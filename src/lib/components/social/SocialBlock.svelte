<script lang="ts">
	import type { SvelteComponentTyped } from "svelte";

	export let url: string = '';
	export let text: string = '';
	export let user: string = '';

	export let icon: any;
	export let pic: any;

    export let ref;
	function handleClick() {
		window.open(url, '_blank');
	}
</script>

<!--
    Clicking the div block will take you to the url
    icon - content - pic
-->

<div class="flex flex-row p-2 space-x-2" on:click={handleClick}>
	{#if icon}
		<div class="flex flex-col justify-center"><img class="h-6 w-6 inline" src={`/images/logo/${icon}.png`}></div>
	{/if}
	<div class="flex-1 grow overflow-auto">
            <p class="truncate text-white drop-shadow-md">{text}</p>
            <p class="truncate text-white drop-shadow-md">{user}</p>
	</div>
</div>
