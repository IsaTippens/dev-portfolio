<script lang="ts">
	/**
	 * Raspberry Pi 5, top view, in millimetres. Every outline is lifted from Raspberry Pi's
	 * mechanical drawing (datasheets.raspberrypi.com/rpi5/raspberry-pi-5-mechanical-drawing.pdf):
	 * board origin at the top-left corner, GPIO header along the top edge, USB and Ethernet
	 * overhanging the right edge.
	 *
	 * The drawing is a toggle that fits this board's accessories in assembly order and strips
	 * them in reverse: the Active Cooler, then the M.2 HAT+ on its standoffs (the cooler beneath
	 * it drawn as hidden lines), then the 256GB Raspberry Pi SSD (M.2 2230). A tap, click or
	 * Enter/Space holds them fitted; a mouse also previews them while it hovers. Their outlines
	 * come from the product briefs' mechanical drawings (datasheets.raspberrypi.com: cooling/,
	 * m2-hat-plus/ and ssd/), registered on the board's mounting holes.
	 */

	/** 40-pin header, 2.54 mm pitch; pin 1 is the square pad at the left end of the inner row. */
	const PINS = Array.from({ length: 20 }, (_, i) => Math.round((8.36 + i * 2.54) * 100) / 100);

	/** The board's mounting holes, where the HAT's standoffs and screws land. */
	const HOLES = [
		[3.5, 3.5],
		[61.5, 3.5],
		[3.5, 52.5],
		[61.5, 52.5]
	];

	/** Active Cooler base plate, clear of the camera connectors, bosses under both push pins. */
	const HEATSINK =
		'M6.99 7.04H60.28L61.39 6.37L64.18 7.88L64.25 11.06L63.97 11.23V35.02A3 3 0 0 1 60.97 38.02H46.27A3 3 0 0 0 44.09 38.95L37.25 46.1A2.9 2.9 0 0 1 35.16 47.01H7.89A1.76 1.76 0 0 0 6.6 47.6L5.65 48.6L1.96 43.77L6.14 39.4A3.1 3.1 0 0 0 6.99 37.27Z';

	/** Heatsink pin fins: 6 columns by 9 rows of 2 × 2.66 mm pins on a 3.4 × 4.66 mm pitch. */
	const FINS = Array.from({ length: 54 }, (_, i) => {
		const x = 7.48 + (i % 6) * 3.4;
		const y = 7.04 + Math.floor(i / 6) * 4.66;
		return `M${x.toFixed(2)} ${y.toFixed(2)}h2v2.66h-2Z`;
	}).join('');

	/** The blower's intake: the open disc inside its three curved ribs, closed along the shroud. */
	const INTAKE =
		'M42.17 32.92L41.7 32.82L41.31 32.48L41.2 32.25L41.15 31.76L41.36 31.3L41.94 30.61L42.31 30.39L43.44 30.15L44.82 29.73L46.09 29.06L47.23 28.18L47.73 27.67L48.59 26.5L49.23 25.22L49.63 23.82L49.79 22.18L49.86 21.99L50.12 21.64L50.5 21.44L50.71 21.41L51.08 21.44L51.61 21.62L51.83 21.78L52.17 22.22L52.35 22.75L52.35 23.01A10.6 10.6 0 0 0 50.74 16.68L50.9 17.16L50.79 17.65L50.48 18.04L50 18.22L49.75 18.2L49.01 18.09L48.49 17.85L47.21 16.45L46.65 15.99L45.45 15.22L44.11 14.67L43.41 14.5L41.98 14.34L40.55 14.43L39.14 14.78L37.64 15.45L37.43 15.5L37 15.45L36.51 15.06L36.35 14.71L36.25 14.18L36.35 13.63L36.47 13.38L36.85 12.96L37.09 12.82A10.6 10.6 0 0 0 32.4 17.39L32.54 17.18L32.97 16.89L33.46 16.86L33.92 17.07L34.22 17.49L34.48 18.18L34.54 18.76L33.97 20.56L33.78 21.99L33.85 23.42L34.18 24.83L34.75 26.15L35.54 27.35L36.55 28.37L37.11 28.83L37.89 29.34L38.13 29.7L38.19 30.33L37.99 30.7L37.69 31.04L37.46 31.2L36.95 31.37L36.67 31.39L36.39 31.35L35.89 31.14A10.6 10.6 0 0 0 42.17 32.92Z';

	/** Fan lead, a 1 mm band from the blower round to the plug in the FAN header. */
	const FAN_LEAD =
		'M57.49 15.1L59.23 15.06L60.82 14.93L62.25 14.68L63.53 14.28L64.64 13.69L65.58 12.88L66.31 11.85L66.83 10.58L67.13 9.07L67.23 7.33L66.23 7.27L66.14 8.95L65.87 10.3L65.43 11.37L64.84 12.21L64.08 12.86L63.15 13.35L62.02 13.71L60.69 13.94L59.18 14.06L57.47 14.1Z';

	/** Held by a tap, click or Enter/Space; previewed while a mouse (never a finger) is over it. */
	let held = $state(false);
	let previewing = $state(false);
