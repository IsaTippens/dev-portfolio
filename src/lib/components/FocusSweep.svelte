<script lang="ts">
	import { EASE_SNAP, PANEL, SNAP, motionEnabled } from '$lib/motion';

	/**
	 * Focus pull for route changes.
	 *
	 * `covered` is the navigation state: true from the moment a navigation starts, false
	 * the moment the new program is mounted. On the rising edge the veil travels to a full
	 * de-focus over SNAP; on the falling edge whatever is left of that travel is landed on
	 * the spot — the swap is already in the DOM by then and must never be painted through a
	 * half-travelled veil — and focus sweeps back in over PANEL.
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
	const COVER = { rest: 'translateY(-100%)', hold: 'translateY(-25%)' };
	const REVEAL = { hold: 'translateY(-25%)', rest: 'translateY(50%)' };

	let curtain: HTMLDivElement | null = $state(null);

	/** The stack is painted only while it has something to do. */
	let active = $state(false);

	let sweep: Animation | undefined;
	let shown = false;

	$effect(() => {
		if (covered === shown) return;
		shown = covered;

		// No script, reduced motion, or `data-motion="off"`: the program changes, the
		// screen does not.
		if (!curtain || !motionEnabled()) return;

		if (covered) {
			// A second navigation can arrive while the previous reveal is still running.
			// Read where the curtain actually is before dropping the hold, and travel from
			// there: restarting from `rest` would flash the screen sharp for a frame.
			const from = getComputedStyle(curtain).transform;
			sweep?.cancel();
			active = true;
			sweep = curtain.animate([{ transform: from }, { transform: COVER.hold }], {
				duration: SNAP,
				easing: EASE_SNAP,
				fill: 'forwards'
			});
			return;
		}

		// Land the cover before revealing: a veil still on its way in would show the swap
		// through the part of the screen it has not reached yet.
		if (sweep?.playState === 'running' || sweep?.playState === 'paused') sweep.finish();

		const reveal = curtain.animate([{ transform: REVEAL.hold }, { transform: REVEAL.rest }], {
			duration: PANEL,
			easing: EASE_SNAP,
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
	});
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
