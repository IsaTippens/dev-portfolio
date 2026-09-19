<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	import { rowNav } from '$lib/rowNav.js';

	let { data } = $props();
	let posts = $derived(data.posts ?? []);

	let currentPage = $state(1);
	const pageSize = 5;

	let totalPages = $derived(Math.max(1, Math.ceil(posts.length / pageSize)));
	let paginatedPosts = $derived(posts.slice((currentPage - 1) * pageSize, currentPage * pageSize));

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			window.scrollTo({ top: 0 });
		}
	}
</script>

<Meta title="Posts" description="Interesting Readables" path="/blog" />
<PageHeader pathName="POSTS" title="STUFF I WROTE" stats={`TOTAL: ${posts.length}`} />
<main>
	<!-- Rows assemble as the list is reached; `j`/`k` walk them. -->
	<div data-seat use:rowNav>
		{#each paginatedPosts as post, i (post.path)}
			<PostTile data={post} />
			{#if i < paginatedPosts.length - 1}
				<Divider />
			{/if}
		{/each}
	</div>

	<PaginationControls {currentPage} {totalPages} onPageChange={goToPage} />
</main>
