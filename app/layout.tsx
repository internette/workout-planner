import type { Metadata, Viewport } from 'next';
import './planner.css';
import { ColorVariables } from '@/components/ui/colors';
import { TypographyVariables } from '@/components/ui/typography';
import { ElevationVariables } from '@/components/ui/elevation';
import { StructureVariables } from '@/components/ui/StructureVariables';
import { RegisterServiceWorker } from '@/components/RegisterServiceWorker';

export const metadata: Metadata = {
  title: 'Moonshot — Magical Girl Training Plan',
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
        <StructureVariables />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* The root layout is the one place every page shares. The rule below is written for the Pages Router,
            where a font in a page would load for that page only. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
