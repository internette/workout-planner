/** @type {import('next').NextConfig} */
// The design-system site, deployed as its own Vercel project. Moonshot's main app forwards /design-system here
// (DESIGN_SYSTEM_URL in its next.config.js), so every page and asset lives under that path. Keep basePath in step with
// app/basePath.ts.
const nextConfig = {
  reactStrictMode: true,
  basePath: '/design-system',
};

module.exports = nextConfig;
