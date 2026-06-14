<svelte:head>
	<title>Gear</title>
	<meta name="description" content="Hardware and Software I use daily" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com/gear" />
</svelte:head>

<div class="border-b border-black dark:border-neutral-700 pb-3 mb-6 flex justify-between items-end">
	<div>
		<div class="text-[9px] uppercase tracking-widest font-mono text-accent">
			[NAV: <a href="/" class="hover:underline">HOME</a> / GEAR]
		</div>
		<h1 class="text-2xl font-bold uppercase tracking-tight text-black dark:text-white mt-1">
			HARDWARE & SOFTWARE
		</h1>
	</div>
	<div class="text-[8px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
		DEVICE_COUNT: 5 // LANG_COUNT: 10+
	</div>
</div>

<div class="grid gap-6">
	<!-- Section 1: Hardware Setup -->
	<div class="grid gap-4">
		<div class="flex items-center gap-2">
			<svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<rect x="4" y="4" width="16" height="16" rx="0" fill="none" />
				<rect x="9" y="9" width="6" height="6" rx="0" fill="none" />
				<path d="M9 1v3" />
				<path d="M15 1v3" />
				<path d="M9 20v3" />
				<path d="M15 20v3" />
				<path d="M20 9h3" />
				<path d="M20 15h3" />
				<path d="M1 9h3" />
				<path d="M1 15h3" />
			</svg>
			<div class="text-[10px] font-mono text-accent uppercase tracking-widest">
				[SECTION: HARDWARE_SETUP]
			</div>
		</div>

		<!-- Wootbook -->
		<div class="border border-black dark:border-neutral-700 p-4 relative bg-transparent">
			<div class="absolute top-0 left-4 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
				01 / WOOTBOOK_ULTRA_X16
			</div>
			<div class="text-xs leading-relaxed mt-1">
				<span class="font-bold text-black dark:text-white uppercase">Workstation Laptop:</span> Tongfang-based barebone customizable chassis. Configured with an Intel Core i9-13900HX (24 Cores / 32 Threads), NVIDIA GeForce RTX 4070 Laptop GPU, 16" WQXGA 240Hz display, 32GB DDR5 RAM, and 2TB NVMe Gen4 SSD. Liquid-cooling compatible.
			</div>
		</div>

		<!-- Nothing Phone -->
		<div class="border border-black dark:border-neutral-700 p-4 relative bg-transparent">
			<div class="absolute top-0 left-4 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
				02 / NOTHING_PHONE_2
			</div>
			<div class="text-xs leading-relaxed mt-1">
				<span class="font-bold text-black dark:text-white uppercase">Primary Phone:</span> Snapdragon 8+ Gen 1, 6.7" 120Hz LTPO OLED display, 12GB RAM, 256GB storage. Features the signature translucent design and programmable Glyph Interface.
			</div>
		</div>

		<!-- Samsung Tab S9 -->
		<div class="border border-black dark:border-neutral-700 p-4 relative bg-transparent">
			<div class="absolute top-0 left-4 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
				03 / GALAXY_TAB_S9
			</div>
			<div class="text-xs leading-relaxed mt-1">
				<span class="font-bold text-black dark:text-white uppercase">Tablet / Slate:</span> Snapdragon 8 Gen 2, 11" 120Hz Dynamic AMOLED 2X display, 12GB RAM. Used with S-Pen for layout planning, drawing architectures, and reading papers.
			</div>
		</div>

		<!-- Raspberry Pi 5 -->
		<div class="border border-black dark:border-neutral-700 p-4 relative bg-transparent">
			<div class="absolute top-0 left-4 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
				04 / RASPBERRY_PI_5_8GB
			</div>
			<div class="text-xs leading-relaxed mt-1">
				<span class="font-bold text-black dark:text-white uppercase">Lab Node A:</span> Broadcom BCM2712 Quad-core ARM Cortex-A76 processor @ 2.4GHz, 8GB LPDDR4X. Powered by Raspberry Pi OS (PiOS). Handles local API prototypes, container testing, and script automations.
			</div>
		</div>

		<!-- Raspberry Pi 4 -->
		<div class="border border-black dark:border-neutral-700 p-4 relative bg-transparent">
			<div class="absolute top-0 left-4 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
				05 / RASPBERRY_PI_4_4GB
			</div>
			<div class="text-xs leading-relaxed mt-1">
				<span class="font-bold text-black dark:text-white uppercase">Lab Node B:</span> Broadcom BCM2711 Quad-core ARM Cortex-A72 processor @ 1.5GHz, 4GB LPDDR4. Configured with NixOS for declarative environment deployments and lightweight network services.
			</div>
		</div>
	</div>

	<!-- Section 2: Software / Environment -->
	<div class="grid gap-4 mt-2">
		<div class="flex items-center gap-2">
			<svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<rect x="2" y="3" width="20" height="18" rx="0" fill="none" />
				<path d="M6 8l4 4-4 4" />
				<path d="M12 16h6" />
			</svg>
			<div class="text-[10px] font-mono text-accent uppercase tracking-widest">
				[SECTION: DEV_ENVIRONMENT]
			</div>
		</div>

		<!-- Operating Systems & Shells -->
		<div class="border border-black dark:border-neutral-700 p-4 relative bg-transparent">
			<div class="absolute top-0 left-4 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
				06 / OS_AND_KERNELS
			</div>
			<div class="text-xs leading-relaxed mt-1">
				<span class="font-bold text-black dark:text-white uppercase">Windows 11:</span> Host OS on workstation. <br />
				<span class="font-bold text-black dark:text-white uppercase">WSL2 (Ubuntu):</span> Primary Linux development shell. <br />
				<span class="font-bold text-black dark:text-white uppercase">NixOS / PiOS:</span> Declarative and Debian-based lab node distributions.
			</div>
		</div>

		<!-- Development Languages -->
		<div class="border border-black dark:border-neutral-700 p-4 relative bg-transparent">
			<div class="absolute top-0 left-4 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
				07 / CODE_LANGUAGES
			</div>
			<div class="text-xs leading-relaxed mt-1">
				<span class="font-bold text-accent uppercase">Daily Stack:</span> Rust, Go (Golang), and Python (all 3 used daily for systems engineering and trading apps). <br />
				<span class="font-bold text-black dark:text-white uppercase">Past Experience:</span> C#, C++, Flutter, React Native, TypeScript, and JavaScript.
			</div>
		</div>

		<!-- Apps -->
		<div class="border border-black dark:border-neutral-700 p-4 relative bg-transparent">
			<div class="absolute top-0 left-4 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
				08 / APPLICATIONS
			</div>
			<div class="text-xs leading-relaxed mt-1">
				<span class="font-bold text-black dark:text-white uppercase">Google Gemini:</span> AI pair programming and quick reasoning. <br />
				<span class="font-bold text-black dark:text-white uppercase">Notion:</span> Structured task planning, logging, and notebook notes. <br />
				<span class="font-bold text-black dark:text-white uppercase">Spotify:</span> Essential soundtrack generation for coding focus. <br />
				<span class="font-bold text-black dark:text-white uppercase">VSCode:</span> Lightweight editor environment for web, Rust, and systems scripts.
			</div>
		</div>
	</div>
</div>
