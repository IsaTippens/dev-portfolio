<!--
https://daniel.do/article/making-noisy-svgs/
https://css-tricks.com/grainy-gradients/
-->
<script context="module">
   import { getContext } from 'svelte';
   

</script>
<script>
    let dark_top = "#2367BD";
    let dark_bottom = "#1F131E";

    let light_top = "#7EC2F5";
    let light_bottom = "#A292B4";

    // set a boolean is_dark
    // listen for media event to change is_dark
    // if is_dark, set colors to dark
    const { is_dark } = getContext('theme')

    $: top_color = $is_dark ? dark_top : light_top;
    $: bottom_color = $is_dark ? dark_bottom : light_bottom;

</script>

<svg height="100%" width="100%">
	<defs>
		<circle id="shape" cx="100%" cy="100%" r="90%" />
        <circle id="circle" r="90%" />
		<filter id="noise">
			<feTurbulence type="fractalNoise" baseFrequency="19.5" numOctaves="10" result="turbulence" />
			<feComposite operator="in" in="turbulence" in2="SourceAlpha" result="composite" />
			<feColorMatrix in="composite" type="luminanceToAlpha" />
			<feBlend in="SourceGraphic" in2="composite" mode="color-burn" />
		</filter>
		<mask id="gradient">
			<radialGradient id="fade">
				<stop offset="0%" stop-color="white" stop-opacity="1" />
				<stop offset="65%" stop-color="white" stop-opacity="0.2" />
				<stop offset="75%" stop-color="black" stop-opacity="0" />
			</radialGradient>
			<use href="#shape" fill="url('#fade')" />
		</mask>
        <mask id="gradient2">
			<radialGradient id="fade2">
				<stop offset="0%" stop-color="white" stop-opacity="1" />
				<stop offset="65%" stop-color="white" stop-opacity="0.2" />
				<stop offset="75%" stop-color="black" stop-opacity="0" />
			</radialGradient>
			<use href="#circle" fill="url('#fade2')" />
		</mask>
	</defs>
	<use href="#shape" fill={bottom_color} mask="url(#gradient)" filter="url('#noise')" />
    <use href="#circle" fill={top_color} mask="url(#gradient2)" filter="url('#noise')" />
</svg>
