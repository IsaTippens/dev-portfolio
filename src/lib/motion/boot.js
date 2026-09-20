import { animate, createTimeline, stagger, steps } from 'animejs';
import { EASE_SNAP, MODULE_STAGGER, SNAP, STEPS_FLICKER, motionEnabled } from './index.js';

/**
 * Power-on sequence. Runs once per session, on the first cold paint, and is the only
 * thing on the site allowed to hide the page before it renders.
 *
 * Order is fixed and derived from the `data-boot` attribute (1 = header, … 7 = footer).
 * Displays (`data-boot-screen`) do not fade — they flicker up in steps, and the PO-100
 * screen is deliberately held dark until the end of the sweep.
 *
 * The inline styles are cleaned off when the sweep finishes. Leaving a `transform` on a
 * module is not cosmetic: it makes that element a containing block and a stacking
 * context, which silently breaks any `position: fixed` descendant — the MODE dial's
 * popup was being painted underneath the page because of it.
 */
const BUDGET = 900;

/** @param {ParentNode} root */
export function maybeBoot(root) {
	const html = document.documentElement;
	if (html.dataset.boot !== 'armed') return null;
	if (!motionEnabled()) {
		html.dataset.boot = 'done';
		return null;
	}

	const nodes = /** @type {HTMLElement[]} */ ([...root.querySelectorAll('[data-boot]')]);
	if (!nodes.length) {
		html.dataset.boot = 'done';
		return null;
	}

	/** @type {Map<number, HTMLElement[]>} */
	const groups = new Map();
	for (const node of nodes) {
		const order = Number(node.dataset.boot) || 1;
		const bucket = groups.get(order) ?? [];
		bucket.push(node);
		groups.set(order, bucket);
	}

	const orders = [...groups.keys()].sort((a, b) => a - b);
	const last = orders[orders.length - 1];
	const span = Math.min(MODULE_STAGGER, BUDGET / orders.length);

	/** Hands every module back to the stylesheet once the sweep is over. */
	const release = () => {
		// Order matters: the flag lifts the pre-paint hiding first, then the inline
		// styles go, so nothing flashes.
		html.dataset.boot = 'done';
		for (const node of nodes) {
			node.style.removeProperty('opacity');
			node.style.removeProperty('transform');
			node.style.removeProperty('translate');
		}
		try {
			sessionStorage.setItem('booted', '1');
		} catch {
			/* private mode: the sequence just replays next visit */
		}
	};

	const timeline = createTimeline({
		defaults: { ease: EASE_SNAP },
		onComplete: release
	});

	orders.forEach((order, index) => {
		const offset = index * span;
		const group = groups.get(order) ?? [];
		const chassis = group.filter(
			(n) => !n.hasAttribute('data-boot-screen') && !n.hasAttribute('data-boot-scramble')
		);
		const screens = group.filter((n) => n.hasAttribute('data-boot-screen'));
		const scrambles = group.filter((n) => n.hasAttribute('data-boot-scramble'));

		if (chassis.length) {
			// Explicit start values, never `utils.set`: the start values must not become
			// inline styles, or clearing them at the end would restore the hidden state.
			timeline.add(
				chassis,
				{
					opacity: [0, 1],
					translateY: [6, 0],
					duration: SNAP,
					delay: stagger(Math.min(40, span))
				},
				offset
			);
		}

		for (const node of scrambles) {
			// Decode, don't fade: the heading resolves out of its own characters.
			const duration = Number(node.dataset.bootScramble) || 400;
			timeline.add(
				node,
				{
					opacity: [0, 1],
					duration: SNAP,
					onBegin: () => scrambleIn(node, duration)
				},
				offset
			);
		}

		for (const screen of screens) {
			// The display of the last group is held dark: that is the punchline.
			const hold = order === last ? 140 : 0;
			timeline.add(
				screen,
				{ opacity: [0, 1], duration: 160, ease: steps(STEPS_FLICKER) },
				offset + hold
			);
		}

	});

	return timeline;
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_#$%';

/**
 * Decode a heading in: every character churns through GLYPHS, locking left to right.
 * Stepped, not eased — the readout either has the character or it does not. Boot only,
 * hero only, once per session.
 * @param {HTMLElement} node
 * @param {number} duration
 */
export function scrambleIn(node, duration = 400) {
	const final_text = node.dataset.scramble ?? node.textContent ?? '';
	if (!final_text) return;
	node.setAttribute('aria-label', final_text);

	const frames = Math.max(6, Math.round(duration / 50));
	const proxy = { frame: 0 };

	animate(proxy, {
		frame: frames,
		duration,
		ease: steps(frames),
		onUpdate: () => {
			const revealed = Math.floor((proxy.frame / frames) * final_text.length);
			let out = '';
			for (let i = 0; i < final_text.length; i++) {
				if (final_text[i] === ' ') out += ' ';
				else if (i < revealed) out += final_text[i];
				else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
			}
			node.textContent = out;
		},
		onComplete: () => {
			node.textContent = final_text;
		}
	});
}