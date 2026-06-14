<script>
	import About from '$lib/components/About.svelte';
	import { gsap } from 'gsap';
	import { TextPlugin } from 'gsap/dist/TextPlugin';
	gsap.registerPlugin(TextPlugin);

	import { onMount } from 'svelte';

	import RightArrow from 'virtual:icons/mingcute/right-fill.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
	import Socials from '$lib/components/Socials.svelte';

	let { data } = $props();

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
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
		<a href="/blog" class="p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-indigo-500/50 hover:bg-neutral-900/60 transition-all text-center">
			<span class="block text-lg font-bold text-white">Blog</span>
			<span class="text-xs text-neutral-400">Articles & notes</span>
		</a>
		<a href="/projects" class="p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-indigo-500/50 hover:bg-neutral-900/60 transition-all text-center">
			<span class="block text-lg font-bold text-white">Projects</span>
			<span class="text-xs text-neutral-400">Code & systems</span>
		</a>
		<a href="/resume" target="_blank" class="p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-indigo-500/50 hover:bg-neutral-900/60 transition-all text-center">
			<span class="block text-lg font-bold text-white">Resume</span>
			<span class="text-xs text-neutral-400">Download CV (PDF)</span>
		</a>
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
