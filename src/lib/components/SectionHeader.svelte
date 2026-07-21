<script lang="ts">
	import RightArrow from 'virtual:icons/mingcute/right-fill.svelte';
	let { title, href, linkText = 'View all' } = $props<{
		title: string;
		href?: string;
		linkText?: string;
	}>();
</script>

{#if href}
	<a {href} class="flex items-center justify-between border-b border-border pb-3 my-6 group">
		<div class="flex items-center gap-2">
			<span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
			<h2 class="text-xl font-bold font-mono uppercase tracking-tight text-main group-hover:text-accent transition-colors">{title}</h2>
		</div>
		<div class="flex items-center gap-1.5 text-xs font-mono text-muted group-hover:text-accent transition-colors">
			<span>{linkText}</span>
			<RightArrow class="w-4 h-4 text-accent transition-transform group-hover:translate-x-0.5" />
		</div>
	</a>
{:else}
	<div class="flex items-center gap-2 border-b border-border pb-3 my-6">
		<span class="w-2 h-2 rounded-full bg-accent"></span>
		<h2 class="text-xl font-bold font-mono uppercase tracking-tight text-main">{title}</h2>
	</div>
{/if}