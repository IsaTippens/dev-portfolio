<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * Module chassis. One radius, one stroke, one corner treatment for the whole site —
	 * the PO-100 and TE-S10 set the standard and this is how everything else meets it.
	 *
	 * `tag`     module ID, sits on the top edge (`[BIO_DATA]`, `[CARTOGRAPHY_CPT]`, …)
	 * `draw`    frame is stroked on when the module seats (SVG rect, CSS border takes over)
	 * `seat`    module takes part in the scroll-assembly pass
	 * `screws`  corner screws, for panels that are meant to be bolted down
	 * `sunk`    recessed surface (a well), rather than a raised panel
	 */
	let {
		tag = '',
		tag_tone = 'dim',
		tag_side = 'right',
		screws = false,
		draw = false,
		seat = false,
		sunk = false,
		class: klass = '',
		children,
		...rest
	}: {
		tag?: string;
		tag_tone?: 'dim' | 'accent';
		tag_side?: 'left' | 'right';
		screws?: boolean;
		draw?: boolean;
		seat?: boolean;
		sunk?: boolean;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	const SCREW_ANGLE = [45, -30, 60, 15];
</script>

<div
	class="panel {sunk ? 'bg-sunk' : ''} {klass}"
	data-draw={draw ? '' : undefined}
	data-seat={seat ? '' : undefined}
	{...rest}
>
	<svg class="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" data-panel-rect>
		<rect fill="none" stroke="var(--line)" stroke-width="1" pathLength="1" />
	</svg>

	{#if tag}
		<span
			class="section-label {tag_side === 'left' ? 'left-4' : 'right-3'} text-tiny {tag_tone === 'accent'
				? 'text-accent'
				: 'text-dim'}"
		>
			[{tag}]
		</span>
	{/if}

	{#if screws}
		{#each ['top-1.5 left-1.5', 'top-1.5 right-1.5', 'bottom-1.5 left-1.5', 'bottom-1.5 right-1.5'] as pos, i (pos)}
			<span class="pointer-events-none absolute {pos} block h-2 w-2" aria-hidden="true">
				<svg viewBox="0 0 8 8" class="block h-full w-full" style="transform: rotate({SCREW_ANGLE[i]}deg)">
					<circle cx="4" cy="4" r="3.5" fill="var(--panel-sunk)" stroke="var(--line)" stroke-width="1" />
					<line x1="1.5" y1="4" x2="6.5" y2="4" stroke="var(--ink-dim)" stroke-width="1" stroke-linecap="round" />
				</svg>
			</span>
		{/each}
	{/if}

	{@render children?.()}
</div>
