import { getYearsSince } from '$lib/getYear';
export async function load({ fetch }) {
    const age = getYearsSince(new Date('2001-06-01'));
    const devYear = getYearsSince(new Date('2013-08-01'));
    const workYear = getYearsSince(new Date('2021-06-01'));

    const res = await fetch(`/api/posts`);
    const posts = await res.json();
    return {
        age,
        devYear,
        workYear,
        posts
    };
}