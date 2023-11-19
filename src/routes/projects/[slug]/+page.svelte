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
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@issssaaaaaaaaah" />
	<meta name="twitter:creator" content="@issssaaaaaaaaah" />
</svelte:head>
<div class="py-8 px-4 gradient-card-bg rounded-lg text-white">
	<div>
		<span class="font-semibold text-white">
			<a href="/" class="text-white">Home</a> /
			<a href="/projects" class="text-white">Projects</a> /
			<span class="crumb-end truncate whitespace-nowrap text-white">{title}</span>
		</span>
	</div>
	<div>
		<p
			class="text-3xl font-semibold truncate whitespace-nowrap hover:whitespace-normal text-white"
		>
			{title}
		</p>
		<p class="text-white">{new Date(date).toDateString()}</p>
	</div>
</div>
<main class="blog-body">
	<div class="all-prose blog">{@html html}</div>
</main>
<footer class="border-t grid grid-cols-1 text-xl" />

<style>
	img {
		border-radius: 25%;
	}
</style>
