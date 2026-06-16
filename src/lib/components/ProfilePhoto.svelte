<script lang="ts">
	type FilterType = 'LCD' | 'CRT' | 'GAMEBOY' | 'DOT_MATRIX' | 'NORMAL';
	let filters: FilterType[] = ['LCD', 'CRT', 'GAMEBOY', 'DOT_MATRIX', 'NORMAL'];
	let activeFilter = $state<FilterType>('LCD');

	const filterPresets: Record<FilterType, { freq: number; phase: number; rgb: number }> = {
		'LCD': { freq: 45, phase: -30, rgb: 90 },
		'CRT': { freq: -90, phase: 60, rgb: -45 },
		'GAMEBOY': { freq: 180, phase: 120, rgb: 30 },
		'DOT_MATRIX': { freq: -30, phase: -90, rgb: 120 },
		'NORMAL': { freq: 0, phase: 0, rgb: 0 }
	};
	let freq = $state(filterPresets['LCD'].freq);
	let phase = $state(filterPresets['LCD'].phase);
	let rgb = $state(filterPresets['LCD'].rgb);

	import { isCharging, batteryLevel } from '$lib/stores/battery';

	function selectFilter(f: FilterType) {
		activeFilter = f;
		freq = filterPresets[f].freq;
		phase = filterPresets[f].phase;
		rgb = filterPresets[f].rgb;
	}

	function resetKnob(knobType: 'freq' | 'phase' | 'rgb') {
		const preset = filterPresets[activeFilter];
		if (knobType === 'freq') freq = preset.freq;
		else if (knobType === 'phase') phase = preset.phase;
		else if (knobType === 'rgb') rgb = preset.rgb;
	}

	function handleKnobDrag(knobType: 'freq' | 'phase' | 'rgb', event: PointerEvent) {
		event.preventDefault();
		const element = event.currentTarget as HTMLDivElement;
		element.setPointerCapture(event.pointerId);
		
		const startY = event.clientY;
		const startVal = knobType === 'freq' ? freq : knobType === 'phase' ? phase : rgb;
		
		function onPointerMove(moveEvent: PointerEvent) {
			const deltaY = startY - moveEvent.clientY;
			// 1.5 degrees of rotation per pixel dragged
			let newVal = startVal + deltaY * 1.5;
			newVal = Math.max(-180, Math.min(180, newVal));
			
			if (knobType === 'freq') freq = newVal;
			else if (knobType === 'phase') phase = newVal;
			else if (knobType === 'rgb') rgb = newVal;
		}
		
		function onPointerUp(upEvent: PointerEvent) {
			element.releasePointerCapture(upEvent.pointerId);
			element.removeEventListener('pointermove', onPointerMove as EventListener);
			element.removeEventListener('pointerup', onPointerUp as EventListener);
		}
		
		element.addEventListener('pointermove', onPointerMove as EventListener);
		element.addEventListener('pointerup', onPointerUp as EventListener);
	}

	function handleKnobKeydown(knobType: 'freq' | 'phase' | 'rgb', event: KeyboardEvent) {
		let currentVal = knobType === 'freq' ? freq : knobType === 'phase' ? phase : rgb;
		let step = 5;
		
		if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
			event.preventDefault();
			let newVal = Math.min(180, currentVal + step);
			if (knobType === 'freq') freq = newVal;
			else if (knobType === 'phase') phase = newVal;
			else if (knobType === 'rgb') rgb = newVal;
		} else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
			event.preventDefault();
			let newVal = Math.max(-180, currentVal - step);
			if (knobType === 'freq') freq = newVal;
			else if (knobType === 'phase') phase = newVal;
			else if (knobType === 'rgb') rgb = newVal;
		} else if (event.key === 'Home') {
			event.preventDefault();
			if (knobType === 'freq') freq = -180;
			else if (knobType === 'phase') phase = -180;
			else if (knobType === 'rgb') rgb = -180;
		} else if (event.key === 'End') {
			event.preventDefault();
			if (knobType === 'freq') freq = 180;
			else if (knobType === 'phase') phase = 180;
			else if (knobType === 'rgb') rgb = 180;
		}
	}

	let hudColor = $derived(
		activeFilter === 'LCD' ? '#00ff66' :
		activeFilter === 'CRT' ? '#33ccff' :
		activeFilter === 'GAMEBOY' ? '#8bac0f' :
		activeFilter === 'DOT_MATRIX' ? '#ff5500' :
		'#ffffff'
	);

	let filterStyle = $derived(
		activeFilter === 'LCD'
			? `grayscale(100%) contrast(${150 + phase}%) brightness(0.8) sepia(100%) hue-rotate(${80 + freq}deg) saturate(${200 + rgb}%)`
			: activeFilter === 'CRT'
			? `contrast(${120 + freq * 0.5}%) brightness(${1.1 + phase * 0.002}) saturate(${130 + rgb * 0.5}%) sepia(20%)`
			: activeFilter === 'GAMEBOY'
			? `grayscale(100%) contrast(${200 + phase * 0.5}%) brightness(0.9) sepia(100%) hue-rotate(${50 + freq}deg) saturate(${300 + rgb}%)`
			: activeFilter === 'DOT_MATRIX'
			? `grayscale(100%) contrast(${400 + phase * 1.5}%) sepia(100%) hue-rotate(${-25 + freq}deg) saturate(400%) brightness(${0.7 + rgb * 0.002})`
			: `grayscale(${Math.max(0, Math.min(100, 50 - freq / 3.6))}%) contrast(${100 + phase * 0.5}%) opacity(${Math.max(0.2, Math.min(1, 0.8 + rgb * 0.001))})`
	);
