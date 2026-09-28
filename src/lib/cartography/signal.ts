/**
 * Where the visitor's signal comes from, as near as the browser will say without
 * asking. The time zone is the one location hint every browser hands over for
 * free, and its IANA name is a city: good to a few hundred kilometres, which
 * is plenty for a compass tick on a plate the size of a thumbnail.
 */

/** The survey's home pin, same as the LAT/LON readout. */
export const CAPE_TOWN = { lat: -33.9249, lon: 18.4241 } as const;

/** South Africa runs on one zone: a visitor on it is already on the map. */
const LOCAL = 'Africa/Johannesburg';

/**
 * Reference city of each zone, `[lat, lon]`. The busiest few dozen, not the whole
 * database: an unlisted zone just leaves the row off. Legacy aliases that
 * browsers still report ride along with their current names.
 */
const ZONES: Record<string, readonly [number, number]> = {
	'Europe/London': [51.51, -0.13],
	'Europe/Dublin': [53.35, -6.26],
	'Europe/Lisbon': [38.72, -9.14],
	'Europe/Madrid': [40.42, -3.7],
	'Europe/Paris': [48.86, 2.35],
	'Europe/Brussels': [50.85, 4.35],
	'Europe/Amsterdam': [52.37, 4.9],
	'Europe/Berlin': [52.52, 13.4],
	'Europe/Zurich': [47.38, 8.54],
	'Europe/Rome': [41.9, 12.5],
	'Europe/Vienna': [48.21, 16.37],
	'Europe/Prague': [50.08, 14.44],
	'Europe/Warsaw': [52.23, 21.01],
	'Europe/Copenhagen': [55.68, 12.57],
	'Europe/Oslo': [59.91, 10.75],
	'Europe/Stockholm': [59.33, 18.07],
	'Europe/Helsinki': [60.17, 24.94],
	'Europe/Athens': [37.98, 23.73],
	'Europe/Istanbul': [41.01, 28.98],
	'Europe/Kyiv': [50.45, 30.52],
	'Europe/Kiev': [50.45, 30.52],
	'Europe/Moscow': [55.76, 37.62],
	'Africa/Casablanca': [33.57, -7.59],
	'Africa/Accra': [5.6, -0.19],
	'Africa/Lagos': [6.52, 3.38],
	'Africa/Cairo': [30.04, 31.24],
	'Africa/Addis_Ababa': [9.03, 38.74],
	'Africa/Nairobi': [-1.29, 36.82],
	'Africa/Lusaka': [-15.39, 28.32],
	'Africa/Harare': [-17.83, 31.05],
	'Africa/Windhoek': [-22.56, 17.08],
	'Africa/Gaborone': [-24.63, 25.92],
	'Africa/Maputo': [-25.97, 32.57],
	'Asia/Jerusalem': [31.77, 35.21],
	'Asia/Riyadh': [24.71, 46.68],
	'Asia/Tehran': [35.69, 51.39],
	'Asia/Dubai': [25.2, 55.27],
	'Asia/Karachi': [24.86, 67.01],
	'Asia/Kolkata': [22.57, 88.36],
	'Asia/Calcutta': [22.57, 88.36],
	'Asia/Dhaka': [23.81, 90.41],
	'Asia/Bangkok': [13.76, 100.5],
	'Asia/Ho_Chi_Minh': [10.82, 106.63],
	'Asia/Saigon': [10.82, 106.63],
	'Asia/Kuala_Lumpur': [3.14, 101.69],
	'Asia/Singapore': [1.35, 103.82],
	'Asia/Jakarta': [-6.21, 106.85],
	'Asia/Manila': [14.6, 120.98],
	'Asia/Hong_Kong': [22.32, 114.17],
	'Asia/Shanghai': [31.23, 121.47],
	'Asia/Taipei': [25.03, 121.57],
	'Asia/Seoul': [37.57, 126.98],
	'Asia/Tokyo': [35.68, 139.69],
	'Australia/Perth': [-31.95, 115.86],
	'Australia/Adelaide': [-34.93, 138.6],
	'Australia/Melbourne': [-37.81, 144.96],
	'Australia/Sydney': [-33.87, 151.21],
	'Australia/Brisbane': [-27.47, 153.03],
	'Pacific/Auckland': [-36.85, 174.76],
	'Pacific/Honolulu': [21.31, -157.86],
	'America/Anchorage': [61.22, -149.9],
	'America/Vancouver': [49.28, -123.12],
	'America/Los_Angeles': [34.05, -118.24],
	'America/Phoenix': [33.45, -112.07],
	'America/Denver': [39.74, -104.99],
	'America/Mexico_City': [19.43, -99.13],
	'America/Chicago': [41.88, -87.63],
	'America/Toronto': [43.65, -79.38],
	'America/New_York': [40.71, -74.01],
	'America/Halifax': [44.65, -63.57],
	'America/Bogota': [4.71, -74.07],
	'America/Lima': [-12.05, -77.04],
	'America/Caracas': [10.48, -66.9],
	'America/Santiago': [-33.45, -70.67],
	'America/Sao_Paulo': [-23.55, -46.63],
	'America/Argentina/Buenos_Aires': [-34.6, -58.38],
	'America/Buenos_Aires': [-34.6, -58.38]
};

const RAD = Math.PI / 180;
/** Mean earth radius, km. */
const EARTH_KM = 6371;

/**
 * `local` for South African zones, great-circle distance (km) and initial
 * bearing (degrees from north) out of Cape Town for a known zone, and null for
 * anything else.
 */
export type Signal = 'local' | { km: number; bearing: number } | null;

export function signalFrom(zone: string): Signal {
	if (zone === LOCAL) return 'local';
	// Own keys only: a zone string is visitor-controlled, and `constructor` is not a city.
	if (!Object.hasOwn(ZONES, zone)) return null;
	const far = ZONES[zone];

	const p1 = CAPE_TOWN.lat * RAD;
	const p2 = far[0] * RAD;
	const dl = (far[1] - CAPE_TOWN.lon) * RAD;

	// Haversine: well-conditioned at every range, antipodes included.
	const h = Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
	const km = 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));

	const bearing =
		(Math.atan2(
			Math.sin(dl) * Math.cos(p2),
			Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl)
		) /
			RAD +
			360) %
		360;

	return { km, bearing };
}
