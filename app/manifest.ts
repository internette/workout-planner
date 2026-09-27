import type { MetadataRoute } from 'next';
import { colors } from '@moonshot/design-system/colors';

// Served at /manifest.webmanifest and linked from every page. The icon is a full-bleed tile with the mark well inside
// the central 80%, so the same file works as a plain icon and as a maskable one (Android rounds or crops it).
export default function manifest(): MetadataRoute.Manifest {
  return {
    // A fixed identity, so changing start_url later does not turn the installed app into a different one.
    id: '/',
    name: 'Moonshot',
    short_name: 'Moonshot',
    description: 'Plan workouts, log how they felt, and rank up.',
    start_url: '/calendar',
    display: 'standalone',
    background_color: colors.canvas,
    theme_color: colors.canvas,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
