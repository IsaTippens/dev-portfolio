<script lang="ts">
	import Knob from '$lib/components/Knob.svelte';
	import Readout from '$lib/components/Readout.svelte';
	import { isCharging, batteryLevel } from '$lib/stores/battery';
	import { reducedMotion } from '$lib/motion';
	import {
		PO_MODES,
		po,
		poApply,
		poResetKnob,
		poScrollMode
	} from '$lib/stores/po100.svelte.js';

	export type PoMode = 'LCD' | 'CRT' | 'GAMEBOY' | 'DOT_MATRIX' | 'NORMAL';
	const MODES = PO_MODES;

	/**
	 * The 2D control panel. The device state lives in `$lib/stores/po100.svelte.js`,
	 * shared with the 3D view that can take this slot over — this module is the
	 * interface, the 3D model is the object being controlled.
	 *
	 * `scroll_mode` is driven by the hero's pinned scroll (Task 4.5). A manual button
	 * press wins for the rest of the visit: once the operator has touched the panel the
	 * scroll no longer drives it, because a machine that fights its operator is broken.
	 */
	let {
		scroll_mode = null,
		covered = false
	}: { scroll_mode?: PoMode | null; covered?: boolean } = $props();

	let screen: HTMLDivElement | null = $state(null);

	const active = $derived(MODES.find((m) => m.id === po.mode) ?? MODES[0]);
	const readout = (v: number) => Math.round((v + 180) / 3.6);

	// Scroll-driven mode cycling, unless the operator has taken the panel.
	$effect(() => {
		poScrollMode(scroll_mode);
	});

	// A mode change is a switch, not a fade: the tube blinks for a frame and comes back
	// on the new setting.
	let first_run = true;
	$effect(() => {
		void po.mode;
		if (first_run) {
			first_run = false;
			return;
		}
		if (reducedMotion() || !screen) return;
		screen.animate(
			[{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }],
			{ duration: 130, easing: 'steps(3, end)' }
		);
	});

	const filter_style = $derived(
		po.mode === 'LCD'
			? `grayscale(100%) contrast(${150 + po.phase}%) brightness(0.8) sepia(100%) hue-rotate(${80 + po.freq}deg) saturate(${200 + po.rgb}%)`
			: po.mode === 'CRT'
				? `contrast(${120 + po.freq * 0.5}%) brightness(${1.1 + po.phase * 0.002}) saturate(${130 + po.rgb * 0.5}%) sepia(20%)`
				: po.mode === 'GAMEBOY'
					? `grayscale(100%) contrast(${200 + po.phase * 0.5}%) brightness(0.9) sepia(100%) hue-rotate(${50 + po.freq}deg) saturate(${300 + po.rgb}%)`
					: po.mode === 'DOT_MATRIX'
						? `grayscale(100%) contrast(${400 + po.phase * 1.5}%) sepia(100%) hue-rotate(${-25 + po.freq}deg) saturate(400%) brightness(${0.7 + po.rgb * 0.002})`
						: `grayscale(${Math.max(0, Math.min(100, 50 - po.freq / 3.6))}%) contrast(${100 + po.phase * 0.5}%) opacity(${Math.max(0.2, Math.min(1, 0.8 + po.rgb * 0.001))})`
	);

	const bar = (v: number) => Math.max(0.12, (v + 180) / 360);
</script>

<!-- PO-100 · portrait engine. Chassis materials, not interface colours. -->
<div
	class="relative flex w-full flex-col gap-3.5 overflow-hidden border bg-[var(--hw-case)] p-4 pt-5 pb-3 select-none {covered
		? 'border-transparent shadow-none'
		: 'border-line shadow-[3px_3px_0_var(--shadow)]'}"
	data-boot="5"
