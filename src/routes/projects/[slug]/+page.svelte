<script>
	import Meta from '$lib/components/Meta.svelte';
	import PhotoViewer from '$lib/components/PhotoViewer.svelte';
	let { data } = $props();

	let { date, title, description, slug } = $derived(data.meta);
	let Content = $derived(data.Content);
</script>

<Meta {title} {description} path={`/projects/${slug}`} type="article" published={date} />
<div class="border-b border-line pb-3 mb-6 flex flex-col gap-2">
	<div class="text-tiny uppercase tracking-widest font-mono text-accent">
		[NAV: <a href="/" class="hover:underline">HOME</a> /
		<a href="/projects" class="hover:underline">PROJECTS</a>
		/ {title ? title.toUpperCase() : ''}]
	</div>
	<h1 class="text-2xl font-bold uppercase tracking-tight text-ink leading-tight">
		{title}
	</h1>
	<div
		class="text-micro font-mono text-dim uppercase tracking-widest"
	>
		{new Date(date).toDateString()}
	</div>
</div>
<main class="my-6">
	<div class="blog-content"><Content /></div>
	<PhotoViewer />
</main>
<footer class="border-t grid grid-cols-1 text-xl"></footer>
