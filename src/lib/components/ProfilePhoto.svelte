<script lang="ts">
	import { cubicIn, cubicOut } from 'svelte/easing';
	import Knob from '$lib/components/Knob.svelte';
	import Readout from '$lib/components/Readout.svelte';
	import { isCharging, batteryLevel, setCharging } from '$lib/stores/battery';
	import { reducedMotion } from '$lib/motion';

	type PoMode = 'LCD' | 'CRT' | 'GAMEBOY' | 'DOT_MATRIX' | 'NORMAL';

	/**
	 * The display's own phosphor colours. These are the tube, not the interface, so they
	 * are deliberately faceplate-independent — the case around them changes with the
	 * theme, the phosphor inside does not, exactly like real hardware.
	 */
	const MODES: { id: PoMode; key: string; hud: string; preset: [number, number, number] }[] = [
		{ id: 'LCD', key: 'LCD', hud: '#00ff66', preset: [43.2, -28.8, 90] },
		{ id: 'CRT', key: 'CRT', hud: '#33ccff', preset: [-90, 57.6, -43.2] },
		{ id: 'GAMEBOY', key: 'GB', hud: '#8bac0f', preset: [180, 118.8, 28.8] },
		{ id: 'DOT_MATRIX', key: 'DM', hud: '#ff5500', preset: [-28.8, -90, 118.8] },
		{ id: 'NORMAL', key: 'NOR', hud: '#ffffff', preset: [0, 0, 0] }
	];

	const NORMAL = MODES.find((m) => m.id === 'NORMAL')!;

	// The panel boots on the untouched photo; modes change only from the keys.
	let mode = $state<PoMode>('NORMAL');
	let freq = $state(NORMAL.preset[0]);
	let phase = $state(NORMAL.preset[1]);
	let rgb = $state(NORMAL.preset[2]);

	let screen: HTMLDivElement | null = $state(null);

	const active = $derived(MODES.find((m) => m.id === mode) ?? MODES[0]);
	const readout = (v: number) => Math.round((v + 180) / 3.6);

	function apply(id: PoMode) {
		if (id === mode) return;
		mode = id;
		const preset = MODES.find((m) => m.id === id)?.preset;
		if (preset) [freq, phase, rgb] = preset;
	}

	function reset(knob: 'freq' | 'phase' | 'rgb') {
		const [f, p, r] = active.preset;
		if (knob === 'freq') freq = f;
		else if (knob === 'phase') phase = p;
		else rgb = r;
	}

	// A mode change is a switch, not a fade: the tube blinks for a frame and comes back
	// on the new setting.
	let first_run = true;
	$effect(() => {
		void mode;
		if (first_run) {
			first_run = false;
			return;
		}
		if (reducedMotion() || !screen) return;
		screen.animate([{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], {
			duration: 130,
			easing: 'steps(3, end)'
		});
	});

	// Power in: the tube surges for a beat when the charger seats, the way a backlight
	// jumps when the supply switches over.
	let was_charging: boolean | null = null;
	$effect(() => {
		const now = $isCharging;
		const plugged = was_charging === false && now;
		was_charging = now;
		if (!plugged || reducedMotion() || !screen) return;
		screen.animate(
			[{ filter: 'brightness(1)' }, { filter: 'brightness(1.7)' }, { filter: 'brightness(1)' }],
			{ duration: 260, delay: 300, easing: 'steps(3, end)' }
		);
	});

	/** The plug travels along its own axis: straight up into the port, straight back out. */
	function seat(_: Element, { out = false }: { out?: boolean } = {}) {
		return {
			duration: reducedMotion() ? 0 : out ? 180 : 340,
			easing: out ? cubicIn : cubicOut,
			css: (t: number) =>
				`transform: translateY(${(1 - t) * 22}px); opacity: ${Math.min(1, t * 2.5)};`
		};
	}

	// Glass catches the light where the pointer is. Mouse only: a finger is not a lamp.
	let glare_x = $state(70);
	let glare_y = $state(15);
	let glare_on = $state(false);
	function moveGlare(e: PointerEvent) {
		if (e.pointerType !== 'mouse') return;
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		glare_x = ((e.clientX - r.left) / r.width) * 100;
		glare_y = ((e.clientY - r.top) / r.height) * 100;
		glare_on = true;
	}

	const filter_style = $derived(
		mode === 'LCD'
			? `grayscale(100%) contrast(${150 + phase}%) brightness(0.8) sepia(100%) hue-rotate(${80 + freq}deg) saturate(${200 + rgb}%)`
			: mode === 'CRT'
				? `contrast(${120 + freq * 0.5}%) brightness(${1.1 + phase * 0.002}) saturate(${130 + rgb * 0.5}%) sepia(20%)`
				: mode === 'GAMEBOY'
					? `grayscale(100%) contrast(${200 + phase * 0.5}%) brightness(0.9) sepia(100%) hue-rotate(${50 + freq}deg) saturate(${300 + rgb}%)`
					: mode === 'DOT_MATRIX'
						? `grayscale(100%) contrast(${400 + phase * 1.5}%) sepia(100%) hue-rotate(${-25 + freq}deg) saturate(400%) brightness(${0.7 + rgb * 0.002})`
						: `grayscale(${Math.max(0, Math.min(100, 50 - freq / 3.6))}%) contrast(${100 + phase * 0.5}%) opacity(${Math.max(0.2, Math.min(1, 0.8 + rgb * 0.001))})`
	);

	const bar = (v: number) => Math.max(0.12, (v + 180) / 360);
</script>

<!-- PO-100 · portrait engine. Chassis materials, not interface colours. Built to the
     TE-S10's spec: rounded moulding, inset modules, machined knobs and screws. -->
<div
	class="relative flex w-full flex-col gap-3.5 rounded-2xl border-2 border-[var(--hw-case-line)] bg-[var(--hw-case-2)] px-4 pt-5 pb-5 shadow-2xl select-none"
	data-boot="5"
>
	<div class="dot-grid pointer-events-none absolute inset-0 rounded-[inherit] opacity-40"></div>

	{#each ['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'] as pos, i (pos)}
		<span class="hw-screw {pos}" style="--angle: {[45, -30, 60, 15][i]}deg" aria-hidden="true"
		></span>
	{/each}

	<!-- Device header -->
	<div class="z-10 flex items-center justify-between px-1">
		<div class="flex flex-col">
			<span class="font-mono text-micro font-bold tracking-wider text-ink">PO-100 / ID-PHOTO</span>
			<span class="font-mono text-pico tracking-widest text-dim uppercase">TE_PORTRAIT_ENGINE</span>
		</div>

		<!-- Speaker grill -->
		<div class="grid grid-cols-4 gap-0.5 opacity-60" aria-hidden="true">
			{#each Array(12) as _}
				<div class="h-0.5 w-0.5 rounded-full bg-[var(--hw-key-ink)]"></div>
			{/each}
		</div>
	</div>

	<!-- Recessed screen -->
	<div
		class="relative z-10 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-2 border-[var(--hw-well-2)] bg-[var(--hw-well)] p-[3px] shadow-[inset_0_2px_5px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.1)]"
		onpointermove={moveGlare}
		onpointerleave={() => (glare_on = false)}
		role="presentation"
	>
		<div
			bind:this={screen}
			class="scanlines relative h-full w-full overflow-hidden rounded-lg"
			data-boot="5"
			data-boot-screen
		>
			<img
				src="/images/profile-instagram.jpg"
				alt="Portrait of Isa"
				class="absolute inset-0 h-full w-full object-cover"
				style="filter: {filter_style};"
			/>

			{#if mode === 'LCD'}
				<div class="lcd-overlay absolute inset-0 pointer-events-none"></div>
			{/if}
			{#if mode === 'CRT'}
				<div class="crt-overlay absolute inset-0 pointer-events-none"></div>
				<div
					class="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
				></div>
			{/if}
			{#if mode === 'GAMEBOY'}
				<div class="gb-overlay absolute inset-0 pointer-events-none"></div>
			{/if}
			{#if mode === 'DOT_MATRIX'}
				<div class="dot-overlay absolute inset-0 pointer-events-none"></div>
			{/if}

			<!-- Glass: a fixed sheen, plus the glare of whatever the pointer is. -->
			<div
				class="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-transparent to-[var(--hw-glass)]"
			></div>
			<div
				class="glare pointer-events-none absolute inset-0 z-20"
				class:on={glare_on}
				style="--gx: {glare_x}%; --gy: {glare_y}%;"
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
						<span class="led rec-blink" data-on="true"></span>
						<span class="text-[var(--hw-chip-ink)]">REC</span>
					</div>
				</div>

				<div class="flex items-end justify-between">
					<div class="flex flex-col bg-[var(--hw-chip)] px-1 py-0.5 leading-tight">
						<span>MODE: {active.key}</span>
						<span
							>VAL: <Readout value={readout(freq)} pad={3} />
							<Readout value={readout(phase)} pad={3} />
							<Readout value={readout(rgb)} pad={3} /></span
						>
					</div>

					<!-- Meter bars: scaled, never resized -->
					<div class="flex h-[18px] items-end gap-0.5 bg-[var(--hw-chip)] p-0.5">
						{#each [freq, phase, rgb] as v, i (i)}
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
			<div class="flex flex-col items-center gap-1.5">
				<button
					type="button"
					class="hw-key h-7 w-7 text-nano"
					aria-pressed={mode === m.id}
					aria-label={`Display mode ${m.id.replace('_', ' ')}`}
					onclick={() => apply(m.id)}
				>
					{m.key}
				</button>
				<span class="led" data-on={mode === m.id ? 'true' : 'false'} aria-hidden="true"></span>
			</div>
		{/each}
	</div>

	<!-- Parameter knobs: their own inset module, as on the TE-S10. -->
	<div
		class="z-10 flex items-center justify-around rounded-xl border border-[var(--hw-case-line)] bg-[var(--hw-case)] px-1 pt-2.5 pb-2 shadow-inner"
	>
		<Knob
			bind:value={freq}
			label="FREQ"
			cap="var(--hw-knob-1)"
			aria_label="Filter frequency"
			onreset={() => reset('freq')}
		/>
		<Knob
			bind:value={phase}
			label="PHAS"
			cap="var(--hw-knob-2)"
			aria_label="Filter phase"
			onreset={() => reset('phase')}
		/>
		<Knob
			bind:value={rgb}
			label="RGB"
			cap="var(--hw-knob-3)"
			aria_label="Filter colour balance"
			onreset={() => reset('rgb')}
		/>
	</div>

	<!-- Bottom hardware -->
	<div
		class="z-10 mt-1 flex items-center justify-between border-t border-dashed border-[var(--hw-case-line)] px-1 pt-2 font-mono text-femto tracking-widest text-dim uppercase"
	>
		<div class="flex items-center gap-1.5">
			<div
				class="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[var(--hw-case-line)] bg-[var(--hw-well-2)] shadow-inner"
			>
				<div
					class="h-2.5 w-2.5 rounded-full border border-[var(--hw-port)] bg-[var(--hw-well)]"
				></div>
			</div>
			<span>OUT</span>
		</div>

		<span>PO-100 OP-IMG</span>

		<div class="flex items-center gap-1.5">
			<span>PWR</span>
			<span
				class="indicator-dot h-1 w-1"
				class:green={$isCharging && $batteryLevel !== null && $batteryLevel >= 99}
				class:blink-red={$isCharging && ($batteryLevel === null || $batteryLevel < 99)}
				aria-hidden="true"
			></span>
			<span class="text-[var(--hw-key-ink)]" aria-hidden="true">&#8595;</span>
		</div>
	</div>

	<!-- USB-C receptacle, cut into the bottom edge of the case under the PWR label. It is a
	     real control: the plug goes in and comes out from here, same as the BAT key. -->
	<button
		type="button"
		class="usb-port"
		aria-pressed={$isCharging}
		aria-label={$isCharging ? 'Unplug the charger' : 'Plug in the charger'}
		onclick={() => setCharging(!$isCharging)}
	>
		<span class="usb-port-slot"></span>
	</button>

	{#if $isCharging}
		<div class="usb-plug" in:seat out:seat={{ out: true }} aria-hidden="true">
			<span class="usb-spark"></span>
			<svg viewBox="0 0 40 84" width="40" height="84" overflow="visible">
				<defs>
					<linearGradient id="po-plug-metal" x1="0" x2="1" y1="0" y2="0">
						<stop offset="0" stop-color="var(--hw-case-line)" />
						<stop offset="0.3" stop-color="#ffffff" />
						<stop offset="0.55" stop-color="var(--hw-screw)" />
						<stop offset="1" stop-color="var(--hw-case-line)" />
					</linearGradient>
					<linearGradient id="po-plug-body" x1="0" x2="1" y1="0" y2="0">
						<stop offset="0" stop-color="var(--hw-key-shadow)" />
						<stop offset="0.28" stop-color="var(--hw-key)" />
						<stop offset="0.6" stop-color="var(--hw-key)" />
						<stop offset="1" stop-color="var(--hw-key-shadow)" />
					</linearGradient>
					<linearGradient
						id="po-plug-fade"
						x1="0"
						x2="0"
						y1="0"
						y2="84"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0.45" stop-color="#fff" />
						<stop offset="1" stop-color="#fff" stop-opacity="0" />
					</linearGradient>
					<mask
						id="po-plug-cable-mask"
						maskUnits="userSpaceOnUse"
						x="-10"
						y="0"
						width="80"
						height="90"
					>
						<rect x="-10" y="0" width="80" height="90" fill="url(#po-plug-fade)" />
					</mask>
				</defs>

				<!-- Cable: a round jacket is a dark edge, a lit body and one specular line. -->
				<g mask="url(#po-plug-cable-mask)" fill="none" stroke-linecap="round">
					<path
						d="M14 27 C14 42 15 52 24 60 S42 70 52 82"
						stroke="var(--hw-key-line)"
						stroke-width="5.5"
					/>
					<path
						d="M14 27 C14 42 15 52 24 60 S42 70 52 82"
						stroke="var(--hw-key)"
						stroke-width="3.8"
					/>
					<path
						d="M13 28 C13 42 14 52 23 60 S41 70 51 82"
						stroke="#ffffff"
						stroke-opacity="0.35"
						stroke-width="0.9"
					/>
				</g>

				<!-- Strain relief: tapered, ribbed boot. -->
				<path
					d="M9.5 19 H18.5 L17 28.5 H11 Z"
					fill="url(#po-plug-body)"
					stroke="var(--hw-key-line)"
					stroke-width="0.6"
				/>
				<g stroke="var(--hw-key-shadow)" stroke-width="0.7">
					<line x1="10.4" y1="22" x2="17.6" y2="22" />
					<line x1="10.8" y1="24.5" x2="17.2" y2="24.5" />
					<line x1="11.1" y1="27" x2="16.9" y2="27" />
				</g>

				<!-- Metal shell: the only part of the connector still outside the port. -->
				<rect x="8.5" y="0" width="11" height="3.5" rx="1" fill="url(#po-plug-metal)" />
				<line
					x1="9"
					y1="3.2"
					x2="19"
					y2="3.2"
					stroke="var(--hw-well-2)"
					stroke-opacity="0.35"
					stroke-width="0.5"
				/>

				<!-- Overmould. -->
				<rect
					x="5"
					y="3"
					width="18"
					height="17"
					rx="3.5"
					fill="url(#po-plug-body)"
					stroke="var(--hw-key-line)"
					stroke-width="0.75"
				/>
				<rect x="7" y="4.2" width="14" height="1.2" rx="0.6" fill="#ffffff" fill-opacity="0.35" />
				<g stroke="var(--hw-key-shadow)" stroke-width="0.6" stroke-linecap="round">
					<line x1="9" y1="13" x2="19" y2="13" />
					<line x1="9" y1="15" x2="19" y2="15" />
					<line x1="9" y1="17" x2="19" y2="17" />
				</g>
			</svg>
		</div>
	{/if}
</div>

<style>
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
		background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%),
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

	/* Glare: a soft hotspot that follows the pointer across the glass. */
	.glare {
		background: radial-gradient(
			circle at var(--gx) var(--gy),
			rgba(255, 255, 255, 0.16),
			rgba(255, 255, 255, 0.04) 28%,
			transparent 55%
		);
		mix-blend-mode: screen;
		opacity: 0;
		transition: opacity 240ms linear;
	}
	.glare.on {
		opacity: 1;
	}

	/* The camcorder REC lamp: on, off, on. */
	.rec-blink {
		animation: rec-blink 1.2s steps(2, jump-none) infinite;
	}
	@keyframes rec-blink {
		50% {
			background-color: var(--hw-well-2);
			box-shadow: none;
		}
	}

	/* ── USB-C ─────────────────────────────────────────────────────────── */

	/* Receptacle on the bottom edge, centred under the PWR label. */
	.usb-port {
		position: absolute;
		right: 14px;
		bottom: -7px;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 12px;
		padding: 0;
		background: transparent;
		cursor: pointer;
	}
	/* Plugged in, the whole connector is the handle to pull it back out by. */
	.usb-port[aria-pressed='true'] {
		height: 34px;
		bottom: -29px;
		align-items: flex-start;
		padding-top: 5px;
	}
	.usb-port-slot {
		display: block;
		width: 12px;
		height: 3px;
		border-radius: 2px;
		background-color: var(--hw-well-2);
		box-shadow:
			0 0 0 1px var(--hw-case-line),
			inset 0 1px 1px rgba(0, 0, 0, 0.6);
		transition: box-shadow 120ms linear;
	}
	.usb-port:hover .usb-port-slot,
	.usb-port:focus-visible .usb-port-slot {
		box-shadow:
			0 0 0 1px var(--accent),
			0 0 6px var(--accent);
	}

	.usb-plug {
		position: absolute;
		top: 100%;
		right: -4px;
		z-index: 30;
		pointer-events: none;
	}
	.usb-plug svg {
		display: block;
		filter: drop-shadow(1px 2px 1.5px var(--shadow-soft));
		transition: transform 120ms cubic-bezier(0.2, 0.9, 0.25, 1);
	}
	/* A hand on the plug: it gives a pixel, as if about to be pulled. */
	.usb-port:hover ~ .usb-plug svg {
		transform: translateY(1.5px);
	}

	/* The contact: one flash at the port as the connector seats. */
	.usb-spark {
		position: absolute;
		top: -1px;
		left: 14px;
		width: 26px;
		height: 10px;
		border-radius: 50%;
		background: radial-gradient(closest-side, var(--accent), transparent);
		transform: translate(-50%, -50%) scale(0.2);
		opacity: 0;
		animation: usb-spark 420ms 300ms steps(4, end) both;
	}
	@keyframes usb-spark {
		40% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(1.6);
		}
	}

	.indicator-dot {
		background-color: var(--hw-well-2);
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
