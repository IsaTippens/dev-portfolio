// Every page is built from files in the repo, so every page is prerendered and served
// by the CDN without running the Worker. Routes that need a live server opt out.
export const prerender = true;
