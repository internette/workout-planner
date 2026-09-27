import type { Metadata, Viewport } from 'next';
import '../src/base.css';
import './globals.css';
import { ColorVariables, colors } from '../src/colors';
import { ElevationVariables } from '../src/elevation';
import { StructureVariables } from '../src/StructureVariables';
import { TypographyVariables } from '../src/typography';
import { Lockup } from '../src/brand/Lockup';
import { DesignSystemNav } from './DesignSystemNav';
import styles from './design-system.module.css';

// The design-system site: its own Next.js app, served at /design-system on Moonshot's address (the main app forwards
// that path here). It always shows the light pink theme: it has no theme script, so the app's saved look never applies.

export const metadata: Metadata = { title: 'Design system' };
export const viewport: Viewport = { themeColor: colors.canvas };

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorVariables />
        <TypographyVariables />
        <ElevationVariables />
        <StructureVariables />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className={styles.shell} data-design-system>
          <header className={styles.top}>
            {/* A plain link: the home page is the main app, outside this site. */}
            <a href="/" className={styles.brand} aria-label="Moonshot home">
              <Lockup height={28} />
            </a>
          </header>
          <div className={styles.body}>
            <DesignSystemNav />
            <div className={styles.content}>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
