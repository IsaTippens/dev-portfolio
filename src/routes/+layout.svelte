<script>
	import { is_dark } from '$lib/stores/theme';
	import { setContext } from 'svelte';
	setContext('theme', { is_dark });

	import NoisyGradient from '$lib/components/NoisyGradient.svelte';
	import '../app.css';
	import '../prism.css';
</script>

<!--
	I want a centered layout with a max-width of 1200px
	Ideally mobile should be full width
	Greater than mobile should be a centered column
	not using tailwind, only css or carbon-components-svelte
	All screen sizes should use full height
-->
<div class="flex flex-col items-center justify-center min-h-screen relative" data-theme="nord">
	<div class="absolute inset-0"><NoisyGradient /></div>
	<div
		class="max-w-full p-4
				sm:min-w-[720px] sm:max-w-[1080px] z-10 backdrop-blur-[2px]"
	>
		<slot />
	</div>
</div>
