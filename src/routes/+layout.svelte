<script>
	import { is_dark } from '$lib/stores/theme';
	import { setContext } from 'svelte';
	setContext('theme', { is_dark });

	import NoisyGradient from '$lib/components/NoisyGradient.svelte';
	import '../app.css';
	import '../prism.css';

	let { children } = $props();
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
		class="w-full max-w-[640px] bg-[#f4f4f2] dark:bg-[#1c1c1c] border-2 border-black dark:border-neutral-700 z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] flex flex-col relative"
	>
		<!-- Top Technical Status Bar -->
		<div class="flex justify-between items-center px-4 py-2 border-b border-black dark:border-neutral-700 text-[9px] uppercase tracking-widest font-mono text-neutral-500 dark:text-neutral-400">
			<span class="flex items-center gap-1">
				<span class="inline-block w-2.5 h-2.5 bg-[#ff4500]"></span>
				<span class="font-bold text-black dark:text-white">TE-OP-PORTFOLIO</span>
			</span>
			<span class="hidden sm:inline">SYS: RUNNING</span>
			<span class="flex items-center gap-1.5">
				<span>BAT: 100%</span>
				<span class="inline-block w-5 h-2.5 border border-neutral-500 dark:border-neutral-400 p-[1px] relative">
					<span class="block h-full bg-[#ff4500] w-full"></span>
				</span>
			</span>
		</div>

		<!-- Main viewport/content screen -->
		<div class="p-4 sm:p-6 flex-auto">
			{@render children()}
		</div>

		<!-- Bottom Technical Status Bar -->
		<div class="flex justify-between items-center px-4 py-2 border-t border-black dark:border-neutral-700 text-[9px] uppercase tracking-widest font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-200/20 dark:bg-neutral-800/20">
			<span>SVELTE v5</span>
			<span>60 FPS</span>
			<span>REV: 2026.06</span>
		</div>
	</div>
</div>
