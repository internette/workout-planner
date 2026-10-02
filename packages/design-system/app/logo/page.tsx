import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { Lockup, Mark } from '../../src/brand';
import { Card } from '../../src/card';
import { Text } from '../../src/typography';
import { BASE_PATH } from '../basePath';
import { DocPage, h2, note } from '../docs';
import styles from '../design-system.module.css';

export const metadata = { title: 'Logo — Design system' };

// The four pieces of Moonshot's logo, each at the sizes it's used. The artwork is in the package's public/brand.

const stage: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'center',
  gap: '20px 32px',
  padding: '28px 20px',
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-canvas)',
};

const art = (file: string, size: number, rounded = false) => (
  <Image
    src={`${BASE_PATH}/brand/${file}`}
    alt=""
    width={size}
    height={size}
    unoptimized
    style={rounded ? { borderRadius: '22%', boxShadow: 'var(--elevation-raised)' } : undefined}
  />
);

/** One size of a piece of the logo, with its label underneath. */
function Size({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {children}
      <Text variant="body" tone="muted" as="figcaption">
        {label}
      </Text>
    </figure>
  );
}

/** The panel for one piece: its sizes on the page colour, then where it's used, its import and its download. */
function Piece({ sizes, used, code, file }: { sizes: ReactNode; used: ReactNode; code?: string; file: string }) {
  return (
    <Card>
      <div style={stage}>{sizes}</div>
      <Text variant="body" tone="slateDeep" as="p" style={{ margin: '14px 0 0' }}>
        {used}
      </Text>
      {code ? (
        <Text variant="body" tone="muted" as="p" style={{ margin: '6px 0 0' }}>
          <code>{code}</code>
        </Text>
      ) : null}
      <a className={styles.download} href={`${BASE_PATH}/brand/${file}`} download style={{ display: 'inline-block', marginTop: 12 }}>
        Download SVG
      </a>
    </Card>
  );
}

export default function LogoPage() {
  return (
    <DocPage title="Logo">
      <p style={{ ...note, marginTop: 8 }}>
        Moonshot&apos;s logo is a faceted crescent moon, the mark, in the brand&apos;s pink, periwinkle and teal. It comes
        in four pieces: the lockup (the mark with the name), the mark alone, the favicon and the app icon. The lockup
        and the mark are components, so the name stays live text; the favicon and the app icon are files.
      </p>

      <h2 id="lockup" style={h2}>Lockup</h2>
      <p style={note}>
        The mark with the name. Use it wherever Moonshot introduces itself: page headers and footers, left-aligned.
        Size it by <code>height</code>; the width follows.
      </p>
      <Piece
        file="moonshot-lockup.svg"
        code="import { Lockup } from '@moonshot/design-system/brand'"
        used="The sign-in page's header (28) and footer (24), and this site's header (28) and phone menu (22)."
        sizes={
          <>
            <Size label="40">
              <Lockup height={40} />
            </Size>
            <Size label="28">
              <Lockup height={28} />
            </Size>
            <Size label="22">
              <Lockup height={22} />
            </Size>
          </>
        }
      />

      <h2 id="mark" style={h2}>Mark</h2>
      <p style={note}>
        The mark alone, where the name is already on the page or there&apos;s no room for it. It&apos;s decorative, so put
        the name beside it or label its parent. With <code>animate</code> its facets light up one after another, for a
        loading screen.
      </p>
      <Piece
        file="moonshot-mark.svg"
        code="import { Mark } from '@moonshot/design-system/brand'"
        used="The loading screen (60, animated), the install prompt (36) and this site's phone menu (26)."
        sizes={
          <>
            <Size label="60, animated">
              <Mark size={60} animate />
            </Size>
            <Size label="36">
              <Mark size={36} />
            </Size>
            <Size label="26">
              <Mark size={26} />
            </Size>
          </>
        }
      />

      <h2 id="favicon" style={h2}>Favicon</h2>
      <p style={note}>
        The mark made to hold up at 16px, the size of a browser tab: enlarged by about a fifth to fill its square, and
        without the thin seams between the facets, which would only blur that small. In the app itself, use the mark.
      </p>
      <Piece
        file="moonshot-favicon.svg"
        used="The browser tab icon (the app's icon.svg and favicon.ico)."
        sizes={
          <>
            <Size label="64">{art('moonshot-favicon.svg', 64)}</Size>
            <Size label="32">{art('moonshot-favicon.svg', 32)}</Size>
            <Size label="16">{art('moonshot-favicon.svg', 16)}</Size>
          </>
        }
      />

      <h2 id="app-icon" style={h2}>App icon</h2>
      <p style={note}>
        The mark on the app tint, full-bleed, with the mark well inside the middle 80%, so the same file works as a plain
        icon and as a maskable one (Android rounds or crops it). Drawn at 1024 and exported at 512, 192 and 180.
      </p>
      <Piece
        file="moonshot-app-icon-1024.svg"
        used="The home-screen icon when Moonshot is installed (icon-192.png, icon-512.png and apple-icon.png)."
        sizes={
          <>
            <Size label="96">{art('moonshot-app-icon-1024.svg', 96, true)}</Size>
            <Size label="60">{art('moonshot-app-icon-1024.svg', 60, true)}</Size>
            <Size label="40">{art('moonshot-app-icon-1024.svg', 40, true)}</Size>
          </>
        }
      />
    </DocPage>
  );
}
