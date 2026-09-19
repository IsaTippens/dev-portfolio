import { animate, stagger, utils } from 'animejs';
import { CHILD_STAGGER, EASE_SNAP, PANEL, SNAP } from './index.js';

/**
 * Seating: the mechanical vocabulary for a module arriving on screen.
 *
 * A module seats in two beats — the chassis frame is stroked on first (the panel's
 * SVG rect, PANEL long), then its contents tick in, one child every CHILD_STAGGER. It
 * seats once; scrolling back up never replays it.
 *
 * The pre-paint hidden state lives in app.css behind `:root[data-motion='on']`, so a
 * module is never visible in its unstaged position. Those flags are only ever armed by
 * the boot script in hooks.server.js, and it clears them itself if the app never takes
 * over — a module can never be stranded invisible.
 */

/** The one observer every visibility-driven effect shares. */
/** @type {IntersectionObserver | null} */
let visibility_observer = null;
const visibility_callbacks = new WeakMap();

function observer() {
	if (!visibility_observer) {
		const instance = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const callback = visibility_callbacks.get(entry.target);
					instance.unobserve(entry.target);
					visibility_callbacks.delete(entry.target);
					callback?.();
				}
			},
			// Fires when the element's top crosses 80% of the viewport: the
			// "15-20% of the module is visible" trigger, and well-behaved for modules
			// taller than the viewport too.
			{ rootMargin: '0px 0px -20% 0px', threshold: 0 }
		);
		visibility_observer = instance;
	}
	return visibility_observer;
}

/**
 * Run `callback` the first time `node` is meaningfully on screen. Returns a cleanup.
 * @param {HTMLElement} node
 * @param {() => void} callback
 */
export function onVisible(node, callback) {
	if (typeof IntersectionObserver === 'undefined') {
		callback();
		return () => {};
	}
	visibility_callbacks.set(node, callback);
	observer().observe(node);
	return () => {
		visibility_callbacks.delete(node);
		visibility_observer?.unobserve(node);
	};
}

/**
 * Interior elements a module staggers on seat; explicit marks win over plain children.
 * @param {HTMLElement} node
 */
export function staggerTargets(node) {
	const marked = node.querySelectorAll(':scope [data-stagger], :scope [data-row]');
	if (marked.length) return [...marked];
	return [...node.children].filter((child) => !['SVG', 'STYLE', 'SCRIPT'].includes(child.tagName));
}

/**
 * Stroke the panel frame on. Without an SVG frame the CSS border already is the frame,
 * so this just marks it drawn.
 * @param {HTMLElement} node
 */
export function drawFrame(node, { duration = PANEL } = {}) {
	// The frame may be the module itself or a panel inside it (a seated section that
	// owns a panel, rather than a panel that owns itself).
	const panel = /** @type {HTMLElement | null} */ (
		node.matches('[data-draw]') ? node : node.querySelector('[data-draw]')
	);
	if (!panel) return null;

	const frame = panel.querySelector(':scope > [data-panel-rect]');
	const rect = frame?.querySelector('rect');
	if (!rect || !frame) {
		panel.dataset.drawn = 'true';
		return null;
	}

	// Measured, not derived: user units are CSS pixels, so the stroke lands exactly on
	// the box edge on all four sides at any size.
	const box = panel.getBoundingClientRect();
	rect.setAttribute('x', '0.5');
	rect.setAttribute('y', '0.5');
	rect.setAttribute('width', String(Math.max(0, box.width - 1)));
	rect.setAttribute('height', String(Math.max(0, box.height - 1)));

	return animate(rect, {
		strokeDashoffset: [1, 0],
		duration,
		ease: 'linear',
		onComplete: () => {
			// The CSS border takes back over: same geometry, and it has the real radius.
			panel.dataset.drawn = 'true';
			utils.set(frame, { opacity: 0 });
		}
	});
}

/**
 * Seat one module: frame first, contents second.
 * @param {HTMLElement} node
 * @param {{ children?: Element[], draw?: boolean }} [options]
 */
export function seatModule(node, { children, draw = true } = {}) {
	if (node.dataset.seated) return;
	node.dataset.seated = 'true';

	const kids = children ?? staggerTargets(node);

	if (draw) drawFrame(node, { duration: PANEL });

	animate(node, { opacity: [0, 1], duration: SNAP, ease: EASE_SNAP });
	if (kids.length) {
		utils.set(kids, { opacity: 0, translateY: 6 });
		animate(kids, {
			opacity: 1,
			translateY: 0,
			duration: SNAP,
			ease: EASE_SNAP,
			delay: stagger(CHILD_STAGGER, { start: draw ? 150 : 0 })
		});
	}
}

/** Seat everything marked, immediately. Used when motion is off. */
export function seatAllNow(root = document) {
	for (const el of /** @type {HTMLElement[]} */ ([...root.querySelectorAll('[data-draw]')])) {
		el.dataset.drawn = 'true';
	}
	for (const el of /** @type {HTMLElement[]} */ ([...root.querySelectorAll('[data-seat]')])) {
		el.dataset.seated = 'true';
		utils.set(el, { opacity: 1, translateY: 0 });
		for (const kid of staggerTargets(el)) utils.set(kid, { opacity: 1, translateY: 0 });
	}
}

/**
 * Watch every unseated module under `root`. One-shot per module: a module never
 * re-assembles, however much the visitor scrubs.
 * @param {ParentNode} root
 */
export function observeSeats(root) {
	const nodes = /** @type {HTMLElement[]} */ ([
		...root.querySelectorAll('[data-seat]:not([data-seated])')
	]);
	const cleanups = nodes.map((node) =>
		onVisible(node, () => seatModule(node, { draw: node.hasAttribute('data-draw') }))
	);
	return () => cleanups.forEach((off) => off());
}
