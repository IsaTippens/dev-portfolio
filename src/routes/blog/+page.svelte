<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	let { data } = $props();
	let posts = $derived(data.posts);

	let currentPage = $state(1);
	const pageSize = 5;

	let totalPages = $derived(Math.ceil(posts.length / pageSize));
	let paginatedPosts = $derived(
		posts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	let containerEl = $state<HTMLElement>();

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			containerEl?.closest('.panel-content-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

</script>
<svelte:head>
	<title>Posts</title>
	<meta name="description" content="Interesting Readables" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com/blog" />
</svelte:head>
<PageHeader 
	pathName="POSTS" 
	title="STUFF I WROTE" 
	stats={`TOTAL: ${posts.length}`} 
/>
<main bind:this={containerEl}>
	{#each paginatedPosts as post, i}
		<PostTile data={post} />
		{#if i < paginatedPosts.length - 1}
			<Divider />
		{/if}
	{/each}

	<PaginationControls 
		currentPage={currentPage} 
		totalPages={totalPages} 
		onPageChange={goToPage} 
	/>
</main>
