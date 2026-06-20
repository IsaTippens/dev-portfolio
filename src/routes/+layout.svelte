<script lang="ts">
	import { is_dark } from '$lib/stores/theme';
	import { setContext, onMount, tick } from 'svelte';
	setContext('theme', { is_dark });

	import NoisyGradient from '$lib/components/NoisyGradient.svelte';
	import '../app.css';
	import '../prism.css';

	import { browser } from '$app/environment';
	import { isCharging, batteryLevel, playLightning } from '$lib/stores/battery';
	import { getYearsSince } from '$lib/getYear';

	// Static imports of page components
	import HomePage from './+page.svelte';
	import BlogPage from './blog/+page.svelte';
	import BlogDetailPage from './blog/[slug]/+page.svelte';
	import ProjectsPage from './projects/+page.svelte';
	import ProjectsDetailPage from './projects/[slug]/+page.svelte';
	import GearPage from './gear/+page.svelte';

	interface Panel {
		path: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		component: any;
		loading: boolean;
		error: string | null;
	}

	let panels = $state<Panel[]>([]);
	let fps = $state<number>(60);

	// Loaders for Markdown
	const blogPostImports = import.meta.glob('/content/blog/**/*.{md,svx}');
	const projectImports = import.meta.glob('/content/projects/**/*.{md,svx}');

	function getPanelPathsForPathname(pathname: string): string[] {
		if (pathname === '/') return ['/'];
		if (pathname === '/blog') return ['/', '/blog'];
		if (pathname.startsWith('/blog/')) return ['/', '/blog', pathname];
		if (pathname === '/projects') return ['/', '/projects'];
		if (pathname.startsWith('/projects/')) return ['/', '/projects', pathname];
		if (pathname === '/gear') return ['/', '/gear'];
		return ['/'];
	}

	function getComponentForPath(path: string) {
		if (path === '/') return HomePage;
		if (path === '/blog') return BlogPage;
		if (path.startsWith('/blog/')) return BlogDetailPage;
		if (path === '/projects') return ProjectsPage;
		if (path.startsWith('/projects/')) return ProjectsDetailPage;
		if (path === '/gear') return GearPage;
		return null;
	}

	async function loadPanelData(path: string) {
		if (path === '/') {
			const age = getYearsSince(new Date('2001-06-01'));
			const devYear = getYearsSince(new Date('2014-06-01'));
			const seYear = getYearsSince(new Date('2021-06-01'));
			const vibeYear = new Date().getFullYear() - 2025;
			const res = await fetch('/api/posts');
			const posts = await res.json();
			return { age, devYear, seYear, vibeYear, posts };
		} else if (path === '/blog') {
			const res = await fetch('/api/posts');
			const posts = await res.json();
			return { posts };
		} else if (path.startsWith('/blog/')) {
			const slug = decodeURIComponent(path.split('/').pop() || '');
			const matchKey = Object.keys(blogPostImports).find(key => {
				const segments = key.split('/');
				return segments[segments.length - 2] === slug && key.endsWith('index.md');
			}) || Object.keys(blogPostImports).find(key => {
				const segments = key.split('/');
				return segments[segments.length - 2] === slug;
			});
			if (!matchKey) throw new Error(`Blog post not found: ${slug}`);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const post = (await blogPostImports[matchKey]()) as any;
			return {
				Content: post.default,
				meta: { ...post.metadata, slug }
			};
		} else if (path === '/projects') {
			const res = await fetch('/api/projects');
			const posts = await res.json();
			return { posts };
		} else if (path.startsWith('/projects/')) {
			const slug = decodeURIComponent(path.split('/').pop() || '');
			const matchKey = Object.keys(projectImports).find(key => {
				const segments = key.split('/');
				return segments[segments.length - 2] === slug && key.endsWith('index.md');
			}) || Object.keys(projectImports).find(key => {
				const segments = key.split('/');
				return segments[segments.length - 2] === slug;
			});
			if (!matchKey) throw new Error(`Project not found: ${slug}`);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const post = (await projectImports[matchKey]()) as any;
			return {
				Content: post.default,
				meta: { ...post.metadata, slug }
			};
		} else if (path === '/gear') {
			return {};
		}
		throw new Error(`Path not found: ${path}`);
	}

	async function loadPanel(path: string) {
		try {
			const component = getComponentForPath(path);
			if (!component) {
				throw new Error(`Component not found for path: ${path}`);
			}
			const data = await loadPanelData(path);
			const index = panels.findIndex((p) => p.path === path);
			if (index !== -1) {
				panels[index].component = component;
				panels[index].data = data;
				panels[index].loading = false;
			}
		} catch (err) {
			const index = panels.findIndex((p) => p.path === path);
			if (index !== -1) {
				panels[index].error = (err as Error)?.message || 'Error loading panel';
				panels[index].loading = false;
			}
		}
	}

	async function scrollToRight() {
		await tick();
		const container = document.getElementById('panel-container');
		if (container) {
			container.scrollTo({
				left: container.scrollWidth,
				behavior: 'smooth'
			});
		}
	}

	async function navigateTo(href: string, fromPanelIndex: number) {
		const url = new URL(href, window.location.href);
		const targetPath = url.pathname;

		// Slice panels up to the origin panel
		panels = panels.slice(0, fromPanelIndex + 1);

		const targetPanelPaths = getPanelPathsForPathname(targetPath);

		for (let i = panels.length; i < targetPanelPaths.length; i++) {
			const path = targetPanelPaths[i];
			const newPanel: Panel = {
				path,
				data: null,
				component: null,
				loading: true,
				error: null
			};
			panels.push(newPanel);
			loadPanel(path);
		}

		history.pushState(null, '', href);
		scrollToRight();
	}

	function closePanelsFrom(index: number) {
		if (index === 0) return;
		panels = panels.slice(0, index);
		const lastPanel = panels[panels.length - 1];
		history.pushState(null, '', lastPanel.path);
		scrollToRight();
	}

	function shouldInterceptClick(event: MouseEvent) {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return false;
		}

		const anchor = (event.target as HTMLElement).closest('a');
		if (!anchor) return false;

		const target = anchor.getAttribute('target');
		if (target === '_blank') return false;

		const rel = anchor.getAttribute('rel');
		if (rel && rel.includes('external')) return false;

		const href = anchor.getAttribute('href');
		if (!href) return false;

		if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
			return false;
		}

		if (href.startsWith('http://') || href.startsWith('https://')) {
			const url = new URL(href, window.location.href);
			if (url.origin !== window.location.origin) {
				return false;
			}
		}

		if (href.startsWith('/resume') || href.startsWith('/api')) {
			return false;
		}

		return true;
	}

	async function handleLinkClick(event: MouseEvent) {
		if (!shouldInterceptClick(event)) return;

		event.preventDefault();
		const anchor = (event.target as HTMLElement).closest('a');
		if (!anchor) return;

		const href = anchor.getAttribute('href');
		if (!href) return;

		const panelEl = anchor.closest('[data-panel-index]');
		const panelIndex = panelEl ? parseInt(panelEl.getAttribute('data-panel-index') || '0', 10) : 0;

		await navigateTo(href, panelIndex);
	}

	function handlePopState() {
		const currentPath = window.location.pathname;
		const targetPanelPaths = getPanelPathsForPathname(currentPath);

		const newPanels: Panel[] = [];

		targetPanelPaths.forEach((path, i) => {
			const existing = panels[i];
			if (existing && existing.path === path) {
				newPanels.push(existing);
			} else {
				const newPanel: Panel = {
					path,
					data: null,
					component: null,
					loading: true,
					error: null
				};
				newPanels.push(newPanel);
			loadPanel(path);
			}
		});

		panels = newPanels;
		scrollToRight();
	}

	onMount(() => {

		const initialPath = window.location.pathname;
		const initialPanelPaths = getPanelPathsForPathname(initialPath);

		panels = initialPanelPaths.map(path => ({
			path,
			data: null,
			component: null,
			loading: true,
			error: null
		}));

		panels.forEach((panel) => {
			loadPanel(panel.path);
		});

		window.addEventListener('popstate', handlePopState);
		window.addEventListener('click', handleLinkClick);

		// Battery status API
		if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				((navigator as any).getBattery() as Promise<any>)
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					.then((battery: any) => {
						batteryLevel.set(Math.round(battery.level * 100));
						isCharging.set(battery.charging);
						battery.addEventListener('levelchange', () => {
							batteryLevel.set(Math.round(battery.level * 100));
						});
						battery.addEventListener('chargingchange', () => {
							const newCharging = battery.charging;
							let currentIsCharging = false;
							isCharging.subscribe(v => currentIsCharging = v)();

							if (newCharging && !currentIsCharging) {
								playLightning.set(true);
								setTimeout(() => {
									playLightning.set(false);
								}, 3141);
							}
							isCharging.set(newCharging);
						});
					})
					.catch(() => {});
			} catch {
				// Ignored
			}
		}

		// FPS counter
		let lastTime: number | null = null;
		let frameCount = 0;
		let animationFrameId: number;

		function updateFps(timestamp: number) {
			if (lastTime === null) lastTime = timestamp;
			frameCount++;
			if (timestamp >= lastTime + 1000) {
				fps = Math.round((frameCount * 1000) / (timestamp - lastTime));
				frameCount = 0;
				lastTime = timestamp;
			}
			animationFrameId = window.requestAnimationFrame(updateFps);
		}

		animationFrameId = window.requestAnimationFrame(updateFps);

		return () => {
			window.removeEventListener('popstate', handlePopState);
			window.removeEventListener('click', handleLinkClick);
			window.cancelAnimationFrame(animationFrameId);
		};
	});

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

	$effect(() => {
		if (browser && panels.length > 0) {
			const lastPanel = panels[panels.length - 1];
			if (lastPanel && !lastPanel.loading && lastPanel.data) {
				if (lastPanel.path === '/') {
					document.title = 'Isa Tippens';
				} else if (lastPanel.path === '/blog') {
					document.title = 'Posts';
				} else if (lastPanel.path === '/projects') {
					document.title = 'Projects';
				} else if (lastPanel.path === '/gear') {
					document.title = 'Gear';
				} else if (lastPanel.data.meta && lastPanel.data.meta.title) {
					document.title = lastPanel.data.meta.title;
				}
			}
		}
	});

	$effect(() => {
		if (browser) {
			if (panels.length === 1) {
				document.documentElement.classList.remove('overflow-hidden', 'h-full');
				document.body.classList.remove('overflow-hidden', 'h-full');
			} else {
				document.documentElement.classList.add('overflow-hidden', 'h-full');
				document.body.classList.add('overflow-hidden', 'h-full');
			}
		}
	});
