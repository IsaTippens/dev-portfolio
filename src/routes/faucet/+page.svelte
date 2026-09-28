<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Readout from '$lib/components/Readout.svelte';
	import { motionEnabled } from '$lib/motion';

	/**
	 * ISA_FAUCET — the 2022 joke post ("there is currently 10.1 bitcoins in my wallet"),
	 * rebuilt as hardware. Nothing links here; robots.txt tells crawlers to stay out,
	 * which is precisely what sends a curious human in. It is flag 3 of the console CTF
	 * (walkthrough: `$lib/ctf/SOLUTIONS.md`).
	 *
	 * The payout is a Rickroll. The flag is the cold-storage seed: its MD5 rides on the
	 * SEED row as a data attribute, and the recovery line names the tool that opens it.
	 */
	const PAYOUT = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
	const SEED_MD5 = '36cd38f49b9afa08222c0dc9ebfe35eb';

	let claims = $state(0);
	// The status line strikes up like a screen when it changes — unless motion is off,
	// in which case it just changes.
	let flicker = $state(false);

	function claim() {
		claims += 1;
		flicker = motionEnabled();
	}
</script>

<svelte:head>
	<title>ISA_FAUCET — Isa Tippens</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader pathName="FAUCET" title="ISA_FAUCET // 10.1 BTC AVAILABLE" stats="NODE: COLD_STORAGE" />

<Panel tag="ISA_FAUCET" tag_tone="accent" screws class="p-4 pt-6 sm:p-6">
	<div class="grid gap-5">
		<!-- The balance screen. -->
		<div
			class="scanlines relative overflow-hidden border border-[var(--hw-screen-line)] bg-[var(--hw-screen)] px-4 py-3 font-mono text-[var(--hw-screen-ink)]"
			style="text-shadow: var(--hw-screen-glow)"
		>
			<div
				class="flex items-center justify-between text-micro uppercase tracking-widest text-[var(--hw-screen-ink-dim)]"
			>
				<span>WALLET_BALANCE</span>
				<span>NET: MAINNET-ISH</span>
			</div>
			<div class="mt-2 flex items-baseline gap-2">
				<span class="text-4xl font-bold tabular-nums tracking-tight">10.1</span>
				<span class="text-xs font-bold tracking-widest">BTC</span>
			</div>
			<div class="mt-1 text-micro uppercase tracking-widest text-[var(--hw-screen-ink-dim)]">
				SATS: <Readout value={1_010_000_000} />
			</div>
		</div>

		<dl class="grid gap-2 font-mono text-tiny uppercase tracking-widest">
			<div class="flex justify-between gap-4 border-b border-line pb-2">
				<dt class="text-dim">WALLET</dt>
				<dd class="truncate text-ink">bc1q-isa-tippens-definitely-real</dd>
			</div>
			<div class="flex justify-between gap-4 border-b border-line pb-2">
				<dt class="text-dim">PAYOUT</dt>
				<dd class="text-ink">10.1 BTC / CLAIM, ONE PER HUMAN</dd>
			</div>
			<div class="flex justify-between gap-4 border-b border-line pb-2">
				<dt class="text-dim">FEES</dt>
				<dd class="text-ink">NONE. SUSPICIOUSLY NONE.</dd>
			</div>
			<div class="flex justify-between gap-4" aria-live="polite">
				<dt class="text-dim">STATUS</dt>
				{#key claims}
					<dd class="flex items-center gap-2 text-ink" class:crt-on={flicker}>
						<span class="led" data-on={claims ? 'true' : 'ok'} aria-hidden="true"></span>
						{claims ? `PAYOUT_FAILED x${claims} // NEVER_GONNA_GIVE_YOU_UP` : 'PAYOUT_READY'}
					</dd>
				{/key}
			</div>
		</dl>

		<div class="flex flex-wrap items-center justify-between gap-3">
			<span class="text-micro uppercase tracking-widest text-dim">PAID OUT TO DATE: 0.0 BTC</span>
			<a
				href={PAYOUT}
				target="_blank"
				rel="noopener noreferrer"
				class="hbtn px-4 py-2 text-xs"
				onclick={claim}
			>
				{claims ? 'CLAIM AGAIN' : 'CLAIM 10.1 BTC'}
			</a>
		</div>

		<Panel sunk tag="COLD_STORAGE" class="p-3 pt-5">
			<dl class="grid gap-2 font-mono text-tiny uppercase tracking-widest">
				<div class="flex justify-between gap-4">
					<dt class="text-dim">SEED</dt>
					<dd class="text-ink" data-seed-md5={SEED_MD5}>{'ISA{******}'} // LOCKED</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-dim">RECOVERY</dt>
					<dd class="normal-case tracking-normal text-ink">
						HASHCAT: adwanced paffword recovowy toowl
					</dd>
				</div>
			</dl>
		</Panel>
	</div>
</Panel>
