<script context="module">
	// export const prerender = true
	import Divider from '$lib/components/Divider.svelte';
</script>

<script>
	export let data;

	let { html, date, title, description, path } = data.post;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>
<div>
	<span class="font-semibold highlight-text">
		<a href="/" class="highlight-text">Home</a> /
		<a href="/blog" class="highlight-text">Blog</a> /
		<span class="crumb-end truncate whitespace-nowrap">{title}</span>
	</span>
</div>
<div class="sticky top-0 z-10 blog-header">
	<p
		class="text-3xl font-semibold highlight-text truncate whitespace-nowrap hover:whitespace-normal"
	>
		{title}
	</p>
	<p>{new Date(date).toDateString()}</p>
</div>
<main>
	<div class="all-prose">{@html html}</div>
</main>
<footer class="border-t grid grid-cols-1 text-xl" />

<style>
	img {
		border-radius: 25%;
	}
</style>
