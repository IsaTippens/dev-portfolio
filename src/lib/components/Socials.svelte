<script lang="ts">
	/**
	 * SOCIAL_PORTS — external comms patchbay. Five direct port keys wired into the main
	 * chassis: no nested synth case, no simulated VU meters, and immediate single-tap
	 * activation on touch and keyboard.
	 */
	const PORTS = [
		{
			id: 'P1_GH',
			name: 'GitHub',
			role: 'SRC // CODE',
			href: 'https://www.github.com/IsaTippens',
			external: true
		},
		{
			id: 'P2_IG',
			name: 'Instagram',
			role: 'LNS // PHOTO',
			href: 'https://www.instagram.com/issssaaaaaaaaaaaaaahhhhhhhhhhh/',
			external: true
		},
		{
			id: 'P3_YT',
			name: 'YouTube',
			role: 'VID // MEDIA',
			href: 'https://www.youtube.com/@issaaahhhh',
			external: true
		},
		{
			id: 'P4_X',
			name: 'X',
			role: 'TXT // FEED',
			href: 'https://x.com/issssaaaaaaaaah',
			external: true
		},
		{
			id: 'P5_ML',
			name: 'Mail',
			role: 'MSG // DIRECT',
			href: 'mailto:isatippens2@gmail.com',
			external: false
		}
	];

	let activePort = $state<string | null>(null);
</script>

<div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
	{#each PORTS as port (port.id)}
		<a
			href={port.href}
			target={port.external ? '_blank' : undefined}
			rel={port.external ? 'noopener noreferrer' : undefined}
			class="hbtn min-h-[72px] flex-col items-start justify-between gap-1 p-3 text-left hover:bg-accent-wash last:col-span-2 sm:last:col-span-1"
			onpointerenter={() => (activePort = port.id)}
			onpointerleave={() => {
				if (activePort === port.id) activePort = null;
			}}
			onfocus={() => (activePort = port.id)}
			onblur={() => {
				if (activePort === port.id) activePort = null;
			}}
		>
			<div class="flex w-full items-center justify-between gap-2">
				<span class="font-mono text-xxs font-normal tracking-widest text-dim uppercase">
					[{port.id}]
				</span>
				<span
					class="led shrink-0"
					data-on={activePort === port.id ? 'ok' : 'false'}
					aria-hidden="true"
				></span>
			</div>
			<span class="text-sm font-bold tracking-tight text-ink uppercase">
				{port.name}
			</span>
			<span class="font-mono text-xxs font-normal tracking-wide text-dim uppercase">
				{port.role}
			</span>
		</a>
	{/each}
</div>
