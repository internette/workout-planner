import type { MetadataRoute } from 'next';

// Served at /manifest.webmanifest and linked from every page. The icon is a full-bleed tile with the mark well inside
// the central 80%, so the same file works as a plain icon and as a maskable one (Android rounds or crops it).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Moonset',
    short_name: 'Moonset',
    description: 'Plan workouts, log how they felt, and rank up.',
    start_url: '/calendar',
    display: 'standalone',
    background_color: '#FBF1F3',
    theme_color: '#FBF1F3',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
