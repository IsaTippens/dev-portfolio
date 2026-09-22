<script lang="ts">
	/**
	 * One row of a list — a post or a project. The full slug is always shown: a readout
	 * that lies about its own ID is worse than a long one.
	 */
	let {
		data,
		basePath = '/blog',
		showId = true,
		bordered = false,
		project = false
	} = $props<{
		data: any;
		basePath?: string;
		showId?: boolean;
		bordered?: boolean;
		project?: boolean;
	}>();

	const meta = $derived(data.meta ?? {});
	const stack = $derived(
		Array.isArray(meta.stack) ? meta.stack : typeof meta.stack === 'string' ? [meta.stack] : []
	);
	const status = $derived(meta.status ?? null);
	const date = $derived(new Date(meta.date));
</script>

<a
	class="group relative block border {bordered
		? 'border-line'
		: 'border-transparent'} p-4 transition-colors duration-150 hover:border-line hover:bg-hover focus-visible:bg-hover"
	href={`${basePath}/${data.path}`}
	data-row
>
	<div class="flex flex-col gap-1">
		<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
			<span class="font-mono text-tiny tracking-widest text-dim uppercase">
				{Number.isNaN(date.getTime()) ? 'UNDATED' : date.toDateString()}
			</span>
			{#if showId}
				<span class="font-mono text-micro tracking-widest text-dim uppercase"
					>[ID: {data.path}]</span
				>
			{/if}
		</div>
		<h2 class="text-lg font-bold tracking-tight text-ink uppercase group-hover:text-accent">
			{meta.title}
		</h2>
		{#if meta.description}
			<p class="mt-1 text-xs leading-relaxed text-dim">
				{meta.description}
			</p>
		{/if}

		{#if project && (stack.length || status || meta.link)}
			<div
				class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-micro tracking-wider uppercase"
			>
				{#if stack.length}
					<span class="text-dim">STACK: <span class="text-ink">{stack.join(' / ')}</span></span>
				{/if}
				{#if status}
					<span class="flex items-center gap-1 text-dim">
						<span class="led" data-on={status === 'ACTIVE' ? 'ok' : 'false'} aria-hidden="true"
						></span>
						STATUS: <span class="text-ink">{status}</span>
					</span>
				{/if}
				{#if meta.link}
					<span class="text-dim">LINK: <span class="text-accent">{meta.link}</span></span>
				{/if}
			</div>
		{/if}
	</div>
</a>
