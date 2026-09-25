<script lang="ts">
	import { prefersReducedMotion } from '$lib/motion';

	/**
	 * A silent screen-recording loop for posts. It plays only while it is on screen and
	 * motion is allowed; under reduced motion it rests on its first frame and plays only
	 * from its controls. No `autoplay` attribute: the server cannot know the preference,
	 * and an SSR autoplay would start the loop before hydration could stop it.
	 */
	let {
		src,
		label,
		width,
		height
	}: {
		src: string;
		label: string;
		width: number;
		height: number;
	} = $props();

	let video: HTMLVideoElement;
	let visible = $state(false);

	$effect(() => {
		const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
		observer.observe(video);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (visible && !$prefersReducedMotion) {
			// A rejected play (e.g. a data-saver policy) leaves the controls to the reader.
			video.play().catch(() => {});
		} else {
			video.pause();
		}
	});
</script>

<video
	bind:this={video}
	{src}
	{width}
	{height}
	aria-label={label}
	muted
	loop
	playsinline
	controls
	preload="metadata"
	class="mx-auto block h-auto max-w-full"
></video>
