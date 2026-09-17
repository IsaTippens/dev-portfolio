<script>
	import Divider from '$lib/components/Divider.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import PhotoViewer from '$lib/components/PhotoViewer.svelte';

	let { data } = $props();

	let { date, title, description, slug } = $derived(data.meta);
	let Content = $derived(data.Content);
</script>

<Meta {title} {description} path={`/blog/${slug}`} type="article" published={date} />
<div class="border-b border-border pb-3 mb-6 flex flex-col gap-2">
	<div class="text-tiny uppercase tracking-widest font-mono text-accent">
		[NAV: <a href="/" class="hover:underline">HOME</a> /
		<a href="/blog" class="hover:underline">POSTS</a>
		/ {slug ? slug.toUpperCase() : ''}]
	</div>
	<h1 class="text-2xl font-bold uppercase tracking-tight text-main leading-tight">
		{title}
	</h1>
	<div
		class="text-micro font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest"
	>
		{new Date(date).toDateString()}
	</div>
</div>
<main class="my-6">
	<div class="blog-content"><Content /></div>
	<PhotoViewer />
</main>
<footer>
	<Divider />
</footer>
