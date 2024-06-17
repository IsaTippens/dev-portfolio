<script lang="ts">
    export let href: string | undefined | null = null;
    export let heading: string = "";
</script>

<div class="gradient-card-bg p-4 max-h-min" on:click={href ? () => window.location.href = href : undefined}>
    <div class="text-3xl">{heading}</div>
	<slot />
</div>