</script>

<div class="flex flex-col relative bg-background text-main transition-all duration-300 {panels.length === 1 ? 'items-center justify-center min-h-screen w-full p-2 sm:p-4 overflow-x-hidden' : 'h-screen w-screen overflow-hidden'}">
	<!-- Background grid -->
	<div class="absolute inset-0 z-0"><NoisyGradient /></div>

	<!-- Horizontal panel container -->
	<div
		id="panel-container"
		class="transition-all duration-300 relative z-10 min-h-0 {panels.length === 1 ? 'w-full max-w-[700px] flex flex-col' : 'flex flex-row items-stretch gap-6 overflow-x-auto p-4 sm:p-6 w-full h-full scroll-smooth'}"
	>
		{#each panels as panel, i (panel.path)}
			<!-- Panel Chassis -->
			<div
				data-panel-index={i}
				class="bg-card border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] flex flex-col relative transition-all duration-300 {panels.length === 1 ? 'w-full' : 'w-[90vw] sm:w-[500px] shrink-0 h-full min-h-0'}"
			>
				<!-- Top Technical Status Bar -->
				<div class="flex justify-between items-center px-4 py-2 border-b border-border text-xxs uppercase tracking-widest font-mono text-muted relative overflow-hidden shrink-0">
					{#if i === 0 && $playLightning}
						<div class="absolute inset-0 bg-accent/20 flex items-center z-20 pointer-events-none">
							<div class="animate-marquee whitespace-nowrap text-tiny font-bold text-accent font-mono flex items-center">
								⚡ CHARGER_CONNECTED // POWERING_UP // ⚡ ⚡ ⚡
							</div>
						</div>
					{/if}
					<span class="flex items-center gap-1">
						<span class="inline-block w-2.5 h-2.5 bg-accent"></span>
						<span class="font-bold text-main">
							{i === 0 ? 'DEV-PORTFOLIO' : `DEV-PORTFOLIO // ${panel.path.split('/')[1].toUpperCase()}`}
						</span>
					</span>

					{#if i === 0}
						<button
							onclick={toggleTheme}
							class="hover:text-accent font-bold transition-colors uppercase border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 bg-neutral-200/50 dark:bg-neutral-800/50 text-tiny"
						>
							MODE: {$is_dark ? 'DARK' : 'LIGHT'}
						</button>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span
							class="flex items-center gap-1.5 cursor-pointer"
							onclick={() => {
								isCharging.update(v => {
									const newCharging = !v;
									if (newCharging) {
										playLightning.set(true);
										setTimeout(() => {
											playLightning.set(false);
										}, 1500);
									}
									return newCharging;
								});
							}}
						>
							<span>BAT: {$batteryLevel}%</span>
							<span class="inline-block w-5 h-2.5 border border-muted p-[1px] relative">
								<span class="block h-full bg-accent" style="width: {$batteryLevel}%"></span>
							</span>
						</span>
					{:else}
						<span class="text-muted font-mono truncate max-w-[150px]">
							{panel.path.split('/')[2] ? `[${panel.path.split('/')[2].toUpperCase()}]` : ''}
						</span>
						<button
							onclick={() => closePanelsFrom(i)}
							class="hover:text-accent font-bold transition-colors font-mono text-tiny uppercase border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 bg-neutral-200/50 dark:bg-neutral-800/50"
						>
							CLOSE
						</button>
					{/if}
				</div>

				<!-- Main viewport/content screen -->
				<!-- Main viewport/content screen -->
				<div class="panel-content-viewport p-4 sm:p-6 flex-auto relative transition-all duration-300 {panels.length === 1 ? '' : 'overflow-y-auto min-h-0'}">
					{#if panel.loading}
						<div class="flex flex-col items-center justify-center h-full font-mono text-muted py-12">
							<div class="animate-pulse mb-2 text-base font-bold">LOADING_DATA...</div>
							<div class="text-xxs uppercase tracking-widest">[PATH: {panel.path}]</div>
						</div>
					{:else if panel.error}
						<div class="flex flex-col items-center justify-center h-full font-mono text-red-500 p-4 border border-red-500/20 bg-red-500/5 py-12">
							<div class="font-bold mb-2 text-base">ERROR_LOAD_FAILED</div>
							<div class="text-xxs text-center mb-4">{panel.error}</div>
							<button onclick={() => loadPanel(panel.path)} class="border border-red-500 px-3 py-1 text-xs hover:bg-red-500/10 font-bold">RETRY</button>
						</div>
					{:else if panel.component}
						{@const Component = panel.component}
						<Component data={panel.data} />
					{/if}
				</div>

				<!-- Bottom Technical Status Bar -->
				<div class="flex justify-between items-center px-4 py-2 border-t border-border text-xxs uppercase tracking-widest font-mono text-muted bg-neutral-200/20 dark:bg-neutral-800/20 shrink-0">
					<span>SVELTE v5</span>
					<span>{fps} FPS</span>
					<span>REV: {i === 0 ? '2026.06' : `PANEL_${i}`}</span>
				</div>
			</div>
		{/each}
	</div>
</div>
