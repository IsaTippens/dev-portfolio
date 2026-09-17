import { THEMES } from '$lib/stores/theme';

const dark_ids = THEMES.filter((t) => t.dark).map((t) => t.id);
const colors = Object.fromEntries(THEMES.map((t) => [t.id, t.color]));
const default_light = THEMES.find((t) => !t.dark)?.id ?? THEMES[0].id;
const default_dark = dark_ids[0] ?? default_light;

/**
 * Expands `%theme_boot%` in app.html into the palette's <meta name="theme-color"> and
 * an inline script that applies the stored palette to <html> before first paint.
 * Generated from THEMES so the boot script can't drift from the palette registry.
 */
function theme_boot() {
	return `<meta name="theme-color" content="${colors[default_light]}" />
		<script>
			(() => {
				const dark = ${JSON.stringify(dark_ids)};
				const colors = ${JSON.stringify(colors)};
				const stored = localStorage.getItem('theme');
				const id = stored && Object.hasOwn(colors, stored) ? stored : matchMedia('(prefers-color-scheme: dark)').matches ? ${JSON.stringify(
					default_dark
				)} : ${JSON.stringify(default_light)};
				const root = document.documentElement;
				root.dataset.theme = id;
				if (dark.includes(id)) root.classList.add('dark');
				document.querySelector('meta[name="theme-color"]').content = colors[id];
			})();
		</script>`;
}

export async function handle({ event, resolve }) {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%theme_boot%', theme_boot())
	});
}
