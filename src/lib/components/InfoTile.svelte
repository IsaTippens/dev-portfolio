<script context="module">
</script>

<script>
	export let title;
</script>

<div class="aspect-square flex flex-col gradient-card-bg p-4 max-h-min ">
	<p class="text-xl truncate">{title}</p>
	<div class="flex-auto content-center text-center">
		<slot />
	</div>
</div>
