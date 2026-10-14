import type { Metadata, Viewport } from 'next';
import '@moonshot/design-system/base.css';
import './planner.css';
import { colors } from '@moonshot/design-system/colors';
import { DesignTokens } from '@moonshot/design-system/tokens';
import { RegisterServiceWorker } from '@/frontend/features/install/RegisterServiceWorker';
import { themeScript } from '@moonshot/design-system/theme';

export const metadata: Metadata = {
  title: 'Moonshot — Magical Girl Training Plan',
  description: 'Plan workouts, log how they felt, and rank up.',
};

// Cover: the page reaches the screen's edges on a phone with a home indicator, so the tab bar's own background fills
// the strip under it (its padding takes env(safe-area-inset-bottom)) rather than the page's color showing there.
export const viewport: Viewport = { themeColor: colors.canvas, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The theme script sets data-theme before React loads, so the server's <html> can differ: that's expected.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <DesignTokens />
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
