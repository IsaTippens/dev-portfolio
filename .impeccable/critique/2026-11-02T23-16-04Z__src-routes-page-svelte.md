---
target: the landing page
total_score: 24
max_score: 36
na_heuristics: 9
p0_count: 0
p1_count: 3
target_identity: "file:/home/isati/dev/dev-portfolio/src/routes/+page.svelte"
target_fingerprint: "sha256:8684e00541ff951f8bfe681897f9d3766d038526523fdd039eb038a03ba635b5"
target_path: /home/isati/dev/dev-portfolio/src/routes/+page.svelte
timestamp: 2026-11-02T23-16-04Z
slug: src-routes-page-svelte
---
Method: dual-agent (A: AssessmentA · B: AssessmentB)

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Exemplary: live `BAT`, `POS`, `FPS`, `NO CARRIER` / `CARRIER DETECT`, `PAD 1 · LIT`, and `QT-001` states. |
| 2 | Match System / Real World | 2 | Heavy synth/hardware jargon (`PHAS`, `DM`, `LNS`, `TXT`, `WGS84 · TM`, `[F1_BLOG]`) and fake tape/BPM metaphors in `Socials`. |
| 3 | User Control and Freedom | 3 | `ESC` closes modals and double-tap resets knobs, but mobile `Socials` hijacks first tap (`arm_touch`) and `Cartography` tap triggers tilt mode. |
| 4 | Consistency and Standards | 2 | `PO-100` knobs (`Knob.svelte`) are draggable sliders; identical `KnobCap` knobs in `Socials.svelte` are dead props. Duplicate `01–05` and `1–5` links in `Socials`. |
| 5 | Error Prevention | 3 | Strong keyboard guards (`typing` check, click-swallow after brand long-press), except mobile tap-to-tilt on `Cartography` and two-tap link trap on `Socials`. |
| 6 | Recognition Rather Than Recall | 2 | Primary nav (`F1–F4`) is buried below the fold; `PO-100` double-tap reset has no visible cue; `5px–8px` labels are sub-legible. |
| 7 | Flexibility and Efficiency | 4 | Outstanding power-user accelerators: `F1–F4` hotkeys, `J/K` row nav, `[?] KEYS` modal, arrow-key rotary detents, DualSense Gamepad navigation. |
| 8 | Aesthetic and Minimalist Design | 1 | Module bloat: two full skeuomorphic Teenage Engineering cases (`PO-100` + `TE-S10`), 7 knobs, 10 round keys, and 12 Easter eggs competing inside one `700px` column. |
| 9 | Error Recovery | n/a | Read/explore portfolio surface with no destructive user data entry or form submission flows on `/`. |
| 10 | Help and Documentation | 3 | `[?] KEYS` overlay and `console.ts` (`isa.help()`) are crisp and task-focused, though `[?] KEYS` is hidden on `<640px` screens. |
| **Total** | | **24/36** | **Good / Acceptable border (67% — Acceptable: solid engineering foundation held back by skeuomorphic & interactive clutter)** |

---

### Design Specificity Verdict

**LLM Assessment:**
This is unmistakably authored, high-craft work—not a category-interchangeable developer portfolio. The single-column `700px` field-instrument chassis bolted onto a drafting-dot mat, governed by a strict token-pure faceplate architecture (`src/app.css`) and a stepped/snap motion vocabulary (`src/lib/motion/index.js`), is deeply committed to its thesis.

