<script lang="ts">
	import Panel from '$lib/components/Panel.svelte';

	let { id, title, description } = $props<{
		id: string;
		title: string;
		description: string;
	}>();
</script>

<Panel tag={id} tag_side="left" draw={true} seat={true} class="p-4 pb-5">
	<div class="mt-1 text-xs leading-relaxed text-ink" data-stagger>
		<span class="font-bold uppercase">{title}</span> {@html description}
	</div>
</Panel>
