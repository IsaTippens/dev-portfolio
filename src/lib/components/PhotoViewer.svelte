<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Panel from '$lib/components/Panel.svelte';

	/**
	 * PHOTO_VIEWER — every image in a content column opens here.
	 *
	 * A dark screen, the image framed in a bezel with screws, and a caption bar that
	 * reports the file and its real pixel dimensions. Neighbouring images are preloaded,
	 * so a comparison set steps without a blank frame between shots.
	 */
	let { containerSelector = '.blog-content' } = $props();

	interface BlogImage {
		src: string;
		alt: string;
		el: HTMLImageElement;
	}

	let images = $state<BlogImage[]>([]);
	let activeIndex = $state<number | null>(null);
	let dims = $state<{ w: number; h: number } | null>(null);
	let dialog_el = $state<HTMLDivElement | null>(null);
	let return_focus: HTMLElement | null = null;

	const filename = $derived(
		activeIndex === null || !images[activeIndex]
			? ''
			: decodeURIComponent(images[activeIndex].src.split('/').pop() ?? 'UNKNOWN')
	);

	onMount(() => {
		const container = document.querySelector(containerSelector);
		if (!container) return;

		/** @param {Event} event */
		const handleClick = (event: Event) => {
			const target = event.target as HTMLElement;
			if (!target || target.tagName !== 'IMG') return;

			const imgElements = Array.from(container.querySelectorAll('img')) as HTMLImageElement[];
			images = imgElements.map((el) => ({
				src: el.currentSrc || el.src,
				alt: el.alt || 'PORTFOLIO_IMAGE',
				el
			}));

			const index = imgElements.indexOf(target as HTMLImageElement);
			if (index !== -1) activeIndex = index;
		};

		container.addEventListener('click', handleClick);
		return () => container.removeEventListener('click', handleClick);
	});

	// Keep the page behind the modal parked on the image being inspected, so closing
	// puts the reader back where they opened it. Instant, not smooth: the page behind is
	// not the thing being looked at, and scrolling it smoothly costs frames.
	$effect(() => {
		if (activeIndex !== null && images[activeIndex]) {
			images[activeIndex].el.scrollIntoView({ block: 'center' });
		}
	});

	// Preload the neighbours. A comparison set is meant to be stepped through.
	$effect(() => {
		const index = activeIndex;
		if (index === null || images.length < 2) return;
		for (const offset of [1, -1]) {
			const neighbour = images[(index + offset + images.length) % images.length];
			if (!neighbour) continue;
			const preload = new Image();
			preload.src = neighbour.src;
		}
	});

	// Lock the page while the screen is up.
	$effect(() => {
		if (browser && activeIndex !== null) {
			const overflow = document.body.style.overflow;
			const touch = document.body.style.touchAction;
			document.body.style.overflow = 'hidden';
			document.body.style.touchAction = 'none';
			return () => {
				document.body.style.overflow = overflow;
				document.body.style.touchAction = touch;
			};
		}
	});

	function close() {
		activeIndex = null;
		dims = null;
	}

	function next(e?: Event) {
		e?.stopPropagation();
		if (activeIndex === null || images.length === 0) return;
		dims = null;
		activeIndex = (activeIndex + 1) % images.length;
	}

	function prev(e?: Event) {
		e?.stopPropagation();
		if (activeIndex === null || images.length === 0) return;
		dims = null;
		activeIndex = (activeIndex - 1 + images.length) % images.length;
	}

	let touch_start_x = 0;

	function handle_touch_end(e: TouchEvent) {
		const end_x = e.changedTouches[0].screenX;
		const threshold = 40;
		if (end_x < touch_start_x - threshold) next();
		else if (end_x > touch_start_x + threshold) prev();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (activeIndex === null) return;
		if (e.key === 'ArrowRight') next();
		else if (e.key === 'ArrowLeft') prev();
		else if (e.key === 'Escape') close();
		else if (e.key === 'Tab') {
			// Focus stays inside the modal while it is up.
			const focusable = dialog_el?.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			if (!focusable || focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	// Focus moves into the screen on open, and back to the thumbnail on close.
	$effect(() => {
		if (activeIndex !== null && dialog_el) {
			if (!return_focus) return_focus = document.activeElement as HTMLElement | null;
			dialog_el.focus();
		} else if (activeIndex === null && return_focus) {
			return_focus.focus?.();
			return_focus = null;
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if activeIndex !== null && images.length > 0}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={dialog_el}
		tabindex="-1"
		class="fixed inset-0 z-50 flex touch-none items-center justify-center bg-screen-dark p-4 font-mono text-ink select-none backdrop-blur-[2px]"
		onclick={close}
		ontouchmove={(e) => e.preventDefault()}
		role="dialog"
		aria-modal="true"
		aria-label="Image viewer"
	>
		<!-- The screen itself -->
		<Panel
			tag="PHOTO_VIEWER"
			screws={true}
			class="crt-on flex h-[85vh] w-full max-w-5xl flex-col justify-between bg-panel p-2.5 shadow-[4px_4px_0_var(--shadow)] sm:p-4"
			onclick={(e: MouseEvent) => e.stopPropagation()}
			ontouchstart={(e: TouchEvent) => (touch_start_x = e.changedTouches[0].screenX)}
			ontouchend={handle_touch_end}
		>
			<!-- Status bar -->
			<div
				class="flex items-center justify-between border-b border-line pb-2 font-mono text-xxs tracking-widest text-dim uppercase"
			>
				<div class="flex items-center gap-2">
					<span class="led" data-on="ok" aria-hidden="true"></span>
					<span class="hidden xs:inline">[DEVICE: PHOTO_VIEWER]</span>
					<span class="font-bold text-ink">[{activeIndex + 1}/{images.length}]</span>
				</div>
				<div class="hidden sm:block">MODE: INTERACTIVE_SPEC</div>
				<button
					class="hbtn shrink-0 px-2 py-1 text-xxs"
					onclick={close}
					aria-label="Close image viewer"
				>
					[ESC_CLOSE]
				</button>
			</div>

			<!-- Bezel -->
			<div class="relative flex min-h-0 flex-grow items-center justify-between gap-2 py-2 sm:gap-4 sm:py-4">
				<button class="hbtn hidden h-10 w-10 shrink-0 text-lg sm:flex" onclick={prev} aria-label="Previous image">
					&lt;
				</button>

				<div class="relative flex h-full w-full min-h-0 flex-1 items-center justify-center p-1 sm:p-2">
					<img
						src={images[activeIndex].src}
						alt={images[activeIndex].alt}
						class="max-h-[50vh] max-w-full border-2 border-[var(--hw-well-2)] bg-[var(--hw-well)] object-contain p-1 select-text sm:max-h-[60vh] sm:p-1.5"
						onload={(e: Event) =>
							(dims = {
								w: (e.currentTarget as HTMLImageElement).naturalWidth,
								h: (e.currentTarget as HTMLImageElement).naturalHeight
							})}
					/>
				</div>

				<button class="hbtn hidden h-10 w-10 shrink-0 text-lg sm:flex" onclick={next} aria-label="Next image">
					&gt;
				</button>
			</div>

			<!-- Mobile keys -->
			<div class="flex items-center justify-between gap-2 border-t border-line pt-2 sm:hidden">
				<button class="hbtn flex-1 py-2 text-xs" onclick={prev}>&lt; PREV</button>
				<button class="hbtn flex-1 py-2 text-xs" onclick={next}>NEXT &gt;</button>
			</div>

			<!-- Caption bar -->
			<div
				class="flex flex-col justify-between gap-1 border-t border-line pt-2 font-mono text-xxs tracking-wider text-dim uppercase sm:flex-row sm:gap-2"
			>
				<div class="max-w-full truncate sm:max-w-[60vw]">
					<span>IMG: {filename}</span>
				</div>
				<div class="whitespace-nowrap text-right">
					<span>{dims ? `${dims.w}×${dims.h}PX` : 'READING…'} // SYS_OK // INDEX_{activeIndex}</span>
				</div>
			</div>
		</Panel>
	</div>
{/if}
