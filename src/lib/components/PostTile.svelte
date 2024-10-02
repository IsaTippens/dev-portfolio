<script>
	export let data;
</script>

<!--
Using Tailwind
data will be one single post

Title -> Date (on the right)
Description
-->

<a class="card bg-primary text-primary-content w-full" href={`blog/${data.path}`}>
	<div class="card-body">
		<h2 class="card-title text-white">{data.meta.title}</h2>
		<p class="text-white">{data.meta.description}</p>
		<div class="card-actions justify-end">
			<div class="text-white">{new Date(data.meta.date).toDateString()}</div>
		</div>
	</div>
</a>
