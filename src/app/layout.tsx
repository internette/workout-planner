import type { Metadata, Viewport } from 'next';
import '@moonshot/design-system/base.css';
import './planner.css';
import { ColorVariables, colors } from '@moonshot/design-system/colors';
import { TypographyVariables } from '@moonshot/design-system/typography';
import { ElevationVariables } from '@moonshot/design-system/elevation';
import { StructureVariables } from '@moonshot/design-system/StructureVariables';
import { RegisterServiceWorker } from '@/features/install/RegisterServiceWorker';
import { themeScript } from '@moonshot/design-system/theme';

export const metadata: Metadata = {
  title: 'Moonshot — Magical Girl Training Plan',
  description: 'Plan workouts, log how they felt, and rank up.',
};

export const viewport: Viewport = { themeColor: colors.canvas };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The theme script sets data-theme before React loads, so the server's <html> can differ: that's expected.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
