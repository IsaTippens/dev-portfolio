import { get } from 'svelte/store';
import { plates, theme, unlockPlate } from '$lib/stores/theme';

/**
 * The devtools console is a service port. Open it and the device draws itself, says
 * who to email about a job, and hands over `window.isa`: the front door of a small
 * four-flag CTF — a jeopardy round in miniature, the kind the UWC cyber teams train on.
 *
 * Each flag says where the next one lives:
 *   1. here — TAPE_01 in `isa.help()`, XOR-scrambled
 *   2. an `x-flag` header on /api/posts, ROT13
 *   3. robots.txt -> /faucet, an MD5 for hashcat and rockyou
 *   4. view-source — a Vigenère tape in app.html, keyed with flag 3
 * Landing 4 breaks the seal on the MR ROBOT plate. The full walkthrough, answers
 * included, is SOLUTIONS.md next to this file.
 *
 * Nothing in here holds an answer in the clear: flags are checked against SHA-256
 * digests, and TAPE_01 ships already scrambled. Reading the bundle gets you the
 * route, not the flags.
 */

declare global {
	interface Window {
		isa?: {
			help(): void;
			stretch(): string;
			flag(value: string): void;
		};
	}
}

/** SHA-256 of each flag in chain order, and what the operator hears when it lands. */
const FLAGS = [
	{
		sha256: '2e55b8f62f38f8b792d89538a3c713ad9a210e342532b015630c0e9710024440',
		note: 'A response body is for customers. Operators read what arrives before it.'
	},
	{
		sha256: '92dd09631623db7c6e389c44ddf72eb950d6678d0801964ff91e27321750d5af',
		note: 'Robots get told where not to look. You are not a robot. Probably.'
	},
	{
		sha256: 'd2c8aa222e1094560b7857cc8f7a0abf642e88cc7dbd9c9bb344bf4eac683daf',
		note: 'Keep that word, the last tape is sealed with it. Look at the page from behind.'
	},
	{
		sha256: '892141e260326e4c1f89c950370dc4e7802a8f86d11e9550fa32787e84f5b7cf',
		note: 'That is the whole chain.'
	}
];

/** Flag 1, XOR-ed byte by byte with 42 and written out as hex. */
const TAPE_01 = '63 79 6B 51 49 5F 58 46 75 07 43 75 05 4B 5A 43 05 5A 45 59 5E 59 57';

/** The plate the last flag unseals. */
const PRIZE = 'mrrobot';

/** Which flags this browser has landed, as a string of flag numbers ("124"). */
const PROGRESS_KEY = 'ctf-flags';

const REJECTIONS = [
	'Nope. Get gud.',
	'That is a guess wearing a flag costume.',
	'Hashes do not do "close". Neither do SANReN judges.',
	'Your input reached the server so fast it forgot to register it. (It did not.)',
	'Wrong, but with confidence. Respect.'
];

// `(@)` marks a knob cap; the banner paints each one in its plate's knob colour.
const DEVICE = String.raw`
 ______________________________________________________
|  ISA-1  FIELD UNIT             (@)  (@)  (@)  (@)    |
|  .-------------------------.                         |
|  | HELLO, OPERATOR_        |   [#] [ ] [ ] [ ] [ ]   |
|  |  _/\_  _/\/\_   _/\_    |   [ ] [ ] [ ] [#] [ ]   |
|  '-------------------------'   (T) (1) (2) (3) (4)   |
|     [#] [#]     [#] [#] [#]     [#] [#]     [#]      |
|   [_] [_] [_] [_] [_] [_] [_] [_] [_] [_] [_] [_]    |
|______________________________________________________|`;

const TROPHY = String.raw`
 ____________________________________
|  root@ecorp:~# ./fsociety.sh       |
|                                    |
|  > shell ............. [ OWNED ]   |
|  > seal .............. [ BROKEN ]  |
|  > plate ............. MR ROBOT    |
|                                    |
|  hello, friend._                   |
|____________________________________|`;

/**
 * Console styles, read from the fitted plate at print time, so the console wears the
 * same faceplate as the page. Labels are chips (accent-ink on accent) because that
 * pair is tuned for contrast on every plate; bare accent text is not tuned against
 * the devtools background, so it is never used on its own.
 */
function styles() {
	const css = getComputedStyle(document.documentElement);
	const read = (name: string) => css.getPropertyValue(name).trim();
	return {
		chip: `background: ${read('--accent')}; color: ${read('--accent-ink')}; font-weight: bold; padding: 1px 6px;`,
		bold: 'font-weight: bold;',
		knobs: [1, 2, 3, 4].map((n) => `color: ${read(`--hw-knob-${n}`)}; font-weight: bold;`)
	};
}

