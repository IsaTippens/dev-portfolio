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
	 * Focus pull for route changes: one wave, top to bottom, with the route swap hidden
	 * at its crest.
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
	 * The veil itself (five staggered backdrop blurs, masked into one ramp) lives in
	 * app.css under `.focus-sweep`, next to the rest of the display motion. Only the
	 * timing is here.
	 */
	let { covered = false }: { covered?: boolean } = $props();

	/*
		Two rest states, both off the screen. The curtain is two screens tall and the
		visible screen sits inside its fully opaque band at -25%, so the veil only ever
		moves downward and the whole transition reads as one pass of a focus wave.
	*/
	const FULL_COVER = 'translateY(-25%)';
	const REST_BELOW = 'translateY(50%)';

	/** Parked at full cover for longer than this, the veil has stopped, not paused. */
	const PARKED_AFTER = 50;

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

	function release() {
		for (const resolve of waiting) resolve();
		waiting = [];
	}

	function defocus() {
		if (!curtain) return;
		// Already covering or covered: a second trigger for the same navigation.
		if (defocusing) return;
		defocusing = true;

		// A navigation can arrive while the previous refocus is still running. Travel
		// from where the curtain actually is: restarting from rest would flash the screen
		// sharp for a frame.
		const from = getComputedStyle(curtain).transform;
		sweep?.cancel();
		active = true;
		const cover = curtain.animate([{ transform: from }, { transform: FULL_COVER }], {
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
		const from = getComputedStyle(curtain).transform;
		landedAt = null;
		defocusing = false;
		sweep?.cancel();
		release();

		const reveal = curtain.animate([{ transform: from }, { transform: REST_BELOW }], {
			duration: REFOCUS,
			easing: parked ? EASE_WASH : EASE_REFOCUS,
			fill: 'forwards'
		});
		sweep = reveal;
		reveal.addEventListener('finish', () => {
			if (sweep !== reveal) return;
			// Both rest states are off the screen, so dropping the hold is invisible — and
			// it hands the curtain back to the stylesheet instead of leaving a finished
			// animation (and its composited layer) behind.
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
