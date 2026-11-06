<script lang="ts">
	/**
	 * Social interfaces: direct links to external profiles with their brand marks.
	 */
	const PORTS = [
		{
			abbr: 'GH',
			name: 'GitHub',
			href: 'https://www.github.com/IsaTippens',
			external: true
		},
		{
			abbr: 'IG',
			name: 'Instagram',
			href: 'https://www.instagram.com/issssaaaaaaaaaaaaaahhhhhhhhhhh/',
			external: true
		},
		{
			abbr: 'YT',
			name: 'YouTube',
			href: 'https://www.youtube.com/@issaaahhhh',
			external: true
		},
		{
			abbr: 'X',
			name: 'X',
			href: 'https://x.com/issssaaaaaaaaah',
			external: true
		},
		{
			abbr: 'ML',
			name: 'Mail',
			href: 'mailto:isatippens2@gmail.com',
			external: false
		}
	] as const;
</script>

<div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
	{#each PORTS as port (port.name)}
		<a
			href={port.href}
			target={port.external ? '_blank' : undefined}
			rel={port.external ? 'noopener noreferrer' : undefined}
			class="hbtn group flex min-h-[52px] items-center justify-center gap-2.5 p-3 text-center hover:bg-accent-wash last:col-span-2 sm:last:col-span-1"
		>
			{#if port.abbr === 'GH'}
				<svg
					viewBox="0 0 32 32"
					class="h-4 w-4 shrink-0 text-ink transition-colors group-hover:text-accent"
					aria-hidden="true"
				>
					<path
						fill="currentColor"
						fill-rule="evenodd"
						d="M16 2a14 14 0 0 0-4.43 27.28c.7.13 1-.3 1-.67v-2.38c-3.89.84-4.71-1.88-4.71-1.88a3.7 3.7 0 0 0-1.62-2.05c-1.27-.86.1-.85.1-.85a2.94 2.94 0 0 1 2.14 1.45a3 3 0 0 0 4.08 1.16a2.93 2.93 0 0 1 .88-1.87c-3.1-.36-6.37-1.56-6.37-6.92a5.4 5.4 0 0 1 1.44-3.76a5 5 0 0 1 .14-3.7s1.17-.38 3.85 1.43a13.3 13.3 0 0 1 7 0c2.67-1.81 3.84-1.43 3.84-1.43a5 5 0 0 1 .14 3.7a5.4 5.4 0 0 1 1.44 3.76c0 5.38-3.27 6.56-6.39 6.91a3.33 3.33 0 0 1 .95 2.59v3.84c0 .46.25.81 1 .67A14 14 0 0 0 16 2"
					/>
				</svg>
			{:else if port.abbr === 'IG'}
				<svg
					viewBox="0 0 32 32"
					class="h-4 w-4 shrink-0 text-ink transition-colors group-hover:text-accent"
					aria-hidden="true"
				>
					<circle cx="22.406" cy="9.594" r="1.44" fill="currentColor" />
					<path
						fill="currentColor"
						d="M16 9.838A6.162 6.162 0 1 0 22.162 16A6.16 6.16 0 0 0 16 9.838M16 20a4 4 0 1 1 4-4a4 4 0 0 1-4 4"
					/>
					<path
						fill="currentColor"
						d="M16 6.162c3.204 0 3.584.012 4.849.07a6.6 6.6 0 0 1 2.228.413a3.98 3.98 0 0 1 2.278 2.278a6.6 6.6 0 0 1 .413 2.228c.058 1.265.07 1.645.07 4.85s-.012 3.583-.07 4.848a6.6 6.6 0 0 1-.413 2.228a3.98 3.98 0 0 1-2.278 2.278a6.6 6.6 0 0 1-2.228.413c-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07a6.6 6.6 0 0 1-2.228-.413a3.98 3.98 0 0 1-2.278-2.278a6.6 6.6 0 0 1-.413-2.228c-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849a6.6 6.6 0 0 1 .413-2.228a3.98 3.98 0 0 1 2.278-2.278a6.6 6.6 0 0 1 2.228-.413c1.265-.058 1.645-.07 4.849-.07M16 4c-3.259 0-3.668.014-4.948.072a8.8 8.8 0 0 0-2.912.558a6.14 6.14 0 0 0-3.51 3.51a8.8 8.8 0 0 0-.558 2.913C4.014 12.333 4 12.74 4 16s.014 3.668.072 4.948a8.8 8.8 0 0 0 .558 2.912a6.14 6.14 0 0 0 3.51 3.51a8.8 8.8 0 0 0 2.913.558c1.28.058 1.688.072 4.947.072s3.668-.014 4.948-.072a8.8 8.8 0 0 0 2.913-.558a6.14 6.14 0 0 0 3.51-3.51a8.8 8.8 0 0 0 .557-2.913C27.986 19.667 28 19.26 28 16s-.014-3.668-.072-4.948a8.8 8.8 0 0 0-.558-2.912a6.14 6.14 0 0 0-3.51-3.51a8.8 8.8 0 0 0-2.913-.557C19.667 4.013 19.26 4 16 4"
					/>
				</svg>
			{:else if port.abbr === 'YT'}
				<svg
					viewBox="0 0 32 32"
					class="h-4 w-4 shrink-0 text-ink transition-colors group-hover:text-accent"
					aria-hidden="true"
				>
					<path
						fill="currentColor"
						d="M29.41 9.26a3.5 3.5 0 0 0-2.47-2.47C24.76 6.2 16 6.2 16 6.2s-8.76 0-10.94.59a3.5 3.5 0 0 0-2.47 2.47A36 36 0 0 0 2 16a36 36 0 0 0 .59 6.74a3.5 3.5 0 0 0 2.47 2.47c2.18.59 10.94.59 10.94.59s8.76 0 10.94-.59a3.5 3.5 0 0 0 2.47-2.47A36 36 0 0 0 30 16a36 36 0 0 0-.59-6.74M13.2 20.2v-8.4l7.27 4.2Z"
					/>
				</svg>
			{:else if port.abbr === 'X'}
				<svg
					viewBox="0 0 32 32"
					class="h-4 w-4 shrink-0 text-ink transition-colors group-hover:text-accent"
					aria-hidden="true"
				>
					<path
						fill="currentColor"
						d="M18.234 14.162L26.977 4h-2.072l-7.591 8.824L11.25 4H4.258l9.169 13.343L4.258 28H6.33l8.016-9.318L20.75 28h6.993zm-2.837 3.299l-.93-1.329L7.078 5.56h3.182l5.964 8.532l.93 1.329l7.753 11.09h-3.182z"
					/>
				</svg>
			{:else if port.abbr === 'ML'}
				<svg
					viewBox="0 0 32 32"
					class="h-4 w-4 shrink-0 text-ink transition-colors group-hover:text-accent"
					aria-hidden="true"
				>
					<path
						fill="currentColor"
						d="M28 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m-2.2 2L16 14.78L6.2 8ZM4 24V8.91l11.43 7.91a1 1 0 0 0 1.14 0L28 8.91V24Z"
					/>
				</svg>
			{/if}
			<span class="text-sm font-bold tracking-tight text-ink uppercase group-hover:text-accent">
				{port.name}
			</span>
		</a>
	{/each}
</div>
