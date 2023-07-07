<script lang="ts">
	import type { SvelteComponentTyped } from "svelte";

	export let url: string = '';
	export let text: string = '';
	export let user: string = '';

	export let icon: any;
	export let pic: any;

    export let ref;
</script>

<!--
    Clicking the div block will take you to the url
    icon - content - pic
-->

<div class="flex flex-row border p-2">
	<div class=""><svelte:component this={icon} /></div>
	<div class="">
		<div class="grow">
            <p class="truncate text-white drop-shadow-md">{text}</p>
            <p class="truncate text-white drop-shadow-md">{user}</p>
        </div>
	</div>
	<div class=""><svelte:component this={pic} /></div>
</div>
