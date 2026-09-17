<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	let { data } = $props();
	let posts = $derived(data.posts ?? []);

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

<Meta title="Posts" description="Interesting Readables" path="/blog" />
<PageHeader pathName="POSTS" title="STUFF I WROTE" stats={`TOTAL: ${posts.length}`} />
<main>
	{#each paginatedPosts as post, i}
		<PostTile data={post} />
		{#if i < paginatedPosts.length - 1}
			<Divider />
		{/if}
	{/each}

	<PaginationControls {currentPage} {totalPages} onPageChange={goToPage} />
</main>
