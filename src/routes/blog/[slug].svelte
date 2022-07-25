<script context="module">
	// export const prerender = true
	import Divider from '$lib/components/Divider.svelte';
	export async function load({ fetch, params }) {
		const { slug } = params;
		const res = await fetch(`./${slug}.json`);
		if (res.ok) {
			const { post } = await res.json();
			return {
				props: { post }
			};
		}
	}
</script>

<script>
	export let post;

	let { html, date, title } = post;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div>
	<p class="text-3xl font-semibold">{title}</p>
	<p>{new Date(date).toDateString()}</p>
</div>
<Divider />
<div class="prose">{@html html}</div>
<Divider />
<div class="grid grid-cols-1 text-xl">
	<a href="/">Back to home</a>
	<a href="/blog">Back to blog</a>
</div>

<style>
	img {
		border-radius: 25%;
	}
</style>