</script>

<div class="relative w-full bg-[#e6e6e3] dark:bg-[#1e1e1f] border border-border dark:border-neutral-800 p-4 pt-5 pb-3 flex flex-col gap-3.5 shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#333333] select-none overflow-hidden">
	<!-- Grid Dots Background -->
	<div class="absolute inset-0 pointer-events-none opacity-40 dot-grid-bg"></div>

	<!-- Screws in corners with random-like rotations -->
	<div class="absolute top-1.5 left-1.5 w-2 h-2 rounded-full border border-neutral-400 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-sm">
		<div class="w-1.5 h-0.5 bg-neutral-500 dark:bg-neutral-600 rotate-[45deg]"></div>
	</div>
	<div class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-neutral-400 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-sm">
		<div class="w-1.5 h-0.5 bg-neutral-500 dark:bg-neutral-600 rotate-[-30deg]"></div>
	</div>
	<div class="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full border border-neutral-400 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-sm">
		<div class="w-1.5 h-0.5 bg-neutral-500 dark:bg-neutral-600 rotate-[60deg]"></div>
	</div>
	<div class="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full border border-neutral-400 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-sm">
		<div class="w-1.5 h-0.5 bg-neutral-500 dark:bg-neutral-600 rotate-[15deg]"></div>
	</div>

	<!-- Device Header -->
	<div class="flex justify-between items-center z-10 px-1">
		<div class="flex flex-col">
			<span class="text-micro font-bold tracking-wider text-neutral-800 dark:text-neutral-200 font-mono">PO-100 / ID-PHOTO</span>
			<span class="text-pico tracking-widest text-muted font-mono uppercase">TE_PORTRAIT_ENGINE</span>
		</div>
		
		<!-- Speaker grill -->
		<div class="grid grid-cols-4 gap-0.5 opacity-60">
			{#each Array(12) as _}
				<div class="w-0.5 h-0.5 rounded-full bg-neutral-600 dark:bg-neutral-400"></div>
			{/each}
		</div>
	</div>

	<!-- Photo Container (Recessed screen bezel) -->
	<div class="relative w-full aspect-square border-2 border-neutral-900 dark:border-neutral-950 bg-[#1c1c1c] overflow-hidden flex items-center justify-center p-[2px] shadow-[inset_0_2px_5px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.1)] z-10">
		<div class="relative w-full h-full overflow-hidden">
			<!-- The image -->
			<img 
				src="/images/profile-instagram.jpg" 
				alt="Profile" 
				class="absolute inset-0 w-full h-full object-cover transition-all duration-300"
				style="filter: {filterStyle};"
			/>

			<!-- Overlays -->
			{#if activeFilter === 'LCD'}
				<div class="absolute inset-0 pointer-events-none lcd-overlay"></div>
			{/if}
			{#if activeFilter === 'CRT'}
				<div class="absolute inset-0 pointer-events-none crt-overlay"></div>
				<div class="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-10"></div>
			{/if}
			{#if activeFilter === 'GAMEBOY'}
				<div class="absolute inset-0 pointer-events-none gb-overlay"></div>
			{/if}
			{#if activeFilter === 'DOT_MATRIX'}
				<div class="absolute inset-0 pointer-events-none dot-overlay"></div>
			{/if}

			<!-- Glass reflection overlay -->
			<div class="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-transparent to-white/10 z-20"></div>

			<!-- Dynamic HUD Overlay -->
			<div 
				class="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 font-mono text-nano z-30 transition-colors duration-300 select-none"
				style="color: {hudColor};"
			>
				<div class="flex justify-between items-start">
					<span class="bg-black/60 px-1 py-0.5 rounded-sm tracking-wider">{$isCharging ? 'PWR: CHG' : 'LNK: ON'}</span>
					<div class="flex items-center gap-1 bg-black/60 px-1 py-0.5 rounded-sm">
						<span class="w-1.5 h-1.5 rounded-full bg-[#ff3300] animate-pulse"></span>
						<span class="text-white">REC</span>
					</div>
				</div>
				
				<div class="flex justify-between items-end">
					<div class="flex flex-col bg-black/60 px-1 py-0.5 rounded-sm leading-tight">
						<span>MODE: {activeFilter === 'DOT_MATRIX' ? 'DOT' : activeFilter === 'GAMEBOY' ? 'GB' : activeFilter}</span>
						<span>VAL: {Math.round((freq + 180) / 3.63)} {Math.round((phase + 180) / 3.63)} {Math.round((rgb + 180) / 3.63)}</span>
					</div>
					
					<!-- Interactive parameter meter bars -->
					<div class="flex items-end gap-0.5 h-4.5 bg-black/60 p-0.5 rounded-sm">
						<div class="w-1 transition-all duration-300" style="background-color: {hudColor}; height: {Math.max(15, Math.round((freq + 180) / 3.63 * 0.8))}%"></div>
						<div class="w-1 transition-all duration-300" style="background-color: {hudColor}; height: {Math.max(15, Math.round((phase + 180) / 3.63 * 0.8))}%"></div>
						<div class="w-1 transition-all duration-300" style="background-color: {hudColor}; height: {Math.max(15, Math.round((rgb + 180) / 3.63 * 0.8))}%"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Controls (Tactile circular keys) -->
	<div class="grid grid-cols-5 gap-1 mt-0.5 z-10">
		{#each filters as f}
			<div class="flex flex-col items-center gap-1">
				<button 
					class="{activeFilter === f ? 'filter-btn-active' : 'filter-btn'}"
					onclick={() => selectFilter(f)}
				>
					{f === 'GAMEBOY' ? 'GB' : f === 'DOT_MATRIX' ? 'DM' : f.slice(0, 3)}
				</button>
				
				<!-- LED Indicator under key -->
				<div class="w-1 h-1 rounded-full transition-all duration-300 {activeFilter === f ? 'bg-[#ff3300] shadow-[0_0_4px_#ff3300]' : 'bg-neutral-300 dark:bg-neutral-800'}"></div>
			</div>
		{/each}
	</div>

	<!-- Dials / Knobs -->
	<div class="flex justify-between items-center px-1 pt-2 border-t border-neutral-300/60 dark:border-neutral-800/80 z-10">
		<!-- Knob 1: FREQ -->
		<div class="flex flex-col items-center gap-1">
			<div class="w-9 h-9 rounded-full bg-neutral-300 dark:bg-neutral-900/60 border border-neutral-400/50 dark:border-neutral-800 flex items-center justify-center shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]">
				<div 
					class="w-7 h-7 rounded-full border border-neutral-900/80 dark:border-neutral-950 shadow-md relative flex items-center justify-center cursor-ns-resize select-none bg-gradient-to-tr from-[#0066cc] to-[#33a3ff] active:cursor-grabbing active:scale-95 focus:outline-none focus:ring-1 focus:ring-accent" 
					style="transform: rotate({freq}deg);"
					onpointerdown={(e) => handleKnobDrag('freq', e)}
					ondblclick={() => resetKnob('freq')}
					onkeydown={(e) => handleKnobKeydown('freq', e)}
					role="slider"
					aria-label="Filter Frequency knob"
					aria-valuenow={Math.round((freq + 180) / 3.63)}
					aria-valuemin="0"
					aria-valuemax="100"
					tabindex="0"
					title="Drag vertically or use Arrow Keys to adjust FREQ. Double-click to reset."
				>
					<div class="w-0.5 h-3 bg-neutral-950 absolute top-0.5 rounded-b-[1px]"></div>
				</div>
			</div>
			<div class="flex flex-col items-center leading-none">
				<span class="text-nano text-neutral-800 dark:text-neutral-200 font-bold font-mono tracking-wider">FREQ</span>
				<span class="text-pico text-muted font-mono mt-0.5 font-bold">{Math.round((freq + 180) / 3.63)}</span>
			</div>
		</div>

		<!-- Knob 2: PHASE -->
		<div class="flex flex-col items-center gap-1">
			<div class="w-9 h-9 rounded-full bg-neutral-300 dark:bg-neutral-900/60 border border-neutral-400/50 dark:border-neutral-800 flex items-center justify-center shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]">
				<div 
					class="w-7 h-7 rounded-full border border-neutral-900/80 dark:border-neutral-950 shadow-md relative flex items-center justify-center cursor-ns-resize select-none bg-gradient-to-tr from-[#00994d] to-[#33ff99] active:cursor-grabbing active:scale-95 focus:outline-none focus:ring-1 focus:ring-accent" 
					style="transform: rotate({phase}deg);"
					onpointerdown={(e) => handleKnobDrag('phase', e)}
					ondblclick={() => resetKnob('phase')}
					onkeydown={(e) => handleKnobKeydown('phase', e)}
					role="slider"
					aria-label="Filter Phase knob"
					aria-valuenow={Math.round((phase + 180) / 3.63)}
					aria-valuemin="0"
					aria-valuemax="100"
					tabindex="0"
					title="Drag vertically or use Arrow Keys to adjust PHASE. Double-click to reset."
				>
					<div class="w-0.5 h-3 bg-neutral-950 absolute top-0.5 rounded-b-[1px]"></div>
				</div>
			</div>
			<div class="flex flex-col items-center leading-none">
				<span class="text-nano text-neutral-800 dark:text-neutral-200 font-bold font-mono tracking-wider">PHAS</span>
				<span class="text-pico text-muted font-mono mt-0.5 font-bold">{Math.round((phase + 180) / 3.63)}</span>
			</div>
		</div>

		<!-- Knob 3: RGB -->
		<div class="flex flex-col items-center gap-1">
			<div class="w-9 h-9 rounded-full bg-neutral-300 dark:bg-neutral-900/60 border border-neutral-400/50 dark:border-neutral-800 flex items-center justify-center shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]">
				<div 
					class="w-7 h-7 rounded-full border border-neutral-900/80 dark:border-neutral-950 shadow-md relative flex items-center justify-center cursor-ns-resize select-none bg-gradient-to-tr from-[#cc4400] to-[#ff7733] active:cursor-grabbing active:scale-95 focus:outline-none focus:ring-1 focus:ring-accent" 
					style="transform: rotate({rgb}deg);"
					onpointerdown={(e) => handleKnobDrag('rgb', e)}
					ondblclick={() => resetKnob('rgb')}
					onkeydown={(e) => handleKnobKeydown('rgb', e)}
					role="slider"
					aria-label="Filter RGB knob"
					aria-valuenow={Math.round((rgb + 180) / 3.63)}
					aria-valuemin="0"
					aria-valuemax="100"
					tabindex="0"
					title="Drag vertically or use Arrow Keys to adjust RGB. Double-click to reset."
				>
					<div class="w-0.5 h-3 bg-neutral-950 absolute top-0.5 rounded-b-[1px]"></div>
				</div>
			</div>
			<div class="flex flex-col items-center leading-none">
				<span class="text-nano text-neutral-800 dark:text-neutral-200 font-bold font-mono tracking-wider">RGB</span>
				<span class="text-pico text-muted font-mono mt-0.5 font-bold">{Math.round((rgb + 180) / 3.63)}</span>
			</div>
		</div>
	</div>

	<!-- Bottom Hardware Details -->
	<div class="flex justify-between items-center mt-2.5 pt-2 border-t border-dashed border-neutral-400/40 dark:border-neutral-800 text-femto text-muted font-mono uppercase tracking-widest z-10">
		<div class="flex items-center gap-1.5">
			<!-- 3.5mm Jack -->
			<div class="w-3.5 h-3.5 rounded-full bg-neutral-950 border border-neutral-400/50 dark:border-neutral-800 flex items-center justify-center relative shadow-inner">
				<div class="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-[#b8860b] dark:border-[#ffd700]"></div>
			</div>
			<span>OUT</span>
		</div>
		
		<span>PO-100 OP-IMG</span>
		
		<div class="flex items-center gap-1.5">
			<span>PWR</span>
			<!-- USB-C Port & Cable -->
			<div class="relative flex items-center justify-center">
				<div class="w-4 h-2 rounded-[1px] bg-neutral-950 border border-neutral-400/50 dark:border-neutral-800 flex items-center justify-center shadow-inner">
					<div class="w-2.5 h-0.5 rounded-full bg-neutral-800 border border-neutral-600"></div>
				</div>
				
				{#if $isCharging}
					<div class="absolute top-[1px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30 usb-c-cable">
						<!-- Connector collar (inserted tip) -->
						<div class="w-2 h-0.5 bg-neutral-400 dark:bg-neutral-500 border-x border-neutral-500"></div>
						<!-- Connector body -->
						<div class="w-4 h-4 bg-[#eaeae6] dark:bg-[#2e2e30] border border-neutral-800 dark:border-neutral-950 rounded-[1px] flex items-center justify-center relative shadow-md">
							<!-- Small TE-inspired indicator dot -->
							<div 
								class="w-1 h-1 rounded-full indicator-dot" 
								class:green={$batteryLevel === 100}
								class:blink-red={$batteryLevel !== 100}
							></div>
						</div>
						<!-- Strain relief -->
						<div class="w-1.5 h-1 bg-neutral-800 dark:bg-neutral-900 rounded-b-[1px]"></div>
						<!-- Cord extending down -->
						<div class="w-0.5 h-16 bg-neutral-600 dark:bg-neutral-500 shadow-inner"></div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.dot-grid-bg {
		background-image: radial-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px);
		background-size: 8px 8px;
	}
	:global(.dark) .dot-grid-bg {
		background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
	}

	/* LCD: High contrast monochromatic green with scanlines */
	.lcd-overlay {
		background: repeating-linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 0px,
			rgba(0, 0, 0, 0) 2px,
			rgba(0, 0, 0, 0.2) 2px,
			rgba(0, 0, 0, 0.2) 4px
		);
		mix-blend-mode: overlay;
	}

	/* CRT: Warmer tone, higher saturation, slight blur and scanlines */
	.crt-overlay {
		background: 
			linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%), 
			linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04));
		background-size: 100% 3px, 3px 100%;
		mix-blend-mode: multiply;
	}

	/* GAMEBOY: Classic 4-color pea green look */
	.gb-overlay {
		background: rgba(139, 172, 15, 0.25);
		mix-blend-mode: color;
	}

	/* DOT_MATRIX: High contrast orange/black with dot pattern */
	.dot-overlay {
		background-image: radial-gradient(rgba(0, 0, 0, 0.6) 1px, transparent 1px);
		background-size: 3px 3px;
	}

	@keyframes plug-in {
		0% {
			transform: translate(-50%, 20px);
			opacity: 0;
		}
		100% {
			transform: translate(-50%, 0);
			opacity: 1;
		}
	}
	.usb-c-cable {
		animation: plug-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}
	.indicator-dot.green {
		background-color: #22c55e;
		box-shadow: 0 0 2px #22c55e;
	}
	.indicator-dot.blink-red {
		animation: blink-red 2.5s infinite ease-in-out;
	}
	@keyframes blink-red {
		0%, 100% {
			background-color: #ef4444;
			box-shadow: 0 0 2px #ef4444;
		}
		50% {
			background-color: #7f1d1d;
			box-shadow: none;
		}
	}
	.filter-btn {
		@apply w-7 h-7 rounded-full flex items-center justify-center font-mono text-nano font-bold border transition-all select-none relative focus:outline-none active:scale-95 bg-[#f4f4f2] text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 shadow-[0_2px_0_#b5b5b8,0_3px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_0_#111,0_3px_2px_rgba(0,0,0,0.3)] active:translate-y-px active:shadow-none;
	}
	.filter-btn-active {
		@apply w-7 h-7 rounded-full flex items-center justify-center font-mono text-nano font-bold border transition-all select-none relative focus:outline-none active:scale-95 bg-neutral-900 text-white border-neutral-950 dark:bg-white dark:text-black dark:border-white shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] translate-y-px;
	}
</style>
