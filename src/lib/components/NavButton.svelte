<script lang="ts">
	let { href, target, prefix, title, subtitle }: {
		href: string;
		target?: string;
		prefix: string;
		title: string;
		subtitle: string;
	} = $props();
</script>

<a
	{href}
	{target}
	class="hbtn min-h-[72px] flex-col items-start justify-between gap-1 p-3 text-left hover:bg-accent-wash"
>
	<span class="font-mono text-xxs font-normal tracking-widest text-dim uppercase">[{prefix}]</span>
	<span class="text-base font-bold tracking-tight text-ink uppercase">{title}</span>
	<span class="font-mono text-xxs font-normal tracking-wide text-dim uppercase">{subtitle}</span>
</a>
