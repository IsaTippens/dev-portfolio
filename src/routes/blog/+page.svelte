<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
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
	<title>Posts</title>
	<meta name="description" content="Interesting Readables" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com/blog" />
</svelte:head>
<div class="border-b border-border pb-3 mb-4 flex justify-between items-end">
	<div>
		<div class="text-tiny uppercase tracking-widest font-mono text-accent">
			[NAV: <a href="/" class="hover:underline">HOME</a> / POSTS]
		</div>
		<h1 class="text-2xl font-bold uppercase tracking-tight text-main mt-1">
			STUFF I WROTE
		</h1>
	</div>
	<div class="text-micro font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
		TOTAL: {posts.length}
	</div>
</div>
<main>
	{#each paginatedPosts as post, i}
		<PostTile data={post} />
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
</main>
