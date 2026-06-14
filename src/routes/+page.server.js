import { getYearsSince } from '$lib/getYear';
export async function load({ fetch }) {
	const age = getYearsSince(new Date('2001-06-01'));
	const devYear = getYearsSince(new Date('2014-06-01'));
	const seYear = getYearsSince(new Date('2021-06-01'));
	const vibeYear = new Date().getFullYear() - 2025;

	const res = await fetch(`/api/posts`);
	const posts = await res.json();
	return {
		age,
		devYear,
		seYear,
		vibeYear,
		posts
	};
}
