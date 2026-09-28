<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Panel from '$lib/components/Panel.svelte';
	import { MAX_DURATION, PANEL, SNAP, STEPS_FLICKER, motionEnabled } from '$lib/motion';
	import { theme, unlockPlate } from '$lib/stores/theme';

	/**
	 * Active log. Read-only telemetry, so the rows are a table and not a control surface.
	 */
	const ROWS = [
		{ game: 'Valorant', stat: 'PEAK PLATINUM 3', platform: 'PC (RIOT)' },
		{ game: 'Geometry Dash', stat: '12 DEMONS COMPLETED', platform: 'PC (STEAM)' },
		{ game: 'Fortnite', stat: 'ZERO BUILD MODE', platform: 'PC (EPIC)' },
		{ game: "No Man's Sky", stat: 'SINGLE PLAYER', platform: 'PC (STEAM)' },
		{ game: 'Into the Dead: ODD', stat: 'SINGLE PLAYER', platform: 'PC (STEAM)' }
	];

	const HEADINGS = ['Game Title', 'Stats / Mode', 'Platform'];

	/*
		The one exception to "not a control surface": the Geometry Dash row carries its
		own cube. Space or a tap makes it jump; now and then it crashes and the attempt
		counter ticks over, same as the real game. Twelve clean jumps in a row is one
		more than the log admits to, so the row starts wondering about a thirteenth demon.
	*/
	const GD = 'Geometry Dash';
	const ATTEMPTS_KEY = 'gd-attempts';
	const DEMON_KEY = 'gd-demon13';
	/** Roughly one jump in eight clips a spike. */
	const CRASH_ODDS = 1 / 8;
	/** Twelve demons on the record; twelve clean jumps earns the question mark. */
	const DEMON_STREAK = 12;
	const DEMON_HOLD = 3200;

	/*
		The hop is a sprite, not a panel: it moves in frames, the way the game draws it.
		Eight samples of a parabola with the quarter-turn spread across them, played
		through steps() so each sample holds for a frame and nothing is eased between.
	*/
	const HOP = PANEL;
	const HOP_FRAMES = 8;
	const HOP_HEIGHT = 7;
	const HOP_KEYS: Keyframe[] = Array.from({ length: HOP_FRAMES + 1 }, (_, i) => {
		const t = i / HOP_FRAMES;
		const y = -4 * HOP_HEIGHT * t * (1 - t);
		return { transform: `translateY(${y.toFixed(2)}px) rotate(${90 * t}deg)` };
	});

	/** Crash debris: four chips thrown to the corners. */
	const SHARDS = [
		[-6, -6],
		[6, -6],
		[-6, 6],
		[6, 6]
	] as const;

	let cube = $state<HTMLButtonElement>();
	let body = $state<HTMLSpanElement>();
	let shards = $state<HTMLSpanElement[]>([]);
	let attempt_el = $state<HTMLSpanElement>();

	/** 0 until the first jump ever, then the attempt in progress. */
	let attempts = $state(0);
	let demon13 = $state(false);
	let show_demon = $state(false);

	/** Clean landings since the last crash. Session-only, like a run. */
	let streak = 0;
	/** Jumps are dropped until the cube is back on the ground, so a held key repeats at hop cadence. */
	let busy_until = 0;
	/** Set when Space already jumped on keydown, so the button's own keyup click is ignored. */
	let space_consumed = false;
	let demon_timer: ReturnType<typeof setTimeout> | undefined;
	let running: Animation[] = [];

	function store(key: string, value: string) {
		try {
			localStorage.setItem(key, value);
		} catch {
			// Storage can be off (private mode, quota). The cube still jumps; it just forgets.
		}
	}

	function play(el: Element | undefined, keys: Keyframe[], options: KeyframeAnimationOptions) {
		if (!el) return;
		const anim = el.animate(keys, options);
		running.push(anim);
		anim.onfinish = anim.oncancel = () => {
			running = running.filter((a) => a !== anim);
		};
	}

	function hop() {
		play(body, HOP_KEYS, { duration: HOP, easing: `steps(${HOP_FRAMES}, end)` });
	}

	function crash() {
		// Body drops out, then flash-steps back in on the spawn point.
		play(body, [{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }, { opacity: 0 }, { opacity: 1 }], {
			duration: MAX_DURATION,
			easing: 'steps(4, end)'
		});
		shards.forEach((shard, i) => {
			const [dx, dy] = SHARDS[i];
			play(
				shard,
				[
					{ transform: 'translate(0, 0)', opacity: 1 },
					{ transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
				],
				{ duration: SNAP, easing: `steps(${STEPS_FLICKER}, end)` }
			);
		});
	}

	async function blink_attempt() {
		// The counter may only just have mounted on this crash.
		await tick();
		// Held until the respawn, where the game flashes it too.
		play(attempt_el, [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }, { opacity: 0 }, { opacity: 1 }], {
			duration: MAX_DURATION,
			delay: SNAP,
			easing: 'steps(4, end)'
		});
	}

	function jump() {
		const now = performance.now();
		if (now < busy_until) return;

		const animated = motionEnabled();
		const crashed = Math.random() < CRASH_ODDS;

		if (attempts === 0) attempts = 1;

		if (crashed) {
			streak = 0;
			attempts += 1;
			busy_until = now + (animated ? MAX_DURATION : HOP);
			if (animated) {
				crash();
				blink_attempt();
			}
		} else {
			streak += 1;
			busy_until = now + HOP;
			if (animated) hop();
			if (streak >= DEMON_STREAK) {
				streak = 0;
				// The first run of twelve wins the GD plate and fits it on the spot; later
				// runs only replay the banner, so a plate picked since is left alone.
				if (!demon13) {
					unlockPlate('gd');
					theme.set('gd');
				}
				demon13 = true;
				show_demon = true;
				store(DEMON_KEY, '1');
				clearTimeout(demon_timer);
				demon_timer = setTimeout(() => (show_demon = false), DEMON_HOLD);
			}
		}

		store(ATTEMPTS_KEY, String(attempts));
	}

	function is_space(event: KeyboardEvent) {
		return event.key === ' ' || event.code === 'Space';
	}

	/* Space jumps on the press, not the release: the game answers on keydown. */
	function on_cube_keydown(event: KeyboardEvent) {
		if (!is_space(event) || event.metaKey || event.ctrlKey || event.altKey) return;
		event.preventDefault();
		space_consumed = true;
		jump();
	}

	function on_cube_keyup(event: KeyboardEvent) {
		if (!is_space(event)) return;
		event.preventDefault();
		setTimeout(() => (space_consumed = false));
	}

	function on_cube_click(event: MouseEvent) {
		// A keyboard click (detail 0) right after a Space keydown already jumped.
		if (event.detail === 0 && space_consumed) {
			space_consumed = false;
			return;
		}
		jump();
	}

	/*
		Hovering the row is enough to play, but only when nothing else holds focus: Space
		on a focused link or field belongs to that element, and anywhere off the row the
		page keeps its scroll.
	*/
	function on_window_keydown(event: KeyboardEvent) {
		if (event.defaultPrevented || !is_space(event)) return;
		if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
		if (event.target !== document.body && event.target !== document.documentElement) return;
		if (!cube?.closest('tr')?.matches(':hover')) return;
		event.preventDefault();
		jump();
	}

	onMount(() => {
		try {
			const saved = Number(localStorage.getItem(ATTEMPTS_KEY));
			if (Number.isInteger(saved) && saved > 0) attempts = saved;
			demon13 = localStorage.getItem(DEMON_KEY) === '1';
			// Earned before the GD plate existed: the seal is already broken, quietly.
			if (demon13) unlockPlate('gd');
		} catch {
			// No storage: every visit is attempt 1.
		}

		return () => {
			clearTimeout(demon_timer);
			running.forEach((a) => a.cancel());
		};
	});
