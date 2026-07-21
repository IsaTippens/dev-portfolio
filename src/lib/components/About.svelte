<script lang="ts">
	import ProfilePhoto from '$lib/components/ProfilePhoto.svelte';

	let { data } = $props<{ data: any }>();
</script>

<div class="grid gap-6">
	<!-- Bio Overview and Profile Photo Panel -->
	<div class="flex flex-col md:flex-row gap-6 items-stretch">
		<div class="flex flex-col gap-4 flex-1 justify-between">
			<!-- Bio Data Grid -->
			<div class="border border-border rounded-md p-4 bg-card shadow-sm">
				<div class="text-xs uppercase font-mono font-bold text-accent mb-3 flex items-center justify-between border-b border-border pb-2">
					<span>// BIO_OVERVIEW</span>
					<span class="text-tiny font-normal text-muted">CPT_ZA</span>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-mono">
					<div class="flex flex-col">
						<span class="text-tiny text-muted uppercase">Location</span>
						<span class="text-main font-medium">Cape Town, South Africa</span>
					</div>
					<div class="flex flex-col">
						<span class="text-tiny text-muted uppercase">Developer Age</span>
						<span class="text-main font-medium">{data.age} y/o ({data.devYear} yrs code)</span>
					</div>
					<div class="flex flex-col">
						<span class="text-tiny text-muted uppercase">Engineering Experience</span>
						<span class="text-main font-medium">{data.seYear} years professional</span>
					</div>
					<div class="flex flex-col">
						<span class="text-tiny text-muted uppercase">Focus Areas</span>
						<span class="text-main font-medium">Systems, Security, Quant</span>
					</div>
				</div>
			</div>

			<!-- Cartography Compartment -->
			<div class="border border-border rounded-md p-4 hidden md:block bg-card shadow-sm">
				<div class="text-xs uppercase font-mono font-bold text-accent mb-3 flex items-center justify-between border-b border-border pb-2">
					<span>// CAPE PENINSULA SURVEY</span>
					<span class="text-tiny font-normal text-muted">33.9249° S, 18.4241° E</span>
				</div>
				
				<div class="flex gap-6 items-center">
					<!-- Map SVG -->
					<div class="w-1/2 border border-border bg-background/50 rounded p-2 relative h-40 flex items-center justify-center overflow-hidden">
						<span class="absolute top-1 left-2 text-[9px] font-mono text-muted">33°54'S</span>
						<span class="absolute bottom-1 right-2 text-[9px] font-mono text-muted">18°26'E</span>
						
						<svg viewBox="0 -80 320 280" class="w-full h-full text-main opacity-85">
							<!-- Grid lines -->
							<g class="stroke-border stroke-1" stroke-dasharray="2 4">
								<line x1="80" y1="-80" x2="80" y2="200" />
								<line x1="160" y1="-80" x2="160" y2="200" />
								<line x1="240" y1="-80" x2="240" y2="200" />
								<line x1="0" y1="-50" x2="320" y2="-50" />
								<line x1="0" y1="0" x2="320" y2="0" />
								<line x1="0" y1="50" x2="320" y2="50" />
								<line x1="0" y1="100" x2="320" y2="100" />
								<line x1="0" y1="150" x2="320" y2="150" />
							</g>
							
							<!-- Coastline & Robben Island -->
							<path 
								d="M 40,-70 C 50,-50 65,-30 85,0 C 88,10 90,20 95,25 C 105,30 115,35 105,42 C 100,45 98,48 95,53 C 90,60 92,70 95,78 C 95,85 85,100 85,115 C 85,140 95,160 102,180 C 106,192 112,190 114,180 C 116,160 118,140 125,125 C 130,115 145,108 160,105 C 180,102 195,108 200,115 C 205,125 200,165 208,185 C 212,195 220,185 225,180 C 235,170 250,168 265,165 C 275,162 285,165 295,175 C 305,185 315,190 320,195 M 80,25 C 83,23 85,26 83,28 C 80,29 77,27 80,25 Z M 35,-65 C 38,-67 40,-64 38,-62 C 35,-61 32,-63 35,-65 Z" 
								fill="none" 
								class="stroke-accent"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							
							<!-- Elevation/Topography contours -->
							<path d="M 102,50 Q 112,48 118,52 Q 122,58 115,62 Q 108,65 102,60 Q 98,55 102,50 Z" fill="none" class="stroke-muted/40" stroke-width="1" />
							<path d="M 106,53 Q 110,50 115,53 Q 118,56 115,60 Q 110,63 106,60 Q 103,56 106,53 Z" fill="none" class="stroke-muted/40" stroke-width="1" />
							<path d="M 95,78 Q 102,75 108,80 Q 112,85 108,92 Q 102,95 95,90 Q 92,85 95,78 Z" fill="none" class="stroke-muted/40" stroke-width="1" />
							
							<!-- Point markers & City label -->
							<circle cx="110" cy="43" r="2.5" class="fill-accent" />
							<text x="117" y="45" class="fill-main text-[9px] font-mono font-bold uppercase tracking-wider">CPT CITY</text>
							<circle cx="102" cy="180" r="1.5" class="fill-muted" />
							<text x="107" y="182" class="fill-muted text-[8px] font-mono uppercase">CAPE POINT</text>
						</svg>
					</div>
					
					<!-- Cartography Metadata -->
					<div class="w-1/2 font-mono text-xs leading-relaxed flex flex-col justify-between py-1 border-l border-border pl-4">
						<div class="space-y-1 text-muted text-tiny">
							<div class="flex justify-between"><span class="uppercase">Datum:</span> <span class="text-main font-semibold">WGS84</span></div>
							<div class="flex justify-between"><span class="uppercase">Elevation:</span> <span class="text-main font-semibold">0-1086m</span></div>
							<div class="flex justify-between"><span class="uppercase">Peak:</span> <span class="text-main font-semibold">Table Mt.</span></div>
							<div class="flex justify-between"><span class="uppercase">Scale:</span> <span class="text-main font-semibold">1:250,000</span></div>
						</div>
						
						<div class="mt-3 pt-2 border-t border-border flex items-center justify-between text-tiny text-muted">
							<span>BEARING: 25.3° W</span>
							<span class="text-accent font-bold">N ↑</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Profile Photo Section -->
		<div class="w-full max-w-[200px] mx-auto md:max-w-none md:w-56 shrink-0 flex items-stretch justify-center">
			<ProfilePhoto />
		</div>
	</div>

	<!-- Career & Roles Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<!-- CTO Card -->
		<div class="border-l-2 border-accent border-y border-r border-border rounded-r-md p-4 bg-card shadow-sm flex flex-col justify-between gap-2">
			<div>
				<div class="text-tiny font-mono text-accent font-bold uppercase tracking-wider mb-1">
					01 // EXECUTION
				</div>
				<h3 class="text-sm font-bold font-mono text-main">CHIEF TECH OFFICER</h3>
				<div class="text-tiny font-mono text-muted mb-2">Alphacrest // Present</div>
				<p class="text-xs text-muted leading-relaxed font-sans">
					Directing technical strategy, scalable AWS cloud infrastructure, low-latency algorithmic trading systems, and internal developer tools.
				</p>
			</div>
		</div>

		<!-- MSc Candidate Card -->
		<div class="border-l-2 border-accent border-y border-r border-border rounded-r-md p-4 bg-card shadow-sm flex flex-col justify-between gap-2">
			<div>
				<div class="text-tiny font-mono text-accent font-bold uppercase tracking-wider mb-1">
					02 // RESEARCH
				</div>
				<h3 class="text-sm font-bold font-mono text-main">MSC CS CANDIDATE</h3>
				<div class="text-tiny font-mono text-muted mb-2">UWC // Thesis Year</div>
				<p class="text-xs text-muted leading-relaxed font-sans">
					Framework for secure financial transactions using relativistic quantum tokens, combining quantum physics with software engineering.
				</p>
			</div>
		</div>

		<!-- Cybersecurity Card -->
		<div class="border-l-2 border-accent border-y border-r border-border rounded-r-md p-4 bg-card shadow-sm flex flex-col justify-between gap-2">
			<div>
				<div class="text-tiny font-mono text-accent font-bold uppercase tracking-wider mb-1">
					03 // SECURITY
				</div>
				<h3 class="text-sm font-bold font-mono text-main">CYBERSECURITY</h3>
				<div class="text-tiny font-mono text-muted mb-2">SANReN 1st Place // Mentor</div>
				<p class="text-xs text-muted leading-relaxed font-sans">
					Mentoring cybersecurity competition teams at UWC (2024, 2026). Secured 1st place in SANReN 2025 national competition.
				</p>
			</div>
		</div>
	</div>
</div>
