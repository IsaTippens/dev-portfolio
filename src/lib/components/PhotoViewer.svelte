<script lang="ts">
	import { onMount } from 'svelte';

	let { containerSelector = '.blog-content' } = $props();

	interface BlogImage {
		src: string;
		alt: string;
		el: HTMLImageElement;
	}

	let images = $state<BlogImage[]>([]);
	let activeIndex = $state<number | null>(null);

	onMount(() => {
		const container = document.querySelector(containerSelector);
		if (!container) return;

		// Event delegation: attach a single click handler to the container
		const handleClick = (e: Event) => {
			const target = e.target as HTMLElement;
			if (target && target.tagName === 'IMG') {
				const imgElements = Array.from(container.querySelectorAll('img')) as HTMLImageElement[];
				images = imgElements.map((el) => ({
					src: el.src,
					alt: el.alt || 'PORTFOLIO_IMAGE',
					el
				}));

				const index = imgElements.indexOf(target as HTMLImageElement);
				if (index !== -1) {
					activeIndex = index;
				}
			}
		};

		container.addEventListener('click', handleClick);

		return () => {
			container.removeEventListener('click', handleClick);
		};
	});

	// Reactive effect to scroll background page to the navigated image
	$effect(() => {
		if (activeIndex !== null && images[activeIndex]) {
			images[activeIndex].el.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});
		}
	});

	function close() {
		activeIndex = null;
	}

	function next(e?: Event) {
		if (e) e.stopPropagation();
		if (activeIndex === null || images.length === 0) return;
		activeIndex = (activeIndex + 1) % images.length;
	}

	function prev(e?: Event) {
		if (e) e.stopPropagation();
		if (activeIndex === null || images.length === 0) return;
		activeIndex = (activeIndex - 1 + images.length) % images.length;
	}

	let touchStartX = 0;
	let touchEndX = 0;

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e: TouchEvent) {
		touchEndX = e.changedTouches[0].screenX;
		const swipeThreshold = 40;
		if (touchEndX < touchStartX - swipeThreshold) {
			next();
		} else if (touchEndX > touchStartX + swipeThreshold) {
			prev();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (activeIndex === null) return;
		if (e.key === 'ArrowRight' || e.key === 'Right') {
			next();
		} else if (e.key === 'ArrowLeft' || e.key === 'Left') {
			prev();
		} else if (e.key === 'Escape') {
			close();
		}
	}

</script>
<svelte:window onkeydown={handleKeydown} />

{#if activeIndex !== null && images.length > 0}
	<!-- Modal Backdrop Overlay -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none font-mono text-main"
		onclick={close}
		role="dialog"
		aria-modal="true"
	>
		<!-- Modal Layout Container -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="w-full max-w-5xl h-[85vh] flex flex-col justify-between border-2 border-border bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] relative p-2.5 sm:p-4"
			onclick={(e) => e.stopPropagation()}
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
		>
			<!-- Top Technical Status Bar -->
			<div class="flex justify-between items-center pb-2 border-b border-border text-xxs uppercase tracking-widest font-mono text-muted">
				<div class="flex items-center gap-2">
					<span class="text-accent">●</span>
					<span class="hidden xs:inline">[DEVICE: PHOTO_VIEWER]</span>
					<span class="text-main font-bold">[{activeIndex + 1}/{images.length}]</span>
				</div>
				<div class="hidden sm:block">
					<span>MODE: INTERACTIVE_SPEC</span>
				</div>
				<button
					class="border border-border px-2 py-1 bg-background hover:bg-accent hover:text-background active:translate-y-[1px] text-xxs uppercase tracking-widest font-bold font-mono transition-all shrink-0"
					onclick={close}
				>
					[ESC_CLOSE]
				</button>
			</div>

			<!-- Image Viewer Area -->
			<div class="flex-grow flex items-center justify-between gap-2 sm:gap-4 py-2 sm:py-4 relative min-h-0">
				<!-- Prev Button -->
				<button
					class="border-2 border-border bg-background hover:bg-accent hover:text-background active:translate-x-[2px] active:translate-y-[2px] active:shadow-none w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-base sm:text-lg transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] z-20 shrink-0"
					onclick={prev}
					aria-label="Previous image"
				>
					&lt;
				</button>

				<!-- Displayed Image -->
				<div class="flex-1 min-w-0 h-full flex items-center justify-center relative p-1 sm:p-2">
					<img
						src={images[activeIndex].src}
						alt={images[activeIndex].alt}
						class="max-h-[55vh] sm:max-h-[60vh] max-w-full object-contain border-2 border-border bg-background p-1 sm:p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] select-text"
					/>
				</div>

				<!-- Next Button -->
				<button
					class="border-2 border-border bg-background hover:bg-accent hover:text-background active:translate-x-[2px] active:translate-y-[2px] active:shadow-none w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-base sm:text-lg transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] z-20 shrink-0"
					onclick={next}
					aria-label="Next image"
				>
					&gt;
				</button>
			</div>

			<!-- Footer Bar -->
			<div class="border-t border-border pt-2 text-xxs uppercase tracking-wider font-mono text-muted flex flex-col sm:flex-row justify-between gap-1 sm:gap-2">
				<div class="truncate max-w-full sm:max-w-[60vw]">
					<span>[CAPTION: {images[activeIndex].alt.toUpperCase()}]</span>
				</div>
				<div class="text-right whitespace-nowrap">
					<span>[SYS_OK // INDEX_{activeIndex}]</span>
				</div>
			</div>
		</div>
	</div>
{/if}
