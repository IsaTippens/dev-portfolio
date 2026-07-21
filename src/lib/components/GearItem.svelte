<script lang="ts">
	let { id, title, description } = $props<{
		id: string;
		title: string;
		description: string;
	}>();
</script>

<div class="border border-border bg-card rounded-md p-4 relative shadow-sm hover:border-accent/50 transition-all">
	<div class="flex items-center justify-between border-b border-border pb-2 mb-2">
		<span class="text-tiny font-mono text-accent font-semibold uppercase">[{id}]</span>
		<span class="text-xs font-bold font-mono text-main uppercase">{title}</span>
	</div>
	<div class="text-xs text-muted leading-relaxed font-sans">
		{@html description}
	</div>
</div>