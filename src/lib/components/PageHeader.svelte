<script lang="ts">
	let { pathName, title, stats } = $props<{
		pathName: string;
		title: string;
		stats: string;
	}>();
</script>

<div class="border-b border-border pb-3 mb-4 flex justify-between items-end">
	<div>
		<div class="text-tiny uppercase tracking-widest font-mono text-accent">
			[NAV: <a href="/" class="hover:underline">HOME</a> / {pathName}]
		</div>
		<h1 class="text-2xl font-bold uppercase tracking-tight text-main mt-1">
			{title}
		</h1>
	</div>
	<div class="text-micro font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
		{stats}
	</div>
</div>