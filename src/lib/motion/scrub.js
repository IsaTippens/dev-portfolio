import { browser } from '$app/environment';
import { clamp } from 'animejs';

/**
 * Scroll scrubbing. Position-mapped effects have no duration — they are a readout of
 * where the page is, so scrubbing back up runs them backwards. That is correct, and
 * desirable: a tape counter counts down.
 *
 * All reads happen inside one rAF-throttled scroll/resize listener shared by every
 * subscriber, so N scrubbed modules cost one pass per frame, not N listeners. Two
 * modules may watch the same element (the homepage's mode cycle and the cartography
 * plate both read the hero track), so subscriptions are keyed by callback, not by
 * element — keying by element meant the second subscriber silently replaced the first.
 */

/** @type {Map<(p: number) => void, Element>} */
const subscribers = new Map();
let listening = false;
let queued = false;

/**
 * How far `node` has travelled through the viewport, 0 → 1.
 *
 * Modules shorter than the viewport map from "enters from the bottom" to "exits past
 * the top". Anything at least a viewport tall — including a pinned hero track — maps
 * from "top hits the top" to "bottom hits the bottom", which is the only reading that
 * stays meaningful while it is stuck.
 * @param {Element} node
 */
export function scrollProgress(node) {
	if (!browser) return 0;
	const rect = node.getBoundingClientRect();
	const vh = window.innerHeight;

	if (rect.height >= vh) {
		const span = rect.height - vh;
		return span > 0 ? clamp(-rect.top / span, 0, 1) : 0;
	}
	return clamp((vh - rect.top) / (vh + rect.height), 0, 1);
}

function flush() {
	queued = false;
	/** One rect read per element per frame, however many watchers it has. */
	const measured = new Map();
	for (const [callback, node] of subscribers) {
		if (!node.isConnected) {
			subscribers.delete(callback);
			continue;
		}
		if (!measured.has(node)) measured.set(node, scrollProgress(node));
		callback(measured.get(node));
	}
}

function schedule() {
	if (queued) return;
	queued = true;
	window.requestAnimationFrame(flush);
}

function listen() {
	if (listening || !browser) return;
	listening = true;
	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', schedule);
}

/**
 * Call `callback(progress)` whenever the page moves, starting with the current position.
 * @param {Element} node
 * @param {(p: number) => void} callback
 */
export function onScrollProgress(node, callback) {
	if (!browser) return () => {};
	subscribers.set(callback, node);
	listen();
	callback(scrollProgress(node));
	return () => {
		subscribers.delete(callback);
	};
}
