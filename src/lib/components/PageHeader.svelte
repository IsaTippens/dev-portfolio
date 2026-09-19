<script lang="ts">
	let { pathName, title, stats } = $props<{
		pathName: string;
		title: string;
		stats: string;
	}>();
</script>

<div class="mb-4 flex items-end justify-between border-b border-line pb-3">
	<div>
		<!-- Breadcrumb: the trail is dim, the page you are on is the accent. -->
		<div class="font-mono text-tiny tracking-widest text-dim uppercase">
			[NAV: <a href="/" class="hover:text-accent">HOME</a> /
			<span class="text-accent">{pathName}</span>]
		</div>
		<h1 class="mt-1 text-2xl font-bold tracking-tight text-ink uppercase">
			{title}
		</h1>
	</div>
	<div class="font-mono text-micro tracking-widest text-dim uppercase">
		{stats}
	</div>
</div>
