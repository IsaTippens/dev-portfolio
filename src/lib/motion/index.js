import { readable, get } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Motion vocabulary. One machine, one set of curves.
 *
 * Rules this module exists to enforce:
 *   - LEDs and state changes are instantaneous or stepped (`steps()`), never eased.
 *   - Panels move with EASE_SNAP, under PANEL.
 *   - Sustained passes across the screen — a wash — move with EASE_WASH, over
 *     MAX_DURATION: they travel farther than a panel and their speed is the point, so
 *     they ease in and out instead of snapping off the line.
 *   - The focus pull is one wave split across a route swap: EASE_DEFOCUS then
 *     EASE_REFOCUS, over DEFOCUS then REFOCUS, joined at matching speed.
 *   - Nothing bounces, nothing overshoots — the single exception is a physical knob
 *     settling into a detent, which is a spring because the object is a spring.
 *   - Scroll-scrubbed effects have no duration at all; they are position-mapped.
 *
 * Every effect authored downstream imports from here. No ad-hoc easings.
 */

/** Primary panel motion: fast out of the gate, long settle. */
export const EASE_SNAP = 'cubic-bezier(0.2, 0.9, 0.25, 1)';

/** Decisive state flips: almost a cut, with just enough shape to read as motion. */
export const EASE_HARD = 'cubic-bezier(0.85, 0, 0.15, 1)';

/**
 * Sustained travel: a wave crossing the screen. Symmetrical and gentle out of the gate,
 * so the front keeps a readable speed the whole way instead of arriving in the first
 * few frames the way EASE_SNAP does.
 */
export const EASE_WASH = 'cubic-bezier(0.45, 0, 0.35, 1)';

/*
	The focus pull: two halves of one wave, joined at the route swap. A cubic-bezier's
	edge speed is y1/x1 at the start and (1 - y2)/(1 - x2) at the end, in units of
	distance over duration. The defocus leaves the line already moving (0.4, so a click
	answers on the next frame) and accelerates into full cover (1.5). The refocus
	covers the same distance over REFOCUS / DEFOCUS times as long, so it has to open at
	1.5 × 340 / 220 ≈ 2.33 for the front to carry through the swap without a hitch, then
	lands on a zero-speed tail: focus arrives, it does not stop.
	Retune DEFOCUS or REFOCUS and the refocus x1/y1 must move with them.
*/
/** Losing focus: gentle off the line, accelerating into full cover. */
export const EASE_DEFOCUS = 'cubic-bezier(0.3, 0.12, 0.7, 0.55)';
/** Regaining focus: picks up the defocus at speed, settles on a long soft tail. */
export const EASE_REFOCUS = 'cubic-bezier(0.15, 0.35, 0.3, 1)';

/** Durations, in ms. */
export const TICK = 120;
export const SNAP = 200;
export const PANEL = 280;
export const DEFOCUS = 220;
export const REFOCUS = 340;

/** Hard ceiling for anything time-based. Scroll-scrubbed effects are exempt. */
export const MAX_DURATION = 400;

/** Stagger between siblings of one module, and between modules of the boot sequence. */
export const CHILD_STAGGER = 30;
export const MODULE_STAGGER = 50;

/** Anime.js linear() sampler is fine for stepped values; these are the step counts. */
export const STEPS_BLINK = 3;
export const STEPS_FLICKER = 4;

/**
 * Reactive `prefers-reduced-motion: reduce`, re-evaluated on media-query change.
 * SSR-safe: reports `false` on the server, then the first client read is authoritative.
 */
export const prefersReducedMotion = readable(false, (set) => {
	if (!browser || typeof window.matchMedia !== 'function') return;
	const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
	set(mq.matches);
	/** @param {MediaQueryListEvent} event */
	const on_change = (event) => set(event.matches);
	mq.addEventListener('change', on_change);
	return () => mq.removeEventListener('change', on_change);
});

/** Imperative read for use inside effects and event handlers. */
export function reducedMotion() {
	return get(prefersReducedMotion);
}

/** Is the document allowed to animate? The pre-paint script owns this flag. */
export function motionEnabled() {
	if (!browser) return false;
	if (reducedMotion()) return false;
	return document.documentElement.dataset.motion !== 'off';
}
