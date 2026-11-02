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
		{ label: 'VIBE_CHECK', value: `vibe coder for ${now.getUTCFullYear() - 2025} year` }
	];
</script>

<div class="flex flex-col gap-6 md:flex-row">
	<div class="flex flex-1 flex-col gap-6">
		<Panel tag="BIO_DATA" class="p-3 pb-4" data-boot="2">
			<dl class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 font-mono text-[12px] leading-relaxed">
				{#each FIELDS as field (field.label)}
					<dt class="text-dim">{field.label}:</dt>
					<dd class="text-ink">{field.value}</dd>
				{/each}
			</dl>
		</Panel>

		<div class="flex-1">
			<Cartography />
		</div>
	</div>

	<!-- Portrait engine -->
	<div
		class="mx-auto flex w-full max-w-[220px] shrink-0 items-center justify-center md:w-48 md:max-w-none md:self-center"
	>
		<ProfilePhoto />
	</div>
</div>
