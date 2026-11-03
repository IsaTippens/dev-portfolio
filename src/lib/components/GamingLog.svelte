<script lang="ts">
	import Panel from '#lib/components/Panel.svelte';

	/**
	 * Active gaming log. Static read-only telemetry: no row hover highlight (rows are not
	 * links) and fixed desktop/mobile geometry so neither titles nor status strings wrap
	 * into uneven orphans.
	 */
	const ROWS = [
		{
			game: 'Valorant',
			stat: 'PEAK PLATINUM 3 // COMPETITIVE',
			client: 'PC · RIOT'
		},
		{
			game: 'Geometry Dash',
			stat: '12 DEMONS COMPLETED',
			client: 'PC · STEAM'
		},
		{
			game: 'Fortnite',
			stat: 'ZERO BUILD MODE',
			client: 'PC · EPIC'
		},
		{
			game: "No Man's Sky",
			stat: 'EXPLORATION // SANDBOX',
			client: 'PC · STEAM'
		},
		{
			game: 'Into the Dead: ODD',
			stat: 'SURVIVAL // EXTRACTION',
			client: 'PC · STEAM'
		}
	] as const;
</script>

<Panel>
	<div
		class="hidden border-b border-line bg-sunk px-3.5 py-2 font-mono text-xxs font-bold tracking-wider text-ink uppercase sm:grid sm:grid-cols-[1.15fr_1.35fr_6.5rem] sm:items-center sm:gap-4"
		aria-hidden="true"
	>
		<span>Game Title</span>
		<span>Telemetry / Mode</span>
		<span class="text-right">Platform</span>
	</div>

	<div class="divide-y divide-line font-mono text-xs" role="list">
		{#each ROWS as row (row.game)}
			<div
				role="listitem"
				class="flex flex-col gap-1 px-3.5 py-2.5 sm:grid sm:grid-cols-[1.15fr_1.35fr_6.5rem] sm:items-center sm:gap-4"
			>
				<div class="flex items-baseline justify-between gap-2">
					<span class="font-bold text-ink uppercase">{row.game}</span>
					<span class="text-xxs tracking-wider text-dim uppercase sm:hidden">
						[{row.client}]
					</span>
				</div>

				<span class="text-xxs tracking-wide text-dim uppercase sm:text-xs">
					{row.stat}
				</span>

				<span class="hidden text-right text-xxs tracking-wider text-dim uppercase sm:block">
					{row.client}
				</span>
			</div>
		{/each}
	</div>
</Panel>
