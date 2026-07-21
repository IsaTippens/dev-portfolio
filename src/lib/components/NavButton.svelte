<script lang="ts">
	let { href, target, prefix, title, subtitle } = $props<{
		href: string;
		target?: string;
		prefix: string;
		title: string;
		subtitle: string;
	}>();
</script>

<a 
	{href} 
	{target}
	class="flex flex-col border border-border bg-card hover:border-accent hover:bg-accent/5 transition-all p-4 rounded-md shadow-sm group"
>
	<div class="flex items-center justify-between">
		<span class="text-tiny font-mono text-accent font-semibold tracking-wider">[{prefix}]</span>
		<span class="text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all font-mono text-sm">→</span>
	</div>
	<span class="text-base font-bold font-mono text-main mt-2 group-hover:text-accent transition-colors">{title}</span>
	<span class="text-xs text-muted mt-1 font-sans">{subtitle}</span>
</a>