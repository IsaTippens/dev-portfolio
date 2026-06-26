<script>
</script>

<div class="relative w-full h-full">
    <svg viewBox="0 0 200 400" class="w-full h-full drop-shadow-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-300">
        <!-- Phone Body -->
        <rect x="20" y="20" width="160" height="360" rx="24" fill="#f4f4f4" stroke="#d1d5db" stroke-width="2" />

        <!-- Camera Bump -->
        <rect x="35" y="40" width="40" height="90" rx="20" fill="#e5e7eb" stroke="#d1d5db" stroke-width="1" />
        <circle cx="55" cy="65" r="12" fill="#111827" />
        <circle cx="55" cy="105" r="12" fill="#111827" />
        <circle cx="55" cy="65" r="4" fill="#374151" />
        <circle cx="55" cy="105" r="4" fill="#374151" />

        <!-- Wireless Charging Coil (Center) -->
        <circle cx="100" cy="200" r="45" fill="none" stroke="#d1d5db" stroke-width="1" />
        <circle cx="100" cy="200" r="40" fill="none" stroke="#e5e7eb" stroke-width="4" />
        <circle cx="100" cy="200" r="35" fill="none" stroke="#d1d5db" stroke-width="1" />

        <!-- Ribbon cables / internal details -->
        <path d="M 100 245 L 100 320" stroke="#d1d5db" stroke-width="8" stroke-linecap="round" />
        <path d="M 80 320 L 120 320" stroke="#d1d5db" stroke-width="4" stroke-linecap="round" />
        <path d="M 130 50 L 150 50 L 150 120 L 100 120" fill="none" stroke="#d1d5db" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />

        <!-- GLYPH INTERFACES -->

        <!-- Camera surround glyph -->
        <path d="M 55 35 A 30 30 0 0 1 85 65 L 85 105 A 30 30 0 0 1 55 135" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-fast" />

        <!-- Top right slant glyph -->
        <path d="M 140 40 L 160 80" stroke="#ffffff" stroke-width="3" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-delayed-1" />

        <!-- Coil surround glyphs (split into parts) -->
        <path d="M 100 152 A 48 48 0 0 1 148 200 A 48 48 0 0 1 100 248" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-delayed-2" />
        <path d="M 100 248 A 48 48 0 0 1 52 200" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-delayed-3" />
        <path d="M 52 200 A 48 48 0 0 1 100 152" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" class="opacity-30 group-hover:animate-pulse-fast" />

        <!-- Bottom exclamation mark glyph -->
        <path d="M 100 270 L 100 330" stroke="#ffffff" stroke-width="3" stroke-linecap="round" class="opacity-30 group-hover:animate-pulse-delayed-4" />
        <circle cx="100" cy="345" r="2.5" fill="#ffffff" class="opacity-30 group-hover:animate-pulse-delayed-1" />
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
