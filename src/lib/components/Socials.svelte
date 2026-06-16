<script>
	import { onMount } from 'svelte';
	import X from 'virtual:icons/carbon/logo-x.svelte';
	import YouTube from 'virtual:icons/carbon/logo-youtube.svelte';
	import Github from 'virtual:icons/carbon/logo-github.svelte';
	import Instagram from 'virtual:icons/carbon/logo-instagram.svelte';
	import Mail from 'virtual:icons/carbon/email.svelte';

	// Svelte 5 state runes
	/** @type {number | null} */
	let activeChannel = $state(null);
	let levels = $state([20, 35, 15, 30, 45]);
	let tapeRotation = $state(0);

	const channels = [
		{
			name: 'GITHUB',
			abbr: 'GH',
			label: 'SRC',
			url: 'https://www.github.com/IsaTippens',
			icon: Github
		},
		{
			name: 'INSTAGRAM',
			abbr: 'IG',
			label: 'LNS',
			url: 'https://www.instagram.com/issssaaaaaaaaaaaaaahhhhhhhhhhh/',
			icon: Instagram
		},
		{
			name: 'YOUTUBE',
			abbr: 'YT',
			label: 'PLAY',
			url: 'https://www.youtube.com/@issaaahhhh',
			icon: YouTube
		},
		{
			name: 'X',
			abbr: 'X',
			label: 'TXT',
			url: 'https://x.com/issssaaaaaaaaah',
			icon: X
		},
		{
			name: 'MAIL',
			abbr: 'ML',
			label: 'MSG',
			url: 'mailto:isatippens2@gmail.com',
			icon: Mail
		}
	];

	const knobPresets = [
		{ a: 45, b: -30, c: 90, d: 180 },    // GH
		{ a: -90, b: 60, c: -45, d: 90 },    // IG
		{ a: 180, b: 120, c: 30, d: -60 },   // YT
		{ a: -30, b: -90, c: 120, d: 45 },   // X
		{ a: 90, b: 45, c: -120, d: -180 }   // ML
	];

	// Derived knob rotation values based on active channel
	let knobA = $derived(activeChannel !== null ? knobPresets[activeChannel].a : 0);
	let knobB = $derived(activeChannel !== null ? knobPresets[activeChannel].b : 0);
	let knobC = $derived(activeChannel !== null ? knobPresets[activeChannel].c : 0);
	let knobD = $derived(activeChannel !== null ? knobPresets[activeChannel].d : 0);

	onMount(() => {
		let frame = 0;
		let lastTime = performance.now();

		/** @param {number} time */
		const update = (time) => {
			const delta = time - lastTime;
			lastTime = time;

			// Spin the tape reel. Active channel makes it spin faster!
			const speed = activeChannel !== null ? 0.35 : 0.08;
			tapeRotation = (tapeRotation + speed * delta) % 360;

			// Ambient bounce for levels
			for (let i = 0; i < 5; i++) {
				if (activeChannel === i) {
					// High activity when hovered
					levels[i] = Math.max(20, Math.min(100, levels[i] + (Math.random() - 0.5) * 35));
				} else {
					// Low ambient activity
					levels[i] = Math.max(5, Math.min(45, levels[i] + (Math.random() - 0.5) * 12));
				}
			}

			frame = requestAnimationFrame(update);
		};

		frame = requestAnimationFrame(update);
		return () => cancelAnimationFrame(frame);
	});

	// Helper to display level percentage as hex string (Teenage Engineering style)
	/** @param {number} val */
	function toHex(val) {
		return Math.round(val * 2.55)
			.toString(16)
			.toUpperCase()
			.padStart(2, '0');
	}
</script>

<div
	class="w-full max-w-3xl mx-auto bg-[#eaeaea] dark:bg-[#161617] border-2 border-[#c5c5c5] dark:border-[#2b2b2c] rounded-3xl p-4 sm:p-6 shadow-2xl relative font-mono text-neutral-600 dark:text-neutral-400 select-none transition-colors duration-200"
