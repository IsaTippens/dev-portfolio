import { readonly, writable, type Readable } from 'svelte/store';
import { theme } from '$lib/stores/theme';
import { reducedMotion } from '$lib/motion';

/**
 * PAD 1 — a controller port that only exists on the PlayStation plates.
 *
 * The pad does not get an input system of its own. It is a thumb on the keyboard: every
 * button becomes the keydown the page already answers, dispatched where a real key would
 * land, so rowNav, the MODE dial and the layout's F-keys keep a single code path and the
 * pad can never do something the keyboard cannot.
 *
 * Browsers only reveal a pad after its first button press, so the port reads empty until
 * the operator touches the controller. That is the hardware being honest, not a bug.
 */

/** Standard-mapping button indices. Anything else is not a pad we know how to read. */
const BTN = {
	cross: 0,
	circle: 1,
	triangle: 3,
	l1: 4,
	r1: 5,
	start: 9,
	up: 12,
	down: 13
} as const;

/** Plates with a controller port. Every other plate leaves the pad unpolled. */
const PAD_PLATES: Record<string, true> = { ps1: true, ps2: true };

/** Stick travel before it counts as a direction; below it is thumb rest, not intent. */
const STICK_DEADZONE = 0.5;
/** Held direction: one step, a pause long enough to lift off, then a steady walk. */
const REPEAT_DELAY_MS = 380;
const REPEAT_EVERY_MS = 110;

/**
 * Pages the shoulder buttons walk, in F-key order. F3 (resume) is left out on purpose:
 * it opens in a new tab, and a popup fired from pad input has no user activation behind
 * it, so the blocker would eat it — a dead detent is worse than a skipped one.
 */
const PAGES = [
	{ key: 'F1', path: '/blog' },
	{ key: 'F2', path: '/projects' },
	{ key: 'F4', path: '/gear' }
];

const connected = writable(false);

/** True while a standard-mapping pad is plugged in, whatever the plate. */
export const padConnected: Readable<boolean> = readonly(connected);

/** Per-pad edge state: last frame's buttons and the held vertical direction. */
type PadState = {
	buttons: boolean[];
	dir: -1 | 0 | 1;
	next_repeat: number;
};

/**
 * A keydown where a real key would have landed: the focused element, bubbling up to
 * window. The layout and rowNav both read `key` and check `target` for text fields, so
 * the synthetic press inherits the same "not while typing" rules as a real one.
 */
