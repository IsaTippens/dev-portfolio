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

<div
	class="my-6 border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/90 p-4 transition-colors rounded-none"
>
	{#if title}
		<div class="flex items-center gap-2 mb-2 h-4 shrink-0">
			<div class="text-amber-500 dark:text-amber-400 shrink-0 flex items-center justify-center w-4 h-4" aria-hidden="true">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-4 h-4 shrink-0 block"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
					<line x1="12" y1="9" x2="12" y2="13" />
					<line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
			</div>
			<div
				class="font-mono text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 leading-4 h-4 flex items-center shrink-0"
			>
				[{title}]
			</div>
		</div>
	{/if}

	<div class="text-sm font-sans text-main leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
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
