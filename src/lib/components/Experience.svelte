<script lang="ts">
	import Panel from '#lib/components/Panel.svelte';
	import QuantumToken from '#lib/components/QuantumToken.svelte';

	/**
	 * Experience record. Three bolted-down modules, each seating as it comes up the page.
	 */
	const ENTRIES = [
		{
			tag: '01 / CHIEF_TECH_OFFICER',
			lead: 'Alphacrest',
			body: 'Directing technical strategy and execution, managing scalable AWS cloud infrastructure, developing and optimizing low-latency algorithmic trading systems, and engineering critical internal developer tooling.'
		},
		{
			tag: '02 / MSC_CS_CANDIDATE',
			lead: 'Thesis',
			body: '"A framework for secure financial transactions using relativistic quantum tokens", combining quantum computing and software engineering to develop next-generation secure transaction protocols. Currently in the final year of an MSc in Computer Science at the University of the Western Cape.',
			href: '/projects/relativistic-quantum-tokens',
			linkLabel: 'PROJECT_SPEC // RELATIVISTIC QUANTUM TOKENS',
			// The thesis subject, as a working part: see QuantumToken.
			token: true
		},
		{
			tag: '03 / CYBERSECURITY_UWC',
			lead: 'Mentorship',
			body: 'Currently mentoring cybersecurity teams at UWC (2024, 2026). Represented UWC as a SANReN finalist in 2023, and secured 1st place in 2025.'
		}
	];
</script>

<div class="mt-2 grid gap-6">
	{#each ENTRIES as entry (entry.tag)}
		<Panel tag={entry.tag} tag_side="left" class="p-4 pb-5">
			<p class="mt-1 text-[13px] leading-relaxed text-ink">
				<span class="font-bold uppercase">{entry.lead}</span>: {entry.body}
			</p>
			{#if entry.token}
				<QuantumToken />
			{/if}
			{#if entry.href}
				<div class="mt-2.5 flex justify-end">
					<a
						href={entry.href}
						class="font-mono text-xxs font-bold tracking-wider text-dim uppercase underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
					>
						[{entry.linkLabel} &rarr;]
					</a>
				</div>
			{/if}
		</Panel>
	{/each}
</div>
