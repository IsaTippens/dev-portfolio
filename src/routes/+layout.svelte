<script lang="ts">
	import { goto } from '$app/navigation';
	import { page, navigating } from '$app/state';
	import { onMount, tick } from 'svelte';

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
	import { padConnected, startGamepad } from '$lib/gamepad';
	import { lightbarLinked, lightbarSupported, linkLightbar, sonyPadPresent, startLightbar } from '$lib/lightbar';
	import { startKonami } from '$lib/konami';
	import { installConsole } from '$lib/ctf/console';

	import NoisyGradient from '$lib/components/NoisyGradient.svelte';
	import FocusSweep from '$lib/components/FocusSweep.svelte';
	import ModeDial from '$lib/components/ModeDial.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Readout from '$lib/components/Readout.svelte';
	import PrintManual from '$lib/components/PrintManual.svelte';
	import '../app.css';
	import '../prism.css';
	import '../print.css';

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

	/* ── Brand: the stretched name ───────────────────────────────────────── */

	// Every handle Isa owns is the name held down too long — issssaaaaaaaaah, issaaahhhh —
	// so holding the brand does the same to the status bar. Past a long-press the S's pile
	// up, then the A's, then the H lands, one letter a beat; letting go snaps it back in
	// stepped pairs. There is no fixed cap: the bar is the cap. A letter that would clip is
	// measured and taken back before the frame paints, so a 390px phone simply stops sooner.
	const LONG_PRESS_MS = 250;
	const GROW_EVERY_MS = 90;
	// Two letters a step, a step every 40ms: the whole handle retracts in six steps,
	// inside PANEL, and each step is a cut — the letters are state, not a tween.
	const RETRACT_EVERY_MS = 40;
	const RETRACT_LETTERS = 2;
	/** An `isa:stretch` holds the name this long: time to grow the handle and read it. */
	const EVENT_HOLD_MS = 1200;
	/** A click this soon after a long-press is the tail of that press, not a new one. */
	const CLICK_SWALLOW_MS = 400;

	// ISA -> ISSSSAAAAAAAAAH: three more S's, eight more A's, then the H. One stage a letter.
	const EXTRA_S = 3;
	const EXTRA_A = 8;
	const MAX_STRETCH = EXTRA_S + EXTRA_A + 1;

	function stretchedName(n: number) {
		const s = Math.min(n, EXTRA_S);
		const a = Math.min(Math.max(n - EXTRA_S, 0), EXTRA_A);
		return 'IS' + 'S'.repeat(s) + 'A' + 'A'.repeat(a) + (n > EXTRA_S + EXTRA_A ? 'H' : '');
	}

	let stretch = $state(0);
	let stretched_by: 'hold' | 'event' | null = $state(null);
	let brand_link: HTMLAnchorElement | null = $state(null);
	let brand_name: HTMLSpanElement | null = $state(null);
	const brand_text = $derived(`${stretchedName(stretch)} TIPPENS`);

	let hold_timer: ReturnType<typeof setTimeout> | undefined;
	let event_timer: ReturnType<typeof setTimeout> | undefined;
	let grow_timer: ReturnType<typeof setInterval> | undefined;
	let retract_timer: ReturnType<typeof setInterval> | undefined;
	let long_pressed = false;
	let swallow_until = 0;
	let held_key: string | null = null;

	/** One more letter, unless it would clip. Resolves to whether there is room for another. */
	async function grow(): Promise<boolean> {
		if (stretch >= MAX_STRETCH) return false;
		stretch += 1;
		// tick() flushes the DOM without yielding to the renderer, so the measure below sees
		// the new letter and can take it back in the same frame it was added.
		await tick();
		if (stretched_by === null) return false;
		if (brand_name && brand_name.scrollWidth > brand_name.clientWidth) {
			stretch -= 1;
			return false;
		}
		return true;
	}

	function engage(by: 'hold' | 'event') {
		// A finger on the name outranks a scripted stretch; a scripted one never cuts a hold.
		if (stretched_by === 'hold') return;
		clearTimeout(event_timer);
		const running = stretched_by !== null;
		stretched_by = by;
		if (running) return;
		clearInterval(retract_timer);
		if (!motionEnabled()) {
			// Nothing to watch grow: the whole handle that fits is simply there, in one frame.
			void (async () => {
				let room = true;
				while (room) room = await grow();
			})();
			return;
		}
		void grow();
		grow_timer = setInterval(async () => {
			if (!(await grow())) clearInterval(grow_timer);
		}, GROW_EVERY_MS);
	}

	function release(by: 'hold' | 'event') {
		if (stretched_by !== by) return;
		stretched_by = null;
		clearInterval(grow_timer);
		clearTimeout(event_timer);
		clearInterval(retract_timer);
		if (!motionEnabled()) {
			stretch = 0;
			return;
		}
		retract_timer = setInterval(() => {
			stretch = Math.max(0, stretch - RETRACT_LETTERS);
			if (stretch === 0) clearInterval(retract_timer);
		}, RETRACT_EVERY_MS);
	}

	function armHold() {
		clearTimeout(hold_timer);
		long_pressed = false;
		hold_timer = setTimeout(() => {
			hold_timer = undefined;
			long_pressed = true;
			engage('hold');
		}, LONG_PRESS_MS);
	}

	/** Lets go of a press. True when it had turned into a long-press. */
	function endHold() {
		clearTimeout(hold_timer);
		hold_timer = undefined;
		window.removeEventListener('pointerup', onHoldPointerUp);
		window.removeEventListener('pointercancel', onHoldPointerUp);
		if (!long_pressed) return false;
		long_pressed = false;
		release('hold');
		return true;
	}

	function onHoldPointerUp() {
		if (endHold()) swallow_until = performance.now() + CLICK_SWALLOW_MS;
	}

	function onBrandPointerDown(e: PointerEvent) {
		if (e.button !== 0 || !e.isPrimary) return;
		armHold();
		// On window, not the link: a held press that drifts off the name still lets go.
		window.addEventListener('pointerup', onHoldPointerUp);
		window.addEventListener('pointercancel', onHoldPointerUp);
	}

	// Capture phase, straight on the link: it has to mark the click before the router's
	// listener further up sees it, and the router skips a click that is defaultPrevented.
	function onBrandClick(e: MouseEvent) {
		if (performance.now() < swallow_until) e.preventDefault();
		swallow_until = 0;
	}

	// Android opens the link menu on a long-press. The press already belongs to the name.
	function onBrandContextMenu(e: MouseEvent) {
		if (hold_timer !== undefined || stretched_by === 'hold' || performance.now() < swallow_until) {
			e.preventDefault();
		}
	}

	// A link follows on Enter's keydown, so a held Enter would be gone before it was held.
	// Enter and Space are taken on the way down; a tap follows the link on the way up, a
	// hold stretches the name instead. Only real keys: the gamepad's synthetic presses
	// never send the keyup that would let go.
	function onBrandKeydown(e: KeyboardEvent) {
		if (!e.isTrusted || (e.key !== 'Enter' && e.key !== ' ')) return;
		if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
		e.preventDefault();
		if (held_key !== null) return;
		held_key = e.key;
		armHold();
	}

	function onBrandKeyup(e: KeyboardEvent) {
		if (e.key !== held_key) return;
		e.preventDefault();
		held_key = null;
		if (!endHold() && e.key === 'Enter') brand_link?.click();
	}

	function onBrandBlur() {
		if (held_key === null) return;
		held_key = null;
		endHold();
	}

	onMount(() => {
		// Anything may ask for the bit (the console's `isa.stretch()`, for one): it plays
		// as a fixed long-press.
		function onStretchEvent() {
			if (stretched_by === 'hold' || hold_timer !== undefined) return;
			engage('event');
			event_timer = setTimeout(() => release('event'), EVENT_HOLD_MS);
		}
		window.addEventListener('isa:stretch', onStretchEvent);
		return () => {
			window.removeEventListener('isa:stretch', onStretchEvent);
			window.removeEventListener('pointerup', onHoldPointerUp);
			window.removeEventListener('pointercancel', onHoldPointerUp);
			clearTimeout(hold_timer);
			clearTimeout(event_timer);
			clearInterval(grow_timer);
			clearInterval(retract_timer);
		};
	});

	/* ── Standby: the tab title ──────────────────────────────────────────── */

	const STANDBY_TITLE = '▮ STANDBY // ISA TIPPENS';
	const RESTORED_TITLE = 'SIGNAL RESTORED';
	const RESTORED_MS = 2000;

	onMount(() => {
		// Pages title themselves through <svelte:head>, so the tab only ever puts a title back
		// over one of its own. If it reads anything else, a navigation retitled it while we
		// were away, and the page's title wins.
		let saved: string | null = null;
		let restore_timer: ReturnType<typeof setTimeout> | undefined;
		const ours = () => document.title === STANDBY_TITLE || document.title === RESTORED_TITLE;

		function onVisibility() {
			clearTimeout(restore_timer);
			if (document.visibilityState === 'hidden') {
				// Hidden again mid-restore: what is saved is still the page's real title.
				if (!ours()) saved = document.title;
				if (saved !== null) document.title = STANDBY_TITLE;
				return;
			}
			if (saved === null) return;
			if (document.title !== STANDBY_TITLE) {
				saved = null;
				return;
			}
			document.title = RESTORED_TITLE;
			restore_timer = setTimeout(() => {
				if (saved !== null && document.title === RESTORED_TITLE) document.title = saved;
				saved = null;
			}, RESTORED_MS);
		}

		document.addEventListener('visibilitychange', onVisibility);
		return () => {
			document.removeEventListener('visibilitychange', onVisibility);
			clearTimeout(restore_timer);
			if (saved !== null && ours()) document.title = saved;
		};
	});

	/* ── Carrier: the network line ───────────────────────────────────────── */

	const CARRIER_DETECT_MS = 1500;

	// Optimistic until the client can read the line: the server has no idea, and a
	// NO CARRIER flash on every first paint would be a lie.
	let online = $state(true);
	let carrier_detect = $state(false);
	const carrier_badge = $derived(!online || carrier_detect);

	onMount(() => {
		let detect_timer: ReturnType<typeof setTimeout> | undefined;
		online = navigator.onLine;

		function onOffline() {
			clearTimeout(detect_timer);
			online = false;
			carrier_detect = false;
		}
		function onOnline() {
			clearTimeout(detect_timer);
			online = true;
			carrier_detect = true;
			detect_timer = setTimeout(() => (carrier_detect = false), CARRIER_DETECT_MS);
		}

		window.addEventListener('offline', onOffline);
		window.addEventListener('online', onOnline);
		return () => {
			window.removeEventListener('offline', onOffline);
			window.removeEventListener('online', onOnline);
			clearTimeout(detect_timer);
		};
	});

	/* ── Ports: controller and console ───────────────────────────────────── */

	// The pad only navigates on the PlayStation plates (elsewhere it is read for the
	// Konami code alone), so the badge only shows there too.
	const pad_badge = $derived($padConnected && ($theme === 'ps1' || $theme === 'ps2'));
	// A PlayStation pad whose lightbar isn't ours yet: the badge becomes the button that
	// asks for it, because WebHID only prompts from a click. Re-read on (dis)connect.
	const pad_link = $derived(
		pad_badge && !$lightbarLinked && lightbarSupported() && sonyPadPresent()
	);

	onMount(() => {
		const stop_pad = startGamepad();
		const stop_konami = startKonami();
		const stop_lightbar = startLightbar();
		const uninstall_console = installConsole();
		return () => {
			stop_pad();
			stop_konami();
			stop_lightbar();
			uninstall_console();
		};
	});

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
			<!-- Held, the name stretches instead of following the link (see the Brand
			     section). Not draggable: a held mouse would otherwise pick the link up. -->
			<a
				bind:this={brand_link}
				href="/"
				class="brand flex min-w-0 max-w-full items-center gap-2 justify-self-start text-ink no-underline"
				aria-label="Isa Tippens, home"
				draggable="false"
				data-stretching={stretched_by !== null}
				onpointerdown={onBrandPointerDown}
				onclickcapture={onBrandClick}
				oncontextmenu={onBrandContextMenu}
				onkeydown={onBrandKeydown}
				onkeyup={onBrandKeyup}
				onblur={onBrandBlur}
			>
				<!-- Monogram. Painted entirely from faceplate tokens, so it re-inks itself
				     with every plate: ink body, panel-coloured letters, one accent pixel. -->
				<svg viewBox="0 0 16 16" class="brand-mark h-4 w-4 shrink-0" aria-hidden="true">
					<rect x="0.5" y="0.5" width="15" height="15" rx="1.5" fill="var(--ink)" />
					<rect x="3.5" y="7" width="2.5" height="5.5" fill="var(--panel)" />
					<rect class="brand-dot" x="3.5" y="3.5" width="2.5" height="2.5" fill="var(--accent)" />
					<path d="M8.5 3.5H11v3h2V8.5h-2v2h2v2H8.5v-4H7.5v-2h1Z" fill="var(--panel)" />
				</svg>
				<!-- Clips rather than wraps or widens the bar: the grid column is the cap. -->
				<span
					bind:this={brand_name}
					class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-bold">{brand_text}</span
				>
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
			<!-- Badges sit ahead of BAT. On a phone the bar has no room for both, so while a
			     badge is up BAT drops its number and keeps the cell, and a lost line outranks
			     the pad. -->
			<span class="flex items-center justify-self-end">
				<span role="status" class="flex items-center">
					{#if !online}
						<span class="carrier-lost mr-2 flex items-center gap-1 whitespace-nowrap font-bold text-ink">
							<span class="badge-led" aria-hidden="true"></span>NO CARRIER
						</span>
					{:else if carrier_detect}
						<span class="mr-2 flex items-center gap-1 whitespace-nowrap font-bold text-ink">
							<span class="badge-led" aria-hidden="true"></span>CARRIER DETECT
						</span>
					{/if}
				</span>
				{#if pad_badge}
					{@const badge_class = `${carrier_badge ? 'hidden sm:flex' : 'flex'} mr-2 items-center gap-1 whitespace-nowrap font-bold text-ink`}
					{#if pad_link}
						<button
							type="button"
							class="{badge_class} bg-transparent p-0 text-xxs uppercase tracking-widest hover:text-accent"
							title="Link the controller's lightbar to the faceplate"
							onclick={() => void linkLightbar()}
						>
							<span class="badge-led" aria-hidden="true"></span>PAD 1 · LINK LIGHT
						</button>
					{:else}
						<span class={badge_class}>
							<span class="badge-led" aria-hidden="true"></span>PAD 1{#if $lightbarLinked}&nbsp;· LIT{/if}
						</span>
					{/if}
				{/if}
				<button
					type="button"
					class="flex items-center gap-1.5 whitespace-nowrap bg-transparent p-0 text-xxs uppercase tracking-widest hover:text-accent"
					aria-pressed={$isCharging}
					aria-label={`Battery ${$batteryLevel ?? 'unknown'} percent${$isCharging ? ', charging' : ''}`}
					onclick={toggleCharging}
				>
					<span class="{carrier_badge || pad_badge ? 'hidden sm:flex' : 'flex'} items-center gap-1">
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
			</span>
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

	<!-- Print-only: the screen hides it, paper gets the manual. -->
	<PrintManual />
</div>

<style>
	/* ── Brand ───────────────────────────────────────────────────────────── */

	.brand span {
		transition: color 120ms linear;
	}
	.brand:hover span,
	.brand[data-stretching='true'] span {
		color: var(--accent);
	}
	/* A held name is a held name, not a text selection, a callout or a link drag. */
	.brand {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		user-select: none;
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

	/* ── Status badges ───────────────────────────────────────────────────── */

	.badge-led {
		display: inline-block;
		width: 5px;
		height: 5px;
		background-color: var(--accent);
	}
	/* NO CARRIER blinks like a modem light: on, off, no fade in between. The global
	   reduced-motion block collapses it to one frame, which ends lit; the failsafe's
	   `data-motion="off"` gets the same steady light. */
	.carrier-lost {
		animation: carrier-blink 1s steps(1, end) infinite;
	}
	:global(:root[data-motion='off']) .carrier-lost {
		animation: none;
	}
	@keyframes carrier-blink {
		50% {
			opacity: 0;
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
