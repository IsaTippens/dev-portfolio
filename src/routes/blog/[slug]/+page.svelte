<script context="module">
	// export const prerender = true
	import Divider from '$lib/components/Divider.svelte';
</script>

<script>
	export let data;

	let { html, date, title, description } = data.post;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="sticky top-0 z-10 blog-header">
	<p class="text-3xl font-semibold highlight-text truncate whitespace-nowrap md:whitespace-normal hover:whitespace-normal">{title}</p>
	<p>{new Date(date).toDateString()}</p>
</div>
<main>
	<div class="all-prose">{@html html}</div>
</main>
<footer class="border-t grid grid-cols-1 text-xl">
	<a href="/">Back to home</a>
	<a href="/blog">Back to blog</a>
</footer>

<style>
	img {
		border-radius: 25%;
	}
</style>
