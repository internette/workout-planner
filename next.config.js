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
    ];
  },
};

module.exports = nextConfig;
