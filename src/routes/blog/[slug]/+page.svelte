<script>
	import Divider from '$lib/components/Divider.svelte';

	let { data } = $props();

	let { date, title, description, slug } = $derived(data.meta);
	let Content = $derived(data.Content);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@issssaaaaaaaaah" />
	<meta name="twitter:creator" content="@issssaaaaaaaaah" />
</svelte:head>
<div class="border-b border-border pb-3 mb-6 flex justify-between items-end">
	<div>
		<div class="text-tiny uppercase tracking-widest font-mono text-accent">
			[NAV: <a href="/" class="hover:underline">HOME</a> / <a href="/blog" class="hover:underline">POSTS</a> / {slug ? slug.toUpperCase() : ''}]
		</div>
		<h1 class="text-2xl font-bold uppercase tracking-tight text-main mt-1">
			{title}
		</h1>
	</div>
	<div class="text-micro font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
		{new Date(date).toDateString()}
	</div>
</div>
<main class="my-6">
	<div class="blog-content"><Content /></div>
</main>
<footer>
	<Divider />
</footer>

