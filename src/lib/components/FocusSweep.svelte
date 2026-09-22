<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import {
		DEFOCUS,
		EASE_DEFOCUS,
		EASE_REFOCUS,
		EASE_WASH,
		REFOCUS,
		motionEnabled
	} from '$lib/motion';

	/**
	 * Focus pull for route changes: one wave, ringing out from the click that started
	 * the navigation, with the route swap hidden at its crest.
	 *
	 * `covered` is the navigation state, true from the moment a navigation starts. Its
	 * rising edge sends the veil in, so a slow load is answered on the next frame. The
	 * swap itself waits in `onNavigate` until the veil has landed at full cover. That is
	 * what keeps the wave whole: without the wait a prefetched route lands a few frames
	 * in and the cover has to jump the rest of the way, which reads as a cut to blur.
	 * The falling edge, once the new program is mounted, sends focus back in.
	 *
	 * The defocus accelerates into cover and the refocus takes over at the same speed,
	 * so the two legs read as a single pass. There is no pause at full cover and no
	 * restart from rest. Only a slow load, where the veil has already parked and waited,
	 * refocuses from standstill, on EASE_WASH.
	 *
	 * The veil itself (five staggered backdrop blurs, masked into one radial ramp) lives
	 * in app.css under `.focus-sweep`, next to the rest of the display motion. Only the
	 * timing and the origin are here.
	 */
	let { covered = false }: { covered?: boolean } = $props();

	/*
		Positions of the ring's leading edge, in band widths (see app.css). The screen
		sits inside the fully opaque band at 0.75; both rest states leave it sharp, so the
		ring only ever travels outward and the transition reads as one pass of a wave.
	*/
	const REST_ORIGIN = 0;
	const FULL_COVER = 0.75;
	const REST_BEYOND = 1.5;

	/** Parked at full cover for longer than this, the veil has stopped, not paused. */
	const PARKED_AFTER = 50;

	/** A click older than this did not start the navigation now beginning. */
	const CLICK_FRESH = 1000;

	let curtain: HTMLDivElement | null = $state(null);

	/** The stack is painted only while it has something to do. */
	let active = $state(false);

	let sweep: Animation | undefined;
	/** True from the moment the veil heads for cover until focus starts coming back. */
	let defocusing = false;
	/** When the veil last reached full cover, or null while it is not there. */
	let landedAt: number | null = null;
	/** Navigations holding their swap until the veil lands. */
	let waiting: Array<() => void> = [];
	/** The last click, in viewport coordinates: the likely source of the next navigation. */
	let lastClick: { x: number; y: number; at: number } | null = null;

	function release() {
		for (const resolve of waiting) resolve();
		waiting = [];
	}

	// Capture phase, so the point is recorded before the router acts on the click.
	function recordClick(event: MouseEvent) {
		let { clientX: x, clientY: y } = event;
		// Keyboard activation synthesises a click at 0,0: ring out from the element instead.
		if (event.detail === 0 && event.target instanceof Element) {
			const box = event.target.getBoundingClientRect();
			x = box.left + box.width / 2;
			y = box.top + box.height / 2;
		}
		lastClick = { x, y, at: performance.now() };
	}

	/**
	 * Aim the ring at the click that started this navigation, clamped into the visible
	 * screen: a link outside the panel rings in from the nearest edge. Back/forward and
	 * programmatic navigations have no click, so they ring out from the centre.
	 */
	function aim(target: HTMLDivElement) {
		const box = target.getBoundingClientRect();
		const click = lastClick && performance.now() - lastClick.at < CLICK_FRESH ? lastClick : null;
		lastClick = null;
		const x = click ? Math.min(Math.max(click.x - box.left, 0), box.width) : box.width / 2;
		const y = click ? Math.min(Math.max(click.y - box.top, 0), box.height) : box.height / 2;
		const reach = Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y));
		target.style.setProperty('--fs-x', `${x}px`);
		target.style.setProperty('--fs-y', `${y}px`);
		target.style.setProperty('--fs-b', `${2 * reach}px`);
	}

	/** Where the ring actually is, mid-animation or at rest. */
	function position(target: HTMLDivElement) {
		return parseFloat(getComputedStyle(target).getPropertyValue('--fs-p')) || REST_ORIGIN;
	}

	function defocus() {
		if (!curtain) return;
		// Already covering or covered: a second trigger for the same navigation.
		if (defocusing) return;
		defocusing = true;

		// A navigation can arrive while the previous refocus is still running. Keep that
		// ring's origin and travel from where it actually is: re-aiming or restarting from
		// rest would flash the screen sharp for a frame.
		if (!active) aim(curtain);
		const from = position(curtain);
		sweep?.cancel();
		active = true;
		const cover = curtain.animate([{ '--fs-p': from }, { '--fs-p': FULL_COVER }], {
			duration: DEFOCUS,
			easing: EASE_DEFOCUS,
			fill: 'forwards'
		});
		sweep = cover;
		cover.addEventListener('finish', () => {
			if (sweep !== cover) return;
			landedAt = performance.now();
			release();
		});
	}

	function refocus() {
		if (!curtain) return;

		// Parked at full cover through a slow load: pull focus from standstill. Otherwise
		// the defocus has only just landed, or the navigation was dropped mid-cover
		// before any swap. Either way the veil is moving, so carry that speed on.
		const parked = landedAt !== null && performance.now() - landedAt > PARKED_AFTER;
		const from = position(curtain);
		landedAt = null;
		defocusing = false;
		sweep?.cancel();
		release();

		const reveal = curtain.animate([{ '--fs-p': from }, { '--fs-p': REST_BEYOND }], {
			duration: REFOCUS,
			easing: parked ? EASE_WASH : EASE_REFOCUS,
			fill: 'forwards'
		});
		sweep = reveal;
		reveal.addEventListener('finish', () => {
			if (sweep !== reveal) return;
			// Both rest states leave the screen sharp, so dropping the hold is invisible —
			// and it hands the curtain back to the stylesheet instead of leaving a finished
			// animation (and its repainting mask) behind.
			reveal.cancel();
			sweep = undefined;
			active = false;
		});
	}

	// The swap waits for full cover. Never rejects: a navigation must not fail because
	// a veil was interrupted, and `refocus` releases anyone still waiting.
	onNavigate(() => {
		// No script, reduced motion, or `data-motion="off"`: the program changes, the
		// screen does not.
		if (!curtain || !motionEnabled()) return;
		defocus();
		if (landedAt !== null) return;
		return new Promise<void>((resolve) => waiting.push(resolve));
	});

	let shown = false;
	$effect(() => {
		if (covered === shown) return;
		shown = covered;
		// A veil already out always comes back, even if motion was switched off under it.
		if (!covered) {
			if (active) refocus();
			return;
		}
		if (curtain && motionEnabled()) defocus();
	});

	$effect(() => release);
</script>

<svelte:window onclickcapture={recordClick} />

<div class="focus-sweep" aria-hidden="true" style="visibility: {active ? 'visible' : 'hidden'}">
	<div class="focus-sweep-window">
		<div class="focus-sweep-curtain" bind:this={curtain}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
</div>
