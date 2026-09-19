<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
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

<Meta title="Projects" description="Stuff I Made" path="/projects" />
<PageHeader pathName="PROJECTS" title="STUFF I MADE" stats={`TOTAL: ${posts.length}`} />
<main>
	{#if posts.length === 0}
		<!-- A failure should still look like the device telling you about it. -->
		<Panel tag="PROJECTS" class="p-6">
			<div class="flex flex-col items-center gap-2 py-6 text-center font-mono">
				<div class="font-mono text-tiny tracking-widest text-warn uppercase">
					MODULE EMPTY // NO DATA ON TAPE
				</div>
				<div
					class="w-full border border-dashed border-line px-4 py-6 font-mono text-xxs tracking-widest text-dim uppercase"
				>
					Load a project into <span class="text-ink">content/projects/&lt;slug&gt;/index.md</span> to
					populate this module.
				</div>
			</div>
		</Panel>
	{:else}
		<div use:rowNav>
			{#each paginatedPosts as post, i (post.path)}
				<PostTile data={post} basePath="/projects" showId={false} bordered={true} project={true} />
				{#if i < paginatedPosts.length - 1}
					<Divider />
				{/if}
			{/each}
		</div>

		<PaginationControls {currentPage} {totalPages} onPageChange={goToPage} />
	{/if}
</main>
