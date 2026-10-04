import { browser } from '$app/environment';

/**
 * Scroll scrubbing. Position-mapped effects have no duration — they are a readout of
 * where the page is, so scrubbing back up runs them backwards. That is correct, and
 * desirable: a tape counter counts down.
 *
 * Subscribers share one rAF-throttled scroll/resize listener. It is attached while
 * anyone is subscribed and removed with the last subscriber, so a page without a
 * scrubbed module pays nothing. Each subscriber measures what it needs itself.
 */

/** @type {Set<() => void>} */
const subscribers = new Set();
let queued = false;

function flush() {
	queued = false;
	for (const callback of subscribers) callback();
}

function schedule() {
	if (queued) return;
	queued = true;
	window.requestAnimationFrame(flush);
}

/**
 * Call `callback` once per animation frame in which the page scrolled or resized.
 * Returns the unsubscribe.
 * @param {() => void} callback
 */
export function onScrollFrame(callback) {
	if (!browser) return () => {};
	if (subscribers.size === 0) {
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);
	}
	subscribers.add(callback);
	return () => {
		subscribers.delete(callback);
		if (subscribers.size > 0) return;
		window.removeEventListener('scroll', schedule);
		window.removeEventListener('resize', schedule);
	};
}
