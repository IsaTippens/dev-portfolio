<script lang="ts">
	import { THEMES, theme } from '$lib/stores/theme';

	import NoisyGradient from '$lib/components/NoisyGradient.svelte';
	import '../app.css';
	import '../prism.css';

	let { children } = $props();

	import { onMount } from 'svelte';

	import { isCharging, batteryLevel, playLightning } from '$lib/stores/battery';
	let fps = $state<number>(60);

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
							isCharging.subscribe(v => currentIsCharging = v)();

							if (newCharging && !currentIsCharging) {
								playLightning.set(true);
								setTimeout(() => {
									playLightning.set(false);
								}, 1500);
							}
							isCharging.set(newCharging);
						});
					})
					.catch(() => {});
			} catch (e) {
				// Ignored
			}
		}

		// FPS counter
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

	$effect(() => {
		const active = THEMES.find((t) => t.id === $theme);
		document.documentElement.dataset.theme = active?.id ?? 'light';
		document.documentElement.classList.toggle('dark', active?.dark ?? false);
	});
</script>

<!--
	I want a centered layout with a max-width of 1200px
	Ideally mobile should be full width
	Greater than mobile should be a centered column
	not using tailwind, only css or carbon-components-svelte
	All screen sizes should use full height
-->
<div class="flex flex-col items-center justify-center min-h-screen relative overflow-x-hidden p-2 sm:p-4">
	<!-- Background grid -->
	<div class="absolute inset-0 z-0"><NoisyGradient /></div>

	<!-- TE Device Chassis -->
	<div
		class="w-full max-w-[700px] bg-card border-2 border-border z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] flex flex-col relative"
	>
		<!-- Top Technical Status Bar -->
		<div class="flex justify-between items-center px-4 py-2 border-b border-border text-xxs uppercase tracking-widest font-mono text-muted relative overflow-hidden">
			{#if $playLightning}
				<div class="absolute inset-0 bg-accent/20 flex items-center z-20 pointer-events-none">
					<div class="animate-marquee whitespace-nowrap text-tiny font-bold text-accent font-mono flex items-center">
						⚡ CHARGER_CONNECTED // POWERING_UP // ⚡ ⚡ ⚡
					</div>
				</div>
			{/if}
			<span class="flex items-center gap-1">
				<span class="inline-block w-2.5 h-2.5 bg-accent"></span>
				<span class="font-bold text-main">DEV-PORTFOLIO</span>
			</span>
			<label
				class="flex items-center gap-1 font-bold uppercase border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 bg-neutral-200/50 dark:bg-neutral-800/50 text-tiny cursor-pointer"
			>
				MODE:
				<select
					bind:value={$theme}
					aria-label="Colour theme"
					class="bg-transparent text-main uppercase font-bold cursor-pointer hover:text-accent focus:outline-none"
				>
					{#each THEMES as t (t.id)}
						<option value={t.id}>{t.label}</option>
					{/each}
				</select>
			</label>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span
				class="flex items-center gap-1.5 cursor-pointer"
				onclick={() => {
					isCharging.update(v => {
						const newCharging = !v;
						if (newCharging) {
							playLightning.set(true);
							setTimeout(() => {
								playLightning.set(false);
							}, 1500);
						}
						return newCharging;
					});
				}}
			>
				<span>BAT: {$batteryLevel}%</span>
				<span class="inline-block w-5 h-2.5 border border-muted p-[1px] relative">
					<span class="block h-full bg-accent" style="width: {$batteryLevel}%"></span>
				</span>
			</span>
		</div>

		<!-- Main viewport/content screen -->
		<div class="p-4 sm:p-6 flex-auto">
			{@render children()}
		</div>

		<!-- Bottom Technical Status Bar -->
		<div class="flex justify-between items-center px-4 py-2 border-t border-border text-xxs uppercase tracking-widest font-mono text-muted bg-neutral-200/20 dark:bg-neutral-800/20">
			<span>SVELTE v5</span>
			<span>{fps} FPS</span>
			<span>REV: 2026.06</span>
		</div>
	</div>
</div>
