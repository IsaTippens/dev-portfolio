<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, steps } from 'animejs';
	import { MAX_DURATION, PANEL, STEPS_BLINK, TICK, motionEnabled } from '$lib/motion';

	/**
	 * QT-001 — one relativistic quantum token, the MSc thesis as a part you can poke.
	 *
	 * Three bits of physics, each a literal browser behaviour:
	 *   - Superposition: the serial has no value until somebody looks at it. Before the
	 *     token is properly on screen it churns; the first real look collapses it to one
	 *     serial, and that is the serial for the rest of the page view.
	 *   - No-cloning: an unknown quantum state cannot be copied, so neither can this.
	 *     Copy a selection that touches the token and the clipboard gets the theorem.
	 *   - Relativistic double-spend: a token redeemed in one place is spent everywhere
	 *     else. Every open tab is a location; they signal each other over a
	 *     BroadcastChannel and the earliest redemption wins.
	 */

	/** A redemption: which tab spent the token, and when. */
	type Claim = { from: string; at: number };

	const HEX = '0123456789ABCDEF';
	const UNOBSERVED = '????-????';
	const CLONE_TEXT = '∅ // NO-CLONING THEOREM';
	const SPENT_TEXT = 'SPENT AT ANOTHER LOCATION // RELATIVISTIC BOUND';

	/** How much of the token has to be on screen before it counts as observed. */
	const COLLAPSE_AT = 0.6;

	/*
		Tabs on one machine hear each other within a few milliseconds. A redeeming tab
		still waits a panel's length before it believes its own claim, so two tabs
		redeeming in the same instant settle on one winner before either reads REDEEMED.
		It is the light cone: you do not own the token until nobody could have beaten you.
	*/
	const LIGHT_CONE = PANEL;

	/** How long CLONE_REJECTED holds the label. A hold, not an animation. */
	const REJECT_HOLD = 1200;

	/** LED blink for a rejected clone: hard on/off, never a fade. */
	const REJECT_BLINK: Keyframe[] = Array.from({ length: STEPS_BLINK * 2 + 1 }, (_, i) => ({
		opacity: i % 2 ? 0.2 : 1,
		easing: 'steps(1, end)'
	}));

	let token: HTMLSpanElement | null = $state(null);
	let label_el: HTMLSpanElement | null = $state(null);

	/** What the readout shows right now: noise, the blank, or the observed serial. */
	let shown = $state(UNOBSERVED);
	/** The serial the measurement produced. Empty until collapse, then fixed. */
	let observed = $state('');
	let rejecting = $state(false);
	let pending = $state(false);
	/** Best claim this tab knows of. Raw so it can go straight into postMessage. */
	let claim = $state.raw<Claim | null>(null);

	let tab_id = '';
	let channel: BroadcastChannel | null = null;
	let cycle: ReturnType<typeof setInterval> | undefined;
	let reject_timer: ReturnType<typeof setTimeout> | undefined;
	let pending_timer: ReturnType<typeof setTimeout> | undefined;
	let settle: ReturnType<typeof animate> | undefined;

	const ledger = $derived(
		pending ? 'SIGNALLING' : claim === null ? null : claim.from === tab_id ? 'REDEEMED' : 'SPENT'
	);

	const label = $derived(
		rejecting
			? 'CLONE_REJECTED'
			: ledger === 'SIGNALLING'
				? 'SIGNALLING // AWAITING LIGHT CONE'
				: ledger === 'REDEEMED'
					? 'REDEEMED'
					: ledger === 'SPENT'
						? SPENT_TEXT
						: observed
							? 'COLLAPSED'
							: 'SUPERPOSED'
	);

	const led = $derived(
		rejecting || ledger === 'SPENT'
			? 'bg-rec'
			: ledger === 'REDEEMED'
				? 'bg-ok'
				: observed
					? 'bg-accent'
					: 'bg-dim'
	);

	/** Hex from the platform CSPRNG: the measurement outcome has to be genuinely random. */
	function hex(bytes: number) {
		const buf = crypto.getRandomValues(new Uint8Array(bytes));
		return Array.from(buf, (b) => b.toString(16).padStart(2, '0'))
			.join('')
			.toUpperCase();
	}

	/** Display noise only. Math.random is fine for something nobody keeps. */
	function noise(final = UNOBSERVED, locked = 0) {
		let out = '';
		for (let i = 0; i < final.length; i++) {
			if (final[i] === '-') out += '-';
			else if (i < locked) out += final[i];
			else out += HEX[Math.floor(Math.random() * HEX.length)];
		}
		return out;
	}

	function start_cycle() {
		if (cycle !== undefined || observed || !motionEnabled()) return;
		cycle = setInterval(() => (shown = noise()), TICK);
	}

	function stop_cycle() {
		clearInterval(cycle);
		cycle = undefined;
	}

	/** Measure. Runs once; after this the serial is a fact for the rest of the page view. */
	function collapse() {
		if (observed) return;
		stop_cycle();
		const raw = hex(4);
		const serial = `${raw.slice(0, 4)}-${raw.slice(4)}`;
		observed = serial;
		if (!motionEnabled()) {
			shown = serial;
			return;
		}
		// Lock left to right, one character per step, the way the boot decode does.
		const frames = serial.length;
		const proxy = { frame: 0 };
		settle = animate(proxy, {
			frame: frames,
			duration: PANEL,
			ease: steps(frames),
			onUpdate: () => {
				shown = noise(serial, proxy.frame);
			},
			onComplete: () => {
				shown = serial;
			}
		});
	}

	/** Earliest redemption wins; the tab id breaks an exact tie so every tab agrees. */
	function beats(a: Claim, b: Claim) {
		return a.at < b.at || (a.at === b.at && a.from < b.from);
	}

	function is_claim(value: unknown): value is Claim {
		if (typeof value !== 'object' || value === null) return false;
		const c = value as Record<string, unknown>;
		return typeof c.from === 'string' && typeof c.at === 'number';
	}

	/** Fold in a claim from elsewhere. A losing claim gets the winner sent back at it. */
	function learn(incoming: Claim) {
		if (claim === null || beats(incoming, claim)) {
			claim = incoming;
			return;
		}
		if (beats(claim, incoming)) channel?.postMessage({ t: 'claim', claim });
	}

	function redeem() {
		if (pending || ledger === 'REDEEMED') return;
		// Spending it is a measurement too: a superposed token collapses on redemption.
		collapse();
		const mine: Claim = { from: tab_id, at: Date.now() };
		if (claim === null || beats(mine, claim)) claim = mine;
		// No channel, no other locations to hear from: the token is simply spent here.
		if (!channel) return;
		channel.postMessage({ t: 'claim', claim: mine });
		pending = true;
		clearTimeout(pending_timer);
		pending_timer = setTimeout(() => (pending = false), LIGHT_CONE);
	}

	function reject_clone() {
		rejecting = true;
		clearTimeout(reject_timer);
		reject_timer = setTimeout(() => (rejecting = false), REJECT_HOLD);
		// Reduced motion holds the label lit for the same time, no blink.
		if (motionEnabled()) label_el?.animate(REJECT_BLINK, { duration: MAX_DURATION });
	}

	/*
		Copying is allowed right up until the selection touches the token. Selecting it
		stays completely normal on purpose: the theorem only shows up once you try to
		take a copy home.
	*/
	function on_copy(event: ClipboardEvent) {
		const selection = document.getSelection();
		if (!token || !selection || selection.isCollapsed) return;
		for (let i = 0; i < selection.rangeCount; i++) {
			if (!selection.getRangeAt(i).intersectsNode(token)) continue;
			event.preventDefault();
			event.clipboardData?.setData('text/plain', CLONE_TEXT);
			reject_clone();
			return;
		}
	}

	onMount(() => {
		tab_id = hex(8);
		document.addEventListener('copy', on_copy);

		let io: IntersectionObserver | undefined;
		if (typeof IntersectionObserver === 'undefined') {
			collapse();
		} else if (token) {
			// Churn only while at least partly visible; collapse once it is properly seen.
			io = new IntersectionObserver(
				(entries) => {
					const entry = entries[entries.length - 1];
					if (entry.intersectionRatio >= COLLAPSE_AT) {
						collapse();
						io?.disconnect();
					} else if (entry.isIntersecting) {
						start_cycle();
					} else {
						stop_cycle();
					}
				},
				{ threshold: [0, COLLAPSE_AT] }
			);
			io.observe(token);
		}

		if (typeof BroadcastChannel !== 'undefined') {
			channel = new BroadcastChannel('isa-qt');
			channel.onmessage = (event: MessageEvent) => {
				const msg: unknown = event.data;
				if (typeof msg !== 'object' || msg === null) return;
				const { t, claim: incoming } = msg as { t?: unknown; claim?: unknown };
				// A tab that opens late asks; anyone who knows the ledger answers.
				if (t === 'who-has') {
					if (claim) channel?.postMessage({ t: 'claim', claim });
				} else if (t === 'claim' && is_claim(incoming)) {
					learn(incoming);
				}
			};
			channel.postMessage({ t: 'who-has' });
		}

		return () => {
			document.removeEventListener('copy', on_copy);
			io?.disconnect();
			stop_cycle();
			settle?.pause();
			clearTimeout(reject_timer);
			clearTimeout(pending_timer);
			channel?.close();
			channel = null;
		};
	});
</script>

<div
	class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded border border-line bg-sunk px-2.5 py-2 font-mono"
>
	<span class="flex items-center gap-1.5 whitespace-nowrap">
		<span class="block h-1.5 w-1.5 shrink-0 rounded-full {led}" aria-hidden="true"></span>
		<span
			bind:this={token}
			role="img"
			aria-label="Quantum token QT-001, serial {observed || 'unobserved'}"
			class="text-xxs font-bold tracking-wider text-ink tabular-nums">QT-001 // {shown}</span
		>
	</span>
	<span
		bind:this={label_el}
		class="min-w-0 text-tiny font-bold tracking-wide break-words uppercase {rejecting ||
		ledger === 'SPENT'
			? 'text-ink'
			: 'text-dim'}"
		aria-live="polite"
		aria-atomic="true">[{label}]</span
	>
	<button
		type="button"
		class="hw-key ml-auto h-6 shrink-0 px-3 text-nano disabled:cursor-default disabled:opacity-60"
		disabled={pending || ledger === 'REDEEMED'}
		onclick={redeem}
	>
		REDEEM
	</button>
</div>
