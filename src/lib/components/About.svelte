<script lang="ts">
	import ProfilePhoto from '$lib/components/ProfilePhoto.svelte';
	import Cartography from '$lib/components/Cartography.svelte';
	import Panel from '$lib/components/Panel.svelte';

	/**
	 * The hero row: identity, survey plate and the portrait engine.
	 *
	 * This is the device's front panel — it is the module the homepage pins while the
	 * PO-100 walks through its display modes.
	 */
	let { data, scroll_mode = null } = $props<{ data: any; scroll_mode?: any }>();

	const FIELDS = $derived([
		{ label: 'LOCATION', value: 'Cape Town, South Africa' },
		{ label: 'STATUS', value: `${data.age} y/o programmer (${data.devYear} yrs code)` },
		{ label: 'EXPERIENCE', value: `software engineer for ${data.seYear} years` },
		{ label: 'VIBE_CHECK', value: `vibe coder for ${data.vibeYear} year` }
	]);
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

		<div class="hidden md:block">
			<Cartography />
		</div>
	</div>

	<!-- Portrait engine -->
	<div class="mx-auto flex w-full max-w-[220px] shrink-0 items-center justify-center md:w-48 md:max-w-none">
		<ProfilePhoto {scroll_mode} />
	</div>
</div>
