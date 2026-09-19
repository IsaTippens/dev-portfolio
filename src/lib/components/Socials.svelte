<script lang="ts">
	import { onMount } from 'svelte';
	import Panel from '$lib/components/Panel.svelte';
	import { reducedMotion } from '$lib/motion';
	import X from 'virtual:icons/carbon/logo-x.svelte';
	import YouTube from 'virtual:icons/carbon/logo-youtube.svelte';
	import Github from 'virtual:icons/carbon/logo-github.svelte';
	import Instagram from 'virtual:icons/carbon/logo-instagram.svelte';
	import Mail from 'virtual:icons/carbon/email.svelte';

	/**
	 * TE-S10 — social interface. A tape deck with five channels and five keys.
	 *
	 * The meters *and* the reels step at 10Hz rather than every frame. A segmented VU
	 * meter is a stepped readout anyway, and a continuously spinning reel repaints the
	 * whole document through the grain blend layer on every frame — which measured at
	 * roughly half the frame budget in this environment. Stepped, it costs nothing; it
	 * also reads more like a machine than a lava lamp.
	 */

	let activeChannel = $state<number | null>(null);
	let levels = $state([20, 35, 15, 30, 45]);
	let reel_angle = $state(0);

	const channels = [
		{ name: 'GITHUB', abbr: 'GH', label: 'SRC', url: 'https://www.github.com/IsaTippens', icon: Github },
		{
			name: 'INSTAGRAM',
			abbr: 'IG',
			label: 'LNS',
			url: 'https://www.instagram.com/issssaaaaaaaaaaaaaahhhhhhhhhhh/',
			icon: Instagram
		},
		{ name: 'YOUTUBE', abbr: 'YT', label: 'PLAY', url: 'https://www.youtube.com/@issaaahhhh', icon: YouTube },
		{ name: 'X', abbr: 'X', label: 'TXT', url: 'https://x.com/issssaaaaaaaaah', icon: X },
		{ name: 'MAIL', abbr: 'ML', label: 'MSG', url: 'mailto:isatippens2@gmail.com', icon: Mail }
	];

	const knobPresets = [
		{ a: 45, b: -30, c: 90, d: 180 },
		{ a: -90, b: 60, c: -45, d: 90 },
		{ a: 180, b: 120, c: 30, d: -60 },
		{ a: -30, b: -90, c: 120, d: 45 },
		{ a: 90, b: 45, c: -120, d: -180 }
	];

	let knobs = $derived(activeChannel !== null ? knobPresets[activeChannel] : { a: 0, b: 0, c: 0, d: 0 });

	onMount(() => {
		// Decoration: leave the meters parked on a still frame for reduced motion.
		if (reducedMotion()) return;

		const STEP = 100;
		const id = setInterval(() => {
			levels = levels.map((level, i) => {
				const range = activeChannel === i ? 35 : 12;
				const ceiling = activeChannel === i ? 100 : 45;
				const floor = activeChannel === i ? 20 : 5;
				return Math.max(floor, Math.min(ceiling, level + (Math.random() - 0.5) * range));
			});
			reel_angle = (reel_angle + (activeChannel !== null ? 40 : 12)) % 360;
		}, STEP);

		return () => clearInterval(id);
	});

	/** Level percentage as a hex byte, TE readout style. */
	function toHex(val: number) {
		return Math.round(val * 2.55)
			.toString(16)
			.toUpperCase()
			.padStart(2, '0');
	}
</script>

<Panel
	draw={true}
	screws={true}
	data-stagger
	class="mx-auto w-full max-w-3xl border-[var(--hw-case-line)] bg-[var(--hw-case-2)] p-4 font-mono select-none sm:p-6"