However, the landing page suffers from **metaphor inflation** that violates its own First Principle in `PRODUCT.md` (*"One Working Device, Not a Page of Widgets"*). Instead of reading as one coherent field unit housing Isa's work, the landing page stacks **three different hardware metaphors inside one outer chassis**:
1. The outer **ISA-1 Field Unit** (`+layout.svelte`: status bar, `[MODULE: USER_INFO]`, `[BIO_DATA]`, `[CARTOGRAPHY_CPT]`, `F1–F4` keys, `[GAMING_LOG]`).
2. A rounded, drop-shadowed **PO-100 Portrait Synthesizer** (`ProfilePhoto.svelte`) bolted inside the hero row with its own 4 corner screws, speaker grill, 5 mode buttons, 3 rotary knobs, audio jack, and USB-C port.
3. A second, even larger rounded **TE-S10 Social Interface Pocket Controller** (`Socials.svelte`) bolted into the footer with another 4 corner screws, spinning cassette reels, 5 VU-meter screen channels, 4 rotary knobs, and 5 physical keycaps.

**Deterministic Scan (`impeccable detect`):**
- **CLI scan (`src/routes/+page.svelte`):** `0` findings (exit code `0`).
- **CLI scan (`src/routes/+page.svelte src/routes/+layout.svelte src/lib/components`):** `1` advisory finding (`codex-grid-background` on `src/lib/components/Socials.svelte:426`).
- **Runtime DOM scan (`detect.js` at `1280×800` & `390×844`):** `114` total items across 6 rules:
  - `undersized-ui-text` (**104** instances): `tailwind.config.cjs:17-24` defines `text-xxs` (`10px`), `text-tiny` (`9px`), `text-micro` (`8px`), `text-nano` (`7px`), `text-pico` (`6px`), and `text-femto` (`5px`). **~38 of the 104 instances are genuine legibility and touch-target failures** on functional controls and live readouts (e.g., `7px` `LCD/CRT/GB/DM/NOR` buttons inside `28×28px` circles in `ProfilePhoto.svelte:234`; `7px` `REDEEM` button inside a `51×24px` box in `QuantumToken.svelte:274`; `7px` live telemetry `<dl>` cells in `Cartography.svelte:782`; `8px–9px` post dates/IDs in `PostTile.svelte:37-43`). The remaining **~66 instances are false positives** on decorative PCB silkscreen legends (`OUT`, `PWR`, `TE_PORTRAIT_ENGINE`).
  - `nested-cards` (**8** instances): **Partial true positive.** While the outer chassis + inner `.panel` is intentional, the Hero (`ProfilePhoto.svelte:250`) and Footer (`Socials.svelte:198, 364`) nest a 3rd bordered/recessed card layer inside an inner synth case inside the outer chassis. On `390×844` mobile, 3-deep borders/padding consume `56px` of horizontal width, squeezing the TE-S10 LCD to `296px` (`~46px` per channel column).
  - **False Positives Caught & Filtered:** `codex-grid-background` (`Socials.svelte:426`, scoped LCD dot-matrix well), `buried-raster` (`+layout.svelte:534`, `0.05` opacity hardware matte grain texture), `repeating-stripes-gradient` (`app.css:1068`, `ProfilePhoto.svelte:444`, CRT/LCD scanline shaders), and `kicker-above-heading` (`Intro.svelte:2`, `[MODULE: USER_INFO]` bracketed chassis tag).

**Visual Overlays:**
`detect.js` was injected into the live local build via `impeccable live-server` (`114` `.impeccable-overlay` nodes verified in DOM, `0` page errors), and both the live server and temporary static server were stopped cleanly after capture (`stop --keep-inject`).

---

### Overall Impression

- **What works:** The outer chassis frame (`+layout.svelte`), the token-pure faceplate system (`app.css`), the charging circuit (`battery.ts` + status bar + USB-C plug), and the Cape Peninsula survey (`Cartography.svelte`) are tour-de-force examples of creative front-end engineering. They feel tactile, fast, and grounded in real state.
- **What doesn't:** Visual hierarchy and proportional weight are inverted. On desktop, primary site navigation (`F1_BLOG`–`F4_GEAR`) is buried below the fold (`~950px` down), while a 5-channel synthesizer for social links (`Socials.svelte`) occupies `428px` of vertical height and the entire width of the chassis—more screen real estate than your CTO role at Alphacrest, your MSc Quantum Tokens thesis, and your UWC cybersecurity mentorship combined. Worse, `Socials.svelte` fakes its telemetry (`Math.random()` VU meters, hardcoded `BPM: 110 / 140`, non-interactive knobs), directly contradicting `PRODUCT.md`'s *"Honest Telemetry Only"* rule.
- **Single biggest opportunity:** **Strip the nested synth cases and fake controls so the outer chassis is the *only* hardware device.** Promote navigation (`F1–F4`), let the real telemetry instruments (`Cartography` + `Battery/USB-C` + `QuantumToken`) breathe, and compress `GamingLog` and `Socials` into quiet, honest chassis rows.

