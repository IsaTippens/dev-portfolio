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
	class="hbtn flex-col items-start gap-0 p-3 text-left hover:bg-accent-wash"
	data-stagger
>
	<span class="font-mono text-micro tracking-widest text-dim uppercase">[{prefix}]</span>
	<span class="mt-1 text-base font-bold uppercase">{title}</span>
	<span class="mt-1 font-mono text-tiny font-normal tracking-wide text-dim uppercase">{subtitle}</span>
</a>
