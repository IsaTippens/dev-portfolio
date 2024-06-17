<script context="module">
	import { Tile, SkeletonPlaceholder, AspectRatio } from 'carbon-components-svelte';
	import InfoTile from './InfoTile.svelte';
	import { onMount } from 'svelte';
	import PlaceHolder from './PlaceHolder.svelte';
</script>

<script>
	import SuperHeader from './SuperHeader.svelte';

	export let data;

	onMount(() => {});
</script>

<div class="grid gap-4">
	<div class="text-lg">
		<p>
			{data.age} y/o <span class="highlight-text gsap-info">programmer</span> of {data.devYear} years
		</p>
		<p>Cape Town, South Africa</p>
	</div>

	<p class="text-3xl font-semibold">MSc Student</p>
	<div>
		<p>
			Doing Computer Science at the <a href="https://uwc.ac.za" target="_blank"
				>University of the Western Cape</a
			>
		</p>
		<p>
			Combining Quantum Computing and Software Engineering to develop a fully secure token
			transaction protocol
		</p>
	</div>

	<p class="text-3xl font-semibold">Software Developer</p>
	<div class="">
		<p>Developing a high-frequency trading system and back-testing tools for crypto exchanges</p>
	</div>
</div>
