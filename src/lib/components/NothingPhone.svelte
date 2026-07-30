<script lang="ts">
	let {
		active = false,
		bodyColor = '#f4f4f4',
		strokeColor = '#d1d5db',
		cameraBumpColor = '#e5e7eb',
		cableColor = '#d1d5db',
		glyphColor = '#ffffff',
		glyphActiveColor = '#ffffff',
		showGrid = false
	} = $props<{
		active?: boolean;
		bodyColor?: string;
		strokeColor?: string;
		cameraBumpColor?: string;
		cableColor?: string;
		glyphColor?: string;
		glyphActiveColor?: string;
		showGrid?: boolean;
	}>();

	function hexToRgba(hex: string, alpha: number) {
		hex = hex.replace('#', '');
		if (hex.length === 3) {
			hex = hex
				.split('')
				.map((c) => c + c)
				.join('');
		}
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	let glowColor0 = $derived(
		glyphActiveColor.startsWith('#') ? hexToRgba(glyphActiveColor, 0) : 'rgba(255, 255, 255, 0)'
	);
	let glowColor08 = $derived(
		glyphActiveColor.startsWith('#') ? hexToRgba(glyphActiveColor, 0.8) : glyphActiveColor
	);
	let glowColor05 = $derived(
		glyphActiveColor.startsWith('#') ? hexToRgba(glyphActiveColor, 0.5) : glyphActiveColor
	);
</script>

<div
	class="relative w-full h-full"
	style="--glow-color-0: {glowColor0}; --glow-color-08: {glowColor08}; --glow-color-05: {glowColor05};"
>
	<svg
		viewBox="0 0 200 400"
		class="w-full h-full drop-shadow-2xl transition-opacity duration-300 {active
			? 'opacity-100'
			: 'opacity-50 group-hover:opacity-100'}"
	>
		<!-- Phone Body -->
		<rect
			x="20"
			y="20"
			width="160"
			height="360"
			rx="24"
			fill={bodyColor}
			stroke={strokeColor}
			stroke-width="2"
		/>

		<!-- Camera Bump -->
		<rect
			x="28"
			y="28"
			width="44"
			height="94"
			rx="22"
			fill={cameraBumpColor}
			stroke={strokeColor}
			stroke-width="1"
		/>
		<circle cx="50" cy="50" r="11" fill="#111827" />
		<circle cx="50" cy="100" r="11" fill="#111827" />
		<circle cx="50" cy="50" r="5" fill="#374151" />
		<circle cx="50" cy="100" r="5" fill="#374151" />
		<circle cx="63" cy="50" r="4" fill="#ffffff" stroke={strokeColor} stroke-width="0.5" />

		<!-- Wireless Charging Coil (Center) - Decorative -->
		<circle cx="100" cy="190" r="55" fill="none" stroke={strokeColor} stroke-width="1" />
		<circle cx="100" cy="190" r="48" fill="none" stroke={cameraBumpColor} stroke-width="4" />

		<!-- Ribbon cables / internal details -->
		<path d="M 100 265 L 100 345" stroke={cableColor} stroke-width="8" stroke-linecap="round" />
		<path d="M 80 345 L 120 345" stroke={cableColor} stroke-width="4" stroke-linecap="round" />

		<!-- GLYPH INTERFACES - Phone 2 Layout -->

		<!-- A1 & A2 (Around Camera) -->
		<path
			d="M 50.0 24.0 A 26 26 0 0 0 24.1 47.7 L 24.1 95.0"
			fill="none"
			stroke={glyphColor}
			stroke-width="6"
			stroke-linecap="butt"
			class="opacity-30 {active ? 'pulse-fast' : 'group-hover:animate-pulse-fast'}"
		/>
		<path
			d="M 24.1 102.3 A 26 26 0 0 0 75.9 102.3"
			fill="none"
			stroke={glyphColor}
			stroke-width="6"
			stroke-linecap="butt"
			class="opacity-30 {active ? 'pulse-delayed-1' : 'group-hover:animate-pulse-delayed-1'}"
		/>

		<!-- B1 (Top Right Slant) -->
		<path
			d="M 115 100 L 145 60"
			stroke={glyphColor}
			stroke-width="4"
			stroke-linecap="round"
			class="opacity-30 {active ? 'pulse-delayed-2' : 'group-hover:animate-pulse-delayed-2'}"
		/>

		<!-- C Ring (Around Coil) -->
		<!-- C2 (Top Left) -->
		<path
			d="M 46.9 175.8 A 55 55 0 0 1 95.2 135.2"
			fill="none"
			stroke={glyphColor}
			stroke-width="4"
			stroke-linecap="round"
			class="opacity-30 {active ? 'pulse-fast' : 'group-hover:animate-pulse-fast'}"
		/>
		<!-- C1_1 - C1_16 (Top Right long arc) -->
		<path
			d="M 104.8 135.2 A 55 55 0 0 1 153.1 204.2"
			fill="none"
			stroke={glyphColor}
			stroke-width="4"
			stroke-linecap="round"
			class="opacity-30 {active ? 'pulse-delayed-3' : 'group-hover:animate-pulse-delayed-3'}"
		/>
		<!-- C3 (Middle Left) -->
		<path
			d="M 54.9 221.5 A 55 55 0 0 1 45.2 194.8"
			fill="none"
			stroke={glyphColor}
			stroke-width="4"
			stroke-linecap="round"
			class="opacity-30 {active ? 'pulse-delayed-1' : 'group-hover:animate-pulse-delayed-1'}"
		/>
		<!-- C6 (Middle Right) -->
		<path
			d="M 147.6 217.5 A 55 55 0 0 1 135.4 232.1"
			fill="none"
			stroke={glyphColor}
			stroke-width="4"
			stroke-linecap="round"
			class="opacity-30 {active ? 'pulse-delayed-2' : 'group-hover:animate-pulse-delayed-2'}"
		/>
		<!-- C4 (Bottom Left) -->
		<path
			d="M 95.2 244.8 A 55 55 0 0 1 64.6 232.1"
			fill="none"
			stroke={glyphColor}
			stroke-width="4"
			stroke-linecap="round"
			class="opacity-30 {active ? 'pulse-fast' : 'group-hover:animate-pulse-fast'}"
		/>
		<!-- C5 (Bottom Right) -->
		<path
			d="M 123.2 239.8 A 55 55 0 0 1 104.8 244.8"
			fill="none"
			stroke={glyphColor}
			stroke-width="4"
			stroke-linecap="round"
			class="opacity-30 {active ? 'pulse-delayed-4' : 'group-hover:animate-pulse-delayed-4'}"
		/>

		<!-- D1_1 - D1_8 (Bottom Exclamation Mark Line) -->
		<path
			d="M 100 255 L 100 310"
			stroke={glyphColor}
			stroke-width="4"
			stroke-linecap="round"
			class="opacity-30 {active ? 'pulse-delayed-1' : 'group-hover:animate-pulse-delayed-1'}"
		/>
		<!-- E1 (Bottom Exclamation Mark Dot) -->
		<circle
			cx="100"
			cy="325"
			r="3"
			fill={glyphColor}
			class="opacity-30 {active ? 'pulse-fast' : 'group-hover:animate-pulse-fast'}"
		/>

		{#if showGrid}
			<!-- Coordinate Grid Overlay -->
			<g class="pointer-events-none select-none font-mono text-[7px]" opacity="0.6">
				<!-- Grid Lines -->
				{#each Array(9) as _, i}
					{@const x = (i + 1) * 20}
					<line
						x1={x}
						y1="0"
						x2={x}
						y2="400"
						stroke="#f43f5e"
						stroke-width="0.5"
						stroke-dasharray="2,2"
					/>
					<text x={x + 1} y="12" fill="#f43f5e" font-size="7">{x}</text>
				{/each}
				{#each Array(19) as _, i}
					{@const y = (i + 1) * 20}
					<line
						x1="0"
						y1={y}
						x2="200"
						y2={y}
						stroke="#f43f5e"
						stroke-width="0.5"
						stroke-dasharray="2,2"
					/>
					<text x="2" y={y - 2} fill="#f43f5e" font-size="7">{y}</text>
				{/each}
				<!-- Diagnostic border -->
				<rect x="0" y="0" width="200" height="400" fill="none" stroke="#f43f5e" stroke-width="1" />
			</g>
		{/if}
	</svg>
</div>

<style>
	.pulse-fast,
	:global(.group:hover .group-hover\:animate-pulse-fast) {
		animation: glyph-pulse 0.8s infinite alternate;
	}
	.pulse-delayed-1,
	:global(.group:hover .group-hover\:animate-pulse-delayed-1) {
		animation: glyph-pulse 0.8s infinite alternate 0.2s;
	}
	.pulse-delayed-2,
	:global(.group:hover .group-hover\:animate-pulse-delayed-2) {
		animation: glyph-pulse 0.8s infinite alternate 0.4s;
	}
	.pulse-delayed-3,
	:global(.group:hover .group-hover\:animate-pulse-delayed-3) {
		animation: glyph-pulse 0.8s infinite alternate 0.6s;
	}
	.pulse-delayed-4,
	:global(.group:hover .group-hover\:animate-pulse-delayed-4) {
		animation: glyph-pulse 0.8s infinite alternate 0.8s;
	}

	@keyframes glyph-pulse {
		0% {
			opacity: 0.3;
			filter: drop-shadow(0 0 0px var(--glow-color-0));
		}
		100% {
			opacity: 1;
			filter: drop-shadow(0 0 8px var(--glow-color-08)) drop-shadow(0 0 12px var(--glow-color-05));
		}
	}
</style>
