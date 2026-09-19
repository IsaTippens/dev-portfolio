<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title = 'DISCLAIMER',
		text = '',
		children
	} = $props<{
		title?: string;
		text?: string;
		children?: Snippet;
	}>();
</script>

<!-- Amber means "warning" and nothing else. This is the only place it appears. -->
<div class="my-6 border border-warn bg-sunk p-4">
	{#if title}
		<div class="mb-2 flex h-4 shrink-0 items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="block h-4 w-4 shrink-0 text-warn"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
				<line x1="12" y1="9" x2="12" y2="13" />
				<line x1="12" y1="17" x2="12.01" y2="17" />
			</svg>
			<div
				class="flex h-4 shrink-0 items-center font-mono text-xs leading-4 font-bold tracking-widest text-warn uppercase"
			>
				[{title}]
			</div>
		</div>
	{/if}

	<div class="font-sans text-sm leading-relaxed text-ink [&>p:last-child]:mb-0 [&>p]:mb-2">
		{#if children}
			{@render children()}
		{:else if text}
			<p>{text}</p>
		{:else}
			<p>
				The views and opinions expressed in this post are solely those of the author and do not
				necessarily reflect the official policy or position of any other agency, organization,
				employer, or company.
			</p>
		{/if}
	</div>
</div>
