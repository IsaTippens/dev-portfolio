<script context="module">
	// export const prerender = true
	import Divider from '$lib/components/Divider.svelte';
	
</script>

<script>
	export let data;

	let { html, date, title } = data.post;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="">
<div>
	<p class="text-3xl font-semibold highlight-text">{title}</p>
	<p>{new Date(date).toDateString()}</p>
</div>
<Divider />
<div class="all-prose">{@html html}</div>
<Divider />
<div class="grid grid-cols-1 text-xl">
	<a href="/">Back to home</a>
	<a href="/blog">Back to blog</a>
</div>
</div>
<style>
	img {
		border-radius: 25%;
	}
</style>