---

### What's Working

1. **The Charging Circuit (`battery.ts` + `+layout.svelte` + `ProfilePhoto.svelte`):**
   Bridges two separate components—the top status bar (`BAT: 100%`) and the bottom edge of the `PO-100` portrait module—into a single physical circuit. The 3.4-second high-voltage marquee wipe, the compositor-driven current flow inside the battery cell, the `brightness(1.7)` screen surge on the `PO-100`, and the SVG USB-C plug sliding into the port with a contact spark feel cohesive, surprising, and physically earned.
2. **Token-Pure Faceplate Architecture & Stepped Motion System (`app.css` + `motion/index.js`):**
   Every surface, border, shadow, syntax token, and hardware material (`--hw-case`, `--hw-metal`, `--hw-well`) swaps cleanly via CSS custom properties without component-level theme overrides. Combined with stepped state changes (`plate-blink` in `steps(3, end)`), discrete LEDs, and centralized cubic-bezier curves, the site behaves like a physical machine.
3. **Honest Geodesic & Astronomical Telemetry in `Cartography.svelte`:**
   Projecting Natural Earth 1:10m coastline around 34°S, computing real solar azimuth/altitude (`sun.ts`) to cast accurate terrace shadows by day and switch on road lamps after civil dusk, fetching real Cape Town wind (`wind.ts`) to drape the animated "Tablecloth" cloud over Table Mountain during a Cape Doctor south-easter, and calculating great-circle distance from the visitor's timezone (`signal.ts`) is deeply personal to Cape Town and rewards close inspection without demanding a single click.

---

### Priority Issues

