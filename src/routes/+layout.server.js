export const csr = false;

import * as amp from '@sveltejs/amp';
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    let buffer = '';
    return resolve(event, {
        transformPageChunk: ({ html, done }) => {
            buffer += html;
            if (done) return amp.transform(html);
        }
    });
}