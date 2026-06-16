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
	target={target}
	class="flex flex-col border border-border bg-neutral-100 dark:bg-neutral-900/60 hover:border-accent hover:bg-accent/5 transition-all p-3 rounded-none"
>
	<span class="text-micro font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">[{prefix}]</span>
	<span class="text-base font-bold text-main mt-1 uppercase">{title}</span>
	<span class="text-tiny text-muted mt-1 uppercase">{subtitle}</span>
</a>