- **[P1] What**: **Skeuomorphic Hardware Clutter, Fake Telemetry & Broken Mobile Double-Tap in `Socials.svelte` (`TE-S10`)**
  - **Why it matters**: Renders a `428px`-tall Pocket Controller with spinning cassette reels, hardcoded `BPM: 110 / 140`, 5 randomly jittering VU meters (`Math.random()`), 4 non-interactive rotary knobs (`A-VOL` to `D-MIX` that look identical to `PO-100`'s draggable knobs), and **10 separate links for 5 social URLs**. On mobile touchscreens, `arm_touch()` swallows the first tap (`event.preventDefault()`) just to animate the fake VU meters, forcing mobile users to tap twice to open GitHub or Mail.
  - **Fix**: Replace the `TE-S10` synth case in `Socials.svelte` with a flat chassis panel (`<Panel tag="SOCIAL_PORTS">`) containing 5 single-click tactile `.hbtn` port tiles (`01 GITHUB`, `02 INSTAGRAM`, `03 YOUTUBE`, `04 X`, `05 MAIL`) with direct 1-tap navigation on mobile and zero fake knobs, fake BPM, or random VU meters.
  - **Suggested command**: `/impeccable distill`

- **[P1] What**: **Primary Route Navigation (`F1_BLOG`–`F4_GEAR`) is Buried Below the Fold**
  - **Why it matters**: On `1280×800` desktop, the `NavButton` grid sits at `~950px` Y; on `390×844` mobile, it sits at `~1,850px` Y (2.2 viewports down). First-time visitors cannot see how to reach `/blog`, `/projects`, `/resume`, or `/gear` without scrolling past the hero and all three `Experience` modules.
  - **Fix**: Move the 4-button `F1_BLOG`–`F4_GEAR` strip directly beneath the hero (`Intro` + `About`), above `Experience` (or integrate a compact route strip into the sticky top chassis bar), and link the `02 / MSC_CS_CANDIDATE` panel directly to `/projects/relativistic-quantum-tokens`.
  - **Suggested command**: `/impeccable layout`

- **[P1] What**: **Sub-Legible Micro-Typography (`5px`–`8px` Text Tokens) & Undersized Touch Targets**
  - **Why it matters**: Confirmed by both human review and `104` `undersized-ui-text` detector hits. Functional UI controls and live telemetry use `7px` (`text-nano`) and `8px` (`text-micro`): `PO-100` mode buttons (`7px` inside `28×28px` circles), `QuantumToken` `REDEEM` button (`7px` inside `51×24px`), `Cartography` live telemetry `<dl>` (`7px` across 12 cells), and `PostTile` slug IDs (`8px`). Below `9px–10px`, monospace font hinting breaks down on standard displays.
  - **Fix**: Floor functional DOM text tokens in `tailwind.config.cjs` and component classes at `9px–10px` (`text-tiny` / `text-xxs`), increase the `Cartography` telemetry `<dl>` and `QuantumToken` `REDEEM` button to `9px–10px` with `≥32px` hit height, and enlarge `PO-100` mode controls.
  - **Suggested command**: `/impeccable typeset`

- **[P2] What**: **Over-Engineered `PO-100` Portrait Controls & Hero Column Imbalance (`About.svelte` + `ProfilePhoto.svelte`)**
  - **Why it matters**: Packing 5 mode buttons (`LCD`, `CRT`, `GB`, `DM`, `NOR`) plus 3 rotary filter knobs (`FREQ`, `PHAS`, `RGB`) into a `192px`-wide synth case makes the portrait module `340px+` tall, creating dead vertical space in the right column on desktop and pushing `Cartography` into a narrow `434px` column. Turning `FREQ/PHAS/RGB` washes out the photo with CSS filter extremes.
  - **Fix**: Remove the 3 rotary knobs (`FREQ`, `PHAS`, `RGB`) and outer synth bezel from `ProfilePhoto.svelte`. House the recessed screen, a compact filter toggle, and the bottom USB-C charging port inside a clean `Panel` aligned beside `BIO_DATA`, allowing `CARTOGRAPHY_CPT` to span the full `650px` chassis width underneath.
  - **Suggested command**: `/impeccable quieter`

- **[P2] What**: **Self-Undercutting Hero Copy, Default PlayStation Faceplates & Spacebar Scroll Hijack (`Intro.svelte`, `About.svelte`, `theme.js`, `GamingLog.svelte`)**
  - **Why it matters**:
    1. `"I'M ISA, THIS IS WHAT I DO"` and `"VIBE_CHECK: vibe coder for 1 year"` undercut your CTO and MSc Quantum Computing authority right at the top of the page.
    2. `OS_PLATES` in `theme.js` defaults light/dark OS visitors to `ps1`/`ps2` instead of `light`/`dark`, hiding the signature Teenage Engineering safety-orange `--accent` behind PlayStation blue (`#4d9fff`) and controller knob colors on first visit.
    3. `GamingLog.svelte` intercepts `Space` on `window` whenever the mouse cursor hovers anywhere over the `Geometry Dash` row, breaking normal page-down spacebar scrolling.
  - **Fix**: Sharpen `Intro.svelte` and `BIO_DATA` copy to reflect your actual engineering profile; set `OS_PLATES = { light: 'light', dark: 'dark' }` in `theme.js`; remove or relocate `GamingLog` (and scope `Space` strictly to when the cube `<button>` has keyboard focus).
  - **Suggested command**: `/impeccable clarify`

---

### Persona Red Flags

- **Jordan (Confused First-Timer)**: Lands above the fold and sees `MODE: PS1`, `[?] KEYS`, `BAT: 100%`, `LCD / CRT / GB / DM / NOR`, `FREQ / PHAS / RGB`, and `WGS84 · TM`, but **zero visible navigation links** to Projects, Blog, or Resume until scrolling halfway down the page. Clicks `REDEEM` on `QT-001`, sees `[REDEEMED]`, and has no link to read what the thesis is about. Tries to drag the `A-VOL` knob in `Socials` because it looks identical to the `FREQ` knob above—nothing happens.
- **Riley (Deliberate Stress Tester)**: Inspects `Socials.svelte` and catches `levels[i]` driven by `(Math.random() - 0.5) * 35` and hardcoded `BPM: 140 : 110`, contradicting `PRODUCT.md`'s *"Honest Telemetry Only"* rule. Hovers over the `Geometry Dash` row while pressing `Space` to scroll the page—`on_window_keydown` calls `event.preventDefault()` and jumps the 10px cube instead of scrolling. Enters the Konami code and gets the `MR ROBOT` faceplate immediately, spoiling the 4-flag CTF reward.
- **Casey (Distracted Mobile User — `390×844`)**: Scrolls through a `4,167px`-tall mobile page; accidentally taps `Cartography` while thumb-scrolling, triggering `startTilt()` / iOS `DeviceOrientationEvent.requestPermission()`. Taps the `GH` (GitHub) button at the bottom of the page once: `follow_touch()` swallows the first tap (`event.preventDefault()`) just to arm the fake cassette animation. Casey assumes the link is broken and leaves.
- **Marcus (Hiring CTO / Senior Systems Peer — from `PRODUCT.md`)**: Reads `BIO_DATA` first and sees `VIBE_CHECK: vibe coder for 1 year` right above `01 / CHIEF_TECH_OFFICER (Alphacrest)` and `02 / MSC_CS_CANDIDATE`. Wants to click from those experience modules to technical case studies, but neither links to `/projects`. Sees 3 single-sentence posts from 2023 occupying 60% of the `Recent Posts` list.
- **Zinhle (Security Researcher / Hardware Hacker — from `PRODUCT.md`)**: Appreciates the lazy-loaded `window.isa` DevTools CTF, `BroadcastChannel` quantum light-cone, and WebHID DualSense CRC32 packet driver, but finds that `konami.ts` gives away the `mrrobot` faceplate without solving the CTF, and `gamepad.ts` arbitrarily blocks D-pad navigation unless the theme is set to `ps1` or `ps2`.

---

### Minor Observations

- **`PostTile.svelte` Date & Slug Formatting:** `date.toDateString()` outputs `TUE SEP 22 2026`. Formatting as `2026.09.22` fits the instrument aesthetic and prevents mobile line-wrapping collisions with `[ID: PORTFOLIO-2026-FACEPLATES]`.
- **`SectionHeader.svelte` Heading Semantics:** Renders section titles (`Recent Posts`, `Active Gaming Log`, `Social Interfaces`) as `<p>` tags while `PostTile.svelte` uses `<h2>`, inverting the document heading hierarchy for screen readers.
- **Hardcoded Footer Revision (`REV: 2026.06`):** Bottom status bar hardcodes `REV: 2026.06` even though the September 2026 faceplate update shipped months later.

---

### Questions to Consider

- *"If the outer `700px` frame IS the hardware device, why are there two smaller plastic devices (`PO-100` and `TE-S10`) sitting inside it with their own drop shadows and corner screws?"*
- *"What happens to the authority of your real telemetry (Battery API, solar azimuth, Cape Doctor wind, BroadcastChannel light-cone) when the largest module on the page (`Socials`) fakes its VU meters with `Math.random()`?"*
- *"If a fellow CTO or academic reviewer lands here for 20 seconds, does `'vibe coder for 1 year'` and a 5-row video game table help or hurt the impression of someone building low-latency trading systems and relativistic quantum tokens?"*
