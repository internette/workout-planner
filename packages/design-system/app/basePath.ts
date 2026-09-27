// The design-system site is served at /design-system on Moonshot's own address (the main app forwards that path here).
// Next.js adds it to <Link> and router paths by itself; plain <img> and <a> addresses to files in public/ need it
// written in. Keep it in step with basePath in next.config.js.
export const BASE_PATH = '/design-system';
