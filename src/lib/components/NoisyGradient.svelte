<!--
https://daniel.do/article/making-noisy-svgs/
https://css-tricks.com/grainy-gradients/
-->
<script>
	import { is_dark } from '$lib/stores/theme';
</script>

<div
	class="w-full h-full transition-colors duration-300
	{$is_dark ? 'bg-[#121212] text-white' : 'bg-[#eaeae6] text-[#121212]'}"
	style="
		background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
		background-size: 20px 20px;
		background-position: center;
		opacity: 0.05;
	"
></div>
