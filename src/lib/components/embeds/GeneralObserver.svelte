<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	let { threshold = 0.5, disable_observer = false, children } = $props<{
		threshold?: number;
		disable_observer?: boolean;
		children?: import('svelte').Snippet;
	}>();

	// svelte-ignore state_referenced_locally
	let loaded = $state(disable_observer)
	let root: HTMLElement

	const hasIntersectionObserver =
		typeof IntersectionObserver !== 'undefined'
	// svelte-ignore state_referenced_locally
	let observer: IntersectionObserver | null =
		hasIntersectionObserver && !disable_observer
			? new IntersectionObserver(
					entries => {
						entries.forEach(entry => {
							if (entry.intersectionRatio >= threshold) {
								loaded = true
								observer!.disconnect()
							}
						})
					},
					{
						rootMargin: '0px',
						threshold,
					}
			  )
			: null

	onMount(() => {
		if (observer) {
			observer.observe(root)
		}
	})

	onDestroy(() => {
		if (observer) {
			observer.disconnect()
		}
	})
</script>

<div bind:this={root} data-testid="general-observer">
	{#if disable_observer}
		<div transition:fade>
			{@render children?.()}
		</div>
	{:else if loaded}
		<div transition:fade>
			{@render children?.()}
		</div>
	{/if}
</div>