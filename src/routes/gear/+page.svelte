<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import GearItem from '$lib/components/GearItem.svelte';
	import NothingPhone from '$lib/components/NothingPhone.svelte';

	import Laptop from '~icons/mdi/laptop';
	import Tablet from '~icons/mdi/tablet';
	import Pi from '~icons/simple-icons/raspberrypi';
	import Ubuntu from '~icons/simple-icons/ubuntu';
	import Rust from '~icons/simple-icons/rust';
	import Spotify from '~icons/simple-icons/spotify';
</script>

<svelte:head>
	<title>Gear</title>
	<meta name="description" content="Hardware and Software I use daily" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com/gear" />
</svelte:head>

<PageHeader 
	pathName="GEAR" 
	title="Stuff I use"
	stats="DEVICE_COUNT: 5 // LANG_COUNT: 10+" 
/>

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
			<div class="text-xxs font-mono text-accent uppercase tracking-widest">
				[SECTION: HARDWARE_SETUP]
			</div>
		</div>

		<!-- Wootbook -->
		<GearItem 
			id="01 / WOOTBOOK_ULTRA_X16" 
			title="Workstation Laptop:" 
			description={`Tongfang-based barebone customizable chassis. Configured with an Intel Core i9-13900HX (24 Cores / 32 Threads), NVIDIA GeForce RTX 4060 Laptop GPU, 16" WQXGA 240Hz display, 32GB DDR5 RAM, and 1TB NVMe Gen4 SSD.`}
		>
			<Laptop class="w-full h-full" />
		</GearItem>

		<!-- Nothing Phone -->
		<GearItem 
			id="02 / NOTHING_PHONE_2" 
			title="Primary Phone:" 
			description={`Snapdragon 8+ Gen 1, 6.7" 120Hz LTPO OLED display, 12GB RAM, 512GB storage. Features the signature translucent design and programmable Glyph Interface.`}
		>
			<NothingPhone />
		</GearItem>

		<!-- Samsung Tab S9 -->
		<GearItem 
			id="03 / GALAXY_TAB_S9" 
			title="Tablet / Slate:" 
			description={`Snapdragon 8 Gen 2, 11" 120Hz Dynamic AMOLED 2X display, 12GB RAM. Used with S-Pen for architecture planning, writing notes, and reading papers. Additionally serves as a on-the-go dev machine.`}
		>
			<Tablet class="w-full h-full" />
		</GearItem>

		<!-- Raspberry Pi 5 -->
		<GearItem 
			id="04 / RASPBERRY_PI_5_8GB" 
			title="Lab Node A:" 
			description={`Broadcom BCM2712 Quad-core ARM Cortex-A76 processor @ 2.4GHz, 8GB LPDDR4X. Powered by Raspberry Pi OS (PiOS). Handles local API prototypes, container testing, script automations and Tailscale Exit Node.`}
		>
			<Pi class="w-full h-full" />
		</GearItem>

		<!-- Raspberry Pi 4 -->
		<GearItem 
			id="05 / RASPBERRY_PI_4_4GB" 
			title="Lab Node B:" 
			description={`Broadcom BCM2711 Quad-core ARM Cortex-A72 processor @ 1.5GHz, 4GB LPDDR4. Configured with NixOS for funsies.`}
		>
			<Pi class="w-full h-full" />
		</GearItem>
	</div>

	<!-- Section 2: Software / Environment -->
	<div class="grid gap-4 mt-2">
		<div class="flex items-center gap-2">
			<svg class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<rect x="2" y="3" width="20" height="18" rx="0" fill="none" />
				<path d="M6 8l4 4-4 4" />
				<path d="M12 16h6" />
			</svg>
			<div class="text-xxs font-mono text-accent uppercase tracking-widest">
				[SECTION: DEV_ENVIRONMENT]
			</div>
		</div>

		<!-- Operating Systems & Shells -->
		<GearItem 
			id="06 / OS_AND_KERNELS" 
			title="Windows 11:" 
			description={`Host OS on workstation. <br /> <span class="font-bold text-main uppercase">WSL2 (Ubuntu):</span> Primary Linux development shell. <br /> <span class="font-bold text-main uppercase">NixOS / PiOS:</span> Declarative and Debian-based lab node distributions.`}
		>
			<Ubuntu class="w-full h-full" />
		</GearItem>

		<!-- Development Languages -->
		<GearItem 
			id="07 / CODE_LANGUAGES" 
			title="Daily Stack:" 
			description={`Rust, Go (Golang), and Python (all 3 used daily for systems engineering and trading apps). <br /> <span class="font-bold text-main uppercase">Past Experience:</span> C#, C++, Flutter, React Native, TypeScript, and JavaScript.`}
		>
			<Rust class="w-full h-full" />
		</GearItem>

		<!-- Apps -->
		<GearItem 
			id="08 / APPLICATIONS" 
			title="Google Gemini:" 
			description={`AI pair programming and quick reasoning. <br /> <span class="font-bold text-main uppercase">Notion:</span> Structured task planning, logging, and notebook notes. <br /> <span class="font-bold text-main uppercase">Spotify:</span> Essential soundtrack generation for coding focus. <br /> <span class="font-bold text-main uppercase">VSCode:</span> Lightweight editor environment for web, Rust, and systems scripts. <br /> <span class="font-bold text-main uppercase">Tailscale:</span> Secure, zero-config mesh VPN connecting workstation, mobile, and lab nodes.`}
		>
			<Spotify class="w-full h-full" />
		</GearItem>
	</div>
</div>
