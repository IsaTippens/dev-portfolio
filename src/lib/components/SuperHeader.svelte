<script lang="ts">
    let { href = null, heading = "", children } = $props<{ href?: string | null; heading?: string; children?: import('svelte').Snippet; }>();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="gradient-card-bg p-4 max-h-min" onclick={href ? () => window.location.href = href : undefined} role="button" tabindex="0">
    <div class="text-3xl">{heading}</div>
	{@render children?.()}
</div>
