<script lang="ts">
	import RightArrow from 'virtual:icons/mingcute/right-fill.svelte';
	let { title, href, linkText = 'View all' } = $props<{
		title: string;
		href?: string;
		linkText?: string;
	}>();
</script>

{#if href}
	<a
		{href}
		class="group my-4 block border-t border-b border-line py-3 transition-colors"
		data-stagger
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<span class="inline-block h-2 w-2 bg-ink"></span>
				<p class="text-xl font-bold tracking-tight text-ink uppercase group-hover:text-accent">
					{title}
				</p>
			</div>
			<div class="flex items-center gap-1 font-mono text-xxs text-dim uppercase">
				<span>{linkText}</span>
				<RightArrow class="h-4 w-4 text-accent" />
			</div>
		</div>
	</a>
{:else}
	<div class="my-4 block border-t border-b border-line py-3" data-stagger>
		<div class="flex items-center gap-2">
			<span class="inline-block h-2 w-2 bg-ink"></span>
			<p class="text-xl font-bold tracking-tight text-ink uppercase">{title}</p>
		</div>
	</div>
{/if}
