<script lang="ts">
	import { goto } from '$app/navigation';
	import { page, navigating } from '$app/state';
	import { onMount } from 'svelte';

	import { THEMES, theme } from '$lib/stores/theme';
	import {
		isCharging,
		batteryLevel,
		playLightning,
		setCharging,
		toggleCharging,
		CHARGE_BANNER_MS
	} from '$lib/stores/battery';
	import { maybeBoot } from '$lib/motion/boot.js';
	import { motionEnabled } from '$lib/motion';

	import NoisyGradient from '$lib/components/NoisyGradient.svelte';
	import FocusSweep from '$lib/components/FocusSweep.svelte';
	import ModeDial from '$lib/components/ModeDial.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Readout from '$lib/components/Readout.svelte';
	import '../app.css';
	import '../prism.css';

	let { children } = $props();

	const SHORTCUTS = [
		{ key: 'F1', label: 'F1_BLOG', href: '/blog', blank: false },
		{ key: 'F2', label: 'F2_PROJ', href: '/projects', blank: false },
		{ key: 'F3', label: 'F3_RESM', href: '/resume', blank: true },
		{ key: 'F4', label: 'F4_GEAR', href: '/gear', blank: false }
	];

	let fps = $state(60);
	let scroll_pc = $state(0);
	let keys_open = $state(false);
	let plate_blink = $state(false);

	/* ── Battery ─────────────────────────────────────────────────────────── */

	const CHARGE_TICKER = ['CHARGER_CONNECTED', 'USB-C PD // 20V 3A', 'POWERING_UP'];

	/* ── Program swap ────────────────────────────────────────────────────── */

	// The screen goes out of focus for the length of the navigation and refocuses on the
	// new program. Navigation itself is never intercepted, so back/forward behave exactly
	// like a link click, and the release is keyed off the router's own state rather than a
	// timer: a cancelled navigation clears it, so the sweep can never be left mid-travel.

	/* ── Keyboard ────────────────────────────────────────────────────────── */

	function handleKeydown(e: KeyboardEvent) {
		if (e.metaKey || e.ctrlKey || e.altKey) return;

		const target = e.target as HTMLElement | null;
		const typing =
			target && (target.isContentEditable || /^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName));
		if (typing) {
			if (e.key === 'Escape') keys_open = false;
			return;
		}

		if (e.key === '?') {
			e.preventDefault();
			keys_open = !keys_open;
			return;
		}
		if (e.key === 'Escape') {
			keys_open = false;
			return;
		}

		const hit = SHORTCUTS.find((s) => s.key === e.key);
		if (hit) {
			e.preventDefault();
			keys_open = false;
			if (hit.blank) {
				window.open(hit.href, '_blank', 'noopener');
			} else {
				goto(hit.href);
			}
		}
	}

	/* ── Instrumentation: FPS and tape position ──────────────────────────── */

	onMount(() => {
		// Battery status API
		if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				((navigator as any).getBattery() as Promise<any>)
					.then((battery: any) => {
						batteryLevel.set(Math.round(battery.level * 100));
						isCharging.set(battery.charging);
						battery.addEventListener('levelchange', () => {
							batteryLevel.set(Math.round(battery.level * 100));
						});
						battery.addEventListener('chargingchange', () => setCharging(battery.charging));
					})
					.catch(() => {});
			} catch {
				// Ignored
			}
		}

		// FPS counter. rAF is already parked by the browser in a hidden tab.
		let lastTime: number | null = null;
		let frameCount = 0;
		let raf = 0;

		function updateFps(timestamp: number) {
			if (lastTime === null) lastTime = timestamp;
			frameCount++;
			if (timestamp >= lastTime + 1000) {
				fps = Math.round((frameCount * 1000) / (timestamp - lastTime));
				frameCount = 0;
				lastTime = timestamp;
			}
			raf = window.requestAnimationFrame(updateFps);
		}
		raf = window.requestAnimationFrame(updateFps);

		// Tape counter: scroll position as a device readout, rAF-throttled.
		let queued = false;
		function readPosition() {
			queued = false;
			const max = document.documentElement.scrollHeight - window.innerHeight;
			scroll_pc =
				max > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100))) : 0;
		}
		function onScroll() {
			if (queued) return;
			queued = true;
			window.requestAnimationFrame(readPosition);
		}
		readPosition();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);

		return () => {
			window.cancelAnimationFrame(raf);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	/* ── Motion: power-on once per session ───────────────────────────────── */

	onMount(() => {
		// The inline boot script drops its own safety net as soon as the app is alive.
		(window as any).__motion_ready?.();
		if (!motionEnabled()) {
			document.documentElement.dataset.boot = 'done';
			return;
		}
		maybeBoot(document);
	});

	/* ── Faceplate ───────────────────────────────────────────────────────── */

	// Program-change blink: the chassis blinks, the page behind it does not.
	$effect(() => {
		void $theme;
		plate_blink = false;
		const id = requestAnimationFrame(() => (plate_blink = true));
		return () => cancelAnimationFrame(id);
	});

	$effect(() => {
		const active = THEMES.find((t) => t.id === $theme);
		if (!active) return;
		document.documentElement.dataset.theme = active.id;
		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) meta.setAttribute('content', active.color);
	});

	// Screen swap: the frame's content area drops out and blinks back in.
	$effect(() => {
		void page.url.pathname;
		keys_open = false;
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Static grain, above everything, never in the way. -->
<div class="grain" aria-hidden="true"></div>

<div class="relative flex min-h-screen flex-col items-center justify-center p-3 sm:p-5">
	<!-- Background grid -->
	<div class="absolute inset-0 z-0"><NoisyGradient /></div>

	<!-- TE Device Chassis. Top-anchored on every route, same shadow everywhere. -->
	<div
		class="relative z-10 flex w-full max-w-[700px] flex-col border border-line bg-panel shadow-[4px_4px_0_var(--shadow)] {plate_blink
			? 'plate-blink'
			: ''}"
	>
		<!-- Top Technical Status Bar -->
		<!-- Sticky: MODE, KEYS and BAT are the device's controls, and a control that scrolls
		     out of reach is not a control. It leaves with the chassis at the end of the page. -->
		<div
			class="sticky top-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-line bg-panel px-4 py-2 font-mono text-xxs uppercase tracking-widest text-dim"
			data-boot="1"
			data-status-bar
		>
			{#if $playLightning}
				<!-- Opaque, and it owns the whole bar for its run: the ticker is read against a
				     clean strip, not over the controls. The clip lives on the banner, not the
				     header, so the MODE dial's popup is never clipped by the bar. -->
				<div
					class="charge-banner pointer-events-none absolute inset-0 z-40 overflow-hidden"
					style="--charge-ms: {CHARGE_BANNER_MS}ms"
					aria-hidden="true"
				>
					<div class="charge-track font-mono text-tiny font-bold">
						{#each CHARGE_TICKER as item (item)}
							<svg viewBox="0 0 10 16" class="h-3 w-2 shrink-0" aria-hidden="true">
								<path d="M6 0 0 9h4l-1 7 7-10H6l1-6Z" fill="currentColor" />
							</svg>
							<span>{item}</span>
						{/each}
						<svg viewBox="0 0 10 16" class="h-3 w-2 shrink-0" aria-hidden="true">
							<path d="M6 0 0 9h4l-1 7 7-10H6l1-6Z" fill="currentColor" />
						</svg>
						<span>BAT: {$batteryLevel ?? '--'}%</span>
					</div>
				</div>
			{/if}
			<a
				href="/"
				class="brand flex items-center gap-2 justify-self-start text-ink no-underline"
				aria-label="Isa Tippens, home"
			>
				<!-- Monogram. Painted entirely from faceplate tokens, so it re-inks itself
				     with every plate: ink body, panel-coloured letters, one accent pixel. -->
				<svg viewBox="0 0 16 16" class="brand-mark h-4 w-4 shrink-0" aria-hidden="true">
					<rect x="0.5" y="0.5" width="15" height="15" rx="1.5" fill="var(--ink)" />
					<rect x="3.5" y="7" width="2.5" height="5.5" fill="var(--panel)" />
					<rect class="brand-dot" x="3.5" y="3.5" width="2.5" height="2.5" fill="var(--accent)" />
					<path d="M8.5 3.5H11v3h2V8.5h-2v2h2v2H8.5v-4H7.5v-2h1Z" fill="var(--panel)" />
				</svg>
				<span class="whitespace-nowrap font-bold">ISA TIPPENS</span>
			</a>
			<span class="flex items-center gap-2">
				<ModeDial />
				<button
					type="button"
					class="hbtn hidden whitespace-nowrap px-1.5 py-0.5 text-tiny sm:inline-flex"
					aria-expanded={keys_open}
					aria-controls="key-map"
					onclick={() => (keys_open = !keys_open)}
				>
					[?] KEYS
				</button>
			</span>
			<button
				type="button"
				class="flex items-center gap-1.5 justify-self-end whitespace-nowrap bg-transparent p-0 text-xxs uppercase tracking-widest hover:text-accent"
				aria-pressed={$isCharging}
				aria-label={`Battery ${$batteryLevel ?? 'unknown'} percent${$isCharging ? ', charging' : ''}`}
				onclick={toggleCharging}
			>
				<span class="flex items-center gap-1">
					<!-- The readout only exists once there is a real number, so it ticks up
					     to the machine's actual charge instead of to a placeholder. -->
					BAT: {#if $batteryLevel !== null}<Readout value={$batteryLevel} />%{:else}--%{/if}
				</span>
				<span class="battery" data-charging={$isCharging} aria-hidden="true">
					<span class="battery-fill" style="--level: {($batteryLevel ?? 0) / 100}"></span>
					{#if $isCharging}
						<svg viewBox="0 0 10 16" class="battery-bolt" aria-hidden="true">
							<path d="M6 0 0 9h4l-1 7 7-10H6l1-6Z" />
						</svg>
					{/if}
				</span>
			</button>
		</div>

		<!-- Main viewport. Keyed on the route so a navigation reads as a program swap, and
		     isolated so the modules inside it own their z-indexes: the focus veil has to
		     paint over the content, not fight it. -->
		<div class="relative flex-auto p-4 sm:p-6">
			{#key page.url.pathname}
				<div class="isolate">
					{@render children()}
				</div>
			{/key}
			<!-- `navigating` is a bag of getters, not a nullable object: `.to` is the live one. -->
			<FocusSweep covered={navigating.to !== null} />
		</div>

		<!-- Bottom Technical Status Bar -->
		<div
			class="flex items-center justify-between border-t border-line bg-sunk px-4 py-2 font-mono text-xxs uppercase tracking-widest text-dim"
			data-boot="7"
		>
			<span>SVELTE v5</span>
			<span>POS: <Readout value={scroll_pc} pad={3} />%</span>
			<span>{fps} FPS</span>
			<span>REV: 2026.06</span>
		</div>

		{#if keys_open}
			<!-- `fixed`, not `absolute`: the chassis is as tall as its content, so an
			     absolute overlay would centre on the document instead of the screen. -->
			<div
				id="key-map"
				role="region"
				aria-label="Keyboard shortcuts"
				class="fixed inset-0 z-30 flex items-center justify-center bg-scrim p-4 backdrop-blur-[4px]"
			>
				<Panel
					tag="KEY_MAP"
					screws={true}
					class="w-full max-w-sm shadow-[4px_4px_0_var(--shadow)]"
					role="dialog"
					aria-modal="true"
					aria-label="Keyboard map"
				>
					<div
						class="flex items-center justify-between border-b border-line px-3 py-2 text-xxs uppercase tracking-widest text-dim"
					>
						<span class="font-bold text-ink">[KEY_MAP]</span>
						<button
							type="button"
							class="bg-transparent p-0 font-bold hover:text-accent"
							onclick={() => (keys_open = false)}
						>
							[ESC_CLOSE]
						</button>
					</div>
					<ul class="grid gap-2 p-3">
						{#each SHORTCUTS as s (s.key)}
							<li
								class="flex items-center justify-between gap-3 text-tiny uppercase tracking-widest"
							>
								<span class="text-dim">{s.label}</span>
								<kbd class="border border-line bg-sunk px-1.5 py-0.5 font-mono font-bold text-ink">
									{s.key}
								</kbd>
							</li>
						{/each}
						<li class="flex items-center justify-between gap-3 text-tiny uppercase tracking-widest">
							<span class="text-dim">[J/K] MOVE_ROW_FOCUS</span>
							<kbd class="border border-line bg-sunk px-1.5 py-0.5 font-mono font-bold text-ink">
								J K
							</kbd>
						</li>
						<li class="flex items-center justify-between gap-3 text-tiny uppercase tracking-widest">
							<span class="text-dim">[?] TOGGLE_KEY_MAP</span>
							<kbd class="border border-line bg-sunk px-1.5 py-0.5 font-mono font-bold text-ink">
								?
							</kbd>
						</li>
					</ul>
				</Panel>
			</div>
		{/if}
	</div>
</div>

<style>
	/* ── Brand ───────────────────────────────────────────────────────────── */

	.brand span {
		transition: color 120ms linear;
	}
	.brand:hover span {
		color: var(--accent);
	}
	/* The dot on the i hops once when the mark is touched — two frames up, two down. */
	.brand-dot {
		transform-box: fill-box;
	}
	.brand:hover .brand-dot,
	.brand:focus-visible .brand-dot {
		animation: brand-hop 420ms steps(4, end);
	}
	@keyframes brand-hop {
		50% {
			transform: translateY(-1.5px);
		}
	}

	/* ── Battery gauge ───────────────────────────────────────────────────── */

	.battery {
		position: relative;
		display: inline-block;
		width: 1.375rem;
		height: 0.6875rem;
		margin-right: 3px;
		padding: 1px;
		border: var(--stroke) solid var(--line);
		border-radius: 1px;
	}
	/* Terminal nub. */
	.battery::after {
		content: '';
		position: absolute;
		top: 50%;
		right: -3px;
		width: 2px;
		height: 45%;
		transform: translateY(-50%);
		background-color: var(--line);
	}
	.battery-fill {
		display: block;
		height: 100%;
		background-color: var(--accent);
		transform: scaleX(var(--level));
		transform-origin: left;
	}
	/* Current flowing in: a highlight runs through the cell while it is on the charger. */
	.battery[data-charging='true'] .battery-fill {
		background-image: linear-gradient(
			90deg,
			transparent 30%,
			color-mix(in srgb, var(--accent-ink) 55%, transparent) 50%,
			transparent 70%
		);
		background-size: 250% 100%;
		animation: battery-flow 1.4s linear infinite;
	}
	@keyframes battery-flow {
		from {
			background-position: 100% 0;
		}
		to {
			background-position: -150% 0;
		}
	}
	.battery-bolt {
		position: absolute;
		top: 50%;
		left: 50%;
		height: 9px;
		width: 6px;
		transform: translate(-50%, -50%);
		fill: var(--ink);
		stroke: var(--panel);
		stroke-width: 2px;
		paint-order: stroke;
		overflow: visible;
	}

	/* ── Charge banner ───────────────────────────────────────────────────── */

	/*
		One run, one timeline: the strip wipes in over the bar, the ticker crosses the
		full width of it — entering off the right edge, leaving off the left — and the strip
		wipes off after it. Every phase is a percentage of `--charge-ms`, so nothing can
		drift out of step with the JS timer that unmounts the banner.
	*/
	.charge-banner {
		container-type: inline-size;
		background-color: var(--accent);
		color: var(--accent-ink);
		clip-path: inset(0 100% 0 0);
		animation: charge-wipe var(--charge-ms) linear forwards;
	}

	/* Current lines streaming under the ticker. */
	.charge-banner::before {
		content: '';
		position: absolute;
		inset: 0 -2rem;
		background-image: repeating-linear-gradient(
			90deg,
			color-mix(in srgb, var(--accent-ink) 8%, transparent) 0 5px,
			transparent 5px 14px
		);
		transform: skewX(-30deg);
		animation: charge-stream 600ms linear infinite;
	}

	/* The surge: one bright pass right behind the leading edge of the wipe. */
	.charge-banner::after {
		content: '';
		position: absolute;
		inset: 0;
		width: 35%;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--accent-ink) 45%, transparent),
			transparent
		);
		transform: translateX(-100%);
		animation: charge-surge calc(var(--charge-ms) * 0.3) cubic-bezier(0.3, 0.6, 0.4, 1) forwards;
	}

	.charge-track {
		position: absolute;
		top: 50%;
		left: 0;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		white-space: nowrap;
		letter-spacing: 0.18em;
		transform: translate(100cqw, -50%);
		animation: charge-run var(--charge-ms) linear forwards;
	}

	@keyframes charge-wipe {
		0% {
			clip-path: inset(0 100% 0 0);
			animation-timing-function: cubic-bezier(0.2, 0.9, 0.25, 1);
		}
		8% {
			clip-path: inset(0 0 0 0);
		}
		88% {
			clip-path: inset(0 0 0 0);
			animation-timing-function: cubic-bezier(0.7, 0, 0.8, 0.2);
		}
		100% {
			clip-path: inset(0 0 0 100%);
		}
	}

	@keyframes charge-run {
		0%,
		5% {
			transform: translate(100cqw, -50%);
		}
		88%,
		100% {
			transform: translate(-100%, -50%);
		}
	}

	@keyframes charge-stream {
		to {
			background-position: 14px 0;
		}
	}

	@keyframes charge-surge {
		to {
			transform: translateX(300%);
		}
	}
</style>
