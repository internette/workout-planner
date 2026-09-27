/** @type {import('next').NextConfig} */
// The design-system site, deployed as its own Vercel project. Moonshot's main app forwards /design-system here
// (DESIGN_SYSTEM_URL in its next.config.js), so every page and asset lives under that path. Keep basePath in step with
// app/basePath.ts.
const nextConfig = {
  reactStrictMode: true,
  basePath: '/design-system',
  // The project's own address has nothing at its root (everything is under the basePath), so send it to the site.
  async redirects() {
    return [{ source: '/', destination: '/design-system', basePath: false, permanent: false }];
  },
};

module.exports = nextConfig;
