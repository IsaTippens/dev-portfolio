<script lang="ts">
	let { title, year, children } = $props<{ 
		title: string;
		year: string;
		children?: any;
	}>();
	
	let expanded = $state(false);
	let hasContent = $derived(!!children);
</script>
<div class="border border-border mb-2 bg-card rounded-none overflow-hidden transition-all duration-300">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div 
		class="w-full text-left p-3 flex justify-between items-center transition-colors {hasContent ? 'hover:bg-neutral-100 dark:hover:bg-neutral-900/30 cursor-pointer' : ''} {expanded && hasContent ? 'border-b border-border bg-neutral-100 dark:bg-neutral-900/30' : ''}"
		onclick={() => { if (hasContent) expanded = !expanded; }}
		onkeydown={(e) => { if (hasContent && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); expanded = !expanded; } }}
		role={hasContent ? "button" : "presentation"}
		tabindex={hasContent ? 0 : -1}
	>
		<div class="flex items-center gap-3">
			<span class="text-micro font-mono text-accent uppercase tracking-widest w-10 shrink-0">
				[{year}]
			</span>
			<span class="text-sm font-bold uppercase tracking-tight text-main">{title}</span>
		</div>
		<div class="flex items-center gap-2">
			{#if hasContent}
				<span class="text-nano font-mono uppercase text-muted tracking-widest">
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
		<div class="p-4 bg-background">
			{@render children()}
		</div>
	{/if}
</div>