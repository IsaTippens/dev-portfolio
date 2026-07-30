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
	<div class="flex items-start gap-3">
		<!-- Orange Warning Symbol (Top Left) -->
		<div class="mt-0.5 text-amber-500 dark:text-amber-400 shrink-0" aria-hidden="true">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-5 h-5"
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

		<div class="flex-1 min-w-0">
			{#if title}
				<div
					class="font-mono text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-1"
				>
					[{title}]
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
	</div>
</div>
