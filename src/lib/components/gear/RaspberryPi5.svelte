<script lang="ts">
	/**
	 * Raspberry Pi 5, top view, in millimetres. Every outline is lifted from Raspberry Pi's
	 * mechanical drawing (datasheets.raspberrypi.com/rpi5/raspberry-pi-5-mechanical-drawing.pdf):
	 * board origin at the top-left corner, GPIO header along the top edge, USB and Ethernet
	 * overhanging the right edge.
	 */

	/** 40-pin header, 2.54 mm pitch; pin 1 is the square pad at the left end of the inner row. */
	const PINS = Array.from({ length: 20 }, (_, i) => Math.round((8.36 + i * 2.54) * 100) / 100);
</script>

<svg
	viewBox="-9 -8.5 100 69"
	class="line-art relative block h-full w-full"
	role="img"
	aria-label="Top-view schematic of the Raspberry Pi 5 board"
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
</svg>
