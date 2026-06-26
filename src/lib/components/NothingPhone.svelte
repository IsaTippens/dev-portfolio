<script>
</script>

<div class="relative w-full h-full">
    <svg viewBox="0 0 200 400" class="w-full h-full drop-shadow-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-300">
        <!-- Phone Body -->
        <rect x="20" y="20" width="160" height="360" rx="24" fill="#f4f4f4" stroke="#d1d5db" stroke-width="2" />

        <!-- Camera Bump -->
        <rect x="30" y="30" width="50" height="100" rx="25" fill="#e5e7eb" stroke="#d1d5db" stroke-width="1" />
        <circle cx="55" cy="55" r="14" fill="#111827" />
        <circle cx="55" cy="105" r="14" fill="#111827" />
        <circle cx="55" cy="55" r="5" fill="#374151" />
        <circle cx="55" cy="105" r="5" fill="#374151" />

        <!-- Wireless Charging Coil (Center) - Decorative -->
        <circle cx="100" cy="200" r="55" fill="none" stroke="#d1d5db" stroke-width="1" />
        <circle cx="100" cy="200" r="48" fill="none" stroke="#e5e7eb" stroke-width="4" />

        <!-- Ribbon cables / internal details -->
        <path d="M 100 255 L 100 330" stroke="#d1d5db" stroke-width="8" stroke-linecap="round" />
        <path d="M 80 330 L 120 330" stroke="#d1d5db" stroke-width="4" stroke-linecap="round" />

        <!-- GLYPH INTERFACES - Phone 2 Layout -->

        <!-- A1 & A2 (Around Camera) -->
        <path d="M 38 65 A 25 25 0 0 1 78 40" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-fast" />
        <path d="M 78 120 A 25 25 0 0 1 38 95" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-delayed-1" />

        <!-- B1 (Top Right Slant) -->
        <path d="M 110 90 L 140 50" stroke="#ffffff" stroke-width="4" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-delayed-2" />

        <!-- C Ring (Around Coil) -->
        <!-- C2 (Top Left) -->
        <path d="M 50 170 A 55 55 0 0 1 80 148" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-fast" />
        <!-- C1_1 - C1_16 (Top Right long arc) -->
        <path d="M 90 146 A 55 55 0 0 1 150 170" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-delayed-3" />
        <!-- C3 (Middle Left) -->
        <path d="M 46 185 A 55 55 0 0 0 46 215" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-delayed-1" />
        <!-- C6 (Middle Right) -->
        <path d="M 154 185 A 55 55 0 0 1 154 215" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-delayed-2" />
        <!-- C4 (Bottom Left) -->
        <path d="M 50 230 A 55 55 0 0 0 100 254" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-fast" />
        <!-- C5 (Bottom Right) -->
        <path d="M 110 254 A 55 55 0 0 0 150 230" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-delayed-4" />

        <!-- D1_1 - D1_8 (Bottom Exclamation Mark Line) -->
        <path d="M 100 270 L 100 320" stroke="#ffffff" stroke-width="4" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-delayed-1" />
        <!-- E1 (Bottom Exclamation Mark Dot) -->
        <circle cx="100" cy="335" r="3" fill="#ffffff" class="opacity-30 group-hover:animate-pulse-fast" />
    </svg>
</div>

<style>
    :global(.group:hover .group-hover\:animate-pulse-fast) {
        animation: glyph-pulse 0.8s infinite alternate;
    }
    :global(.group:hover .group-hover\:animate-pulse-delayed-1) {
        animation: glyph-pulse 0.8s infinite alternate 0.2s;
    }
    :global(.group:hover .group-hover\:animate-pulse-delayed-2) {
        animation: glyph-pulse 0.8s infinite alternate 0.4s;
    }
    :global(.group:hover .group-hover\:animate-pulse-delayed-3) {
        animation: glyph-pulse 0.8s infinite alternate 0.6s;
    }
    :global(.group:hover .group-hover\:animate-pulse-delayed-4) {
        animation: glyph-pulse 0.8s infinite alternate 0.8s;
    }

    @keyframes glyph-pulse {
        0% {
            opacity: 0.3;
            filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0));
        }
        100% {
            opacity: 1;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.5));
        }
    }
</style>