</script>

<svelte:window onkeydown={on_window_keydown} />

<!-- The scroller is inside the panel, not the panel itself: an overflow box would clip
     the module tag that sits across the top edge. -->
<Panel tag="GAMING_LOG">
	<div class="overflow-x-auto">
		<table class="w-full border-collapse text-left font-mono text-xs">
			<thead>
				<tr class="border-b border-line bg-sunk">
					{#each HEADINGS as heading, i (heading)}
						<th
							class="p-2 text-xxs font-bold tracking-wider text-ink uppercase {i <
							HEADINGS.length - 1
								? 'border-r border-line'
								: ''}"
						>
							{heading}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each ROWS as row (row.game)}
					<tr class="border-b border-line last:border-b-0 hover:bg-hover">
						<td class="border-r border-line p-2 font-bold text-ink uppercase">
							{row.game}
							{#if row.game === GD}
								<!-- 10px cube, with an invisible pad around it so a thumb can find it. -->
								<button
									bind:this={cube}
									type="button"
									aria-label="Jump"
									class="relative ml-1.5 inline-grid h-2.5 w-2.5 touch-manipulation place-items-center align-[-1px] before:absolute before:-inset-2.5 before:content-['']"
									onclick={on_cube_click}
									onkeydown={on_cube_keydown}
									onkeyup={on_cube_keyup}
								>
									<span
										bind:this={body}
										class="block h-2.5 w-2.5 border border-accent p-px"
										aria-hidden="true"
									>
										<span class="block h-full w-full bg-accent"></span>
									</span>
									{#each SHARDS as shard, i (shard)}
										<span
											bind:this={shards[i]}
											class="pointer-events-none absolute top-1/2 left-1/2 -mt-0.5 -ml-0.5 h-1 w-1 bg-accent opacity-0"
											aria-hidden="true"
										></span>
									{/each}
								</button>
							{/if}
						</td>
						<td class="border-r border-line p-2 text-dim">
							{row.stat}
							{#if row.game === GD}
								{#if demon13}
									<!-- The thirteenth tally mark: claimed, not verified. -->
									<span
										class="ml-0.5 inline-block h-2.5 w-px bg-accent align-[-1px]"
										title="DEMON 13 // UNVERIFIED"
										aria-hidden="true"
									></span>
									<span class="sr-only">, demon 13 unverified</span>
								{/if}
								<span aria-live="polite">
									{#if attempts > 0}
										<span
											bind:this={attempt_el}
											class="ml-2 inline-block text-xxs tracking-wider whitespace-nowrap"
										>
											ATTEMPT {attempts}
										</span>
									{/if}
									{#if show_demon}
										<span
											class="ml-2 inline-block text-xxs font-bold tracking-wider whitespace-nowrap text-accent"
										>
											DEMON 13?
										</span>
									{/if}
								</span>
							{/if}
						</td>
						<td class="whitespace-nowrap p-2 text-dim">{row.platform}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</Panel>