function press(key: string) {
	const el = document.activeElement;
	const target = el instanceof HTMLElement ? el : document.body;
	target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

function step(dir: -1 | 1) {
	// Focus inside an open listbox (the MODE dial) means the dial has the arrows; anywhere
	// else a vertical push walks the rows.
	if (document.activeElement?.closest('[role="listbox"]')) press(dir < 0 ? 'ArrowUp' : 'ArrowDown');
	else press(dir < 0 ? 'k' : 'j');
}

function shoulder(delta: -1 | 1) {
	const path = window.location.pathname;
	const at = PAGES.findIndex((p) => path === p.path || path.startsWith(p.path + '/'));
	const n = PAGES.length;
	// Off the F-key pages (home, say) R1 lands on the first page, L1 on the last.
	const next = at < 0 ? (delta > 0 ? 0 : n - 1) : (at + delta + n) % n;
	press(PAGES[next].key);
}

function confirm(pad: Gamepad) {
	const el = document.activeElement;
	if (!(el instanceof HTMLElement) || el === document.body) return;
	el.click();
	// A short tick in the hand for a commit. Haptics are still motion to someone who
	// asked the device to keep still, so the reduced-motion path is simply no rumble.
	if (reducedMotion()) return;
	const actuator = pad.vibrationActuator;
	if (actuator && typeof actuator.playEffect === 'function') {
		actuator
			.playEffect('dual-rumble', { duration: 40, strongMagnitude: 0.2, weakMagnitude: 0.4 })
			.catch(() => {});
	}
}

function verticalOf(pad: Gamepad): -1 | 0 | 1 {
	if (pad.buttons[BTN.up]?.pressed) return -1;
	if (pad.buttons[BTN.down]?.pressed) return 1;
	const y = pad.axes[1] ?? 0;
	if (y < -STICK_DEADZONE) return -1;
	if (y > STICK_DEADZONE) return 1;
	return 0;
}

/**
 * Start the controller port. Call from onMount; returns the cleanup. Polls only while a
 * pad is connected and a PlayStation plate is on, so every other plate pays nothing.
 */
export function startGamepad(): () => void {
	if (typeof window === 'undefined' || typeof navigator === 'undefined') return () => {};
	if (typeof navigator.getGamepads !== 'function') return () => {};

	const pads = new Set<number>();
	const states = new Map<number, PadState>();
	let on_plate = false;
	let raf = 0;

	function snapshot(): (Gamepad | null)[] {
		try {
			return navigator.getGamepads();
		} catch {
			// Permissions policy or an insecure context: the port is sealed.
			return [];
		}
	}

	function frame(now: number) {
		raf = 0;
		for (const pad of snapshot()) {
			if (!pad || !pad.connected || !pads.has(pad.index)) continue;
			read(pad, now);
		}
		sync();
	}

	function read(pad: Gamepad, now: number) {
		const buttons = pad.buttons.map((b) => b.pressed);
		const dir = verticalOf(pad);
		const prev = states.get(pad.index);
		if (!prev) {
			// First look at this pad: record what is already held so a thumb resting on a
			// button when polling resumes does not fire it.
			states.set(pad.index, { buttons, dir, next_repeat: now + REPEAT_DELAY_MS });
			return;
		}

		if (dir !== prev.dir) {
			prev.dir = dir;
			if (dir !== 0) {
				step(dir);
				prev.next_repeat = now + REPEAT_DELAY_MS;
			}
		} else if (dir !== 0 && now >= prev.next_repeat) {
			step(dir);
			prev.next_repeat = now + REPEAT_EVERY_MS;
		}

		const down = (i: number) => buttons[i] && !prev.buttons[i];
		if (down(BTN.cross)) confirm(pad);
		if (down(BTN.circle)) press('Escape');
		if (down(BTN.triangle)) {
			document.querySelector<HTMLButtonElement>('button[aria-haspopup="listbox"]')?.click();
		}
		if (down(BTN.l1)) shoulder(-1);
		if (down(BTN.r1)) shoulder(1);
		if (down(BTN.start)) press('?');

		prev.buttons = buttons;
	}

	/** Run the poll loop exactly when there is a pad to read and a plate that has a port. */
	function sync() {
		const live = on_plate && pads.size > 0;
		if (live && !raf) {
			raf = window.requestAnimationFrame(frame);
		} else if (!live && raf) {
			window.cancelAnimationFrame(raf);
			raf = 0;
		}
		// Off-plate or unplugged, the edge history is stale by the time polling resumes.
		if (!live) states.clear();
	}

	function onConnect(event: GamepadEvent) {
		if (event.gamepad.mapping !== 'standard') return;
		pads.add(event.gamepad.index);
		connected.set(true);
		sync();
	}

	function onDisconnect(event: GamepadEvent) {
		pads.delete(event.gamepad.index);
		states.delete(event.gamepad.index);
		connected.set(pads.size > 0);
		sync();
	}

	// A pad pressed before this mount (a hot reload, a remount) never fires connect again.
	for (const pad of snapshot()) {
		if (pad && pad.connected && pad.mapping === 'standard') pads.add(pad.index);
	}
	connected.set(pads.size > 0);

	window.addEventListener('gamepadconnected', onConnect);
	window.addEventListener('gamepaddisconnected', onDisconnect);

	const unsubscribe = theme.subscribe((id: string) => {
		on_plate = PAD_PLATES[id] === true;
		sync();
	});

	return () => {
		unsubscribe();
		window.removeEventListener('gamepadconnected', onConnect);
		window.removeEventListener('gamepaddisconnected', onDisconnect);
		if (raf) window.cancelAnimationFrame(raf);
		raf = 0;
		states.clear();
		pads.clear();
		connected.set(false);
	};
}
