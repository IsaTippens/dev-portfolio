<script lang="ts">
	/**
	 * Raspberry Pi 4 Model B, top view, in millimetres. Every outline is lifted from Raspberry
	 * Pi's mechanical drawing (datasheets.raspberrypi.com/rpi4/raspberry-pi-4-mechanical-drawing.pdf):
	 * board origin at the top-left corner, GPIO header along the top edge, Ethernet and USB
	 * overhanging the right edge.
	 */

	/** 40-pin header, 2.54 mm pitch; pin 1 is the square pad at the left end of the inner row. */
	const PINS = Array.from({ length: 20 }, (_, i) => Math.round((8.37 + i * 2.54) * 100) / 100);
</script>

<svg
	viewBox="-9 -8.5 100 69"
	class="line-art relative block h-full w-full"
	role="img"
	aria-label="Top-view schematic of the Raspberry Pi 4 Model B board"
>
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
		<circle cx="3.5" cy="3.5" r="3.09" />
		<circle cx="61.5" cy="3.5" r="3.09" />
		<circle cx="3.5" cy="52.5" r="3.09" />
		<circle cx="61.5" cy="52.5" r="3.09" />
	</g>
	<g fill="var(--panel-sunk)" stroke="var(--ink-dim)">
		<circle cx="3.5" cy="3.5" r="1.33" />
		<circle cx="61.5" cy="3.5" r="1.33" />
		<circle cx="3.5" cy="52.5" r="1.33" />
		<circle cx="61.5" cy="52.5" r="1.33" />
		<rect x="7.1" y="1.01" width="50.8" height="5" />
		<rect x="58.99" y="7.15" width="5" height="5" />
		<rect x="6.61" y="6.9" width="10.78" height="12.99" />
		<path d="M21.75 16.01H36.74V31.01H22.24L21.75 30.49Z" />
		<rect x="39.04" y="16.01" width="11.5" height="15" />
		<rect x="55.5" y="15" width="5.99" height="6.01" />
		<rect x="55.5" y="27.99" width="7.99" height="8.01" />
		<path d="M2.6 16.79H5.45V39.21H2.64V35.84L1.5 34.7V21.3L2.6 20.2Z" />
		<path d="M45.05 33.3H47.84V36.64L48.99 37.8V51.21L47.9 52.3V55.69H45.05Z" />
		<rect x="7.39" y="41.29" width="5" height="5" />
		<rect x="12.91" y="37.9" width="3.98" height="3.99" rx="1" />
		<rect x="47.48" y="14.19" width="2.01" height="1.22" />
		<rect x="51.39" y="35.4" width="2.99" height="2.01" />
		<rect x="50.5" y="39.1" width="1.98" height="3" />
		<rect x="54.59" y="39.1" width="2" height="1.2" />
		<rect x="59.9" y="37.59" width="3.2" height="2.4" />
		<rect x="58.89" y="41.5" width="1.61" height="2.99" />
		<rect x="62.3" y="43.5" width="1.79" height="0.99" />
		<rect x="64.9" y="41.46" width="2" height="2.5" />
		<rect x="66.03" y="45.69" width="2.92" height="1.61" />
		<rect x="67.19" y="48.85" width="1.59" height="2.89" />
		<rect x="58.7" y="45.3" width="1.98" height="3.3" />
		<rect x="51.1" y="24.6" width="1.2" height="2.01" />
		<rect x="57.48" y="22.6" width="0.81" height="1.61" />
		<rect x="60.19" y="22.6" width="0.8" height="1.61" />
		<rect x="61.98" y="22.14" width="1.2" height="2.01" />
		<rect x="30.79" y="51.5" width="1.6" height="2.99" />
		<rect x="8.2" y="34.5" width="7.6" height="2" />
		<rect x="18.19" y="45.3" width="3.6" height="4.4" />
		<rect x="2.6" y="39.7" width="1.2" height="2" />
		<rect x="2.6" y="45.86" width="1.2" height="1.98" />
		<rect x="4.5" y="39.45" width="2" height="2.5" />
		<rect x="4.5" y="45.55" width="2" height="2.5" />
		<rect x="13.09" y="45.55" width="2.01" height="2.5" />
		<rect x="65.54" y="18.94" width="4.29" height="7.31" />
		<rect x="0.35" y="43.85" width="1.09" height="1.3" />
		<rect x="0.35" y="47.45" width="1.09" height="1.3" />
		<rect x="51" y="56" width="5.99" height="2.5" />
		<rect x="50.5" y="43.5" width="6.98" height="12.5" />
		<rect x="22.39" y="56.82" width="7.21" height="0.6" />
		<rect x="22.9" y="49.47" width="6.2" height="7.35" />
		<rect x="35.9" y="56.82" width="7.19" height="0.6" />
		<rect x="36.39" y="49.47" width="6.2" height="7.35" />
		<rect x="6.87" y="49.84" width="8.66" height="7.4" />
		<rect x="66.63" y="2.5" width="21.36" height="15.51" />
		<rect x="70.5" y="22.43" width="17.49" height="13.14" />
		<rect x="70.29" y="40.42" width="17.7" height="13.14" />
	</g>
	<g fill="none" stroke="var(--line)">
		<rect x="6.79" y="7.11" width="10.41" height="12.6" />
		<path d="M5.45 20H4.54V36H5.45M45.05 36.5H45.94V52.49H45.05" />
	</g>
	<g fill="var(--ink-dim)">
		{#each PINS as x, i (x)}
			<circle cx={x} cy="2.24" r="0.49" />
			{#if i === 0}
				<rect x={x - 0.5} y="4.28" width="1" height="1" />
			{:else}
				<circle cx={x} cy="4.78" r="0.49" />
			{/if}
		{/each}
		<circle cx="60.22" cy="8.38" r="0.49" />
		<circle cx="62.76" cy="8.38" r="0.49" />
		<circle cx="60.22" cy="10.92" r="0.49" />
		<circle cx="62.76" cy="10.92" r="0.49" />
	</g>
	<g
		fill="var(--ink-dim)"
		font-family="var(--font-mono)"
		font-size="2.2"
		text-anchor="middle"
		dominant-baseline="central"
	>
		<text x="29.25" y="23.51">BCM2711</text>
		<text x="44.79" y="23.51">LPDDR4</text>
		<text x="59.5" y="31.99" font-size="1.8">VL805</text>
		<text x="12" y="13.4">WLAN</text>
		<text x="9.89" y="43.79" font-size="1.8">PMIC</text>
		<text x="77.31" y="10.26">ETH</text>
		<text x="79.25" y="29">USB3</text>
		<text x="79.14" y="46.99">USB2</text>
		<text x="3" y="28" font-size="1.8" transform="rotate(-90 3 28)">DSI</text>
		<text x="47.4" y="44.5" font-size="1.8" transform="rotate(-90 47.4 44.5)">CSI</text>
		<text x="53.99" y="49.75" font-size="1.8">AV</text>
	</g>
</svg>
