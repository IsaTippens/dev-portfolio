<script lang="ts">
	import RightArrow from 'virtual:icons/mingcute/right-fill.svelte';
	let { title, href, linkText = 'View all' } = $props<{
		title: string;
		href?: string;
		linkText?: string;
	}>();
</script>

{#if href}
	<a {href} class="block border-t border-b border-border py-3 my-4 group hover:border-accent transition-colors">
		<div class="flex justify-between items-center">
			<div class="flex items-center gap-2">
				<span class="inline-block w-2 h-2 bg-accent"></span>
				<p class="text-xl font-bold uppercase tracking-tight text-main group-hover:text-accent transition-colors">{title}</p>
			</div>
			<div class="flex items-center gap-1 text-xxs font-mono text-neutral-400 dark:text-neutral-500 uppercase">
				<span>{linkText}</span>
				<RightArrow class="w-4 h-4 text-accent" />
			</div>
		</div>
	</a>
{:else}
	<div class="block border-t border-b border-border py-3 my-4">
		<div class="flex items-center gap-2">
			<span class="inline-block w-2 h-2 bg-accent"></span>
			<p class="text-xl font-bold uppercase tracking-tight text-main">{title}</p>
		</div>
	</div>
{/if}