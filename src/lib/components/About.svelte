<script lang="ts">
	import ProfilePhoto from '$lib/components/ProfilePhoto.svelte';

	let { data } = $props<{ data: any }>();
</script>

<div class="grid gap-6">
	<!-- Location, Bio Overview and Photo Panel -->
	<div class="flex flex-col md:flex-row gap-6">
		<div class="flex flex-col gap-6 flex-1">
			<div class="border border-border p-3 bg-neutral-100 dark:bg-neutral-900/40 relative">
				<div class="section-label right-3 text-tiny text-accent">
					[BIO_DATA]
				</div>
				<div class="text-[12px] leading-relaxed font-mono">
					<span class="text-accent">LOCATION:</span> Cape Town, South Africa <br />
					<span class="text-accent">STATUS:</span> {data.age} y/o programmer ({data.devYear} yrs code) <br />
					<span class="text-accent">EXPERIENCE:</span> software engineer for {data.seYear} years <br />
					<span class="text-accent">VIBE_CHECK:</span> vibe coder for {data.vibeYear} year
				</div>
			</div>

			<!-- Cartography Compartment -->
			<div class="border border-border p-4 relative hidden md:block bg-neutral-100/50 dark:bg-neutral-900/10">
				<div class="section-label right-3 text-tiny text-accent">
					[CARTOGRAPHY_CPT]
				</div>
				
				<div class="flex gap-6 items-center">
					<!-- Map SVG -->
					<div class="w-2/3 border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black/40 p-2 relative h-48 flex items-center justify-center overflow-hidden">
						<!-- Coordinates labels inside map -->
						<span class="absolute top-1 left-2 text-nano font-mono text-neutral-500 dark:text-neutral-400">33°54'00"S</span>
						<span class="absolute bottom-1 right-2 text-nano font-mono text-neutral-500 dark:text-neutral-400">18°26'00"E</span>
						
						<svg viewBox="0 -80 320 280" class="w-full h-full text-neutral-800 dark:text-neutral-200 opacity-90">
							<!-- Grid lines -->
							<g class="stroke-neutral-200 dark:stroke-neutral-800 stroke-1" stroke-dasharray="2 4">
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
								class="stroke-neutral-700 dark:stroke-neutral-500"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							
							<!-- Elevation/Topography contours (Table Mountain / Peninsula peaks) -->
							<!-- Table Mountain range contour 1 -->
							<path 
								d="M 102,50 Q 112,48 118,52 Q 122,58 115,62 Q 108,65 102,60 Q 98,55 102,50 Z" 
								fill="none" 
								class="stroke-neutral-300 dark:stroke-neutral-800" 
								stroke-width="1"
							/>
							<!-- Table Mountain plateau contour 2 -->
							<path 
								d="M 106,53 Q 110,50 115,53 Q 118,56 115,60 Q 110,63 106,60 Q 103,56 106,53 Z" 
								fill="none" 
								class="stroke-neutral-300 dark:stroke-neutral-800" 
								stroke-width="1"
							/>
							
							<!-- Constantiaberg range contour -->
							<path 
								d="M 95,78 Q 102,75 108,80 Q 112,85 108,92 Q 102,95 95,90 Q 92,85 95,78 Z" 
								fill="none" 
								class="stroke-neutral-300 dark:stroke-neutral-800" 
								stroke-width="1"
							/>
							
							<!-- Swartkop (Simon's Town) range contour -->
							<path 
								d="M 108,135 Q 115,130 118,135 Q 120,140 118,145 Q 112,148 108,142 Q 105,138 108,135 Z" 
								fill="none" 
								class="stroke-neutral-300 dark:stroke-neutral-800" 
								stroke-width="1"
							/>
							
							<!-- Kogelberg range contour -->
							<path 
								d="M 215,125 Q 225,115 235,125 Q 240,135 230,145 Q 220,150 215,140 Q 210,130 215,125 Z" 
								fill="none" 
								class="stroke-neutral-300 dark:stroke-neutral-800" 
								stroke-width="1"
							/>

							<!-- Ocean labels -->
							<text x="35" y="120" class="fill-neutral-500/60 dark:fill-neutral-400/50 text-nano font-mono tracking-widest uppercase rotate-[-90deg]">Atlantic Ocean</text>
							<text x="140" y="150" class="fill-neutral-500/60 dark:fill-neutral-400/50 text-nano font-mono tracking-widest uppercase">False Bay</text>
							<text x="120" y="25" class="fill-neutral-500/60 dark:fill-neutral-400/50 text-pico font-mono uppercase">Table Bay</text>
							
							<!-- Mountain labels -->
							<text x="120" y="55" class="fill-neutral-600 dark:fill-neutral-400 text-femto font-mono uppercase tracking-wider">Table Mt.</text>
							<text x="120" y="60" class="fill-neutral-500 dark:fill-neutral-500 text-[4.5px] font-mono">1086m</text>
							
							<!-- Point markers & City label -->
							<!-- Cape Town City Bowl -->
							<circle cx="110" cy="43" r="2" class="fill-accent opacity-75" />
							<circle cx="110" cy="43" r="1.5" class="fill-accent" />
							<text x="115" y="45" class="fill-neutral-800 dark:fill-neutral-200 text-nano font-mono font-bold uppercase tracking-wider">Cpt City</text>
							
							<!-- Cape of Good Hope / Cape Point -->
							<circle cx="102" cy="180" r="1.5" class="fill-neutral-550 dark:fill-neutral-400" />
							<text x="107" y="182" class="fill-neutral-500 dark:fill-neutral-400 text-pico font-mono uppercase">Cape Point</text>
							
							<!-- Melkbosstrand -->
							<circle cx="88" cy="10" r="1.5" class="fill-neutral-550 dark:fill-neutral-400" />
							<text x="93" y="12" class="fill-neutral-500 dark:fill-neutral-400 text-pico font-mono uppercase">Melkbosstrand</text>
							
							<!-- Yzerfontein -->
							<circle cx="45" cy="-68" r="1.5" class="fill-neutral-550 dark:fill-neutral-400" />
							<text x="50" y="-66" class="fill-neutral-500 dark:fill-neutral-400 text-pico font-mono uppercase">Yzerfontein</text>
							
							<!-- Hermanus -->
							<circle cx="265" cy="165" r="1.5" class="fill-neutral-550 dark:fill-neutral-400" />
							<text x="260" y="158" class="fill-neutral-500 dark:fill-neutral-400 text-pico font-mono uppercase">Hermanus</text>
						</svg>
					</div>
					
					<!-- Cartography Metadata and Stats -->
					<div class="flex-grow font-mono text-xxs leading-relaxed self-stretch flex flex-col justify-between py-1 border-l border-neutral-300/60 dark:border-neutral-800/80 pl-6">
						<div>
							<div class="text-[11px] font-bold text-accent tracking-wider uppercase mb-1">Cape Peninsula Survey</div>
							<div class="grid grid-cols-2 gap-x-2 gap-y-1 text-neutral-600 dark:text-neutral-400">
								<div>PROJECTION:</div><div class="text-neutral-800 dark:text-neutral-200">TRANS_MERCATOR</div>
								<div>DATUM:</div><div class="text-neutral-800 dark:text-neutral-200">WGS84</div>
								<div>COORDS:</div><div class="text-neutral-800 dark:text-neutral-200">33.9249° S, 18.4241° E</div>
								<div>ELEVATION:</div><div class="text-neutral-800 dark:text-neutral-200">0m - 1086m (TABLE MT.)</div>
								<div>VAR_N:</div><div class="text-neutral-800 dark:text-neutral-200">25.3° W (ANNUAL 0.1° W)</div>
							</div>
						</div>
						
						<!-- Scale and Compass -->
						<div class="flex items-center justify-between pt-2 border-t border-dashed border-neutral-350 dark:border-neutral-850">
							<div class="flex flex-col gap-0.5">
								<span class="text-micro text-neutral-400 dark:text-neutral-500">SCALE: 1 : 250,000</span>
								<div class="flex items-center gap-1">
									<div class="w-10 h-1 border border-neutral-400 dark:border-neutral-700 relative p-[0.5px]">
										<div class="w-1/2 h-full bg-neutral-850 dark:bg-neutral-300"></div>
									</div>
									<span class="text-nano text-neutral-600 dark:text-neutral-400">5 KM</span>
								</div>
							</div>
							
							<!-- Mini compass -->
							<div class="flex items-center gap-1.5 pr-2">
								<div class="w-6 h-6 rounded-full border border-neutral-300 dark:border-neutral-800 flex items-center justify-center relative">
									<div class="absolute w-0.5 h-4 bg-neutral-400 dark:bg-neutral-600"></div>
									<!-- North pointer -->
									<div class="absolute top-1 w-0 h-0 border-l-[2px] border-r-[2px] border-b-[4px] border-l-transparent border-r-transparent border-b-accent"></div>
									<span class="absolute -top-1.5 text-pico font-bold text-accent">N</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Profile Photo Section -->
		<div class="w-full max-w-[220px] mx-auto md:max-w-none md:w-48 shrink-0 flex items-center justify-center">
			<ProfilePhoto />
		</div>
	</div>
	<!-- CTO Compartment -->
	<div class="border border-border p-4 relative">
		<div class="section-label left-4 text-xxs text-muted">
			01 / CHIEF_TECH_OFFICER
		</div>
		<div class="text-[13px] leading-relaxed mt-1 text-justify">
			<span class="font-bold text-main uppercase">Alphacrest</span>: Directing technical strategy and execution, managing scalable AWS cloud infrastructure, developing and optimizing low-latency algorithmic trading systems, and engineering critical internal developer tooling.
		</div>
	</div>

	<!-- MSc Candidate Compartment -->
	<div class="border border-border p-4 relative">
		<div class="section-label left-4 text-xxs text-muted">
			02 / MSC_CS_CANDIDATE
		</div>
		<div class="text-[13px] leading-relaxed mt-1 text-justify">
			<span class="font-bold text-main uppercase">Thesis</span>: "A framework for secure financial transactions using relativistic quantum tokens", combining quantum computing and software engineering to develop next-generation secure transaction protocols. Currently in the final year of an MSc in Computer Science at the University of the Western Cape.
		</div>
	</div>

	<!-- Cybersecurity & SANReN Compartment -->
	<div class="border border-border p-4 relative">
		<div class="section-label left-4 text-xxs text-muted">
			03 / CYBERSECURITY_UWC
		</div>
		<div class="text-[13px] leading-relaxed mt-1 text-justify">
			Currently mentoring cybersecurity teams at UWC (2024, 2026). Represented UWC as a SANReN finalist in 2023, and secured 1st place in 2025.
		</div>
	</div>

</div>
