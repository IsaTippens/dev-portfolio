<script lang="ts">
	let { currentPage, totalPages, onPageChange } = $props<{
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	}>();
</script>

{#if totalPages > 1}
	<div class="flex justify-between items-center mt-6 py-4 border-t border-border text-xs font-mono">
		<button
			onclick={() => onPageChange(currentPage - 1)}
			disabled={currentPage === 1}
			class="btn-primary"
		>
			[PREV]
		</button>
		<span class="text-muted uppercase tracking-widest text-tiny">
			PAGE: {currentPage} // {totalPages}
		</span>
		<button
			onclick={() => onPageChange(currentPage + 1)}
			disabled={currentPage === totalPages}
			class="btn-primary"
		>
			[NEXT]
		</button>
	</div>
{/if}