>
	<div class="pointer-events-none absolute inset-0 opacity-40 dot-grid"></div>

	{#each ['top-1.5 left-1.5', 'top-1.5 right-1.5', 'bottom-1.5 left-1.5', 'bottom-1.5 right-1.5'] as pos, i (pos)}
		<span class="pointer-events-none absolute {pos} block h-2 w-2" aria-hidden="true">
			<svg viewBox="0 0 8 8" class="block h-full w-full" style="transform: rotate({[45, -30, 60, 15][i]}deg)">
				<circle cx="4" cy="4" r="3.5" fill="var(--hw-screw)" stroke="var(--hw-case-line)" stroke-width="1" />
				<line x1="1.5" y1="4" x2="6.5" y2="4" stroke="var(--hw-well-2)" stroke-width="1" stroke-linecap="round" />
			</svg>
		</span>
	{/each}

	<!-- Device header -->
	<div class="z-10 flex items-center justify-between px-1" data-hw="header">
		<div class="flex flex-col">
			<span class="font-mono text-micro font-bold tracking-wider text-ink">PO-100 / ID-PHOTO</span>
			<span class="font-mono text-pico tracking-widest text-dim uppercase">TE_PORTRAIT_ENGINE</span>
		</div>

		<!-- Speaker grill -->
		<div class="grid grid-cols-4 gap-0.5 opacity-60" aria-hidden="true" data-hw="grill">
			{#each Array(12) as _}
				<div class="h-0.5 w-0.5 rounded-full bg-[var(--hw-key-ink)]"></div>
			{/each}
		</div>
	</div>

	<!-- Recessed screen -->
	<div
		class="relative z-10 flex aspect-square w-full items-center justify-center overflow-hidden border-2 border-[var(--hw-well-2)] bg-[var(--hw-well)] p-[2px] shadow-[inset_0_2px_5px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.1)]"
	>
		<div
			bind:this={screen}
			class="scanlines relative h-full w-full overflow-hidden"
			data-boot="5"
			data-boot-screen
		>
			<img
				src="/images/profile-instagram.jpg"
				alt="Portrait of Isa"
				class="absolute inset-0 h-full w-full object-cover"
				style="filter: {filter_style};"
			/>

			{#if po.mode === 'LCD'}
				<div class="lcd-overlay absolute inset-0 pointer-events-none"></div>
			{/if}
			{#if po.mode === 'CRT'}
				<div class="crt-overlay absolute inset-0 pointer-events-none"></div>
				<div class="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"></div>
			{/if}
			{#if po.mode === 'GAMEBOY'}
				<div class="gb-overlay absolute inset-0 pointer-events-none"></div>
			{/if}
			{#if po.mode === 'DOT_MATRIX'}
				<div class="dot-overlay absolute inset-0 pointer-events-none"></div>
			{/if}

			<!-- Glass -->
			<div
				class="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-transparent to-[var(--hw-glass)]"
			></div>

			<!-- HUD -->
			<div
				class="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-2 font-mono text-nano select-none"
				style="color: {active.hud};"
			>
				<div class="flex items-start justify-between">
					<span class="bg-[var(--hw-chip)] px-1 py-0.5 tracking-wider">
						{$isCharging ? 'PWR: CHG' : 'LNK: ON'}
					</span>
					<div class="flex items-center gap-1 bg-[var(--hw-chip)] px-1 py-0.5">
						<span class="led" data-on="true"></span>
						<span class="text-[var(--hw-chip-ink)]">REC</span>
					</div>
				</div>

				<div class="flex items-end justify-between">
					<div class="flex flex-col bg-[var(--hw-chip)] px-1 py-0.5 leading-tight">
						<span>MODE: {active.key}</span>
						<span
							>VAL: <Readout value={readout(po.freq)} pad={3} />
							<Readout value={readout(po.phase)} pad={3} />
							<Readout value={readout(po.rgb)} pad={3} /></span
						>
					</div>

					<!-- Meter bars: scaled, never resized -->
					<div class="flex h-[18px] items-end gap-0.5 bg-[var(--hw-chip)] p-0.5">
						{#each [po.freq, po.phase, po.rgb] as v, i (i)}
							<div
								class="h-full w-1 origin-bottom"
								style="background-color: {active.hud}; transform: scaleY({bar(v)});"
							></div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Mode keys -->
	<div class="z-10 mt-0.5 grid grid-cols-5 gap-1">
		{#each MODES as m (m.id)}
			<div class="flex flex-col items-center gap-1">
				<button
					type="button"
					class="hbtn h-7 w-7 rounded-full text-nano"
					aria-pressed={po.mode === m.id}
					aria-label={`Display mode ${m.id.replace('_', ' ')}`}
					onclick={() => poApply(m.id)}
				>
					{m.key}
				</button>
				<span class="led" data-on={po.mode === m.id ? 'true' : 'false'} aria-hidden="true"></span>
			</div>
		{/each}
	</div>

	<!-- Parameter knobs -->
	<div class="z-10 flex items-center justify-between border-t border-[var(--hw-case-line)] px-1 pt-2">
		<Knob
			bind:value={po.freq}
			label="FREQ"
			cap="var(--hw-knob-freq)"
			aria_label="Filter frequency"
			onreset={() => poResetKnob('freq')}
		/>
		<Knob
			bind:value={po.phase}
			label="PHAS"
			cap="var(--hw-knob-phase)"
			aria_label="Filter phase"
			onreset={() => poResetKnob('phase')}
		/>
		<Knob
			bind:value={po.rgb}
			label="RGB"
			cap="var(--hw-knob-rgb)"
			aria_label="Filter colour balance"
			onreset={() => poResetKnob('rgb')}
		/>
	</div>

	<!-- Bottom hardware -->
	<div
		class="z-10 mt-2.5 flex items-center justify-between border-t border-dashed border-[var(--hw-case-line)] pt-2 font-mono text-femto tracking-widest text-dim uppercase"
		data-hw="strip"
	>
		<div class="flex items-center gap-1.5">
			<div
				class="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[var(--hw-case-line)] bg-[var(--hw-well-2)] shadow-inner"
			>
				<div class="h-2.5 w-2.5 rounded-full border border-[var(--hw-port)] bg-[var(--hw-well)]"></div>
			</div>
			<span>OUT</span>
		</div>

		<span>PO-100 OP-IMG</span>

		<div class="flex items-center gap-1.5">
			<span>PWR</span>
			<div class="relative flex items-center justify-center">
				<div
					class="flex h-2 w-4 items-center justify-center rounded-[1px] border border-[var(--hw-case-line)] bg-[var(--hw-well-2)] shadow-inner"
				>
					<div class="h-0.5 w-2.5 rounded-full border border-[var(--hw-case-line)] bg-[var(--hw-well)]"></div>
				</div>

				{#if $isCharging}
					<div class="usb-c-cable pointer-events-none absolute top-[1px] left-1/2 z-30 flex flex-col items-center">
						<div class="h-0.5 w-2 border-x border-[var(--hw-case-line)] bg-[var(--hw-screw)]"></div>
						<div
							class="relative flex h-4 w-4 items-center justify-center rounded-[1px] border border-[var(--hw-well-2)] bg-[var(--hw-case-2)] shadow-md"
						>
							<div
								class="indicator-dot h-1 w-1"
								class:green={$batteryLevel !== null && $batteryLevel >= 99}
								class:blink-red={$batteryLevel === null || $batteryLevel < 99}
							></div>
						</div>
						<div class="h-1 w-1.5 rounded-b-[1px] bg-[var(--hw-well-2)]"></div>
						<div class="h-16 w-0.5 bg-[var(--hw-screw)]"></div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.dot-grid {
		background-image: radial-gradient(var(--line) 1px, transparent 1px);
		background-size: 8px 8px;
	}

	/* LCD: high-contrast monochrome green with a hard scan structure. */
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

	/* CRT: warmer, saturated, aperture-grille stripes. */
	.crt-overlay {
		background:
			linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%),
			linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04));
		background-size:
			100% 3px,
			3px 100%;
		mix-blend-mode: multiply;
	}

	/* GAMEBOY: four-tone pea soup. */
	.gb-overlay {
		background: rgba(139, 172, 15, 0.25);
		mix-blend-mode: color;
	}

	/* DOT MATRIX: discrete emitters. */
	.dot-overlay {
		background-image: radial-gradient(rgba(0, 0, 0, 0.6) 1px, transparent 1px);
		background-size: 3px 3px;
	}

	/* Plugging in is physical, but nothing on this site overshoots except a knob. */
	@keyframes plug-in {
		from {
			transform: translate(-50%, 20px);
			opacity: 0;
		}
		to {
			transform: translate(-50%, 0);
			opacity: 1;
		}
	}
	.usb-c-cable {
		animation: plug-in 220ms cubic-bezier(0.2, 0.9, 0.25, 1) forwards;
	}

	.indicator-dot.green {
		background-color: var(--ok);
		box-shadow: 0 0 2px var(--ok);
	}

	/* A live LED blinks in steps. Diodes do not interpolate. */
	.indicator-dot.blink-red {
		background-color: var(--rec);
		box-shadow: 0 0 2px var(--rec);
		animation: blink-red 1.6s steps(2, end) infinite;
	}
	@keyframes blink-red {
		50% {
			background-color: var(--hw-well-2);
			box-shadow: none;
		}
	}
</style>