>
	<!-- Chassis labels -->
	<div
		class="mb-3 flex items-center justify-between px-1 font-mono text-micro font-bold tracking-wider text-dim uppercase sm:text-tiny"
	>
		<span>TE-S10 // SOCIAL INTERFACE</span>
		<div class="flex gap-1" aria-hidden="true">
			{#each Array(5) as _}
				<span class="led" data-on={activeChannel !== null ? 'ok' : 'false'}></span>
			{/each}
		</div>
		<span>UNIT.04</span>
	</div>

	<div class="grid grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-4">
		<!-- Display module -->
		<div
			class="scanlines relative flex flex-col justify-between overflow-hidden border border-[var(--hw-case-line)] bg-[var(--hw-screen)] p-3 text-[var(--hw-screen-ink)] shadow-inner transition-none sm:p-4 md:col-span-3"
		>
			<!-- Screen header -->
			<div
				class="mb-2 flex items-center justify-between border-b border-[var(--hw-screen-ink)]/25 pb-2 font-mono text-micro font-bold select-none sm:text-tiny"
			>
				<div class="flex items-center gap-1.5">
					<span class="led" data-on={activeChannel !== null ? 'true' : 'false'}></span>
					<span class="text-ink">{activeChannel !== null ? 'REC' : 'PLAY'}</span>
				</div>

				<!-- Tape reels: CSS-driven, so the spin costs nothing per frame -->
				<div
					class="flex scale-90 items-center gap-1 border border-[var(--hw-screen-ink)]/25 bg-[var(--hw-screen-2)]/40 px-2 py-0.5 sm:scale-100"
				>
					{#each [0, 1] as reel (reel)}
						<span class="reel-layer" style="transform: rotate({reel_angle}deg)">
							<svg class="h-3.5 w-3.5" viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="6 3 2 3" />
								<circle cx="12" cy="12" r="3" fill="currentColor" />
							</svg>
						</span>
					{/each}
					<div class="relative flex h-2 w-4 items-center justify-between border border-[var(--hw-screen-ink)]/25 px-0.5">
						<div class="h-0.5 w-0.5 rounded-full bg-current"></div>
						<div class="h-0.5 w-0.5 rounded-full bg-current"></div>
					</div>
				</div>

				<span class="tracking-wider">BPM: {activeChannel !== null ? '140' : '110'}</span>
			</div>

			<!-- Channels -->
			<div class="grid grid-cols-5 gap-1.5 sm:gap-2">
				{#each channels as ch, i (ch.abbr)}
					{@const hovered = activeChannel === i}
					<a
						href={ch.url}
						target="_blank"
						rel="noopener"
						class="flex flex-col items-center border py-2 transition-none {hovered
							? 'border-[var(--hw-screen-ink)] bg-[var(--hw-screen-2)]/50'
							: 'border-[var(--hw-screen-ink)]/20'}"
						onmouseenter={() => (activeChannel = i)}
						onmouseleave={() => (activeChannel = null)}
						onfocus={() => (activeChannel = i)}
						onblur={() => (activeChannel = null)}
					>
						<div class="flex flex-col items-center gap-1 select-none">
							<span class="font-mono text-micro font-bold opacity-60">0{i + 1}</span>
							<span class="led" data-on={hovered ? 'ok' : 'false'} aria-hidden="true"></span>
						</div>

						<div class="my-2">
							<ch.icon class="h-5 w-5 sm:h-6 sm:w-6" />
						</div>

						<!-- Segmented level meter -->
						<div class="my-1 flex flex-col items-center gap-0.5 select-none" aria-hidden="true">
							{#each [75, 60, 45, 30, 15, 5] as threshold (threshold)}
								{@const lit = levels[i] >= threshold}
								<div
									class="h-1 w-4 sm:w-5 {lit
										? 'bg-[var(--hw-screen-ink)]'
										: 'bg-[var(--hw-screen-ink)]/20'}"
								></div>
							{/each}
						</div>

						<div class="mt-1 flex flex-col items-center font-mono text-micro font-bold tracking-tight select-none">
							<span class="opacity-60">{ch.label}</span>
							<span class="opacity-90">{toHex(levels[i])}</span>
						</div>
					</a>
				{/each}
			</div>

			<!-- Source readout -->
			<div
				class="mt-3 flex items-center justify-between border border-[var(--hw-screen-ink)]/25 bg-[var(--hw-screen-2)]/30 px-2 py-1.5 font-mono text-micro font-bold tracking-wide select-none sm:text-xxs"
			>
				<div class="flex w-full items-center gap-1.5 truncate">
					{#if activeChannel !== null}
						<span class="text-accent">▶</span>
						<span class="uppercase">
							{channels[activeChannel].name} // TRANSMIT TO: {channels[activeChannel].url
								.replace('https://www.', '')
								.replace('https://', '')}
						</span>
					{:else}
						<span class="opacity-55">■</span>
						<span class="uppercase opacity-55">SYSTEM READY // SELECT SOURCE CHANNEL 01-05</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- Control surface -->
		<div
			class="flex flex-col justify-between border border-[var(--hw-case-line)] bg-[var(--hw-case)] p-4 shadow-inner"
		>
			<div class="grid w-full grid-cols-4 items-center justify-items-center gap-4 py-2 md:grid-cols-2 md:gap-y-6">
				{#each [['A-VOL', knobs.a, 'var(--hw-knob-freq)'], ['B-FREQ', knobs.b, 'var(--hw-knob-phase)'], ['C-RES', knobs.c, 'var(--hw-knob-rgb)'], ['D-MIX', knobs.d, 'var(--hw-knob-phase)']] as [label, angle, cap], i (label)}
					<div class="flex flex-col items-center">
						<div
							class="relative flex h-7 w-7 items-center justify-center rounded-full border border-[var(--hw-knob-edge)] shadow-md"
							style="background: {cap}; transform: rotate({angle}deg); transition: transform 200ms cubic-bezier(0.2, 0.9, 0.25, 1);"
						>
							<div class="absolute top-0 h-3.5 w-1 rounded-b-sm bg-[var(--hw-well-2)]"></div>
						</div>
						<span class="mt-1 font-mono text-micro font-bold tracking-wider text-dim">{label}</span>
					</div>
				{/each}
			</div>

			<div
				class="mt-4 hidden flex-col gap-0.5 border-t border-[var(--hw-case-line)] pt-3 font-mono text-nano font-bold tracking-widest text-dim uppercase leading-none md:flex"
			>
				<span>HIGH FIDELITY</span>
				<span>POCKET CONTROLLER</span>
				<span>OP-S10 // SWEDEN</span>
			</div>
		</div>
	</div>

	<!-- Physical keys -->
	<div class="mt-5 grid grid-cols-5 gap-2 px-1">
		{#each channels as ch, i (ch.abbr)}
			{@const hovered = activeChannel === i}
			<div class="flex flex-col items-center">
				<a
					href={ch.url}
					target="_blank"
					rel="noopener"
					class="hbtn h-10 w-10 rounded-full text-tiny sm:h-12 sm:w-12"
					data-active={hovered}
					aria-label={`Open ${ch.name}`}
					onmouseenter={() => (activeChannel = i)}
					onmouseleave={() => (activeChannel = null)}
					onfocus={() => (activeChannel = i)}
					onblur={() => (activeChannel = null)}
				>
					{i + 1}
				</a>
				<span class="mt-1.5 font-mono text-micro font-bold text-dim">{ch.abbr}</span>
			</div>
		{/each}
	</div>
</Panel>

<style>
	/* The reel is rotated from the 10Hz instrument tick, not by a CSS animation or a
	   transition: either one keeps the compositor busy between steps and repaints the
	   document through the grain layer, which measured as frame budget lost for no
	   visible gain. See the note in the script. */
	.reel-layer {
		display: inline-block;
		will-change: transform;
	}
</style>
