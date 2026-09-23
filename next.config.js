/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The Arsenal is now the Spellbook. Old links and bookmarks still land there.
  async redirects() {
    return [{ source: '/arsenal', destination: '/spellbook', permanent: true }];
  },
};

module.exports = nextConfig;
