<script lang="ts">
	let { currentPage, totalPages, onPageChange } = $props<{
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	}>();
</script>

{#if totalPages > 1}
	<div class="mt-6 flex items-center justify-between border-t border-line py-4 font-mono text-xs">
		<button
			class="hbtn px-3 py-1 text-xxs"
			onclick={() => onPageChange(currentPage - 1)}
			disabled={currentPage === 1}
		>
			[PREV]
		</button>
		<span class="font-mono text-tiny tracking-widest text-dim uppercase">
			PAGE: {currentPage} // {totalPages}
		</span>
		<button
			class="hbtn px-3 py-1 text-xxs"
			onclick={() => onPageChange(currentPage + 1)}
			disabled={currentPage === totalPages}
		>
			[NEXT]
		</button>
	</div>
{/if}
