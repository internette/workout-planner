// The design-system site is its own Next.js app (packages/design-system), deployed as a separate Vercel project and
// served at /design-system (it uses that basePath). This app forwards the path to it: set DESIGN_SYSTEM_URL to that
// project's address, e.g. https://moonshot-design-system.vercel.app. In development it runs on port 3001
// (npm run dev:design-system). Without either, /design-system isn't served.
const designSystemUrl = (
  process.env.DESIGN_SYSTEM_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '')
).replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The design system is a workspace package shipped as TypeScript source (packages/design-system), so Next compiles it.
  transpilePackages: ['@moonshot/design-system'],
  // The Arsenal is now the Spellbook. Old links and bookmarks still land there.
  async redirects() {
    return [{ source: '/arsenal', destination: '/spellbook', permanent: true }];
  },
  // The connector's OAuth discovery document (see app/api/oauth-protected-resource), at the addresses clients look for.
  async rewrites() {
    return [
      { source: '/.well-known/oauth-protected-resource', destination: '/api/oauth-protected-resource' },
      { source: '/.well-known/oauth-protected-resource/:path*', destination: '/api/oauth-protected-resource' },
      ...(designSystemUrl
        ? [
            { source: '/design-system', destination: `${designSystemUrl}/design-system` },
            { source: '/design-system/:path*', destination: `${designSystemUrl}/design-system/:path*` },
          ]
        : []),
    ];
  },
};

module.exports = nextConfig;
