<script lang="ts">
  import { onMount } from 'svelte';

  let randomStartingPosition: number;

  let background: HTMLDivElement;

  onMount(() => {
    randomStartingPosition = Math.random() * 100 * 60;
    background.style.animationDelay = `-${randomStartingPosition}s`;
  });

  let { children } = $props();
</script>

<div class="gradient-card-bg rounded-lg background-animate" bind:this={background}>
		{@render children?.()}
</div>


<style>
  .background-animate {
    z-index: -1;
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