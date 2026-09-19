import { readable, get } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Motion vocabulary. One machine, one set of curves.
 *
 * Rules this module exists to enforce:
 *   - LEDs and state changes are instantaneous or stepped (`steps()`), never eased.
 *   - Panels move with EASE_SNAP, under PANEL.
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

/** Durations, in ms. */
export const TICK = 120;
export const SNAP = 200;
export const PANEL = 280;

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
