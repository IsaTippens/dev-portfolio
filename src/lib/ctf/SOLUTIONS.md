# ISA-1 CTF: solutions

Spoilers. This file is for Isa. It is never imported, so it doesn't ship in the client bundle. If the repo is public, though, anyone can read the answers here.

Four flags, format `ISA{...}`, solved in order. Each flag's text tells you where the next one is. Submit flags in the devtools console with `isa.flag('ISA{...}')`. The check is case-insensitive inside the braces. The final flag unseals the hidden seventh faceplate, **MR ROBOT** (a red-on-black terminal).

| # | Where                                         | Encoding                 | Flag                                  |
| - | --------------------------------------------- | ------------------------ | ------------------------------------- |
| 1 | devtools console, `isa.help()` → `TAPE_01`    | hex, XOR key `0x2A` (42) | `ISA{curl_-i_/api/posts}`             |
| 2 | `x-flag` response header on `/api/posts`      | ROT13                    | `ISA{r0b0ts_kn0w_wh3r3_th3_m0n3y_is}` |
| 3 | `robots.txt` → `/faucet`, `data-seed-md5`     | MD5 of a rockyou word    | `ISA{source}`                         |
| 4 | view-source, HTML comment in `src/app.html`   | Vigenère, key `source`   | `ISA{w1nn3r_w1nn3r_uwc_d1nn3r}`       |

## 0. The way in

Opening devtools on any page shows the ASCII ISA-1 unit, `hiring? isatippens2@gmail.com` and `type isa.help()`. `window.isa` has three commands:

- `isa.help()`: the menu, the CTF rules, a progress row (`[x][ ][ ][ ]`), and `TAPE_01` with its riddle.
- `isa.stretch()`: fires `isa:stretch`, so the layout plays the stretched-name animation.
- `isa.flag('ISA{...}')`: checks a flag.

## 1. TAPE_01: XOR

`isa.help()` prints:

```
TAPE_01 // 23 BYTES, SCRAMBLED
  63 79 6B 51 49 5F 58 46 75 07 43 75 05 4B 5A 43 05 5A 45 59 5E 59 57

  every byte went through the same gate, with the same key.
  the gate outputs 1 only when its two inputs disagree.
  the key is the answer to life, the universe and everything.
```

The gate that outputs 1 when its inputs disagree is XOR. The key is 42 (`0x2A`).

```js
String.fromCharCode(
	...'63 79 6B 51 49 5F 58 46 75 07 43 75 05 4B 5A 43 05 5A 45 59 5E 59 57'
		.split(' ')
		.map((h) => parseInt(h, 16) ^ 42)
);
// 'ISA{curl_-i_/api/posts}'
```

In CyberChef this is `From Hex` → `XOR` (key `2A`, hex).

**Flag 1: `ISA{curl_-i_/api/posts}`.** The flag is the command for the next step: `curl -i` shows the response headers. Accepting it prints: *"A response body is for customers. Operators read what arrives before it."*

## 2. The response header: ROT13

```sh
curl -i https://isatippens.com/api/posts
# x-flag: VFN{e0o0gf_xa0j_ju3e3_gu3_z0a3l_vf}
```

`curl -I` (HEAD) works too, and so does the Network tab. The crib is `VFN{` against the known `ISA{` prefix: I→V, S→F and A→N are all a shift of 13.

```sh
echo 'VFN{e0o0gf_xa0j_ju3e3_gu3_z0a3l_vf}' | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

**Flag 2: `ISA{r0b0ts_kn0w_wh3r3_th3_m0n3y_is}`.** "Robots know where the money is" points at robots.txt and the faucet. Accepting it prints: *"Robots get told where not to look. You are not a robot. Probably."*

Source: `src/routes/api/posts/+server.js`. Only the ROT13 text is there, and it is server code.

## 3. The faucet: hashcat and rockyou

`https://isatippens.com/robots.txt` contains `Disallow: /faucet`.

`/faucet` is **ISA_FAUCET // 10.1 BTC AVAILABLE**, the 2022 joke post rebuilt as hardware. It is `noindex` and nothing links to it.

