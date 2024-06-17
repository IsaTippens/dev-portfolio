<script context="module">
	import Divider from '$lib/components/Divider.svelte';
	import AnimatedHeader from '$lib/components/AnimatedHeader.svelte';
</script>

<script>
	export let data;

	let { date, title, description, slug } = data.meta;
	let Content = data.Content;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@issssaaaaaaaaah" />
	<meta name="twitter:creator" content="@issssaaaaaaaaah" />
</svelte:head>
<div>
	<div>
		<span class="font-semibold">
			<a href="/" class="">Home</a> /
			<a href="/blog" class="">Posts</a> /
			<span class="crumb-end truncate whitespace-nowrap">{slug}</span>
		</span>
	</div>
	<div>
		<p
			class="text-3xl font-semibold truncate whitespace-nowrap hover:whitespace-normal"
		>
			{title}
		</p>
		<p class="">{new Date(date).toDateString()}</p>
	</div>
</div>
<main class="blog-body">
	<div class="all-prose blog"><svelte:component this={Content} /></div>
</main>
<footer>
	<Divider />
</footer>

<style>
	img {
		border-radius: 25%;
	}
</style>
