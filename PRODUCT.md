# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Isa Tippens (Primary — Creator & Operator):** Uses `isatippens.com` as a personal engineering playground, living technical notebook, and testbed for interactive systems, hardware APIs, and agentic development workflows.
- **Engineering Peers, Builders & Curious Visitors:** Software engineers, systems programmers, security researchers, and design-minded builders exploring technical write-ups, interactive instruments, hardware/gear documentation, and hidden CTF challenges.

## Product Purpose

`isatippens.com` is the personal portfolio, blog, project archive, and hardware/setup index of Isa Tippens — a software engineer based in Cape Town, South Africa (Chief Technology Officer at Alphacrest, MSc in Computer Science candidate at the University of the Western Cape researching relativistic quantum tokens, and UWC cybersecurity team mentor).

Success means the site works simultaneously as a self-contained interactive artifact worth exploring on its own merits and an honest, durable record of Isa's engineering work, notes, hardware setup, and experiments.

## Positioning

The site is built and operated as one coherent piece of working hardware rather than a document with decorative widgets bolted onto it. Every readout, control, and module on the site reports real browser, device, or mathematical state — never simulated placeholders or fake metrics — while remaining fast, accessible, and readable as a technical reference.

## Operating Context

- **Routes & Surfaces:**
  - `/` — Front panel: identity spec (`BIO_DATA`), Cape Peninsula survey (`Cartography`), interactive portrait device (`ProfilePhoto` / PO-100), function-key navigation (`F1_BLOG`–`F4_GEAR`), recent posts, `Active Gaming Log`, and `Social Interfaces` tape deck.
  - `/blog` & `/blog/[slug]` — Markdown-authored (`mdsvex`) technical write-ups, annual recaps, media logs, and notes, with an integrated `PHOTO_VIEWER` lightbox and RSS/sitemap feeds (`/rss.xml`, `/sitemap.xml`).
  - `/projects` & `/projects/[slug]` — Systems and project index with status badges, stack metadata, and repository/live links.
  - `/gear` — Hardware workstation/homelab rack with interactive SVG device diagrams (Laptop, Nothing Phone (2) with playable Glyph composer, Tablet, Raspberry Pi 5 & 4 nodes) and software/agent workflow spec sheets.
  - `/resume` — Direct PDF endpoint serving `Isa Tippens CV.pdf`.
  - `/faucet` — Unlisted cold-storage CTF node (`noindex`).
- **Print Manual Mode:** Printing any page formats the site as a physical hardware operator's manual (`PrintManual.svelte` + `print.css`).
- **Runtime & Deployment:** SvelteKit (Svelte 5 runes, Vite, Tailwind CSS, `mdsvex`, `anime.js`) deployed on Cloudflare (`@sveltejs/adapter-cloudflare`).

## Capabilities and Constraints

- **Honest Telemetry Only:** Instrument readouts must reflect real state (e.g., `navigator.getBattery()` showing `--%` when unsupported rather than faking `100%`, live `requestAnimationFrame` FPS measurement, real scroll progress, real equirectangular map scale and road distance, real light-cone geometry in the relativistic quantum token demonstration). Manual overrides (such as clicking the battery indicator to test the charging state) must be explicit interactions.
- **Token-Pure Faceplate Architecture:** All visual/theme variations operate as swappable faceplates (stock plates follow OS `prefers-color-scheme` until manually switched via the `MODE` dial; sealed plate `mrrobot` unlocks via the console CTF). Components consume semantic tokens rather than per-theme overrides.
- **Input & Peripheral Depth:** Full keyboard navigation (`F1`–`F4` route shortcuts, `?` keymap overlay, `J`/`K` list row navigation, arrow-key rotary controls) plus WebHID DualSense lightbar synchronization and Gamepad API navigation (`src/lib/gamepad.ts`, `src/lib/lightbar.ts`).
- **URL Permanence:** Published post and project slugs are permanent commitments; legacy paths redirect permanently (`301`) in `hooks.server.js`.
- **CTF Chain Integrity:** The 4-flag console and route CTF (`src/lib/ctf/console.ts`, `/faucet`, etc.) and sealed faceplate unlock mechanisms (`plate-unlocked` storage) must remain intact and solvable.

## Brand Commitments

- **Identity:** Isa Tippens (`https://isatippens.com`), handle `@issssaaaaaaaaah` (reflected in the interactive long-press brand header stretch from `ISA` to `ISSSSAAAAAAAAAH`).
- **Voice:** Concise, dry, technical, and matter-of-fact — written like hardware documentation and honest engineering notes rather than marketing copy.
- **AI Authorship Transparency:** Posts or sections written autonomously by AI models carry an explicit `Disclaimer` component naming the exact models, harness (`oh-my-pi`), and scope of generation, separating model prose from Isa's own voice.

## Evidence on Hand

- **Biographical & Career Facts:** Location (Cape Town, South Africa); coding since June 2014, professional software engineering since June 2021; CTO at Alphacrest (AWS cloud infrastructure, low-latency algorithmic trading systems, internal tooling); MSc CS candidate at UWC (thesis: *"A framework for secure financial transactions using relativistic quantum tokens"*); UWC cybersecurity mentorship (2024, 2026; SANReN finalist 2023, 1st place 2025).
- **Content Repository:** Published markdown posts in `content/blog/`, project write-ups in `content/projects/` (`dev-portfolio`, `relativistic-quantum-tokens`, `isatippens-v1`, `inceptionar`), CV in `content/resume/Isa Tippens CV.pdf`, and static media/captures under `static/images/`.
- **No Fabricated Proof:** Do not invent client logos, testimonials, unverified metrics, or unconfirmed employment/academic claims.

## Product Principles

1. **One Working Device, Not a Page of Widgets:** Every interactive module earns its place by operating with real state, physics/math, or hardware/browser APIs rather than decorative fakery.
2. **Architecture Enforces Coherence:** Shared systems (faceplate token contracts, centralized motion rules, keyboard/controller routing) govern individual components so new features work across every plate and input method by construction.
3. **Playful Depth, Zero Friction:** Easter eggs, hardware peripherals, and CTF puzzles reward curiosity without obstructing fast reading, keyboard navigation, or core content access.
4. **Honest Authorship and Permanence:** Distinguish human writing from AI-generated posts explicitly, report real capabilities accurately, and never break published links.

## Accessibility & Inclusion

- Every faceplate must maintain WCAG AA contrast ratios across primary and secondary text tokens.
- Respect `prefers-reduced-motion`: disable progressive-blur focus sweeps, boot sequences, parallax, and continuous animations when reduced motion is active.
- Ensure core content and navigation remain usable without JavaScript (with a hard failsafe unhiding boot-staged content if scripts fail to load) and fully operable via keyboard and assistive technologies (`aria` listbox/slider semantics, focus trapping in modals, visible focus rings).
