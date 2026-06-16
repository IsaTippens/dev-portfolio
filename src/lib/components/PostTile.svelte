<script>
	let { data } = $props();
</script>

<!--
Using Tailwind
data will be one single post

Title -> Date (on the right)
Description
-->

<a 
	class="block border border-transparent hover:border-border p-4 transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-900/30 group relative rounded-none" 
	href={`/blog/${data.path}`}
>
	<!-- Tiny technical prefix -->
	<div class="absolute top-2 right-4 text-micro font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
		[ID: {data.path.slice(0, 8)}]
	</div>

	<div class="flex flex-col gap-1">
		<span class="text-tiny font-mono uppercase tracking-widest text-accent">
			{new Date(data.meta.date).toDateString()}
		</span>
		<h2 class="text-lg font-bold text-main group-hover:text-accent transition-colors duration-150 uppercase tracking-tight">
			{data.meta.title}
		</h2>
		<p class="text-xs text-muted mt-1 leading-relaxed">
			{data.meta.description}
		</p>
	</div>
</a>
