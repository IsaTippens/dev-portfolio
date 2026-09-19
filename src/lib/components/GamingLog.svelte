<script lang="ts">
	import Panel from '$lib/components/Panel.svelte';

	/**
	 * Active log. Read-only telemetry, so the rows are a table and not a control surface.
	 */
	const ROWS = [
		{ game: 'Valorant', stat: 'PEAK PLATINUM 3', platform: 'PC (RIOT)' },
		{ game: 'Geometry Dash', stat: '12 DEMONS COMPLETED', platform: 'PC (STEAM)' },
		{ game: 'Fortnite', stat: 'ZERO BUILD MODE', platform: 'PC (EPIC)' },
		{ game: "No Man's Sky", stat: 'SINGLE PLAYER', platform: 'PC (STEAM)' },
		{ game: 'Into the Dead: ODD', stat: 'SINGLE PLAYER', platform: 'PC (STEAM)' }
	];

	const HEADINGS = ['Game Title', 'Stats / Mode', 'Platform'];
</script>

<Panel tag="GAMING_LOG" class="overflow-x-auto">
	<table class="w-full border-collapse text-left font-mono text-xs">
		<thead>
			<tr class="border-b border-line bg-sunk">
				{#each HEADINGS as heading, i (heading)}
					<th
						class="p-2 text-xxs font-bold tracking-wider text-ink uppercase {i < HEADINGS.length - 1
							? 'border-r border-line'
							: ''}"
					>
						{heading}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each ROWS as row (row.game)}
				<tr class="border-b border-line last:border-b-0 hover:bg-hover">
					<td class="border-r border-line p-2 font-bold text-ink uppercase">{row.game}</td>
					<td class="border-r border-line p-2 text-dim">{row.stat}</td>
					<td class="p-2 text-dim">{row.platform}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</Panel>
