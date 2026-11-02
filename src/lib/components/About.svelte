<script lang="ts">
	import ProfilePhoto from '#lib/components/ProfilePhoto.svelte';
	import Cartography from '#lib/components/Cartography.svelte';
	import Panel from '#lib/components/Panel.svelte';

	/**
	 * The hero row: identity, survey plate and the portrait engine — the device's
	 * front panel.
	 */

	/**
	 * Whole years from a UTC date to `now` on the UTC calendar: an anniversary not yet
	 * reached this year does not count. The page is prerendered: this runs at build
	 * time for the HTML and again in the browser on hydration, which rewrites the text
	 * when the build is older than the last anniversary.
	 */
	function yearsSince(iso: string, now: Date) {
		const then = new Date(iso);
		const years = now.getUTCFullYear() - then.getUTCFullYear();
		const before =
			now.getUTCMonth() < then.getUTCMonth() ||
			(now.getUTCMonth() === then.getUTCMonth() && now.getUTCDate() < then.getUTCDate());
		return before ? years - 1 : years;
	}

	const now = new Date();
	const FIELDS = [
		{ label: 'LOCATION', value: 'Cape Town, South Africa' },
		{
			label: 'STATUS',
			value: `${yearsSince('2001-06-01', now)} y/o programmer (${yearsSince('2014-06-01', now)} yrs code)`
		},
		{ label: 'EXPERIENCE', value: `software engineer for ${yearsSince('2021-06-01', now)} years` },
		{ label: 'ROLE', value: 'CTO @ Alphacrest · MSc CS @ UWC' },
		{ label: 'FOCUS', value: 'low-latency trading, cloud infra & quantum crypto' }
	];
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-6 md:flex-row md:items-stretch">
		<Panel tag="BIO_DATA" class="flex flex-1 flex-col justify-center p-4 pb-5" data-boot="2">
			<dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 font-mono text-xs leading-relaxed">
				{#each FIELDS as field (field.label)}
					<dt class="text-dim">{field.label}:</dt>
					<dd class="text-ink">{field.value}</dd>
				{/each}
			</dl>
		</Panel>

		<!-- Portrait engine -->
		<div
			class="mx-auto flex w-full max-w-[220px] shrink-0 items-stretch justify-center md:w-52 md:max-w-none"
		>
			<ProfilePhoto />
		</div>
	</div>

	<div class="w-full">
		<Cartography />
	</div>
</div>