- The **CLAIM** button opens the Rickroll in a new tab. The status LED then goes red with `PAYOUT_FAILED xN // NEVER_GONNA_GIVE_YOU_UP`.
- The **COLD_STORAGE** panel shows `SEED: ISA{******} // LOCKED` and the recovery line `HASHCAT: adwanced paffword recovowy toowl`.
- Inspect the SEED value and you find `data-seed-md5="36cd38f49b9afa08222c0dc9ebfe35eb"`. The six asterisks give away the length.

```sh
echo 36cd38f49b9afa08222c0dc9ebfe35eb > seed.hash
hashcat -m 0 -a 0 seed.hash rockyou.txt
# 36cd38f49b9afa08222c0dc9ebfe35eb:source
```

`source` is near the top of rockyou: it is in the SecLists `rockyou-75.txt` subset, so it cracks instantly. Online MD5 lookup tables will also find it.

**Flag 3: `ISA{source}`.** It means view the page source. Accepting it prints: *"Keep that word, the last tape is sealed with it. Look at the page from behind."* That word, `source`, is the key for step 4.

Source: `src/routes/faucet/+page.svelte` holds the MD5 only. `static/robots.txt` has the `Disallow`.

## 4. View source: Vigenère

`Ctrl+U` / `view-source:` on any page shows a comment near the top of `<head>`, from `src/app.html`:

```
ISA-1 // REAR SERVICE PANEL. You took the back off. Respect.

TAPE_04 OF 04 [SEALED]: AGU{n1pr3j_k1he3t_yoq_x1ep3v}

The seal is Vigenere. The key is the word inside flag 3, the one hashcat
pulled out of the faucet. Letters shift, everything else rides along.
Submit what falls out in the console: isa.flag('ISA{...}')
```

Decode with key `source`. Only letters are shifted, and only letters advance the key; digits, `_` and braces pass through. That matches CyberChef's `Vigenère Decode` and dcode.fr's defaults. A known-plaintext attack on `AGU` → `ISA` recovers `sou`, which is a fair hint on its own.

**Flag 4: `ISA{w1nn3r_w1nn3r_uwc_d1nn3r}`.**

## The prize

`isa.flag('ISA{w1nn3r_w1nn3r_uwc_d1nn3r}')` prints `FLAG 4/4 ACCEPTED`, an ASCII terminal (`root@ecorp:~# ./fsociety.sh` … `hello, friend._`) and `PLATE_UNLOCKED: MR ROBOT`. Then it:

1. sets `localStorage['plate-unlocked'] = 'mrrobot'` (`unlockPlate` in `src/lib/stores/theme.js`);
2. fits the plate right away (`theme.set('mrrobot')`, persisted as a normal MODE pick);
3. adds a seventh detent to the MODE dial with no reload. Other open tabs pick it up through the `storage` event.

The plate is the `:root[data-theme='mrrobot']` block in `src/app.css`: a one-hue red-on-black terminal in the style of PHOSPHOR (Virtual Boy LED red). Its registry row is `sealed: true`, so the dial (`plates` store) hides it until the seal is broken. The pre-paint script in `hooks.server.js` accepts `mrrobot` as a stored plate because it is in `THEME_IDS`.

Earlier flags work at any time and print `FLAG n/4 ACCEPTED`. Progress is kept in `localStorage['ctf-flags']` (e.g. `"123"`) and shown by `isa.help()`. Wrong answers get a random quip, for example "Nope. Get gud."

## Maintenance

- **Reset a browser:** `['plate-unlocked', 'ctf-flags', 'plate'].forEach((k) => localStorage.removeItem(k))`, then reload.
- **Change a flag:**
  1. Re-encode its carrier: the TAPE_01 hex, the ROT13 header, the MD5 plus the faucet word, or the Vigenère tape.
  2. Replace its SHA-256 in `FLAGS` in `src/lib/ctf/console.ts`:
     ```sh
     node -e "console.log(require('crypto').createHash('sha256').update('ISA{...}').digest('hex'))"
     ```
  3. Changing flag 3's word changes the Vigenère key, so re-seal tape 4 as well.
- **Verified:** every encoding above was checked with node and independently with Python. The steps were XOR→flag 1, ROT13→flag 2, an MD5 dictionary attack over rockyou-75→`source`, and Vigenère decode→flag 4. All four SHA-256 digests match `FLAGS`. The console module was also run under node with stubs: it accepts all four flags in order, rejects bad input, records progress `1234`, unlocks and fits `mrrobot`, and fires `isa:stretch`.
