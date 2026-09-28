/**
 * Where the sun stands over a point on the ground, right now. The low-precision
 * almanac (the one SunCalc and the NOAA spreadsheet are built on): good to a
 * fraction of a degree for a century either side of J2000, which is far finer
 * than a terrace shadow a couple of map units long can show.
 */

const RAD = Math.PI / 180;
const DAY_MS = 86_400_000;
/** Julian day of the Unix epoch, and of J2000.0. */
const J1970 = 2_440_588;
const J2000 = 2_451_545;
/** Obliquity of the ecliptic. */
const OBLIQUITY = 23.4397 * RAD;

export type SunPosition = {
	/** Compass bearing of the sun, degrees clockwise from true north, 0–360. */
	azimuth: number;
	/** Height above the horizon in degrees; negative once it has set. */
	altitude: number;
};

export function sunPosition(date: Date, lat: number, lon: number): SunPosition {
	const d = date.valueOf() / DAY_MS - 0.5 + J1970 - J2000;

	// Where the sun sits on the ecliptic today: mean anomaly, plus the equation
	// of centre, plus the perihelion.
	const mean = RAD * (357.5291 + 0.98560028 * d);
	const centre = RAD * (1.9148 * Math.sin(mean) + 0.02 * Math.sin(2 * mean) + 0.0003 * Math.sin(3 * mean));
	const ecliptic = mean + centre + RAD * 102.9372 + Math.PI;

	const declination = Math.asin(Math.sin(OBLIQUITY) * Math.sin(ecliptic));
	const ascension = Math.atan2(Math.sin(ecliptic) * Math.cos(OBLIQUITY), Math.cos(ecliptic));

	// Hour angle: how far the earth has turned the sun past this meridian.
	const sidereal = RAD * (280.16 + 360.9856235 * d) + RAD * lon;
	const hour = sidereal - ascension;
	const phi = RAD * lat;

	const altitude = Math.asin(
		Math.sin(phi) * Math.sin(declination) + Math.cos(phi) * Math.cos(declination) * Math.cos(hour)
	);
	// Measured from south, positive westward…
	const south = Math.atan2(
		Math.sin(hour),
		Math.cos(hour) * Math.sin(phi) - Math.tan(declination) * Math.cos(phi)
	);
	// …so turn it round to a compass bearing.
	const azimuth = (south / RAD + 180 + 360) % 360;

	return { azimuth, altitude: altitude / RAD };
}

/** Civil dusk: the sun 6° under the horizon, when the streetlights have all come on. */
export const CIVIL_DUSK = -6;
