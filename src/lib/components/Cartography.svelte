<script lang="ts">
	import { onMount } from 'svelte';
	import { animate } from 'animejs';
	import Panel from '$lib/components/Panel.svelte';
	import Readout from '$lib/components/Readout.svelte';
	import { onScrollProgress } from '$lib/motion/scrub.js';
	import { reducedMotion, EASE_SNAP } from '$lib/motion';

	/**
	 * CARTOGRAPHY_CPT — Cape Peninsula survey.
	 *
	 * The route line is scrubbed by scroll position, not played on a clock: it draws as
	 * the module crosses the viewport and un-draws when the visitor scrolls back up.
	 * During the power-on sequence the same line is drawn at a fixed duration, so the
	 * map comes up already on the table.
	 */
	let map: SVGSVGElement | null = $state(null);
	let route: SVGPathElement | null = $state(null);
	let head: SVGGElement | null = $state(null);
	let route_pc = $state(0);

	/** Fraction of the route drawn, 0 → 1. */
	function paint(p: number) {
		if (!route) return;
		const value = Math.max(0, Math.min(1, p));
		route.style.strokeDashoffset = String(1 - value);
		route_pc = Math.round(value * 100);

		if (head) {
			const total = route.getTotalLength();
			const point = route.getPointAtLength(value * total);
			head.setAttribute('transform', `translate(${point.x} ${point.y})`);
			head.style.opacity = value > 0.001 && value < 0.999 ? '1' : '0';
		}
	}

	onMount(() => {
		if (!route || !map) return;

		if (reducedMotion()) {
			paint(1);
			return;
		}

		// The hero no longer pins, so there is no larger track to read: the scroll
		// position comes from the map's own travel through the viewport.
		const source = map;
		const booting = document.documentElement.dataset.boot === 'armed';

		// Fixed draw during power-on; the scroll listener takes over on first movement.
		const proxy = { p: 0 };
		const intro = animate(proxy, {
			p: 1,
			duration: 520,
			delay: booting ? 240 : 0,
			ease: EASE_SNAP,
			onUpdate: () => paint(proxy.p)
		});

		let scrubbed = false;
		const stop = onScrollProgress(source, (p) => {
			if (!scrubbed) {
				// The first real scroll read cancels the boot draw and takes over.
				intro.cancel();
				scrubbed = true;
			}
			paint((p - 0.1) / 0.55);
		});

		return () => {
			stop();
			intro.cancel();
		};
	});
</script>

