<script lang="ts">
	/**
	 * The look of a knob, and nothing else: a coloured cap seated in a knurled, polished
	 * metal skirt. Shared by the PO-100 (interactive, `Knob.svelte`) and the TE-S10
	 * (display only), so both devices are machined from the same stock.
	 *
	 * Lighting is split from rotation the way it is on a real control: the knurl, the
	 * machined rings on the cap face and the pointer turn with the knob, the specular
	 * hotspot and the shade stay where the light is. Every colour is a faceplate token —
	 * `cap` is one of `--hw-knob-1…4`, the metal is `--hw-metal*`, the reflection is
	 * `--hw-sheen` — so a plate change re-machines the knob with no override here.
	 */
	let {
		cap,
		rotation = 0,
		size = 28
	}: {
		cap: string;
		rotation?: number;
		size?: number;
	} = $props();
</script>

<span class="knob" style="--cap: {cap}; --size: {size}px;" aria-hidden="true">
	<span class="knob-turn" style="transform: rotate({rotation}deg);">
		<span class="knob-face"></span>
		<span class="knob-pointer"></span>
	</span>
	<span class="knob-light"></span>
</span>

<style>
	.knob {
		position: relative;
		display: block;
		flex-shrink: 0;
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		/* Polished skirt: a spun finish throws light back in two opposed lobes. */
		background: conic-gradient(
			from 205deg,
			var(--hw-metal-hi),
			var(--hw-metal) 14%,
			var(--hw-metal-lo) 27%,
			var(--hw-metal) 38%,
			var(--hw-metal-hi) 50%,
			var(--hw-metal) 63%,
			var(--hw-metal-lo) 77%,
			var(--hw-metal) 89%,
			var(--hw-metal-hi)
		);
		box-shadow:
			0 0 0 1px var(--hw-knob-edge),
			0 1px 1px var(--shadow-soft),
			0 3px 5px var(--shadow-soft);
	}

	.knob-turn {
		position: absolute;
		inset: 0;
		border-radius: 50%;
	}

	/* Knurling on the skirt only: fine grooves, masked off the cap. */
	.knob-turn::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: repeating-conic-gradient(
			color-mix(in srgb, var(--hw-metal-lo) 55%, transparent) 0 2deg,
			transparent 2deg 8deg
		);
		-webkit-mask-image: radial-gradient(closest-side, transparent 72%, #000 75%);
		mask-image: radial-gradient(closest-side, transparent 72%, #000 75%);
	}

	.knob-face {
		position: absolute;
		inset: 19%;
		border-radius: 50%;
		background:
			/* Lathe rings on the cap face. */
			repeating-radial-gradient(
				circle,
				color-mix(in srgb, var(--hw-sheen) 9%, transparent) 0 0.5px,
				transparent 0.5px 1.5px
			),
			/* Slight dish: the rim sits darker than the centre. */
				radial-gradient(
					closest-side,
					var(--cap) 62%,
					color-mix(in srgb, var(--cap) 72%, var(--hw-knob-edge)) 100%
				);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--cap) 45%, var(--hw-knob-edge));
	}

	/* Engraved index line, filled dark, with a lit lip so it reads on any cap colour. */
	.knob-pointer {
		position: absolute;
		top: 8%;
		left: 50%;
		width: max(2px, calc(var(--size) * 0.085));
		height: 34%;
		transform: translateX(-50%);
		border-radius: 1px;
		background: var(--hw-well-2);
		box-shadow: 0 0 0 0.5px color-mix(in srgb, var(--hw-sheen) 35%, transparent);
	}

	/* Fixed light: one hotspot top-left, falling off into shade bottom-right. */
	.knob-light {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		pointer-events: none;
		background: radial-gradient(
				circle at 34% 28%,
				color-mix(in srgb, var(--hw-sheen) 55%, transparent) 0,
				color-mix(in srgb, var(--hw-sheen) 12%, transparent) 22%,
				transparent 42%
			),
			radial-gradient(circle at 70% 78%, rgba(0, 0, 0, 0.28), transparent 58%);
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--hw-sheen) 45%, transparent),
			inset 0 -1px 1px rgba(0, 0, 0, 0.3);
	}
</style>
