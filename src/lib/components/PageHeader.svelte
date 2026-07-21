<script lang="ts">
	let { pathName, title, stats } = $props<{
		pathName: string;
		title: string;
		stats: string;
	}>();
</script>

<div class="border-b border-border pb-4 mb-6 flex justify-between items-end">
	<div>
		<div class="text-xs font-mono text-accent font-medium tracking-wide flex items-center gap-1">
			<a href="/" class="hover:underline text-muted">~/home</a>
			<span class="text-muted">/</span>
			<span>{pathName.toLowerCase()}</span>
		</div>
		<h1 class="text-2xl sm:text-3xl font-extrabold uppercase font-mono tracking-tight text-main mt-1">
			{title}
		</h1>
	</div>
	{#if stats}
		<div class="text-tiny font-mono text-muted uppercase tracking-wider px-2 py-1 rounded bg-card border border-border">
			{stats}
		</div>
	{/if}
</div>