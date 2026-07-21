<script lang="ts">
	import { is_dark } from '$lib/stores/theme';
	import { setContext } from 'svelte';
	setContext('theme', { is_dark });

	import NoisyGradient from '$lib/components/NoisyGradient.svelte';
	import '../app.css';
	import '../prism.css';

	let { children } = $props();

	import { browser } from '$app/environment';

	function toggleTheme() {
		is_dark.update((d) => !d);
	}

	$effect(() => {
		if (browser) {
			if ($is_dark) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	});

	function scrollToTop() {
		if (browser) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<div class="min-h-screen flex flex-col bg-background text-main relative selection:bg-accent/20">
	<!-- Background texture -->
	<div class="fixed inset-0 z-0 pointer-events-none opacity-40">
		<NoisyGradient />
	</div>

	<!-- Top Sticky Navbar -->
	<header class="w-full border-b border-border bg-background/85 backdrop-blur-md sticky top-0 z-50">
		<div class="max-w-4xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between font-mono text-xs">
			<a href="/" class="flex items-center gap-2 group font-bold tracking-tight text-main hover:text-accent transition-colors">
				<span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
				<span class="text-sm">isa<span class="text-accent">.tippens</span></span>
			</a>

			<nav class="hidden sm:flex items-center gap-6 text-xs text-muted">
				<a href="/" class="hover:text-main transition-colors">~/home</a>
				<a href="/projects" class="hover:text-main transition-colors">~/projects</a>
				<a href="/blog" class="hover:text-main transition-colors">~/blog</a>
				<a href="/gear" class="hover:text-main transition-colors">~/gear</a>
				<a href="/resume" target="_blank" class="hover:text-main transition-colors">~/resume ↗</a>
			</nav>

			<div class="flex items-center gap-3">
				<button
					onclick={toggleTheme}
					class="px-2.5 py-1 text-tiny font-mono uppercase tracking-wider rounded border border-border bg-card/80 hover:border-accent hover:text-accent transition-all flex items-center gap-1.5 shadow-sm"
					aria-label="Toggle Theme"
				>
					<span class="w-1.5 h-1.5 rounded-full {$is_dark ? 'bg-accent' : 'bg-amber-500'}"></span>
					<span>{$is_dark ? 'DARK' : 'LIGHT'}</span>
				</button>
			</div>
		</div>

		<!-- Mobile Subnav Bar -->
		<div class="sm:hidden flex items-center justify-around border-t border-border py-2 px-3 text-tiny font-mono text-muted bg-card/50">
			<a href="/" class="hover:text-main">/home</a>
			<a href="/projects" class="hover:text-main">/projects</a>
			<a href="/blog" class="hover:text-main">/blog</a>
			<a href="/gear" class="hover:text-main">/gear</a>
			<a href="/resume" target="_blank" class="hover:text-main">/resume ↗</a>
		</div>
	</header>

	<!-- Main Viewport Content -->
	<main class="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 flex-auto z-10">
		{@render children()}
	</main>

	<!-- Minimal High-Tech Footer -->
	<footer class="w-full border-t border-border py-6 bg-card/30 z-10 font-mono text-tiny text-muted">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<span class="inline-flex items-center gap-1.5 text-main font-semibold">
					<span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
					SYS_STATUS: ONLINE
				</span>
				<span>•</span>
				<span>SVELTE v5</span>
			</div>
			
			<div class="flex items-center gap-4">
				<span>© {new Date().getFullYear()} ISA TIPPENS</span>
				<button 
					onclick={scrollToTop}
					class="hover:text-main hover:underline flex items-center gap-1 transition-colors"
				>
					[TOP ↑]
				</button>
			</div>
		</div>
	</footer>
</div>
