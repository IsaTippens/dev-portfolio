<script lang="ts">
	import X from 'virtual:icons/carbon/logo-x.svelte';
	import YouTube from 'virtual:icons/carbon/logo-youtube.svelte';
	import Github from 'virtual:icons/carbon/logo-github.svelte';
	import Instagram from 'virtual:icons/carbon/logo-instagram.svelte';
	import Mail from 'virtual:icons/carbon/email.svelte';

	const socialLinks = [
		{
			name: 'GitHub',
			handle: '@IsaTippens',
			url: 'https://www.github.com/IsaTippens',
			icon: Github,
			tag: 'SOURCE_CODE'
		},
		{
			name: 'X (Twitter)',
			handle: '@issssaaaaaaaaah',
			url: 'https://x.com/issssaaaaaaaaah',
			icon: X,
			tag: 'THOUGHTS'
		},
		{
			name: 'Instagram',
			handle: '@issssaaaaaaaaaaaaaahhhhhhhhhhh',
			url: 'https://www.instagram.com/issssaaaaaaaaaaaaaahhhhhhhhhhh/',
			icon: Instagram,
			tag: 'MEDIA'
		},
		{
			name: 'YouTube',
			handle: '@issaaahhhh',
			url: 'https://www.youtube.com/@issaaahhhh',
			icon: YouTube,
			tag: 'VIDEOS'
		},
		{
			name: 'Email',
			handle: 'isatippens2@gmail.com',
			url: 'mailto:isatippens2@gmail.com',
			icon: Mail,
			tag: 'DIRECT_CONTACT'
		}
	];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
	{#each socialLinks as item}
		<a
			href={item.url}
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center justify-between p-3.5 border border-border bg-card hover:border-accent hover:bg-accent/5 rounded-md transition-all group shadow-sm"
		>
			<div class="flex items-center gap-3 min-w-0">
				<div class="w-8 h-8 rounded border border-border bg-background flex items-center justify-center shrink-0 group-hover:border-accent group-hover:text-accent transition-colors">
					<item.icon class="w-4 h-4" />
				</div>
				<div class="flex flex-col min-w-0">
					<span class="text-xs font-bold font-mono text-main truncate group-hover:text-accent transition-colors">
						{item.name}
					</span>
					<span class="text-tiny font-mono text-muted truncate">
						{item.handle}
					</span>
				</div>
			</div>
			<span class="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-xs font-mono ml-2 shrink-0">
				↗
			</span>
		</a>
	{/each}
</div>
