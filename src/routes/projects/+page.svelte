<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	let { data } = $props();
	let posts = $derived(data.posts);

	let currentPage = $state(1);
	const pageSize = 5;

	let totalPages = $derived(Math.ceil(posts.length / pageSize));
	let paginatedPosts = $derived(
		posts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>Blog</title>
	<meta name="description" content="Interesting Readables" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com/projects" />
</svelte:head>
<div class="border-b border-border pb-3 mb-4 flex justify-between items-end">
	<div>
		<div class="text-tiny uppercase tracking-widest font-mono text-accent">
			[NAV: <a href="/" class="hover:underline">HOME</a> / PROJECTS]
		</div>
		<h1 class="text-2xl font-bold uppercase tracking-tight text-main mt-1">
			STUFF I MADE
		</h1>
	</div>
	<div class="text-micro font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
		TOTAL: {posts.length}
	</div>
</div>
<main>
	{#if posts.length === 0}
		<div class="py-8 text-center text-neutral-400 text-base">
			No projects found.
		</div>
	{:else}
		{#each paginatedPosts as post, i}
			<div class="border border-border p-4 transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-900/30 group relative rounded-none">
				<a href={'/projects/' + post.path} class="block">
					<div class="flex flex-col gap-1">
						<span class="text-tiny font-mono uppercase tracking-widest text-accent">
							{new Date(post.meta.date).toDateString()}
						</span>
						<h2 class="text-lg font-bold text-main group-hover:text-accent transition-colors duration-150 uppercase tracking-tight">
							{post.meta.title}
						</h2>
						<p class="text-xs text-muted mt-1 leading-relaxed">
							{post.meta.description}
						</p>
					</div>
				</a>
			</div>
			{#if i < paginatedPosts.length - 1}
				<Divider />
			{/if}
		{/each}

		{#if totalPages > 1}
			<div class="flex justify-between items-center mt-6 py-4 border-t border-border text-xs font-mono">
				<button
					onclick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					class="btn-primary"
				>
					[PREV]
				</button>
				<span class="text-muted uppercase tracking-widest text-tiny">
					PAGE: {currentPage} // {totalPages}
				</span>
				<button
					onclick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					class="btn-primary"
				>
					[NEXT]
				</button>
			</div>
		{/if}
	{/if}
</main>
