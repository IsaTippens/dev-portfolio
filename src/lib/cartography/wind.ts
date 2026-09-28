/**
 * Surface wind over the city bowl, from Open-Meteo (keyless, CORS-open). One
 * reading per visit: the plate is a survey, not a weather station.
 */

const ENDPOINT =
	'https://api.open-meteo.com/v1/forecast?latitude=-33.92&longitude=18.42&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh';

export type Wind = {
	/** 10 m wind speed, km/h. */
	speed: number;
	/** Where the wind blows from, degrees clockwise from north. */
	from: number;
};

/** The reading, or null on any failure: decoration never gets to throw. */
export async function fetchWind(signal: AbortSignal): Promise<Wind | null> {
	try {
		const res = await fetch(ENDPOINT, { signal });
		if (!res.ok) return null;
		const body: { current?: { wind_speed_10m?: unknown; wind_direction_10m?: unknown } } = await res.json();
		const speed = body.current?.wind_speed_10m;
		const from = body.current?.wind_direction_10m;
		if (typeof speed !== 'number' || typeof from !== 'number') return null;
		return { speed, from };
	} catch {
		return null;
	}
}

/**
 * The Cape Doctor: a strong south-easter, the wind that lays the tablecloth.
 * It spills over the mountain from the False Bay side, so anything from east of
 * south-east round to just short of south counts, once it is blowing properly.
 */
export const isCapeDoctor = ({ speed, from }: Wind) => from >= 100 && from <= 170 && speed >= 30;

const POINTS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

/** Sixteen-point compass name for a bearing. */
export const compassPoint = (deg: number) => POINTS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
