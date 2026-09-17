<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
	let { data } = $props();
	let posts = $derived(data.posts);

	let currentPage = $state(1);
	const pageSize = 5;

	let totalPages = $derived(Math.ceil(posts.length / pageSize));
	let paginatedPosts = $derived(posts.slice((currentPage - 1) * pageSize, currentPage * pageSize));

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<Meta title="Projects" description="Stuff I Made" path="/projects" />
<PageHeader pathName="PROJECTS" title="STUFF I MADE" stats={`TOTAL: ${posts.length}`} />
<main>
	{#if posts.length === 0}
		<div class="py-8 text-center text-neutral-400 text-base">No projects found.</div>
	{:else}
		{#each paginatedPosts as post, i}
			<PostTile data={post} basePath="/projects" showId={false} bordered={true} />
			{#if i < paginatedPosts.length - 1}
				<Divider />
			{/if}
		{/each}

		<PaginationControls {currentPage} {totalPages} onPageChange={goToPage} />
	{/if}
</main>
