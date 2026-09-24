<script lang="ts">
	import type { Snippet } from 'svelte';
	import Panel from '$lib/components/Panel.svelte';

	/**
	 * One entry on the gear page. Given a device drawing as `children`, the entry is a
	 * hardware module: the drawing sits in a sunk well on the drafting dots and the spec
	 * sheet folds away behind a disclosure, closed until asked for. Without one it is the
	 * run-in paragraph the software list uses.
	 */
	let {
		id,
		title,
		description,
		children
	}: {
		id: string;
		title: string;
		description: string;
		children?: Snippet;
	} = $props();
</script>

<Panel tag={id} tag_side="left" class="p-4 pb-5">
	{#if children}
		<figure class="relative mt-1 h-60 overflow-hidden border border-line bg-sunk p-3 sm:h-72">
			<div
				class="dot-grid pointer-events-none absolute inset-0 opacity-40"
				aria-hidden="true"
			></div>
			{@render children()}
		</figure>
		<details class="group mt-3">
			<summary
				class="flex cursor-pointer list-none items-center justify-between gap-3 text-xs text-ink select-none hover:text-accent [&::-webkit-details-marker]:hidden"
			>
				<span class="font-bold uppercase">{title}</span>
				<span
					class="font-mono text-tiny tracking-widest text-dim uppercase group-open:text-accent"
					aria-hidden="true"
				>
					<span class="group-open:hidden">[+] SPECS</span>
					<span class="hidden group-open:inline">[-] SPECS</span>
				</span>
			</summary>
			<div class="spec mt-2 text-xs leading-relaxed text-ink">{@html description}</div>
		</details>
	{:else}
		<div class="mt-1 text-xs leading-relaxed text-ink">
			<span class="font-bold uppercase">{title}</span>
			{@html description}
		</div>
	{/if}
</Panel>

<style>
	/* The spec sheet strikes up like a display: on, one flicker, settled (app.css `crt-on`). */
	details[open] .spec {
		animation: crt-on 130ms steps(3, end) both;
	}
</style>
