<!--
https://daniel.do/article/making-noisy-svgs/
https://css-tricks.com/grainy-gradients/
-->
<script>
	let dark_top = '#2367BD';
	let dark_bottom = '#1F131E';

	let light_top = '#7EC2F5';
	let light_bottom = '#A292B4';

	let top_color = dark_top;
	let bottom_color = dark_bottom;
</script>

<div class="w-full h-full">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="100%"
		height="100%"
		viewBox="0 0 100 100"
		preserveAspectRatio="none"
		fill="none"
	>
		<defs>
			<circle id="shape" cx="100%" cy="100%" r="90%" />
			<circle id="circle" r="90%" />
			<filter id="noise">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="19.5"
					numOctaves="10"
					result="turbulence"
				/>
				<feComposite operator="in" in="turbulence" in2="SourceAlpha" result="composite" />
				<feColorMatrix in="composite" type="luminanceToAlpha" />
				<feBlend in="SourceGraphic" in2="composite" mode="color-burn" />
			</filter>
			<mask id="gradient">
				<radialGradient id="fade">
					<stop offset="0%" stop-color="white" stop-opacity="1" />
					<stop offset="65%" stop-color="white" stop-opacity="0.2" />
					<stop offset="90%" stop-color="black" stop-opacity="0" />
				</radialGradient>
				<use href="#shape" fill="url('#fade')" />
			</mask>
			<mask id="gradient2">
				<radialGradient id="fade2">
					<stop offset="0%" stop-color="white" stop-opacity="1" />
					<stop offset="65%" stop-color="white" stop-opacity="0.2" />
					<stop offset="90%" stop-color="black" stop-opacity="0" />
				</radialGradient>
				<use href="#circle" fill="url('#fade2')" />
			</mask>
		</defs>
		<use href="#circle" fill="#2367BD" mask="url(#gradient2)" filter="url('#noise')" />
		<use href="#shape" fill="#345D92" mask="url(#gradient)" filter="url('#noise')" />
	</svg>
</div>
