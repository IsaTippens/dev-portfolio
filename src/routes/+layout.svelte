<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { THEMES, theme } from '$lib/stores/theme';

	import NoisyGradient from '$lib/components/NoisyGradient.svelte';
	import '../app.css';
	import '../prism.css';

	let { children } = $props();

	import { onMount } from 'svelte';

	import { isCharging, batteryLevel, playLightning } from '$lib/stores/battery';
	let fps = $state<number>(60);

	const SHORTCUTS = [
		{ key: 'F1', label: 'F1_BLOG', href: '/blog', blank: false },
		{ key: 'F2', label: 'F2_PROJ', href: '/projects', blank: false },
		{ key: 'F3', label: 'F3_RESM', href: '/resume', blank: true },
		{ key: 'F4', label: 'F4_GEAR', href: '/gear', blank: false }
	];

	let keys_open = $state(false);

	function flashCharging() {
		playLightning.set(true);
		setTimeout(() => {
			playLightning.set(false);
		}, 1500);
	}

	function toggleCharging() {
		isCharging.update((v) => {
			if (!v) flashCharging();
			return !v;
		});
	}

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
							let currentIsCharging = false;
							isCharging.subscribe((v) => (currentIsCharging = v))();

							if (newCharging && !currentIsCharging) {
								flashCharging();
							}
							isCharging.set(newCharging);
						});
					})
					.catch(() => {});
			} catch (e) {
				// Ignored
			}
		}

		// FPS counter. rAF is already parked by the browser in a hidden tab.
		let lastTime: number | null = null;
		let frameCount = 0;
		let animationFrameId: number;

		function updateFps(timestamp: number) {
			if (lastTime === null) lastTime = timestamp;
			frameCount++;
			if (timestamp >= lastTime + 1000) {
				fps = Math.round((frameCount * 1000) / (timestamp - lastTime));
				frameCount = 0;
				lastTime = timestamp;
			}
			animationFrameId = window.requestAnimationFrame(updateFps);
		}

		animationFrameId = window.requestAnimationFrame(updateFps);

		return () => {
			window.cancelAnimationFrame(animationFrameId);
		};
	});

	// Close the key map and restart the screen-swap animation whenever the route changes.
	$effect(() => {
		void page.url.pathname;
		keys_open = false;
	});

	$effect(() => {
		const active = THEMES.find((t) => t.id === $theme);
		if (!active) return;

		const root = document.documentElement;
		root.dataset.theme = active.id;
		root.classList.toggle('dark', active.dark);

		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) meta.setAttribute('content', active.color);
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<!--
	I want a centered layout with a max-width of 1200px
	Ideally mobile should be full width
	Greater than mobile should be a centered column
	not using tailwind, only css or carbon-components-svelte
	All screen sizes should use full height
-->
<div
	class="flex flex-col items-center justify-center min-h-screen relative overflow-x-hidden p-2 sm:p-4"
>
	<!-- Background grid -->
	<div class="absolute inset-0 z-0"><NoisyGradient /></div>

	<!-- TE Device Chassis -->
	<div
		class="w-full max-w-[700px] bg-card border-2 border-border z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] flex flex-col relative"
	>
		<!-- Top Technical Status Bar -->
		<div
			class="flex justify-between items-center gap-2 px-4 py-2 border-b border-border text-xxs uppercase tracking-widest font-mono text-muted relative overflow-hidden"
		>
			{#if $playLightning}
				<div class="absolute inset-0 bg-accent/20 flex items-center z-20 pointer-events-none">
					<div
						class="animate-marquee whitespace-nowrap text-tiny font-bold text-accent font-mono flex items-center"
					>
						⚡ CHARGER_CONNECTED // POWERING_UP // ⚡ ⚡ ⚡
					</div>
				</div>
			{/if}
			<span class="flex items-center gap-1">
				<span class="inline-block w-2.5 h-2.5 bg-accent"></span>
				<span class="font-bold text-main">DEV-PORTFOLIO</span>
			</span>
			<span class="flex items-center gap-2">
				<label
					class="flex items-center gap-1 font-bold uppercase border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 bg-neutral-200/50 dark:bg-neutral-800/50 text-tiny cursor-pointer"
				>
					MODE:
					<select
						bind:value={$theme}
						aria-label="Colour theme"
						class="bg-transparent text-main uppercase font-bold cursor-pointer hover:text-accent"
					>
						{#each THEMES as t (t.id)}
							<option value={t.id}>{t.label}</option>
						{/each}
					</select>
				</label>
				<button
					type="button"
					class="border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 bg-neutral-200/50 dark:bg-neutral-800/50 font-bold text-tiny hover:text-accent"
					aria-expanded={keys_open}
					aria-controls="key-map"
					onclick={() => (keys_open = !keys_open)}
				>
					[?] KEYS
				</button>
			</span>
			<button
				type="button"
				class="flex items-center gap-1.5 hover:text-accent"
				aria-pressed={$isCharging}
				aria-label={`Battery ${$batteryLevel} percent${$isCharging ? ', charging' : ''}`}
				onclick={toggleCharging}
			>
				<span>BAT: {$batteryLevel}%</span>
				<span class="inline-block w-5 h-2.5 border border-muted p-[1px] relative">
					<span class="block h-full bg-accent" style="width: {$batteryLevel}%"></span>
				</span>
			</button>
		</div>

		<!-- Main viewport/content screen. Keyed on the route so a navigation reads as a screen swap. -->
		<div class="p-4 sm:p-6 flex-auto">
			{#key page.url.pathname}
				<div class="screen-swap">
					{@render children()}
				</div>
			{/key}
		</div>

		<!-- Bottom Technical Status Bar -->
		<div
			class="flex justify-between items-center px-4 py-2 border-t border-border text-xxs uppercase tracking-widest font-mono text-muted bg-neutral-200/20 dark:bg-neutral-800/20"
		>
			<span>SVELTE v5</span>
			<span>{fps} FPS</span>
			<span>REV: 2026.06</span>
		</div>

		{#if keys_open}
			<div
				id="key-map"
				role="region"
				aria-label="Keyboard shortcuts"
				class="absolute inset-0 z-30 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
			>
				<div
					class="w-full max-w-sm border-2 border-border bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
				>
					<div
						class="flex justify-between items-center px-3 py-2 border-b border-border text-xxs uppercase tracking-widest text-muted"
					>
						<span class="font-bold text-main">[KEY_MAP]</span>
						<button
							type="button"
							class="hover:text-accent font-bold"
							onclick={() => (keys_open = false)}
						>
							[ESC_CLOSE]
						</button>
					</div>
					<ul class="p-3 grid gap-2">
						{#each SHORTCUTS as s (s.key)}
							<li
								class="flex items-center justify-between gap-3 text-tiny uppercase tracking-widest"
							>
								<span class="text-muted">{s.label}</span>
								<kbd
									class="border border-border bg-background px-1.5 py-0.5 font-mono font-bold text-main"
								>
									{s.key}
								</kbd>
							</li>
						{/each}
						<li class="flex items-center justify-between gap-3 text-tiny uppercase tracking-widest">
							<span class="text-muted">[?] TOGGLE_KEY_MAP</span>
							<kbd
								class="border border-border bg-background px-1.5 py-0.5 font-mono font-bold text-main"
							>
								?
							</kbd>
						</li>
					</ul>
				</div>
			</div>
		{/if}
	</div>
</div>
