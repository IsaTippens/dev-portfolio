<script lang="ts">
	import GamingLog from '#lib/components/GamingLog.svelte';
	import Meta from '#lib/components/Meta.svelte';
	import PageHeader from '#lib/components/PageHeader.svelte';
</script>

<Meta
	title="Active Gaming Log"
	description="Active gaming telemetry and platforms"
	path="/gaming"
/>

<PageHeader pathName="GAMING" title="ACTIVE GAMING LOG" stats="TELEMETRY" />

<main>
	<GamingLog />
</main>
