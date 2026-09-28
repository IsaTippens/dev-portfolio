<script lang="ts">
	import { page } from '$app/state';

	/**
	 * The paper manual. Ctrl+P on a hardware UI should print what hardware ships with:
	 * a spec sheet, a controls diagram and a safety block, then the current program.
	 *
	 * Paper-only. `hidden` keeps it off screen and out of the accessibility tree (it
	 * would read as a second copy of the site); `print.css` fits it for paper and lifts
	 * it above the page content so the cover prints first. No motion, no state: paper
	 * does not animate, so there is no reduced-motion path to take.
	 */

	const SPECS = [
		{ label: 'MODEL', value: 'IT-01' },
		{ label: 'LOCATION', value: 'Cape Town, South Africa (33.9249°S 18.4241°E)' },
		{ label: 'ROLE', value: 'Chief Technology Officer, Alphacrest' },
		{ label: 'EDUCATION', value: 'MSc Computer Science, UWC (final year)' },
		{ label: 'THESIS', value: 'Secure financial transactions using relativistic quantum tokens' },
		{ label: 'LANGUAGES', value: 'Rust, Go, Python' },
		{ label: 'POWER', value: 'USB-C PD, 20V 3A. Coffee accepted.' }
	];

	const PORTS = [
		{ label: 'CONTACT', text: 'isatippens2@gmail.com', href: 'mailto:isatippens2@gmail.com' },
		{ label: 'SOURCE', text: 'github.com/IsaTippens', href: 'https://github.com/IsaTippens' },
		{ label: 'WEB', text: 'isatippens.com', href: 'https://isatippens.com' }
	];

	const F_KEYS = [
		{ key: 'F1', label: 'BLOG' },
		{ key: 'F2', label: 'PROJECTS' },
		{ key: 'F3', label: 'RESUME' },
		{ key: 'F4', label: 'GEAR' }
	];

	// Written out rather than read from the theme store's registry: the manual documents
	// the plates the unit ships with, and anything the registry holds beyond those is not
	// something a manual should be the one to mention.
	const PLATES = [
		{ id: 'LIGHT', note: 'paper + ink' },
		{ id: 'DARK', note: 'charcoal + off-white' },
		{ id: 'PHOSPHOR', note: 'green phosphor scope' },
		{ id: 'GAMEBOY', note: 'four-tone DMG' },
		{ id: 'PS1', note: 'console grey + symbols' },
		{ id: 'PS2', note: 'charcoal black + wordmark blue' }
	];

	const SAFETY = [
		'Do not submerge. The unit is not rated for the Atlantic, or for False Bay.',
		'Contains no user-serviceable parts; the MSc is still in progress.',
		'Operating temperature 12 °C to 28 °C. Uptime outside this range is loadshedding-dependent.',
		'Do not operate with League of Legends installed. Symptoms resolve on uninstall.',
		'Twelve demons completed. A thirteenth is not covered by warranty.',
		'The unit may emit stretched vowels (issssaaaaah). This is normal.',
		'Printing this manual does not charge the battery.'
	];
</script>