</script>

<button
	type="button"
	class="relative block h-full w-full"
	aria-pressed={held}
	aria-label="Top-view schematic of the Raspberry Pi 5 board: fit its Active Cooler, M.2 HAT+ and 256GB SSD"
	data-on={held || previewing}
	onclick={() => (held = !held)}
	onpointerenter={(e) => (previewing = e.pointerType === 'mouse')}
	onpointerleave={() => (previewing = false)}
>
	<svg viewBox="-9 -8.5 100 69" class="line-art block h-full w-full" aria-hidden="true">
		<g fill="none" stroke="var(--line)">
			<path d="M0 -1.2V-6M85 -1.2V-6M0 -4.5H40M45 -4.5H85" />
			<path d="M-2.4 0H-7M-2.4 56H-7M-5.5 0V25.5M-5.5 30.5V56" />
		</g>
		<g
			fill="var(--ink-dim)"
			font-family="var(--font-mono)"
			font-size="2.2"
			text-anchor="middle"
			dominant-baseline="central"
		>
			<text x="42.5" y="-4.5">85</text>
			<text x="-5.5" y="28" transform="rotate(-90 -5.5 28)">56</text>
		</g>
		<rect width="85" height="56" rx="3" fill="var(--panel)" stroke="var(--ink-dim)" />
		<g fill="none" stroke="var(--line)">
			<circle cx="3.5" cy="3.5" r="2.9" />
			<circle cx="61.5" cy="3.5" r="2.9" />
			<circle cx="3.5" cy="52.5" r="2.9" />
			<circle cx="61.5" cy="52.5" r="2.9" />
		</g>
		<g fill="var(--panel-sunk)" stroke="var(--ink-dim)">
			<circle cx="3.5" cy="3.5" r="1.35" />
			<circle cx="61.5" cy="3.5" r="1.35" />
			<circle cx="3.5" cy="52.5" r="1.35" />
			<circle cx="61.5" cy="52.5" r="1.35" />
			<circle cx="61.47" cy="9.53" r="1.5" />
			<circle cx="3.47" cy="46.53" r="1.5" />
			<rect x="7.09" y="1.04" width="50.8" height="4.98" />
			<rect x="65.23" y="1.04" width="3" height="6" />
			<rect x="7.19" y="7.15" width="10.48" height="13.08" />
			<rect x="25.89" y="11.98" width="14.5" height="10.02" />
			<rect x="52.39" y="15.05" width="11.99" height="11.99" />
			<rect x="65.33" y="8.38" width="4.31" height="7.3" />
			<rect x="55.24" y="6.62" width="1.63" height="2.92" />
			<rect x="24.58" y="24.75" width="17.01" height="16.97" />
			<path d="M59.72 32.55L63.99 28.28L68.23 32.55L63.99 36.78Z" />
			<rect x="-1.73" y="22.95" width="2.96" height="9.99" rx="0.6" />
			<rect x="1.23" y="20.76" width="2.96" height="10.52" />
			<rect x="-0.46" y="36.64" width="0.84" height="2.01" />
			<rect x="0.38" y="35.37" width="2.54" height="4.52" />
			<rect x="5.57" y="32.69" width="2.01" height="2.79" />
			<rect x="8.07" y="32.69" width="2.02" height="2.79" />
			<rect x="12.27" y="32.69" width="2.01" height="2.79" />
			<rect x="14.78" y="32.69" width="2.01" height="2.79" />
			<rect x="8.18" y="37.84" width="6" height="6" />
			<rect x="4.33" y="38.12" width="2.01" height="1.2" />
			<rect x="16.05" y="38.12" width="1.97" height="1.2" />
			<rect x="4.33" y="41.54" width="2.01" height="1.2" />
			<rect x="16.05" y="41.54" width="1.97" height="1.2" />
			<rect x="7.72" y="45.67" width="1.2" height="2.01" />
			<rect x="11.14" y="45.67" width="1.2" height="2.01" />
			<rect x="13.72" y="45.67" width="1.2" height="2.01" />
			<rect x="41.87" y="43.17" width="2.01" height="2.99" />
			<rect x="47.23" y="39.85" width="2.97" height="15.49" />
			<rect x="53.44" y="39.85" width="2.93" height="15.49" />
			<rect x="58.98" y="44.05" width="5.01" height="4.97" />
			<rect x="16.96" y="49.83" width="4.03" height="2.9" />
			<rect x="29.66" y="50.54" width="5.33" height="3.21" />
			<rect x="6.8" y="50.05" width="8.75" height="7.3" />
			<rect x="22.54" y="49.16" width="6.49" height="7.69" />
			<rect x="23.28" y="56.85" width="5.01" height="0.85" />
			<rect x="35.91" y="49.16" width="6.53" height="7.69" />
			<rect x="36.69" y="56.85" width="4.97" height="0.85" />
			<rect x="70.94" y="2.49" width="16.23" height="13.09" />
			<rect x="87.17" y="3.69" width="0.71" height="10.69" />
			<rect x="70.94" y="20.45" width="16.23" height="13.08" />
			<rect x="87.17" y="21.65" width="0.71" height="10.69" />
			<rect x="66.74" y="37.84" width="21.24" height="15.98" />
		</g>
		<g fill="none" stroke="var(--line)">
			<path
				d="M24.58 28.24H41.59M24.58 38.23H41.59M3.06 22.67V29.37H4.19M3.06 22.67H4.19M7.83 50.05V57.35M14.57 50.05V57.35"
			/>
			<path
				d="M82.55 4.29L87.03 4.99M82.55 7.08L87.03 7.78M82.55 10.28L87.03 10.99M82.55 13.07L87.03 13.78"
			/>
			<path
				d="M82.55 22.24L87.03 22.95M82.55 25.03L87.03 25.74M82.55 28.24L87.03 28.95M82.55 31.03L87.03 31.74"
			/>
		</g>
		<g fill="var(--ink-dim)">
			{#each PINS as x, i (x)}
				<circle cx={x} cy="2.26" r="0.49" />
				{#if i === 0}
					<rect x={x - 0.5} y="4.3" width="1" height="1" />
				{:else}
					<circle cx={x} cy="4.8" r="0.49" />
				{/if}
			{/each}
			<circle cx="60.22" cy="45.27" r="0.49" />
			<circle cx="62.76" cy="45.27" r="0.49" />
			<circle cx="60.22" cy="47.81" r="0.49" />
			<circle cx="62.76" cy="47.81" r="0.49" />
		</g>
		<g
			fill="var(--ink-dim)"
			font-family="var(--font-mono)"
			font-size="2.2"
			text-anchor="middle"
			dominant-baseline="central"
		>
			<text x="33.09" y="33.24">BCM2712</text>
			<text x="58.39" y="21.05">RP1</text>
			<text x="33.14" y="16.99">LPDDR4X</text>
			<text x="12.43" y="13.69">WLAN</text>
			<text x="11.18" y="40.84" font-size="1.8">PMIC</text>
			<text x="79.06" y="9.04">USB2</text>
			<text x="79.06" y="26.99">USB3</text>
			<text x="77.36" y="45.83">ETH</text>
			<text x="2.1" y="26.02" font-size="1.8" transform="rotate(-90 2.1 26.02)">PCIe</text>
		</g>
		<!-- Active Cooler: base plate and pin fins, blower on top, lead to the FAN header. -->
		<g class="part" style="--out: 360ms">
			<rect
				x="65.73"
				y="1.54"
				width="2"
				height="5"
				fill="var(--panel-sunk)"
				stroke="var(--ink-dim)"
			/>
			<path d={HEATSINK} fill="var(--panel)" stroke="var(--ink-dim)" stroke-linejoin="round" />
			<path d={FINS} fill="var(--panel-sunk)" stroke="var(--line)" />
			<rect x="27.48" y="8.02" width="30" height="30" fill="var(--panel)" stroke="var(--ink-dim)" />
			<circle cx="41.77" cy="22.33" r="10.6" fill="var(--panel)" stroke="var(--ink-dim)" />
			<path d={INTAKE} fill="var(--panel-sunk)" stroke="var(--ink-dim)" stroke-linejoin="round" />
			<g fill="none" stroke="var(--ink-dim)">
				<circle cx="31.48" cy="9.73" r="1.75" />
				<circle cx="54.47" cy="10.53" r="1.75" />
				<circle cx="54.47" cy="35.53" r="1.75" />
			</g>
			<path d={FAN_LEAD} fill="var(--panel-sunk)" stroke="var(--ink-dim)" stroke-linejoin="round" />
			<g fill="var(--panel)" stroke="var(--ink-dim)" stroke-linejoin="round">
				<circle cx="3.48" cy="46.52" r="3" />
				<path d="M1.89 43.77H5.07L6.65 46.52L5.07 49.27H1.89L0.31 46.52Z" />
				<path d="M58.68 8.01L61.39 6.37L64.18 7.88L64.25 11.06L61.55 12.7L58.77 11.18Z" />
			</g>
		</g>
		<!-- M.2 HAT+ on its standoffs; the cooler under it shows as hidden lines. -->
		<g class="part" style="--in: 180ms; --out: 180ms">
			<path
				d="M3 -0.5H61.98A3 3 0 0 1 64.98 2.5V52.98A3 3 0 0 1 61.98 55.98H58.48A1 1 0 0 1 57.48 54.98V40.5A1 1 0 0 0 56.48 39.5H48.48A1 1 0 0 0 47.48 40.5V54.98A1 1 0 0 1 46.48 55.98H3A3 3 0 0 1 0 52.98V35.99A1 1 0 0 1 1 34.99H4.2A0.8 0.8 0 0 0 5 34.19V17.99A1 1 0 0 0 4 16.99H0.8A0.8 0.8 0 0 1 0 16.19V2.5A3 3 0 0 1 3 -0.5Z"
				fill="var(--panel)"
				stroke="var(--ink-dim)"
			/>
			<!-- Dashes are screen pixels: a non-scaling stroke dashes after the drawing is scaled. -->
			<g fill="none" stroke="var(--ink-dim)" stroke-dasharray="4 3" opacity="0.6">
				<path d={HEATSINK} />
				<circle cx="41.77" cy="22.33" r="10.6" />
			</g>
			<g fill="none" stroke="var(--line)">
				<path d="M14.49 16.49H60.98V24.49A3 3 0 0 1 60.98 30.49V38.49H14.49Z" />
				<circle cx="60.98" cy="27.49" r="0.9" />
				{#each HOLES as [x, y] (`${x} ${y}`)}
					<circle cx={x} cy={y} r="3.1" />
				{/each}
			</g>
			<g fill="var(--panel)" stroke="var(--ink-dim)">
				{#each HOLES as [x, y] (`${x} ${y}`)}
					<circle cx={x} cy={y} r="2.25" />
					<path d="M{x - 1.1} {y}h2.2M{x} {y - 1.1}v2.2" />
				{/each}
			</g>
			<rect
				x="7.46"
				y="0.96"
				width="50.06"
				height="5.08"
				fill="var(--panel-sunk)"
				stroke="var(--ink-dim)"
			/>
			<g fill="var(--ink-dim)">
				{#each PINS as x (x)}
					<circle cx={x} cy="2.26" r="0.49" />
					<circle cx={x} cy="4.8" r="0.49" />
				{/each}
			</g>
			<g fill="var(--panel-sunk)" stroke="var(--ink-dim)">
				<path d="M5.77 22.5H-2.3A1 1 0 0 0 -3.3 23.5V30.5A1 1 0 0 0 -2.3 31.5H5.77Z" />
				<rect x="5.77" y="18.34" width="2" height="15.3" />
				<rect x="7.77" y="19.59" width="2.7" height="12.8" />
				<rect x="14.49" y="16.49" width="6" height="22" />
			</g>
			<text
				x="26"
				y="52"
				fill="var(--ink-dim)"
				font-family="var(--font-mono)"
				font-size="2.2"
				text-anchor="middle"
				dominant-baseline="central">M.2 HAT+</text
			>
		</g>
		<!-- Raspberry Pi SSD, M.2 2230, seated in the socket and held by the knurled screw. -->
		<g class="part" style="--in: 360ms">
			<path
				d="M4.1 0H30V9.25A1.75 1.75 0 0 0 30 12.75V22H4.1V21.35A0.5 0.5 0 0 0 3.6 20.85H0V5.45H3A0.6 0.6 0 0 0 3 4.25H0V1.1H3.6A0.5 0.5 0 0 0 4.1 0.6Z"
				transform="translate(18.98 16.49)"
				fill="var(--panel-sunk)"
				stroke="var(--ink-dim)"
			/>
			<!-- The socket again, over the edge the SSD seats in it. -->
			<rect
				x="14.49"
				y="16.49"
				width="6"
				height="22"
				fill="var(--panel-sunk)"
				stroke="var(--ink-dim)"
			/>
			<circle cx="48.98" cy="27.49" r="2.2" fill="var(--panel)" stroke="var(--ink-dim)" />
			<circle cx="48.98" cy="27.49" r="1.1" fill="none" stroke="var(--line)" />
			<text
				x="33.6"
				y="27.49"
				fill="var(--ink-dim)"
				font-family="var(--font-mono)"
				font-size="2.2"
				text-anchor="middle"
				dominant-baseline="central">SSD 256GB</text
			>
		</g>
	</svg>
</button>

<style>
	/*
		Accessories step on one at a time, cooler first, and come off in reverse. A part waits
		--in before it appears and --out before it goes; there is no fade, a part is either
		fitted or it is not.
	*/
	.part {
		visibility: hidden;
		transition: visibility 0s var(--out, 0ms);
	}

	[data-on='true'] .part {
		visibility: visible;
		transition-delay: var(--in, 0ms);
	}

	@media (prefers-reduced-motion: reduce) {
		.part {
			transition: none;
		}
	}
</style>
