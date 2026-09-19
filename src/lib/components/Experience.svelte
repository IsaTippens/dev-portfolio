<script lang="ts">
	import Panel from '$lib/components/Panel.svelte';

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
			body: '"A framework for secure financial transactions using relativistic quantum tokens", combining quantum computing and software engineering to develop next-generation secure transaction protocols. Currently in the final year of an MSc in Computer Science at the University of the Western Cape.'
		},
		{
			tag: '03 / CYBERSECURITY_UWC',
			lead: 'Mentorship',
			body: 'Currently mentoring cybersecurity teams at UWC (2024, 2026). Represented UWC as a SANReN finalist in 2023, and secured 1st place in 2025.'
		}
	];
</script>

<div class="grid gap-6">
	{#each ENTRIES as entry (entry.tag)}
		<Panel tag={entry.tag} tag_side="left" class="p-4 pb-5">
			<p class="mt-1 text-[13px] leading-relaxed text-ink">
				<span class="font-bold uppercase">{entry.lead}</span>: {entry.body}
			</p>
		</Panel>
	{/each}
</div>