<section class="print-manual" hidden aria-label="User manual">
	<div class="bar">
		<span>ISA TIPPENS // USER MANUAL</span>
		<span>PRINTED FROM: {page.url.pathname}</span>
		<span>REV 2026.06</span>
	</div>

	<header class="cover">
		<h1>ISA TIPPENS <span class="slash">// USER MANUAL</span></h1>
		<p class="model">IT-01 SOFTWARE ENGINEER, CAPE TOWN</p>
		<p class="lede">
			Read this manual before operating the unit. Keep it for future reference, or recycle
			it with the rest of the paper.
		</p>
	</header>

	<section class="block">
		<h2><span class="num">01</span>SPECIFICATIONS</h2>
		<table>
			<tbody>
				{#each SPECS as row (row.label)}
					<tr>
						<th scope="row">{row.label}</th>
						<td>{row.value}</td>
					</tr>
				{/each}
				{#each PORTS as row (row.label)}
					<tr>
						<th scope="row">{row.label}</th>
						<td><a href={row.href}>{row.text}</a></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<section class="block">
		<h2><span class="num">02</span>CONTROLS</h2>
		<div class="controls">
			<ol class="keys" aria-label="Function keys">
				{#each F_KEYS as k (k.key)}
					<li>
						<kbd>{k.key}</kbd>
						<span>{k.label}</span>
					</li>
				{/each}
			</ol>
			<dl class="legend">
				<dt><kbd>?</kbd></dt>
				<dd>KEY MAP, open / close</dd>
				<dt><kbd>ESC</kbd></dt>
				<dd>close the key map</dd>
				<dt><kbd>J</kbd> <kbd>K</kbd></dt>
				<dd>next / previous row, blog and projects</dd>
				<dt><kbd>MODE</kbd></dt>
				<dd>change faceplate (status bar dial)</dd>
				<dt><kbd>BAT</kbd></dt>
				<dd>connect / disconnect charger</dd>
			</dl>
		</div>
	</section>

	<section class="block">
		<h2><span class="num">03</span>FACEPLATES</h2>
		<ol class="plates">
			{#each PLATES as plate, i (plate.id)}
				<li>
					<span class="idx">{String(i + 1).padStart(2, '0')}</span>
					<span class="plate-id">{plate.id}</span>
					<span class="note">{plate.note}</span>
				</li>
			{/each}
		</ol>
		<p class="fine">
			Fitted at the factory to match the host: PS1 under a light OS, PS2 under a dark one.
			Swap with the MODE dial. Paper is always LIGHT.
		</p>
	</section>

	<section class="block safety">
		<h2><span class="num">04</span>SAFETY</h2>
		<ul>
			{#each SAFETY as line (line)}
				<li>{line}</li>
			{/each}
		</ul>
	</section>

</section>

<style>
	/* Only ever laid out on paper, so sizes are in points and colours are the paper
	   plate's tokens, which print.css fits for the length of the print. */
	.print-manual {
		font-family: var(--font-mono);
		font-size: 9pt;
		line-height: 1.45;
		color: var(--ink);
		/* The ink bar and keycap fills are the manual's only solid areas; without this
		   most browsers drop backgrounds and the bar prints as white text on nothing. */
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}

	.bar {
		display: flex;
		justify-content: space-between;
		padding: 1.5mm 3mm;
		background: var(--ink);
		color: var(--panel);
		font-size: 7pt;
		font-weight: 700;
		letter-spacing: 0.15em;
	}

	.cover {
		padding: 7mm 0 5mm;
		border-bottom: 1.5pt solid var(--ink);
	}

	h1 {
		margin: 0;
		font-size: 24pt;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.01em;
	}

	.slash {
		color: var(--ink-dim);
		font-weight: 400;
	}

	.model {
		margin: 3mm 0 0;
		font-size: 10pt;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--accent);
	}

	.lede {
		margin: 2mm 0 0;
		max-width: 120mm;
		color: var(--ink-dim);
	}

	.block {
		margin-top: 4.5mm;
		break-inside: avoid;
	}

	h2 {
		display: flex;
		align-items: baseline;
		gap: 3mm;
		margin: 0 0 2.5mm;
		padding-bottom: 1mm;
		border-bottom: 0.5pt solid var(--line);
		font-size: 8pt;
		font-weight: 700;
		letter-spacing: 0.2em;
	}

	.num {
		color: var(--accent);
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.6mm 0;
		border-bottom: 0.5pt dotted var(--line);
		text-align: left;
		vertical-align: top;
	}

	th {
		width: 32mm;
		font-weight: 400;
		font-size: 7pt;
		letter-spacing: 0.15em;
		color: var(--ink-dim);
	}

	a {
		color: var(--ink);
		text-decoration: none;
	}

	.controls {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 8mm;
		align-items: start;
	}

	kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 8mm;
		height: 6mm;
		padding: 0 1.5mm;
		border: 0.75pt solid var(--ink);
		border-radius: 1mm;
		box-shadow: 0.75pt 0.75pt 0 var(--ink);
		background: var(--panel);
		font-family: var(--font-mono);
		font-size: 8pt;
		font-weight: 700;
	}

	.keys {
		display: flex;
		gap: 2mm;
		margin: 0;
		padding: 2.5mm;
		list-style: none;
		border: 0.75pt solid var(--line);
		border-radius: 1.5mm;
		background: var(--panel-sunk);
	}

	.keys li {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5mm;
	}

	.keys kbd {
		width: 12mm;
		height: 10mm;
	}

	.keys span {
		font-size: 6.5pt;
		letter-spacing: 0.12em;
		color: var(--ink-dim);
	}

	.legend {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1mm 3mm;
		align-items: center;
		margin: 0;
	}

	.legend dt {
		display: flex;
		gap: 1mm;
	}

	.legend dd {
		margin: 0;
		color: var(--ink-dim);
	}

	.plates {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1mm 6mm;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.plates li {
		display: flex;
		gap: 2mm;
		align-items: baseline;
	}

	.idx {
		color: var(--accent);
		font-size: 7pt;
	}

	.plate-id {
		font-weight: 700;
	}

	.note,
	.fine {
		color: var(--ink-dim);
		font-size: 7.5pt;
	}

	.fine {
		margin: 2.5mm 0 0;
	}

	.safety ul {
		margin: 0;
		padding: 2.5mm 4mm;
		list-style: none;
		border: 0.75pt solid var(--ink);
	}

	.safety li {
		padding-left: 4mm;
		text-indent: -4mm;
	}

	.safety li::before {
		content: '!';
		display: inline-block;
		width: 4mm;
		text-indent: 0;
		font-weight: 700;
		color: var(--accent);
	}
</style>
