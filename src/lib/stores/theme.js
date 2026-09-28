import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

/** @typedef {{ id: string, label: string, color: string, note: string, sealed?: boolean }} Plate */

/**
 * Face plate registry — the plates the device ships with.
 *
 * `id` must match a `:root[data-theme='<id>']` block in `app.css`; `color` is that
 * plate's `--bg`, used for the <meta name="theme-color"> that paints the browser
 * chrome before first paint. `label` is what the MODE dial shows.
 *
 * Adding a plate is two edits: a token block in `app.css`, and a row here. If a
 * plate needs anything more than that, the components are not token-pure yet.
 *
 * A `sealed` plate ships in the registry — so the pre-paint script and the store
 * accept it as a stored pick — but the MODE dial only offers it once it has been
 * won (see `unlockPlate`).
 *
 * @type {Plate[]}
 */
export const THEMES = [
	{
		id: 'light',
		label: 'LIGHT',
		color: '#f4f4f5',
		note: 'paper + ink'
	},
	{
		id: 'dark',
		label: 'DARK',
		color: '#1a1b1e',
		note: 'charcoal + off-white'
	},
	{
		id: 'phosphor',
		label: 'PHOSPHOR',
		color: '#04070a',
		note: 'green phosphor scope'
	},
	{
		id: 'gameboy',
		label: 'GAMEBOY',
		color: '#306230',
		note: 'four-tone DMG'
	},
	{
		id: 'ps1',
		label: 'PS1',
		color: '#c8c2b4',
		note: 'console grey + symbols'
	},
	{
		id: 'ps2',
		label: 'PS2',
		color: '#0d0f14',
		note: 'charcoal black + wordmark blue'
	},
	{
		id: 'mrrobot',
		label: 'MR ROBOT',
		color: '#0a0101',
		note: 'red terminal, operators only',
		sealed: true
	},
	{
		id: 'gd',
		label: 'GD',
		color: '#061f6e',
		note: 'stereo madness blue + gold',
		sealed: true
	}
];

export const THEME_IDS = THEMES.map((t) => t.id);

/**
 * Plates the OS preference maps to until the operator picks one: a light OS gets
 * the PS1 plate, a dark OS gets PS2. Exported so the pre-paint boot script in
 * `hooks.server.js` reads the same mapping.
 */
export const OS_PLATES = { light: 'ps1', dark: 'ps2' };

/**
 * Where a manual MODE dial pick is stored. Deliberately not the legacy `theme` key:
 * the old store wrote that one on every visit with the auto-detected value, so any
 * browser that visited before this store existed carries a stored plate that was
 * never an operator pick — and honouring those would freeze the plate forever.
 */
export const PLATE_KEY = 'plate';

if (browser) {
	// Drop the legacy key: every value it holds was written by the store, not a pick.
	try {
		localStorage.removeItem('theme');
	} catch {
		/* private mode: nothing was stored anyway */
	}
}

const stored = browser ? localStorage.getItem(PLATE_KEY) : null;
const manual_pick = typeof stored === 'string' && THEME_IDS.includes(stored) ? stored : null;

/** The OS plate right now: ps1 under a light scheme, dark under a dark one. */
const os_plate = () =>
	browser &&
	typeof window.matchMedia === 'function' &&
	window.matchMedia('(prefers-color-scheme: dark)').matches
		? OS_PLATES.dark
		: OS_PLATES.light;

let manual = manual_pick !== null;

const { subscribe, set } = writable(manual_pick ?? os_plate());

/**
 * Current face plate id. Follows the OS scheme — at boot and live, on
 * `prefers-color-scheme` change — until the operator turns the MODE dial. A dial
 * pick is persisted and ends OS following (clearing localStorage returns the
 * device to automatic).
 */
export const theme = {
	subscribe,
	/** Operator pick: persist it and stop following the OS. */
	/** @param {string} id */
	set(id) {
		manual = true;
		try {
			localStorage.setItem(PLATE_KEY, id);
		} catch {
			/* private mode: the plate just won't persist */
		}
		set(id);
	},
	/**
	 * Fit a plate for this page view only: nothing is persisted and OS following is
	 * left as it was, so a reload puts back whatever the operator last chose. This is
	 * how the Konami code borrows a sealed plate without breaking its seal.
	 * @param {string} id
	 */
	visit(id) {
		set(id);
	}
};

if (browser && typeof window.matchMedia === 'function') {
	const scheme = window.matchMedia('(prefers-color-scheme: dark)');
	scheme.addEventListener('change', () => {
		if (!manual) set(os_plate());
	});
}

/**
 * Where won plates are recorded, as a comma-separated list of ids. The console CTF
 * (`$lib/ctf/console.ts`) wins MR ROBOT, the GAMING_LOG cube wins GD; nothing else
 * writes here. A lone id (the format before GD existed) reads as a one-item list.
 */
export const UNLOCK_KEY = 'plate-unlocked';

/** @returns {string[]} */
const read_unlocked = () => {
	try {
		return (localStorage.getItem(UNLOCK_KEY) ?? '').split(',').filter(Boolean);
	} catch {
		return [];
	}
};

const unlocked = writable(browser ? read_unlocked() : []);

/** The plates the MODE dial offers: every stock plate, plus the sealed ones won. */
export const plates = derived(unlocked, ($unlocked) =>
	THEMES.filter((t) => !t.sealed || $unlocked.includes(t.id))
);

/**
 * Break a sealed plate's seal. Persisted, and pushed straight into `plates` so the
 * dial grows its extra detent in this tab without a reload.
 * @param {string} id
 */
export function unlockPlate(id) {
	// Merge with storage first (another tab may have won a different plate since this
	// one loaded) and with memory (in private mode storage forgets within the visit).
	const won = [...new Set([...read_unlocked(), ...get(unlocked), id])];
	try {
		localStorage.setItem(UNLOCK_KEY, won.join(','));
	} catch {
		/* private mode: the seal holds for this visit only */
	}
	unlocked.set(won);
}

if (browser) {
	// Other open tabs learn about the win through `storage`, which never fires in the
	// tab that wrote it — that one was already told by `unlockPlate`.
	window.addEventListener('storage', (event) => {
		if (event.key === UNLOCK_KEY || event.key === null) unlocked.set(read_unlocked());
	});
}
