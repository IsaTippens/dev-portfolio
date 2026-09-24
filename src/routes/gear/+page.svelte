<script>
	import Meta from '$lib/components/Meta.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import GearItem from '$lib/components/GearItem.svelte';
	import Laptop from '$lib/components/gear/Laptop.svelte';
	import NothingPhone2 from '$lib/components/gear/NothingPhone2.svelte';
	import Tablet from '$lib/components/gear/Tablet.svelte';
	import RaspberryPi5 from '$lib/components/gear/RaspberryPi5.svelte';
	import RaspberryPi4 from '$lib/components/gear/RaspberryPi4.svelte';

	/** The model families oh-my-pi drives, and the lab behind each. */
	const MODELS = [
		{ name: 'Gemini', lab: 'Google' },
		{ name: 'Claude', lab: 'Anthropic' },
		{ name: 'Kimi', lab: 'Moonshot AI' },
		{ name: 'DeepSeek', lab: 'DeepSeek' }
	];

	/**
	 * Dev environment: one spec sheet per module, each row a tool and what it is for. A row
	 * whose value is a list is racked as slots (the model families) instead of written out.
	 */
	const STACK = [
		{
			id: '06 / AGENT_WORKFLOW',
			rows: [
				{
					label: 'Harness',
					value:
						'oh-my-pi, a terminal coding agent with the IDE wired in: LSP, debugger, and parallel subagents.'
				},
				{ label: 'Models', value: MODELS }
			]
		},
		{
			id: '07 / CODE_LANGUAGES',
			rows: [
				{
					label: 'Daily',
					value: 'Rust, Go, and Python, for systems engineering and trading apps.'
				},
				{
					label: 'Previously',
					value: 'C#, C++, Flutter, React Native, TypeScript, and JavaScript.'
				}
			]
		},
		{
			id: '08 / OPERATING_SYSTEMS',
			rows: [
				{ label: 'Windows 11', value: 'Host OS on the workstation.' },
				{ label: 'WSL2 (Ubuntu)', value: 'Primary Linux development shell.' },
				{ label: 'PiOS', value: 'Debian-based Raspberry Pi OS on Lab Node A.' },
				{ label: 'NixOS', value: 'Declarative config on Lab Node B, for funsies.' }
			]
		},
		{
			id: '09 / APPLICATIONS',
			rows: [
				{ label: 'VS Code', value: 'Lightweight editor for web, Rust, and systems scripts.' },
				{
					label: 'Tailscale',
					value: 'Zero-config mesh VPN linking the workstation, phone, and lab nodes.'
				},
				{ label: 'Notion', value: 'Task planning, work logs, and notes.' },
				{ label: 'Spotify', value: 'Soundtrack for focused coding sessions.' }
			]
		}
	];
</script>

<Meta title="Gear" description="Hardware and Software I use daily" path="/gear" />

<PageHeader
	pathName="GEAR"
	title="HARDWARE & SOFTWARE"
	stats="DEVICE_COUNT: 5 // LANG_COUNT: 10+"
/>

<div class="grid gap-6">
	<!-- Section 1: Hardware Setup -->
	<div class="grid gap-4">
		<div class="flex items-center gap-2">
			<svg
				class="w-4 h-4 text-accent"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
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
			title="Workstation Laptop"
			description={`Tongfang-based barebone customizable chassis. Configured with an Intel Core i9-13900HX (24 Cores / 32 Threads), NVIDIA GeForce RTX 4060 Laptop GPU, 16" WQXGA 240Hz display, 32GB DDR5 RAM, and 1TB NVMe Gen4 SSD.`}
		>
			<Laptop />
		</GearItem>

		<!-- Nothing Phone -->
		<GearItem
			id="02 / NOTHING_PHONE_2"
			title="Primary Phone"
			description={`Snapdragon 8+ Gen 1, 6.7" 120Hz LTPO OLED display, 12GB RAM, 512GB storage. Features the signature translucent design and programmable Glyph Interface.`}
		>
			<NothingPhone2 />
		</GearItem>

		<!-- Samsung Tab S9 -->
		<GearItem
			id="03 / GALAXY_TAB_S9"
			title="Tablet / Slate"
			description={`Snapdragon 8 Gen 2, 11" 120Hz Dynamic AMOLED 2X display, 12GB RAM. Used with S-Pen for architecture planning, writing notes, and reading papers. Additionally serves as a on-the-go dev machine.`}
		>
			<Tablet />
		</GearItem>

		<!-- Raspberry Pi 5 -->
		<GearItem
			id="04 / RASPBERRY_PI_5_8GB"
			title="Lab Node A"
			description={`Broadcom BCM2712 Quad-core ARM Cortex-A76 processor @ 2.4GHz, 8GB LPDDR4X. Powered by Raspberry Pi OS (PiOS). Handles local API prototypes, container testing, script automations and Tailscale Exit Node.`}
		>
			<RaspberryPi5 />
		</GearItem>

		<!-- Raspberry Pi 4 -->
		<GearItem
			id="05 / RASPBERRY_PI_4_4GB"
			title="Lab Node B"
			description={`Broadcom BCM2711 Quad-core ARM Cortex-A72 processor @ 1.5GHz, 4GB LPDDR4. Configured with NixOS for funsies.`}
		>
			<RaspberryPi4 />
		</GearItem>
	</div>

	<!-- Section 2: Software / Environment -->
	<div class="grid gap-4 mt-2">
		<div class="flex items-center gap-2">
			<svg
				class="w-4 h-4 text-accent"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="2" y="3" width="20" height="18" rx="0" fill="none" />
				<path d="M6 8l4 4-4 4" />
				<path d="M12 16h6" />
			</svg>
			<div class="text-xxs font-mono text-accent uppercase tracking-widest">
				[SECTION: DEV_ENVIRONMENT]
			</div>
		</div>

		{#each STACK as entry (entry.id)}
			<Panel tag={entry.id} tag_side="left" class="p-4 pb-5">
				<dl class="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs leading-relaxed">
					{#each entry.rows as row (row.label)}
						<!-- A racked row's label drops to the slots' first line. -->
						<dt class="text-dim uppercase {typeof row.value === 'string' ? '' : 'pt-1'}">
							{row.label}:
						</dt>
						<dd class="text-ink">
							{#if typeof row.value === 'string'}
								{row.value}
							{:else}
								<ul
									class="grid grid-cols-2 gap-[var(--stroke)] border border-line bg-line sm:grid-cols-4"
								>
									{#each row.value as model (model.name)}
										<li class="flex items-center gap-2 bg-sunk px-2 py-1.5">
											<span class="led shrink-0" data-on="ok" aria-hidden="true"></span>
											<span class="leading-tight">
												<span class="block font-bold uppercase">{model.name}</span>
												<span class="block text-tiny tracking-wider text-dim uppercase">
													{model.lab}
												</span>
											</span>
										</li>
									{/each}
								</ul>
							{/if}
						</dd>
					{/each}
				</dl>
			</Panel>
		{/each}
	</div>
</div>