function progress(): Set<number> {
	try {
		return new Set(Array.from(localStorage.getItem(PROGRESS_KEY) ?? '', Number));
	} catch {
		return new Set();
	}
}

function record(n: number) {
	const got = progress().add(n);
	try {
		localStorage.setItem(PROGRESS_KEY, [...got].sort().join(''));
	} catch {
		/* private mode: progress lasts as long as the tab */
	}
}

function banner() {
	const s = styles();
	const knob_styles: string[] = [];
	let knob = 0;
	const art = DEVICE.replace(/\(@\)/g, () => {
		knob_styles.push(s.knobs[knob++ % s.knobs.length], '');
		return '%c(@)%c';
	});
	console.log(art, ...knob_styles);
	console.log(
		'%cISA TIPPENS%c software engineer, Cape Town\nhiring? isatippens2@gmail.com\ntype %cisa.help()',
		s.chip,
		'',
		s.bold
	);
}

function help() {
	const s = styles();
	const got = progress();
	const boxes = FLAGS.map((_, i) => (got.has(i + 1) ? '[x]' : '[ ]')).join('');
	const won = get(plates).some((p) => p.id === PRIZE);
	console.log(
		[
			'%cISA-1 // SERVICE MENU%c',
			'',
			'  isa.help()              this menu',
			'  isa.stretch()           issssaaaaaaaaah',
			"  isa.flag('ISA{...}')    submit a flag",
			'',
			`CTF // ${FLAGS.length} FLAGS, FORMAT ISA{...}. EACH ONE SAYS WHERE THE NEXT ONE IS.`,
			`  PROGRESS ${boxes}${won ? '  // MR ROBOT PLATE UNLOCKED' : ''}`,
			'',
			`TAPE_01 // ${TAPE_01.split(' ').length} BYTES, SCRAMBLED`,
			`  ${TAPE_01}`,
			'',
			'  every byte went through the same gate, with the same key.',
			'  the gate outputs 1 only when its two inputs disagree.',
			'  the key is the answer to life, the universe and everything.'
		].join('\n'),
		s.chip,
		''
	);
}

/** The Contract-1 event: the layout plays the stretched-name hold on it. */
function stretch() {
	window.dispatchEvent(new CustomEvent('isa:stretch'));
	return 'issssaaaaaaaaah';
}

async function submit(value: unknown) {
	const s = styles();
	const match = typeof value === 'string' ? /^\s*isa\{(.+)\}\s*$/i.exec(value) : null;
	if (!match) {
		console.log("%cFORMAT%c isa.flag('ISA{...}'), quotes included", s.chip, '');
		return;
	}
	// SubtleCrypto only exists in a secure context; production is https, dev is localhost.
	if (typeof crypto === 'undefined' || !crypto.subtle) {
		console.log('%cNO_CRYPTO%c flag checks need https (or localhost).', s.chip, '');
		return;
	}

	// Flags are lowercase inside the braces, so `ISA{Source}` is not a wrong answer.
	const candidate = new TextEncoder().encode(`ISA{${match[1].toLowerCase()}}`);
	const digest = Array.from(
		new Uint8Array(await crypto.subtle.digest('SHA-256', candidate)),
		(b) => b.toString(16).padStart(2, '0')
	).join('');
	const n = FLAGS.findIndex((f) => f.sha256 === digest) + 1;
	if (n === 0) {
		const quip = REJECTIONS[Math.floor(Math.random() * REJECTIONS.length)];
		console.log(`%cREJECTED%c ${quip}`, s.chip, '');
		return;
	}

	record(n);
	console.log(`%cFLAG ${n}/${FLAGS.length} ACCEPTED%c ${FLAGS[n - 1].note}`, s.chip, '');
	if (n < FLAGS.length) return;

	unlockPlate(PRIZE);
	theme.set(PRIZE);
	// The layout fits the new plate on its next effect flush. Wait a frame so the
	// terminal is printed in the plate's own red, not the plate it just replaced.
	const frame = Promise.withResolvers<number>();
	requestAnimationFrame(frame.resolve);
	await frame.promise;
	const won = styles();
	console.log(`%c${TROPHY}`, won.knobs[0]);
	console.log(
		'%cPLATE_UNLOCKED: MR ROBOT%c Red on black, fitted now and on the MODE dial for good.\nTell me you got in: isatippens2@gmail.com',
		won.chip,
		''
	);
}

function flag(value: string) {
	// Fire and forget: returning the promise would make devtools print `Promise {…}`
	// above the verdict.
	void submit(value);
}

export function installConsole(): () => void {
	const isa = { help, stretch, flag };
	window.isa = isa;
	banner();
	return () => {
		if (window.isa === isa) delete window.isa;
	};
}
