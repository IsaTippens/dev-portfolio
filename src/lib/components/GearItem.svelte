<script lang="ts">
	import type { Snippet } from 'svelte';

	let { id, title, description, children } = $props<{
		id: string;
		title: string;
		description: string;
		children?: Snippet;
	}>();
</script>

<div class="group border border-border p-4 relative bg-transparent overflow-hidden">
	<div class="section-label left-4 text-tiny text-muted z-10 relative">
		{id}
	</div>
	<div class="text-xs leading-relaxed mt-1 z-10 relative pointer-events-none">
		<span class="font-bold text-main uppercase">{title}</span> {@html description}
	</div>
	{#if children}
		<div class="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 text-muted pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:-translate-x-2">
			{@render children()}
		</div>
	{/if}
</div>