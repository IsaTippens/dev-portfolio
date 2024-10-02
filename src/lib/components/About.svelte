<script context="module">
	import InfoTile from './InfoTile.svelte';
	import { onMount } from 'svelte';
	import PlaceHolder from './PlaceHolder.svelte';
</script>

<script>
	import SuperHeader from './SuperHeader.svelte';

	export let data;

	onMount(() => {});
</script>

<div class="grid gap-4">
	<div class="grid gap-4 bg-base-200 p-4">
		<p class="text-3xl font-semibold">MSc Comp Sci Student</p>
		<div>
			<p>
				Studying at the <a href="https://uwc.ac.za" target="_blank" class="highlight-link"
					>University of the Western Cape</a
				>
			</p>
			<p>
				Combining Quantum Computing and Software Engineering to develop a fully secure token
				transaction protocol
			</p>
		</div>
	</div>

	<div class="grid gap-4 bg-base-200 p-4">
		<p class="text-3xl font-semibold">Software Developer</p>
		<div>
			<p>Developing super-fast crypto trading systems @ Alpha Crest Finance</p>
		</div>
		<div class="stats shadow bg-neutral">
			<div class="stat">
				<div class="stat-title">Duration</div>
				<div class="stat-value">{data.workYear} Years</div>
				<div class="stat-desc">Since 2021</div>
			</div>
			<div class="stat">
				<div class="stat-title">Days Since Last Disaster</div>
				<div class="stat-value">0 Days</div>
			</div>
		</div>
	</div>

	<div class="grid gap-4 bg-base-200 p-4 text-neutral-content">
		<p class="text-3xl font-semibold">Me</p>
		<div class="grid gap-4">
			<div class="stats bg-neutral shadow">
				<div class="stat">
					<div class="stat-title">Age</div>
					<div class="stat-value">{data.age} y/o</div>
				</div>

				<div class="stat">
					<div class="stat-title">Programmer for</div>
					<div class="stat-value">{data.devYear} years</div>
					<div class="stat-desc">Since 2013</div>
				</div>
			</div>
			<div class="stats bg-neutral bg-base-100">
				<div class="stat">
					<div class="stat-title text-neutral-content">Currently Located</div>
					<div class="stat-desc text-neutral-content">Cape Town, South Africa</div>
				</div>
			</div>
		</div>
	</div>
</div>
