/**
 * The portrait engine's control state, lifted out of the 2D module so every view of the
 * device — the 2D control panel and the 3D model — reads and drives one object.
 *
 * Client state only: nothing here is written during SSR (all writes come from button
 * presses, knob drags and the scroll cycle, all of which happen after hydration), so
 * the module-level rune state cannot leak between requests.
 *
 * @typedef {'LCD' | 'CRT' | 'GAMEBOY' | 'DOT_MATRIX' | 'NORMAL'} PoMode
 * @typedef {'freq' | 'phase' | 'rgb'} PoKnob
 */

/**
 * The display's own phosphor colours. These are the tube, not the interface, so they
 * are deliberately faceplate-independent — the case around them changes with the
 * theme, the phosphor inside does not, exactly like real hardware.
 *
 * @type {{ id: PoMode, key: string, hud: string, preset: [number, number, number] }[]}
 */
export const PO_MODES = [
	{ id: 'LCD', key: 'LCD', hud: '#00ff66', preset: [43.2, -28.8, 90] },
	{ id: 'CRT', key: 'CRT', hud: '#33ccff', preset: [-90, 57.6, -43.2] },
	{ id: 'GAMEBOY', key: 'GB', hud: '#8bac0f', preset: [180, 118.8, 28.8] },
	{ id: 'DOT_MATRIX', key: 'DM', hud: '#ff5500', preset: [-28.8, -90, 118.8] },
	{ id: 'NORMAL', key: 'NOR', hud: '#ffffff', preset: [0, 0, 0] }
];

const state = $state({
	mode: /** @type {PoMode} */ (PO_MODES[0].id),
	manual: false,
	freq: PO_MODES[0].preset[0],
	phase: PO_MODES[0].preset[1],
	rgb: PO_MODES[0].preset[2]
});

/** The live control state. Mutate it through the actions below, never directly. */
export const po = state;

/**
 * Set the display mode. A manual button press wins for the rest of the visit: once the
 * operator has touched the panel the scroll no longer drives it, because a machine
 * that fights its operator is broken.
 * @param {PoMode} id
 * @param {boolean} [by_operator]
 */
export function poApply(id, by_operator = true) {
	if (by_operator) state.manual = true;
	if (id === state.mode) return;
	const preset = PO_MODES.find((m) => m.id === id)?.preset;
	state.mode = id;
	if (preset) [state.freq, state.phase, state.rgb] = preset;
}

/** Scroll-driven mode cycling, unless the operator has taken the panel.
 * @param {PoMode | null} id
 */
export function poScrollMode(id) {
	if (!id || state.manual) return;
	poApply(id, false);
}

/** Return one knob to the active mode's preset.
 * @param {PoKnob} knob
 */
export function poResetKnob(knob) {
	const preset = PO_MODES.find((m) => m.id === state.mode)?.preset ?? PO_MODES[0].preset;
	const [f, p, r] = preset;
	if (knob === 'freq') state.freq = f;
	else if (knob === 'phase') state.phase = p;
	else state.rgb = r;
}

export const poActiveMode = () => PO_MODES.find((m) => m.id === state.mode) ?? PO_MODES[0];
