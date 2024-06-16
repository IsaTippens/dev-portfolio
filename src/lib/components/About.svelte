<script context="module">
	import { Tile, SkeletonPlaceholder, AspectRatio } from 'carbon-components-svelte';
    import InfoTile from './InfoTile.svelte';
	import { onMount } from 'svelte';
</script>

<script>
	export let data;

	onMount(() => {});
</script>

<div class="grid gap-4 md:grid-cols-2 sm:grid-cols-1">
	<div class="col-start-1 col-span-2 text-lg">
		{data.age} y/o <span class="highlight-text gsap-info">programmer</span> of {data.devYear} years
	</div>

	<div class="grid gap-4 col-start-1">
		<div class="grid gap-4">
			<Tile>
				<p class="text-lg font-semibold">
					<span class=" highlight-text">MSc Computer Science</span>
					student at the
					<a href="https://uwc.ac.za" class="highlight-link" target="_blank"
						>University of the Western Cape</a
					>
				</p>
			</Tile>
			<p>
				Combining Quantum Computing and Software Engineering to develop a fully secure token
				transaction protocol
			</p>
		</div>
		<div class="grid gap-4">
			<Tile>
				<p class="text-lg font-semibold">
					<span class="highlight-text">Software Developer</span> in
					<span class="highlight-text">FinTech</span>
				</p>
			</Tile>
			<p>Developing a high-frequency trading system and back-testing tools for crypto exchanges</p>
		</div>
	</div>

	<div class="col-start-1 md:col-start-2 row-span-1 md:row-span-2 justify-center">
		<AspectRatio ratio={'1x1'}>
			<!--use all the space available-->
			<SkeletonPlaceholder style="width: 100%; height: 100%"></SkeletonPlaceholder>
		</AspectRatio>
		<p>Cape Town, South Africa</p>
	</div>
	<div class="col-start-1 col-span-1 md:col-span-2">
		<div class=" grid gap-4 grid-cols-3">
            <InfoTile title={"Currently Using"}>
                <p>Rust, Go and Python</p>
            </InfoTile>
            <InfoTile title={"Mobile Apps"}>
                <p>React Native and Flutter</p>
            </InfoTile>
            <InfoTile title={"History"}>
                <p>C#, JS, Web3 and other cool tech</p>
            </InfoTile>
		</div>
	</div>
</div>