>
	<!-- Corner Screws -->
	<div
		class="chassis-screw top-2.5 left-2.5"
	>
		+
	</div>
	<div
		class="chassis-screw top-2.5 right-2.5"
	>
		+
	</div>
	<div
		class="chassis-screw bottom-2.5 left-2.5"
	>
		+
	</div>
	<div
		class="chassis-screw bottom-2.5 right-2.5"
	>
		+
	</div>

	<!-- Chassis Top Labels -->
	<div
		class="flex justify-between items-center text-micro sm:text-tiny text-neutral-500 dark:text-[#555] tracking-wider mb-3 px-1 uppercase font-bold"
	>
		<span>TE-S10 // SOCIAL INTERFACE</span>
		<div class="flex gap-1">
			<span class="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-[#333]"></span>
			<span class="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-[#333]"></span>
			<span class="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-[#333]"></span>
			<span class="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-[#333]"></span>
			<span class="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-[#333]"></span>
		</div>
		<span>UNIT.04</span>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 items-stretch">
		<!-- Left: The Retro Screen Module -->
		<div
			class="md:col-span-3 flex flex-col justify-between bg-[#8ba67e] dark:bg-[#071308] border-2 border-[#6c8660] dark:border-[#1c2e1f] rounded-xl p-3 sm:p-4 shadow-inner relative overflow-hidden text-[#132a10] dark:text-[#13a846] lcd-grid transition-colors duration-200"
		>
			<!-- Scanline / Glare overlays -->
			<div
				class="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.12] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]"
			></div>
			<div
				class="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_60%)]"
			></div>

			<!-- Screen Header Status Bar -->
			<div
				class="flex justify-between items-center text-micro sm:text-tiny border-b border-[#132a10]/15 dark:border-[#1b301c]/60 pb-2 mb-2 select-none glow-text font-bold text-[#5e7456] dark:text-[#13a846] transition-colors duration-200"
			>
				<div class="flex items-center gap-1.5">
					<span
						class="inline-block w-2 h-2 rounded-full transition-colors {activeChannel !== null
							? 'bg-red-700 dark:bg-red-500 animate-pulse'
							: 'bg-[#7a936d] dark:bg-[#1b301c]'}"
					></span>
					<span class="transition-colors {activeChannel !== null ? 'text-red-700 dark:text-red-500' : ''}">
						{activeChannel !== null ? '● REC' : '▶ PLAY'}
					</span>
				</div>

				<!-- Cassette Tape Reel -->
				<div
					class="flex items-center gap-1 border border-[#132a10]/15 dark:border-[#1b301c] px-2 py-0.5 rounded bg-[#7e9972]/30 dark:bg-[#050c06] scale-90 sm:scale-100"
				>
					<!-- Left Reel -->
					<svg
						class="w-3.5 h-3.5 text-current transition-transform duration-75"
						viewBox="0 0 24 24"
						style="transform: rotate({tapeRotation}deg);"
					>
						<circle
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="1.5"
							fill="none"
							stroke-dasharray="6 3 2 3"
						/>
						<circle cx="12" cy="12" r="3" fill="currentColor" />
					</svg>
					<!-- Tape window -->
					<div
						class="w-4 h-2 border border-[#132a10]/15 dark:border-[#1b301c] relative flex items-center justify-between px-0.5"
					>
						<div class="w-0.5 h-0.5 bg-current rounded-full"></div>
						<div class="w-0.5 h-0.5 bg-current rounded-full"></div>
					</div>
					<!-- Right Reel -->
					<svg
						class="w-3.5 h-3.5 text-current transition-transform duration-75"
						viewBox="0 0 24 24"
						style="transform: rotate({tapeRotation}deg);"
					>
						<circle
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="1.5"
							fill="none"
							stroke-dasharray="6 3 2 3"
						/>
						<circle cx="12" cy="12" r="3" fill="currentColor" />
					</svg>
				</div>

				<div class="tracking-wider">
					<span>BPM: {activeChannel !== null ? '140' : '110'}</span>
				</div>
			</div>

			<!-- Grid of 5 Channels -->
			<div class="grid grid-cols-5 gap-1.5 sm:gap-2">
				{#each channels as ch, i}
					{@const hovered = activeChannel === i}
					<a
						href={ch.url}
						target="_blank"
						rel="noopener"
						class="flex flex-col items-center bg-[#7e9972]/15 dark:bg-[#050c06]/50 border border-[#132a10]/10 dark:border-[#1b301c]/40 rounded py-2 transition-all duration-150 {hovered
							? 'bg-[#76906a]/40 dark:bg-[#0a1e0c] border-[#132a10]/30 dark:border-[#00ff66]/40 text-[#132a10] dark:text-[#00ff66]'
							: 'text-[#5e7456] dark:text-[#13a846]'}"
						onmouseenter={() => (activeChannel = i)}
						onmouseleave={() => (activeChannel = null)}
						onfocus={() => (activeChannel = i)}
						onblur={() => (activeChannel = null)}
					>
						<!-- Channel indicator -->
						<div class="flex flex-col items-center gap-1 select-none">
							<span class="text-micro opacity-50 font-bold">0{i + 1}</span>
							<div
								class="w-1.5 h-1.5 rounded-full transition-colors {hovered
									? 'bg-[#132a10] dark:bg-[#00ff66] dark:shadow-[0_0_4px_#00ff66]'
									: 'bg-[#7a936d] dark:bg-[#0e2712]'}"
							></div>
						</div>

						<!-- Social Icon -->
						<div class="my-2 transition-transform duration-200 {hovered ? 'scale-110' : ''}">
							{#if ch.abbr === 'GH'}
								<Github class="w-5 h-5 sm:w-6 sm:h-6" />
							{:else if ch.abbr === 'IG'}
								<Instagram class="w-5 h-5 sm:w-6 sm:h-6" />
							{:else if ch.abbr === 'YT'}
								<YouTube class="w-5 h-5 sm:w-6 sm:h-6" />
							{:else if ch.abbr === 'X'}
								<X class="w-5 h-5 sm:w-6 sm:h-6" />
							{:else if ch.abbr === 'ML'}
								<Mail class="w-5 h-5 sm:w-6 sm:h-6" />
							{/if}
						</div>

						<!-- Equalizer Segment Display -->
						<div class="flex flex-col gap-0.5 items-center my-1 select-none">
							{#each [75, 60, 45, 30, 15, 5] as threshold}
								{@const active = levels[i] >= threshold}
								<div
									class="w-4 sm:w-5 h-1 rounded-sm transition-colors duration-75 {active
										? 'bg-[#132a10] dark:bg-[#00ff66] dark:shadow-[0_0_3px_rgba(0,255,102,0.8)]'
										: 'bg-[#738a6a] dark:bg-[#0e2411]'}"
								></div>
							{/each}
						</div>

						<!-- Param Readout -->
						<div class="text-micro font-bold flex flex-col items-center mt-1 select-none tracking-tight">
							<span class="opacity-60">{ch.label}</span>
							<span class={hovered ? 'text-[#132a10] dark:text-[#00ff66]' : 'opacity-85'}>{toHex(levels[i])}</span>
						</div>
					</a>
				{/each}
			</div>

			<!-- Dynamic Readout / Technical details -->
			<div
				class="bg-[#7e9972]/30 dark:bg-[#050c06] border border-[#132a10]/15 dark:border-[#1b301c]/40 rounded px-2 py-1.5 mt-3 flex items-center justify-between text-micro sm:text-xxs font-bold tracking-wide select-none"
			>
				<div class="truncate w-full flex items-center gap-1.5 glow-text">
					{#if activeChannel !== null}
						<span class="text-[#132a10] dark:text-[#00ff66] animate-pulse">▶</span>
						<span class="text-[#132a10] dark:text-[#00ff66] uppercase">
							{channels[activeChannel].name} // TRANSMIT TO: {channels[activeChannel].url
								.replace('https://www.', '')
								.replace('https://', '')}
						</span>
					{:else}
						<span class="opacity-55">■</span>
						<span class="opacity-55 uppercase">SYSTEM READY // SELECT SOURCE CHANNEL 01-05</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- Right: Physical Control Knobs & Elements -->
		<div
			class="flex flex-col justify-between bg-[#dfdfdf] dark:bg-[#1d1d1f] p-4 rounded-xl border border-neutral-300 dark:border-neutral-800 shadow-inner transition-colors duration-200"
		>
			<!-- Dial Grid -->
			<div class="grid grid-cols-4 md:grid-cols-2 gap-4 md:gap-y-6 items-center justify-items-center w-full py-2">
				<!-- Knob 1 -->
				<div class="flex flex-col items-center">
					<div
						class="w-7 h-7 rounded-full border border-neutral-950 shadow-md relative flex items-center justify-center bg-[#0088ff] cursor-ew-resize transition-transform duration-75"
						style="transform: rotate({knobA}deg);"
					>
						<div class="w-1 h-3.5 bg-neutral-950 absolute top-0 rounded-b-sm"></div>
					</div>
					<span class="text-micro mt-1 text-neutral-500 dark:text-neutral-500 font-bold tracking-wider font-mono"
						>A-VOL</span
					>
				</div>
				<!-- Knob 2 -->
				<div class="flex flex-col items-center">
					<div
						class="w-7 h-7 rounded-full border border-neutral-950 shadow-md relative flex items-center justify-center bg-[#00cc66] cursor-ew-resize transition-transform duration-75"
						style="transform: rotate({knobB}deg);"
					>
						<div class="w-1 h-3.5 bg-neutral-950 absolute top-0 rounded-b-sm"></div>
					</div>
					<span class="text-micro mt-1 text-neutral-500 dark:text-neutral-500 font-bold tracking-wider font-mono"
						>B-FREQ</span
					>
				</div>
				<!-- Knob 3 -->
				<div class="flex flex-col items-center">
					<div
						class="w-7 h-7 rounded-full border border-neutral-950 shadow-md relative flex items-center justify-center bg-[#ff5500] cursor-ew-resize transition-transform duration-75"
						style="transform: rotate({knobC}deg);"
					>
						<div class="w-1 h-3.5 bg-neutral-950 absolute top-0 rounded-b-sm"></div>
					</div>
					<span class="text-micro mt-1 text-neutral-500 dark:text-neutral-500 font-bold tracking-wider font-mono"
						>C-RES</span
					>
				</div>
				<!-- Knob 4 -->
				<div class="flex flex-col items-center">
					<div
						class="w-7 h-7 rounded-full border border-neutral-950 shadow-md relative flex items-center justify-center bg-[#ffcc00] cursor-ew-resize transition-transform duration-75"
						style="transform: rotate({knobD}deg);"
					>
						<div class="w-1 h-3.5 bg-neutral-950 absolute top-0 rounded-b-sm"></div>
					</div>
					<span class="text-micro mt-1 text-neutral-500 dark:text-neutral-500 font-bold tracking-wider font-mono"
						>D-MIX</span
					>
				</div>
			</div>

			<!-- Mechanical Spec label on chassis -->
			<div
				class="hidden md:flex flex-col border-t border-neutral-300 dark:border-neutral-800 pt-3 mt-4 text-nano text-neutral-400 dark:text-[#444] font-bold uppercase tracking-widest gap-0.5 leading-none"
			>
				<span>HIGH FIDELITY</span>
				<span>POCKET CONTROLLER</span>
				<span>OP-S10 // SWEDEN</span>
			</div>
		</div>
	</div>

	<!-- Bottom: Physical Buttons of the Pocket Operator -->
	<div class="grid grid-cols-5 gap-2 mt-5 px-1">
		{#each channels as ch, i}
			{@const hovered = activeChannel === i}
			<div class="flex flex-col items-center">
				<a
					href={ch.url}
					target="_blank"
					rel="noopener"
					class="knob-btn {hovered
						? 'bg-[#f5f5f7] dark:bg-[#2a2a2d] border-[#132a10] dark:border-[#00ff66] text-[#132a10] dark:text-[#00ff66] shadow-[0_0_8px_rgba(19,42,16,0.15)] dark:shadow-[0_0_10px_rgba(0,255,102,0.3)]'
						: ''}"
					onmouseenter={() => (activeChannel = i)}
					onmouseleave={() => (activeChannel = null)}
					onfocus={() => (activeChannel = i)}
					onblur={() => (activeChannel = null)}
				>
					{i + 1}
				</a>
				<span class="text-micro mt-1.5 text-neutral-500 dark:text-neutral-500 font-bold font-mono">{ch.abbr}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.lcd-grid {
		background-image: 
			linear-gradient(rgba(19, 42, 16, 0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(19, 42, 16, 0.04) 1px, transparent 1px);
		background-size: 3px 3px;
	}
	:global(.dark) .lcd-grid {
		background-image: 
			linear-gradient(rgba(0, 255, 102, 0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 255, 102, 0.02) 1px, transparent 1px);
	}
	:global(.dark) .glow-text {
		text-shadow: 0 0 2px rgba(0, 255, 102, 0.4);
		text-shadow: 0 0 2px rgba(0, 255, 102, 0.4);
	}

	.chassis-screw {
		@apply absolute w-3 h-3 rounded-full border border-neutral-300 dark:border-neutral-800 bg-[#dfdfdf] dark:bg-[#222] flex items-center justify-center text-micro text-[#999] dark:text-[#444] font-bold;
	}
	.knob-btn {
		@apply w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ffffff] dark:bg-[#242426] border border-[#cccccc] dark:border-[#3f3f46] text-neutral-500 dark:text-neutral-400 font-bold flex items-center justify-center shadow-lg transition-all duration-150 active:translate-y-0.5 active:shadow-md cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-400;
	}
</style>
