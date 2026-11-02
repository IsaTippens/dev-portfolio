<script lang="ts">
	let { title, href, linkText = 'View all' }: {
		title: string;
		href?: string;
		linkText?: string;
	} = $props();
</script>

{#if href}
	<a
		{href}
		class="group my-4 block border-t border-b border-line py-3 transition-colors"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<span class="inline-block h-2 w-2 bg-ink"></span>
				<h2 class="text-xl font-bold tracking-tight text-ink uppercase group-hover:text-accent">
					{title}
				</h2>
			</div>
			<div class="flex items-center gap-1 font-mono text-xxs text-dim uppercase">
				<span>{linkText}</span>
				<svg viewBox="0 0 24 24" width="1.2em" height="1.2em" class="h-4 w-4 text-accent"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M16.06 10.94a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 1 1-2.121-2.122L12.879 12L8.283 7.404a1.5 1.5 0 0 1 2.12-2.122l5.658 5.657Z"/></g></svg>
			</div>
		</div>
	</a>
{:else}
	<div class="my-4 block border-t border-b border-line py-3">
		<div class="flex items-center gap-2">
			<span class="inline-block h-2 w-2 bg-ink"></span>
				<h2 class="text-xl font-bold tracking-tight text-ink uppercase">{title}</h2>
		</div>
	</div>
{/if}
