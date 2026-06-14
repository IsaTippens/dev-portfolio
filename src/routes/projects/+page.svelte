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
<div class="py-8 px-4 gradient-card-bg rounded-lg text-white">
	<div>
		<span class="font-semibold text-white"
			><a href="/" class="text-white">Home</a> / <span class="crumb-end text-white">Projects</span></span
		>
	</div>
	<div class="sticky top-0 z-10">
		<p class="text-3xl semibold text-white">Stuff I Made</p>
	</div>
</div>
<main>
	{#if posts.length === 0}
		<div class="py-8 text-center text-neutral-400 text-base">
			No projects found.
		</div>
	{:else}
		{#each paginatedPosts as post, i}
			<div class="card">
				<div class="card-inner">
					<a href={'/projects/' + post.path}>
						<div class="flex flex-col sm:flex-row">
							<div class="flex-auto text-lg">
								{post.meta.title}
							</div>
							<div class="text-sm text-blue-600 dark:text-blue-400 font-medium">
								{new Date(post.meta.date).toDateString()}
							</div>
						</div>
						<div>
							{post.meta.description}
						</div>
					</a>
				</div>
			</div>
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
	{/if}
</main>
