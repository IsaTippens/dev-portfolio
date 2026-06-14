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
<div>
	<div>
		<span class="font-semibold"
			><a href="/" class="">Home</a> /
			<span class="crumb-end">Posts</span></span
		>
	</div>
	<div class="sticky top-0 z-10">
		<p class="text-3xl semibold">Stuff I Wrote</p>
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
		<div class="flex justify-between items-center mt-6 py-4 border-t border-neutral-800 text-sm">
			<button
				onclick={() => goToPage(currentPage - 1)}
				disabled={currentPage === 1}
				class="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-900 transition-colors"
			>
				Previous
			</button>
			<span class="text-neutral-400">
				Page {currentPage} of {totalPages}
			</span>
			<button
				onclick={() => goToPage(currentPage + 1)}
				disabled={currentPage === totalPages}
				class="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-900 transition-colors"
			>
				Next
			</button>
		</div>
	{/if}
</main>
