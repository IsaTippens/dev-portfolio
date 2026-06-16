<script lang="ts">
	let { id, title, description } = $props<{
		id: string;
		title: string;
		description: string;
	}>();
</script>

<div class="border border-border p-4 relative bg-transparent">
	<div class="section-label left-4 text-tiny text-muted">
		{id}
	</div>
	<div class="text-xs leading-relaxed mt-1">
		<span class="font-bold text-main uppercase">{title}</span> {@html description}
	</div>
</div>