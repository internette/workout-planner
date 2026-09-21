import type { Metadata, Viewport } from 'next';
import './planner.css';
import { ColorVariables } from '@/components/ui/colors';
import { TypographyVariables } from '@/components/ui/typography';
import { ElevationVariables } from '@/components/ui/elevation';

export const metadata: Metadata = {
  title: 'Ritual — Magical Girl Training Plan',
  description: 'Plan workouts, log how they felt, and rank up.',
};

export const viewport: Viewport = { themeColor: '#FBF1F3' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorVariables />
        <TypographyVariables />
        <ElevationVariables />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
