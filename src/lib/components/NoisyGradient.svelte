<!--
https://daniel.do/article/making-noisy-svgs/
https://css-tricks.com/grainy-gradients/
-->
<script>
	import { is_dark } from '$lib/stores/theme';
</script>

<div
	class="w-full h-full transition-colors duration-500
	{$is_dark
		? 'bg-[#111111] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#111111] to-[#111111]'
		: 'bg-[#fafafa] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/30 via-[#fafafa] to-[#fafafa]'}"
></div>
