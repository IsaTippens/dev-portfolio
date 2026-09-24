<script>
	import { onMount } from 'svelte';
	import KnobCap from '$lib/components/KnobCap.svelte';
	import X from 'virtual:icons/carbon/logo-x.svelte';
	import YouTube from 'virtual:icons/carbon/logo-youtube.svelte';
	import Github from 'virtual:icons/carbon/logo-github.svelte';
	import Instagram from 'virtual:icons/carbon/logo-instagram.svelte';
	import Mail from 'virtual:icons/carbon/email.svelte';

	// Svelte 5 state runes
	/** @type {number | null} */
	let activeChannel = $state(null);
	/**
	 * Touch only: the channel a tap has tuned to. The first tap on a channel tunes the deck
	 * to it — the same preview a hover gives a mouse — and the second tap follows its link.
	 * @type {number | null}
	 */
	let armedChannel = $state(null);
	/** Whether the tap that armed a channel still owes its click: suppress that one, follow the next. */
	let suppress_click = false;
	/** @type {HTMLDivElement | null} */
	let root = null;

	/**
	 * @param {PointerEvent} event
	 * @param {number} i
	 */
	function arm_touch(event, i) {
		if (event.pointerType === 'mouse') return;
		suppress_click = armedChannel !== i;
		armedChannel = i;
		activeChannel = i;
	}

	/**
	 * @param {MouseEvent} event
	 * @param {number} i
	 */
	function follow_touch(event, i) {
		// @ts-expect-error click carries pointerType for real pointers
		if (event.pointerType !== 'touch') return; // a mouse or Enter follows at once
		if (suppress_click) {
			suppress_click = false;
			event.preventDefault();
			return;
		}
		armedChannel = null;
	}
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
		{ a: 45, b: -30, c: 90, d: 180 }, // GH
		{ a: -90, b: 60, c: -45, d: 90 }, // IG
		{ a: 180, b: 120, c: 30, d: -60 }, // YT
		{ a: -30, b: -90, c: 120, d: 45 }, // X
		{ a: 90, b: 45, c: -120, d: -180 } // ML
	];

	const knobs = [
		{ key: 'a', label: 'A-VOL', cap: 'var(--hw-knob-1)' },
		{ key: 'b', label: 'B-FREQ', cap: 'var(--hw-knob-2)' },
		{ key: 'c', label: 'C-RES', cap: 'var(--hw-knob-3)' },
		{ key: 'd', label: 'D-MIX', cap: 'var(--hw-knob-4)' }
	];

	/** Knob positions follow the hovered channel's preset, and park at 12 o'clock. */
	const knobAngles = $derived(
		activeChannel !== null ? knobPresets[activeChannel] : { a: 0, b: 0, c: 0, d: 0 }
	);

	onMount(() => {
		// The reel and level meters are decoration, so leave them parked on a still frame.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

<svelte:window
	onpointerdown={(event) => {
		if (event.pointerType === 'mouse' || armedChannel === null) return;
		if (root?.contains(/** @type {Node} */ (event.target))) return;
		armedChannel = null;
		activeChannel = null;
	}}
	onkeydown={(event) => {
		if (event.key !== 'Escape' || armedChannel === null) return;
		armedChannel = null;
		activeChannel = null;
	}}
/>

<div
	bind:this={root}
	class="w-full max-w-3xl mx-auto bg-[var(--hw-case-2)] border-2 border-[var(--hw-case-line)] rounded-3xl p-4 sm:p-6 shadow-2xl relative font-mono text-dim select-none transition-colors duration-200"
>
	<!-- Corner Screws -->
	<span class="hw-screw top-2.5 left-2.5" style="--angle: 40deg" aria-hidden="true"></span>
	<span class="hw-screw top-2.5 right-2.5" style="--angle: -25deg" aria-hidden="true"></span>
	<span class="hw-screw bottom-2.5 left-2.5" style="--angle: 70deg" aria-hidden="true"></span>
	<span class="hw-screw bottom-2.5 right-2.5" style="--angle: 10deg" aria-hidden="true"></span>

	<!-- Chassis Top Labels -->
	<div
		class="flex justify-between items-center text-micro sm:text-tiny text-dim tracking-wider mb-3 px-1 uppercase font-bold"
	>
		<span>TE-S10 // SOCIAL INTERFACE</span>
		<div class="flex gap-1">
			<span class="w-1.5 h-1.5 rounded-full bg-[var(--hw-case-line)]"></span>
			<span class="w-1.5 h-1.5 rounded-full bg-[var(--hw-case-line)]"></span>
			<span class="w-1.5 h-1.5 rounded-full bg-[var(--hw-case-line)]"></span>
			<span class="w-1.5 h-1.5 rounded-full bg-[var(--hw-case-line)]"></span>
			<span class="w-1.5 h-1.5 rounded-full bg-[var(--hw-case-line)]"></span>
		</div>
		<span>UNIT.04</span>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 items-stretch">
		<!-- Left: The Retro Screen Module -->
		<div
			class="md:col-span-3 flex flex-col justify-between bg-[var(--hw-screen)] border-2 border-[var(--hw-screen-line)] rounded-xl p-3 sm:p-4 shadow-inner relative overflow-hidden text-[var(--hw-screen-ink)] lcd-grid transition-colors duration-200"
		>
			<!-- Scanline / Glare overlays -->
			<div
				class="absolute inset-0 pointer-events-none opacity-[0.1] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]"
			></div>
			<div
				class="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_60%)]"
			></div>

			<!-- Screen Header Status Bar -->
			<div
				class="flex justify-between items-center text-micro sm:text-tiny border-b border-[var(--hw-screen-line)] pb-2 mb-2 select-none glow-text font-bold text-[var(--hw-screen-ink-dim)] transition-colors duration-200"
			>
				<div class="flex items-center gap-1.5">
					<span
						class="inline-block w-2 h-2 rounded-full transition-colors {activeChannel !== null
							? 'bg-rec animate-pulse'
							: 'bg-[var(--hw-screen-seg-off)]'}"
					></span>
					<span class="transition-colors {activeChannel !== null ? 'text-rec' : ''}">
						{activeChannel !== null ? '● REC' : '▶ PLAY'}
					</span>
				</div>

				<!-- Cassette Tape Reel -->
				<div
					class="flex items-center gap-1 border border-[var(--hw-screen-line)] px-2 py-0.5 rounded bg-[var(--hw-screen-well)] scale-90 sm:scale-100"
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
						class="w-4 h-2 border border-[var(--hw-screen-line)] relative flex items-center justify-between px-0.5"
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
						class="flex flex-col items-center bg-[var(--hw-screen-cell)] border border-[var(--hw-screen-line)] rounded py-2 transition-all duration-150 {hovered
							? 'bg-[var(--hw-screen-cell-on)] border-[var(--hw-screen-ink)] text-[var(--hw-screen-ink)]'
							: 'text-[var(--hw-screen-ink-dim)]'}"
						onmouseenter={() => (activeChannel = i)}
						onmouseleave={() => (activeChannel = null)}
						onfocus={() => (activeChannel = i)}
						onblur={() => (activeChannel = armedChannel)}
						onpointerdown={(event) => arm_touch(event, i)}
						onclick={(event) => follow_touch(event, i)}
					>
						<!-- Channel indicator -->
						<div class="flex flex-col items-center gap-1 select-none">
							<span class="text-micro opacity-50 font-bold">0{i + 1}</span>
							<div
								class="w-1.5 h-1.5 rounded-full transition-colors {hovered
									? 'bg-[var(--hw-screen-ink)]'
									: 'bg-[var(--hw-screen-seg-off)]'}"
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
										? 'bg-[var(--hw-screen-ink)]'
										: 'bg-[var(--hw-screen-seg-off)]'}"
								></div>
							{/each}
						</div>

						<!-- Param Readout -->
						<div
							class="text-micro font-bold flex flex-col items-center mt-1 select-none tracking-tight"
						>
							<span class="opacity-60">{ch.label}</span>
							<span class={hovered ? 'text-[var(--hw-screen-ink)]' : 'opacity-85'}
								>{toHex(levels[i])}</span
							>
						</div>
					</a>
				{/each}
			</div>

			<!-- Dynamic Readout / Technical details -->
			<div
				class="bg-[var(--hw-screen-well)] border border-[var(--hw-screen-line)] rounded px-2 py-1.5 mt-3 flex items-center justify-between text-micro sm:text-xxs font-bold tracking-wide select-none"
			>
				<div class="truncate w-full flex items-center gap-1.5 glow-text">
					{#if activeChannel !== null}
						<span class="text-[var(--hw-screen-ink)] animate-pulse">▶</span>
						<span class="text-[var(--hw-screen-ink)] uppercase">
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
			class="flex flex-col justify-between bg-[var(--hw-case)] p-4 rounded-xl border border-[var(--hw-case-line)] shadow-inner"
		>
			<!-- Dial Grid -->
			<div
				class="grid grid-cols-4 md:grid-cols-2 gap-4 md:gap-y-6 items-center justify-items-center w-full py-2"
			>
				{#each knobs as knob (knob.key)}
					<div class="flex flex-col items-center">
						<div class="knob-seat">
							<KnobCap
								cap={knob.cap}
								rotation={knobAngles[/** @type {'a' | 'b' | 'c' | 'd'} */ (knob.key)]}
								size={30}
							/>
						</div>
						<span class="text-micro mt-1.5 text-dim font-bold tracking-wider font-mono"
							>{knob.label}</span
						>
					</div>
				{/each}
			</div>

			<!-- Mechanical Spec label on chassis -->
			<div
				class="hidden md:flex flex-col border-t border-[var(--hw-case-line)] pt-3 mt-4 text-nano text-dim font-bold uppercase tracking-widest gap-0.5 leading-none"
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
					class="hw-key h-10 w-10 sm:h-12 sm:w-12 {hovered
						? 'border-[var(--hw-screen-ink)] text-[var(--hw-screen-ink)]'
						: ''}"
					onmouseenter={() => (activeChannel = i)}
					onmouseleave={() => (activeChannel = null)}
					onfocus={() => (activeChannel = i)}
					onblur={() => (activeChannel = armedChannel)}
					onpointerdown={(event) => arm_touch(event, i)}
					onclick={(event) => follow_touch(event, i)}
				>
					{i + 1}
				</a>
				<span class="text-micro mt-1.5 text-dim font-bold font-mono">{ch.abbr}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.lcd-grid {
		background-image: linear-gradient(var(--hw-screen-grid) 1px, transparent 1px),
			linear-gradient(90deg, var(--hw-screen-grid) 1px, transparent 1px);
		background-size: 3px 3px;
	}

	.glow-text {
		text-shadow: var(--hw-screen-glow);
	}

	/* The cap turns to a preset the way a motorised fader seeks: quick, and settled. */
	.knob-seat :global(.knob > span:first-child) {
		transition: transform 260ms cubic-bezier(0.2, 0.9, 0.25, 1);
	}
</style>
