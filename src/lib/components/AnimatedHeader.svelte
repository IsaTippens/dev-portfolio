<script>
	export let color = '#3498db';
</script>

<div class="gradient-card-bg rounded-lg background-animate">
	<div class="py-8 px-4">
		<slot />
	</div>
</div>


<style>

  .background-animate {
    background-size: 400%;

    -webkit-animation: AnimationName 60s ease infinite;
    -moz-animation: AnimationName 60s ease infinite;
    animation: AnimationName 60s ease infinite;
  }

  @keyframes AnimationName {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
</style>