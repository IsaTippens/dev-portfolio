<script lang="ts">
	let { title, year, children } = $props<{ 
		title: string;
		year: string;
		children?: any;
	}>();
	
	let expanded = $state(false);
	let hasContent = $derived(!!children);
</script>
<div class="mb-2 overflow-hidden border border-line bg-panel transition-colors duration-150">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="flex w-full items-center justify-between p-3 text-left transition-colors {hasContent
			? 'cursor-pointer hover:bg-hover'
			: ''} {expanded && hasContent ? 'border-b border-line bg-sunk' : ''}"
		onclick={() => { if (hasContent) expanded = !expanded; }}
		onkeydown={(e) => { if (hasContent && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); expanded = !expanded; } }}
		role={hasContent ? "button" : "presentation"}
		tabindex={hasContent ? 0 : -1}
	>
		<div class="flex items-center gap-3">
			<span class="text-micro font-mono text-accent uppercase tracking-widest w-10 shrink-0">
				[{year}]
			</span>
			<span class="text-sm font-bold uppercase tracking-tight text-ink">{title}</span>
		</div>
		<div class="flex items-center gap-2">
			{#if hasContent}
				<span class="text-nano font-mono uppercase text-dim tracking-widest">
					{expanded ? 'CLOSE' : 'VIEW_DATA'}
				</span>
				<div class="text-accent transition-transform duration-300 {expanded ? 'rotate-90' : ''}">
					<!-- Using a simple SVG arrow to avoid missing imports -->
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</div>
			{/if}
		</div>
	</div>
	{#if expanded && hasContent}
		<div class="bg-sunk p-4">
			{@render children()}
		</div>
	{/if}
</div>