<Panel tag="CARTOGRAPHY_CPT" tag_tone="dim" class="p-4" data-boot="3">
	<div class="flex items-center gap-6">
		<!-- Survey plate -->
		<div
			class="relative flex h-48 w-2/3 items-center justify-center overflow-hidden border border-line bg-sunk p-2"
		>
			<span class="absolute top-1 left-2 font-mono text-nano text-dim">33°54'00"S</span>
			<span class="absolute right-2 bottom-1 font-mono text-nano text-dim">18°26'00"E</span>

			<svg
				bind:this={map}
				viewBox="0 -80 320 280"
				class="h-full w-full"
				role="img"
				aria-label="Route survey of the Cape Peninsula, Cape Town to Cape Point"
			>
				<!-- Grid -->
				<g class="stroke-line" stroke-width="1" stroke-dasharray="2 4">
					<line x1="80" y1="-80" x2="80" y2="200" />
					<line x1="160" y1="-80" x2="160" y2="200" />
					<line x1="240" y1="-80" x2="240" y2="200" />
					<line x1="0" y1="-50" x2="320" y2="-50" />
					<line x1="0" y1="0" x2="320" y2="0" />
					<line x1="0" y1="50" x2="320" y2="50" />
					<line x1="0" y1="100" x2="320" y2="100" />
					<line x1="0" y1="150" x2="320" y2="150" />
				</g>

				<!-- Coastline and Robben Island -->
				<path
					d="M 40,-70 C 50,-50 65,-30 85,0 C 88,10 90,20 95,25 C 105,30 115,35 105,42 C 100,45 98,48 95,53 C 90,60 92,70 95,78 C 95,85 85,100 85,115 C 85,140 95,160 102,180 C 106,192 112,190 114,180 C 116,160 118,140 125,125 C 130,115 145,108 160,105 C 180,102 195,108 200,115 C 205,125 200,165 208,185 C 212,195 220,185 225,180 C 235,170 250,168 265,165 C 275,162 285,165 295,175 C 305,185 315,190 320,195 M 80,25 C 83,23 85,26 83,28 C 80,29 77,27 80,25 Z M 35,-65 C 38,-67 40,-64 38,-62 C 35,-61 32,-63 35,-65 Z"
					fill="none"
					stroke="var(--ink-dim)"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>

				<!-- Topography: Table Mountain, Constantiaberg, Swartkop, Kogelberg -->
				<g fill="none" stroke="var(--line)" stroke-width="1">
					<path d="M 102,50 Q 112,48 118,52 Q 122,58 115,62 Q 108,65 102,60 Q 98,55 102,50 Z" />
					<path d="M 106,53 Q 110,50 115,53 Q 118,56 115,60 Q 110,63 106,60 Q 103,56 106,53 Z" />
					<path d="M 95,78 Q 102,75 108,80 Q 112,85 108,92 Q 102,95 95,90 Q 92,85 95,78 Z" />
					<path d="M 108,135 Q 115,130 118,135 Q 120,140 118,145 Q 112,148 108,142 Q 105,138 108,135 Z" />
					<path d="M 215,125 Q 225,115 235,125 Q 240,135 230,145 Q 220,150 215,140 Q 210,130 215,125 Z" />
				</g>

				<!-- The traced route, scrubbed by scroll -->
				<path
					bind:this={route}
					id="cpt-route"
					d="M 110,43 C 106,70 100,95 99,120 C 98,145 101,166 102,178"
					fill="none"
					stroke="var(--accent)"
					stroke-width="1.5"
					stroke-linecap="round"
					pathLength="1"
					stroke-dasharray="1"
					stroke-dashoffset="1"
				/>
				<!-- Route head: crosshair sitting at the current end of the trace -->
				<g bind:this={head} class="text-accent" fill="none" stroke="currentColor" stroke-width="1" opacity="0">
					<line x1="-4" y1="0" x2="-1.5" y2="0" />
					<line x1="1.5" y1="0" x2="4" y2="0" />
					<line x1="0" y1="-4" x2="0" y2="-1.5" />
					<line x1="0" y1="1.5" x2="0" y2="4" />
					<circle cx="0" cy="0" r="1" fill="currentColor" stroke="none" />
				</g>

				<!-- Water -->
				<g fill="var(--ink-dim)" font-family="var(--font-mono)" opacity="0.55">
					<text x="35" y="120" font-size="7" letter-spacing="1.4" transform="rotate(-90 35 120)">ATLANTIC OCEAN</text>
					<text x="140" y="150" font-size="7" letter-spacing="1.4">FALSE BAY</text>
					<text x="120" y="25" font-size="6" letter-spacing="1">TABLE BAY</text>
				</g>

				<!-- Land marks -->
				<g font-family="var(--font-mono)">
					<text x="120" y="55" font-size="5" fill="var(--ink-dim)" letter-spacing="0.8">TABLE MT.</text>
					<text x="120" y="60" font-size="4.5" fill="var(--ink-dim)">1086m</text>
					<circle cx="110" cy="43" r="1.5" fill="var(--accent)" />
					<text x="115" y="45" font-size="6" fill="var(--ink)" font-weight="700" letter-spacing="0.8">CPT CITY</text>
					<circle cx="102" cy="180" r="1.5" fill="var(--ink-dim)" />
					<text x="107" y="182" font-size="6" fill="var(--ink-dim)">CAPE POINT</text>
					<circle cx="88" cy="10" r="1.5" fill="var(--ink-dim)" />
					<text x="93" y="12" font-size="6" fill="var(--ink-dim)">MELKBOSSTRAND</text>
					<circle cx="45" cy="-68" r="1.5" fill="var(--ink-dim)" />
					<text x="50" y="-66" font-size="6" fill="var(--ink-dim)">YZERFONTEIN</text>
					<circle cx="265" cy="165" r="1.5" fill="var(--ink-dim)" />
					<text x="260" y="158" font-size="6" fill="var(--ink-dim)">HERMANUS</text>
				</g>
			</svg>
		</div>

		<!-- Survey metadata -->
		<div class="flex flex-grow flex-col justify-between self-stretch border-l border-line py-1 pl-6 font-mono text-xxs leading-relaxed">
			<div>
				<div class="mb-1 text-[11px] font-bold tracking-wider text-ink uppercase">
					Cape Peninsula Survey
				</div>
				<div class="grid grid-cols-2 gap-x-2 gap-y-1 text-dim">
					<div>PROJECTION:</div><div class="text-ink">TRANS_MERCATOR</div>
					<div>DATUM:</div><div class="text-ink">WGS84</div>
					<div>COORDS:</div><div class="text-ink">33.9249° S, 18.4241° E</div>
					<div>ELEVATION:</div><div class="text-ink">0m - 1086m (TABLE MT.)</div>
					<div>VAR_N:</div><div class="text-ink">25.3° W (ANNUAL 0.1° W)</div>
					<div>TRACE:</div>
					<div class="text-ink"><Readout value={route_pc} pad={3} suffix="%" /></div>
				</div>
			</div>

			<!-- Scale and compass -->
			<div class="flex items-center justify-between border-t border-dashed border-line pt-2">
				<div class="flex flex-col gap-0.5">
					<span class="text-micro text-dim">SCALE: 1 : 250,000</span>
					<div class="flex items-center gap-1">
						<div class="relative h-1 w-10 border border-line p-[0.5px]">
							<div class="h-full w-1/2 bg-ink"></div>
						</div>
						<span class="text-nano text-dim">5 KM</span>
					</div>
				</div>

				<div class="flex items-center gap-1.5 pr-2">
					<div class="relative flex h-6 w-6 items-center justify-center rounded-full border border-line">
						<div class="absolute h-4 w-0.5 bg-line"></div>
						<div
							class="absolute top-1 h-0 w-0 border-r-[2px] border-b-[4px] border-l-[2px] border-r-transparent border-b-accent border-l-transparent"
						></div>
						<span class="absolute -top-1.5 text-pico font-bold text-accent">N</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</Panel>
