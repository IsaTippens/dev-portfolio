<script lang="ts">
	let { data, basePath = '/blog', showId = true, bordered = false } = $props<{
		data: any;
		basePath?: string;
		showId?: boolean;
		bordered?: boolean;
	}>();
</script>

<!--
Using Tailwind
data will be one single post

Title -> Date (on the right)
Description
-->

<a 
	class="block border border-border bg-card hover:border-accent hover:bg-accent/5 p-4 sm:p-5 transition-all duration-200 group rounded-md shadow-sm mb-3" 
	href={`${basePath}/${data.path}`}
>
	<div class="flex flex-col gap-1.5">
		<div class="flex items-center justify-between font-mono text-tiny">
			<span class="text-accent font-semibold tracking-wider uppercase">
				{new Date(data.meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
			</span>
			{#if showId}
				<span class="text-muted text-[10px] uppercase font-mono">
					ref:{data.path.slice(0, 8)}
				</span>
			{/if}
		</div>

		<h2 class="text-base sm:text-lg font-bold font-mono text-main group-hover:text-accent transition-colors duration-150 leading-snug">
			{data.meta.title}
		</h2>

		{#if data.meta.description}
			<p class="text-xs text-muted leading-relaxed font-sans mt-0.5">
				{data.meta.description}
			</p>
		{/if}
	</div>
</a>
