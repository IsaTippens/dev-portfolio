import { THEMES, THEME_IDS } from '$lib/stores/theme';

const colors = Object.fromEntries(THEMES.map((t) => [t.id, t.color]));
const default_light = 'light';
const default_dark = 'dark';

/**
 * Expands `%theme_boot%` in app.html into the plate's <meta name="theme-color"> plus an
 * inline script that runs before first paint. Generated from THEMES so the boot script
 * cannot drift from the registry.
 *
 * Besides choosing the face plate, the script arms the two pre-paint flags the CSS
 * hides content behind — `data-boot` (power-on sequence) and `data-motion` (modules
 * waiting to seat). Arming only ever happens here, in script, so:
 *   - no JavaScript  -> no flags     -> nothing is ever hidden;
 *   - reduced motion -> both cleared -> everything renders in its final state;
 *   - a boot already played this session -> not armed.
 * `js` marks that scripts are alive, which is also what the panel border draw keys off.
 */
function theme_boot() {
	return `<meta name="theme-color" content="${colors[default_light]}" />
		<script>
			(() => {
				const ids = ${JSON.stringify(THEME_IDS)};
				const colors = ${JSON.stringify(colors)};
				const root = document.documentElement;
				const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

				let stored = null;
				try {
					stored = localStorage.getItem('theme');
				} catch (e) {}
				const os_dark = matchMedia('(prefers-color-scheme: dark)').matches;
				const id = ids.includes(stored) ? stored : os_dark ? ${JSON.stringify(
					default_dark
				)} : ${JSON.stringify(default_light)};

				root.dataset.theme = id;
				root.classList.add('js');
				const meta = document.querySelector('meta[name="theme-color"]');
				if (meta) meta.content = colors[id];

				let played = false;
				try {
					played = sessionStorage.getItem('booted') === '1';
				} catch (e) {}
				root.dataset.boot = !played && !reduce ? 'armed' : 'done';
				root.dataset.motion = reduce ? 'off' : 'on';

				// Safety net: the flags above hide content before paint, so if the app
				// bundle never arrives they must come down on their own.
				window.__motion_failsafe = setTimeout(() => {
					root.dataset.motion = 'off';
					root.dataset.boot = 'done';
					for (const el of document.querySelectorAll('[data-draw]')) el.dataset.drawn = 'true';
				}, 4000);
				window.__motion_ready = () => clearTimeout(window.__motion_failsafe);
			})();
		</script>`;
}

export async function handle({ event, resolve }) {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%theme_boot%', theme_boot())
	});
}
