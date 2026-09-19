import { animate, createTimeline, stagger, utils } from 'animejs';
import { EASE_SNAP, MODULE_STAGGER, SNAP, STEPS_FLICKER, motionEnabled } from './index.js';
import { drawFrame } from './seat.js';

/**
 * Power-on sequence. Runs once per session, on the first cold paint, and is the only
 * thing on the site allowed to hide the page before it renders.
 *
 * Order is fixed and derived from the `data-boot` attribute (1 = header, … 7 = footer).
 * Displays (`data-boot-screen`) do not fade — they flicker up in steps, and the PO-100
 * screen is deliberately held dark until the end of the sweep.
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

	const finish = () => {
		html.dataset.boot = 'done';
		try {
			sessionStorage.setItem('booted', '1');
		} catch {
			/* private mode: the sequence just replays next visit */
		}
	};

	const timeline = createTimeline({
		defaults: { ease: EASE_SNAP },
		onComplete: finish
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
			utils.set(chassis, { opacity: 0, translateY: 6 });
			timeline.add(
				chassis,
				{
					opacity: 1,
					translateY: 0,
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
				{ opacity: [0, 1], duration: 160, ease: `steps(${STEPS_FLICKER})` },
				offset + hold
			);
		}

		for (const node of group) {
			if (node.hasAttribute('data-draw')) drawFrame(node);
			const stagger_children = /** @type {HTMLElement[]} */ (
				[...node.querySelectorAll('[data-boot-stagger]')]
			);
			for (const child of stagger_children) {
				timeline.add(
					child,
					{ opacity: [0, 1], translateY: [6, 0], duration: SNAP },
					offset + 40
				);
			}
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

	const steps = Math.max(6, Math.round(duration / 50));
	const proxy = { frame: 0 };

	animate(proxy, {
		frame: steps,
		duration,
		ease: `steps(${steps})`,
		onUpdate: () => {
			const revealed = Math.floor((proxy.frame / steps) * final_text.length);
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