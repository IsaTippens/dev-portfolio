<script>
	export let data;
</script>

<!--
Using Tailwind
data will be one single post

Title -> Date (on the right)
Description
-->

<a class="grid gap-2 p-4" href={`blog/${data.path}`}>
	<div class="flex flex-col-reverse sm:flex-row sm:justify-between">
		<h1 class="text-xl">{data.meta.title}</h1>
		<p class="text-sm highlight-text">{new Date(data.meta.date).toDateString()}</p>
	</div>
	<div>
		<p>{data.meta.description}</p>
	</div>
</a>
