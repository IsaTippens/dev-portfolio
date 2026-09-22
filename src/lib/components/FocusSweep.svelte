<script lang="ts">
	import { EASE_SNAP, EASE_WASH, MAX_DURATION, TICK, motionEnabled } from '$lib/motion';

	/**
	 * Focus pull for route changes.
	 *
	 * `covered` is the navigation state: true from the moment a navigation starts, false
	 * the moment the new program is mounted. On the rising edge the veil travels to a full
	 * de-focus; on the falling edge whatever is left of that travel is landed on the spot —
	 * the swap is already in the DOM by then and must never be painted through a
	 * half-travelled veil — and focus sweeps back in.
	 *
	 * Both legs run over MAX_DURATION, and the asymmetry between them is deliberate: going
	 * out of focus is a reflex and has to beat the swap to the screen, coming back is the
	 * part that gets watched, so it travels the same distance on EASE_WASH at a speed the
	 * eye can follow. Between them the veil holds at full cover for a tick, so the defocus
	 * lands as a state rather than as the frame the cover jumped on. A veil that snapped
	 * shut and snapped open again reads as a blink.
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
	/** Timer for the beat at full cover, between the swap and the reveal. */
	let hold: ReturnType<typeof setTimeout> | undefined;
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
			//
			// EASE_SNAP here, not the wash: the cover only runs for as long as the load
			// takes, and a route that lands early lands on whatever has been travelled. A
			// front-loaded curve is already near full cover by then, so landing is not a
			// visible jump; a wash curve would be caught at a light haze and snap.
			const from = getComputedStyle(curtain).transform;
			clearTimeout(hold);
			sweep?.cancel();
			active = true;
			sweep = curtain.animate([{ transform: from }, { transform: COVER.hold }], {
				duration: MAX_DURATION,
				easing: EASE_SNAP,
				fill: 'forwards'
			});
			return;
		}

		// Land the cover before revealing: a veil still on its way in would show the swap
		// through the part of the screen it has not reached yet.
		if (sweep?.playState === 'running' || sweep?.playState === 'paused') sweep.finish();

		// A tick of hold at full cover first. A route that lands early would otherwise be
		// surrounded by nothing but the single frame the cover jumped on, and the blur would
		// never read as a state the machine was in.
		clearTimeout(hold);
		hold = setTimeout(() => {
			if (!curtain) return;

			// Same distance as the cover, at a speed you can follow: the front crosses the
			// screen over roughly two thirds of the run rather than most of it in the first
			// few frames.
			const reveal = curtain.animate([{ transform: REVEAL.hold }, { transform: REVEAL.rest }], {
				duration: MAX_DURATION,
				easing: EASE_WASH,
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
		}, TICK);
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
