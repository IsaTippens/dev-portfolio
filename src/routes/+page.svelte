<script context="module">
	import { ClickableTile, Tile } from 'carbon-components-svelte';
	import AnimatedHeader from '$lib/components/AnimatedHeader.svelte';
	import About from '$lib/components/About.svelte';
	import { gsap } from 'gsap';
	import { TextPlugin } from 'gsap/dist/TextPlugin';
	gsap.registerPlugin(TextPlugin);

	import { onMount } from 'svelte';
</script>

<script>
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
		<div class="">
			<h1 class="text-3xl font-semibold">I'm Isa</h1>
			<h1 class="text-3xl font-semibold">This is what I do</h1>
		</div>
		<div>
			<About {data} />
		</div>
	</div>
	<div class="grid gap-4 md:grid-cols-2 sm:grid-cols-1">
		<div class="grid gap-2">
			<ClickableTile href="/blog">
				<h1>Posts</h1>
			</ClickableTile>
			<div class="grid gap-2">
				{#each data.posts.slice(0, 5) as post}
					<ClickableTile href={'blog/' + post.path}>
						<p class="text-lg">
							{post.meta.title}
						</p>
						<p class="text-sm">
							{post.meta.description}
						</p>
					</ClickableTile>
				{/each}
			</div>
		</div>
		<div class="grid gap-2 grid-cols-1">
			<Tile>
				<h1>Socials</h1>
			</Tile>
			<div class="grid gap-2 md:grid-cols-2 sm:grid-cols-1">
				<ClickableTile href="mailto:isatippens2@gmail.com">Email</ClickableTile>
				<ClickableTile href="https://www.github.com/IsaTippens">Github</ClickableTile>
				<ClickableTile href="https://x.com/issssaaaaaaaaah">Twitter</ClickableTile>
				<ClickableTile href="https://www.instagram.com/issssaaaaaaaaaaaaaahhhhhhhhhhh/"
					>Instagram</ClickableTile
				>
				<ClickableTile href="https://www.youtube.com/@issaaahhhh">Youtube</ClickableTile>
			</div>
		</div>
	</div>
</div>
