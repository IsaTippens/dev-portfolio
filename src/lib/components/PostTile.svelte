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
	class="block border border-transparent hover:border-black dark:hover:border-neutral-700 p-4 transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-900/30 group relative rounded-none" 
	href={`/blog/${data.path}`}
>
	<!-- Tiny technical prefix -->
	<div class="absolute top-2 right-4 text-[8px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
		[ID: {data.path.slice(0, 8)}]
	</div>

	<div class="flex flex-col gap-1">
		<span class="text-[9px] font-mono uppercase tracking-widest text-[#ff4500]">
			{new Date(data.meta.date).toDateString()}
		</span>
		<h2 class="text-lg font-bold text-black dark:text-white group-hover:text-[#ff4500] transition-colors duration-150 uppercase tracking-tight">
			{data.meta.title}
		</h2>
		<p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
			{data.meta.description}
		</p>
	</div>
</a>
