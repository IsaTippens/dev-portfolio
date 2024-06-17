<script context="module">
	import { ClickableTile, Tile } from 'carbon-components-svelte';
	import SuperHeader from '$lib/components/SuperHeader.svelte';
	import About from '$lib/components/About.svelte';
	import { gsap } from 'gsap';
	import { TextPlugin } from 'gsap/dist/TextPlugin';
	gsap.registerPlugin(TextPlugin);

	import { onMount } from 'svelte';

	import RightArrow from 'virtual:icons/mingcute/right-fill.svelte';
</script>

<script>
	import Intro from '$lib/components/Intro.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
	import Socials from '$lib/components/Socials.svelte';

	export let data;

	onMount(() => {});
</script>

<svelte:head>
	<title>Isa Tippens</title>
	<meta name="description" content="I code things" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com" />
</svelte:head>

<div class="grid gap-4">
	<div class="grid gap-2">
		<div>
			<Intro />
		</div>
		<div>
			<About {data} />
		</div>
	</div>
	<a href="/blog">
		<div class="flex justify-between">
			<p class="text-3xl font-semibold">Posts</p>
			<RightArrow class="w-8 h-8" />
		</div>
	</a>
	<div class="grid">
		{#each data.posts.slice(0, 5) as post}
			<PostTile data={post} />
		{/each}
	</div>
	<div class="p-4">
		<Socials />
	</div>
</div>
