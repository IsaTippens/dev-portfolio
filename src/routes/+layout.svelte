<script lang="ts">
	import { goto } from '$app/navigation';
	import { page, navigating } from '$app/state';
	import { onMount } from 'svelte';

	import { THEMES, theme } from '$lib/stores/theme';
	import { isCharging, batteryLevel, playLightning } from '$lib/stores/battery';
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

	function flashCharging() {
		playLightning.set(true);
		setTimeout(() => playLightning.set(false), 1500);
	}

	function toggleCharging() {
		isCharging.update((v) => {
			if (!v) flashCharging();
			return !v;
		});
	}

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
						battery.addEventListener('chargingchange', () => {
							const newCharging = battery.charging;
							let current = false;
							isCharging.subscribe((v) => (current = v))();
							if (newCharging && !current) flashCharging();
							isCharging.set(newCharging);
						});
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
			scroll_pc = max > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100))) : 0;
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
			class="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-line bg-panel px-4 py-2 font-mono text-xxs uppercase tracking-widest text-dim"
			data-boot="1"
			data-status-bar
		>
			{#if $playLightning}
				<!-- The clip lives here, on the banner, not on the header: an `overflow-hidden`
				     status bar also clipped the MODE dial's popup out of paint and hit-testing. -->
				<div
					class="pointer-events-none absolute inset-0 z-20 flex items-center overflow-hidden bg-accent-wash"
				>
					<div
						class="animate-marquee flex items-center whitespace-nowrap font-mono text-tiny font-bold text-accent"
					>
						⚡ CHARGER_CONNECTED // POWERING_UP // ⚡ ⚡ ⚡
					</div>
				</div>
			{/if}
			<span class="flex items-center gap-1">
				<span class="led" data-on="ok" aria-hidden="true"></span>
				<span class="font-bold text-ink">DEV-PORTFOLIO</span>
			</span>
			<span class="flex items-center gap-2">
				<ModeDial />
				<button
					type="button"
					class="hbtn px-1.5 py-0.5 text-tiny"
					aria-expanded={keys_open}
					aria-controls="key-map"
					onclick={() => (keys_open = !keys_open)}
				>
					[?] KEYS
				</button>
			</span>
			<button
				type="button"
				class="flex items-center gap-1.5 bg-transparent p-0 text-xxs uppercase tracking-widest hover:text-accent"
				aria-pressed={$isCharging}
				aria-label={`Battery ${$batteryLevel ?? 'unknown'} percent${$isCharging ? ', charging' : ''}`}
				onclick={toggleCharging}
			>
				<span class="flex items-center gap-1">
					<!-- The readout only exists once there is a real number, so it ticks up
					     to the machine's actual charge instead of to a placeholder. -->
					BAT: {#if $batteryLevel !== null}<Readout value={$batteryLevel} />%{:else}--%{/if}
				</span>
				<span class="relative inline-block h-2.5 w-5 border border-line p-[1px]">
					<span
						class="block h-full bg-accent transition-none"
						style="width: {$batteryLevel ?? 0}%"
					></span>
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
							<li class="flex items-center justify-between gap-3 text-tiny uppercase tracking-widest">
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
