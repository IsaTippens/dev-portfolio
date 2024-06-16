<script context="module">
	import { Tile, UnorderedList, ListItem, AspectRatio } from 'carbon-components-svelte';
</script>

<script>
	export let title;
</script>

<AspectRatio ratio={'9x16'} class="max-h-36">
	<Tile class="flex flex-col" style="height: 100%">
		<p class="text-xl flex-1">{title}</p>
		<div class="flex-2">
			<slot />
		</div>
	</Tile>
</AspectRatio>
