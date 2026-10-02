import { SectionLabel } from '@moonshot/design-system/typography';
import type { ReactNode } from 'react';
import { vars } from '@moonshot/design-system/colors';
import { Card } from '@moonshot/design-system/card';
import { Sparkle } from '@moonshot/design-system/icons';
import { ProgressBar } from '@moonshot/design-system/progress-bar';

export interface SessionProgressProps {
  /** e.g. "2 of 5 done". */
  label: string;
  /** 0–100. */
  pct: number;
  /** Every exercise is ticked off: the note turns to the accent, with a twinkling sparkle. */
  allDone: boolean;
  /** A line under the bar, e.g. "Mark each exercise as you clear it." */
  note: string;
  /** Drawn as a section of another card (the session page's workout card), not a card of its own. */
  bare?: boolean;
  /** Under the bar, above the note: on the session page, the set up next or the rest. */
  children?: ReactNode;
}

/** How far through a lifting session someone is, on the session page and in its editor. */
export function SessionProgress({ label, pct, allDone, note, bare, children }: SessionProgressProps) {
  const body = (
    <>
      <SectionLabel as="span" label="Progress" value={label} />
      <ProgressBar value={pct} track="tint" style={{ marginTop: '12px' }} />
      {children}
      <p
        style={{
          margin: '12px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: 'var(--text-base)',
          fontWeight: allDone ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
          color: allDone ? 'var(--color-accent-deep)' : 'var(--color-muted)',
        }}
      >
        {allDone ? (
          <span style={{ display: 'flex', animation: 'twinkle 2.6s ease-in-out infinite' }}>
            <Sparkle size={14} color={vars.pink} glow={0.55} />
          </span>
        ) : null}
        <span>{note}</span>
      </p>
    </>
  );
  return bare ? body : <Card style={{ marginTop: '16px' }}>{body}</Card>;
}
