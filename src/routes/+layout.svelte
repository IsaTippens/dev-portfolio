<script lang="ts">
	import { is_dark } from '$lib/stores/theme';
	import { setContext } from 'svelte';
	setContext('theme', { is_dark });

	import NoisyGradient from '$lib/components/NoisyGradient.svelte';
	import '../app.css';
	import '../prism.css';

	let { children } = $props();

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let batteryLevel = $state<number>(100);
	let fps = $state<number>(60);
	let isCharging = $state(false);
	let playLightning = $state(false);

	onMount(() => {
		// Battery status API
		if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			((navigator as any).getBattery() as Promise<any>).then((battery: any) => {
				batteryLevel = Math.round(battery.level * 100);
				isCharging = battery.charging;
				battery.addEventListener('levelchange', () => {
					batteryLevel = Math.round(battery.level * 100);
				});
				battery.addEventListener('chargingchange', () => {
					const newCharging = battery.charging;
					if (newCharging && !isCharging) {
						playLightning = true;
						setTimeout(() => {
							playLightning = false;
						}, 1500);
					}
					isCharging = newCharging;
				});
			});
		}

		// FPS counter
		let lastTime = performance.now();
		let frameCount = 0;
		let animationFrameId: number;

		function updateFps() {
			const now = performance.now();
			frameCount++;
			if (now >= lastTime + 1000) {
				fps = Math.round((frameCount * 1000) / (now - lastTime));
				frameCount = 0;
				lastTime = now;
			}
			animationFrameId = requestAnimationFrame(updateFps);
		}

		animationFrameId = requestAnimationFrame(updateFps);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	});

	function toggleTheme() {
		is_dark.update((d) => !d);
	}

	$effect(() => {
		if (browser) {
			if ($is_dark) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
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
		class="w-full max-w-[700px] bg-[#f4f4f2] dark:bg-[#1c1c1c] border-2 border-black dark:border-neutral-700 z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] flex flex-col relative"
	>
		<!-- Top Technical Status Bar -->
		<div class="flex justify-between items-center px-4 py-2 border-b border-black dark:border-neutral-700 text-[10px] uppercase tracking-widest font-mono text-neutral-500 dark:text-neutral-400 relative overflow-hidden">
			{#if playLightning}
				<div class="absolute inset-0 bg-accent/20 flex items-center z-20 pointer-events-none">
					<div class="animate-marquee whitespace-nowrap text-[9px] font-bold text-accent font-mono flex items-center">
						⚡ CHARGER_CONNECTED // POWERING_UP // ⚡ ⚡ ⚡
					</div>
				</div>
			{/if}
			<span class="flex items-center gap-1">
				<span class="inline-block w-2.5 h-2.5 bg-accent"></span>
				<span class="font-bold text-black dark:text-white">DEV-PORTFOLIO</span>
			</span>
			<button
				onclick={toggleTheme}
				class="hover:text-accent font-bold transition-colors uppercase border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 bg-neutral-200/50 dark:bg-neutral-800/50 text-[9px]"
			>
				MODE: {$is_dark ? 'DARK' : 'LIGHT'}
			</button>
			<span class="flex items-center gap-1.5">
				<span>BAT: {batteryLevel}%</span>
				<span class="inline-block w-5 h-2.5 border border-neutral-500 dark:border-neutral-400 p-[1px] relative">
					<span class="block h-full bg-accent" style="width: {batteryLevel}%"></span>
				</span>
			</span>
		</div>

		<!-- Main viewport/content screen -->
		<div class="p-4 sm:p-6 flex-auto">
			{@render children()}
		</div>

		<!-- Bottom Technical Status Bar -->
		<div class="flex justify-between items-center px-4 py-2 border-t border-black dark:border-neutral-700 text-[10px] uppercase tracking-widest font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-200/20 dark:bg-neutral-800/20">
			<span>SVELTE v5</span>
			<span>{fps} FPS</span>
			<span>REV: 2026.06</span>
		</div>
	</div>
</div>
