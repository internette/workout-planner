import { vars } from '@moonshot/design-system/colors';
import { Card } from '@moonshot/design-system/card';
import { Sparkle } from '@moonshot/design-system/icons';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Button } from '@moonshot/design-system/buttons';
import { Text } from '@moonshot/design-system/typography';
import { SectionHeader } from './SectionHeader';
import { SetPips } from './SetPips';

export interface SessionProgressProps {
  /** e.g. "2 of 5 done". */
  label: string;
  /** 0–100. */
  pct: number;
  /** Every exercise is ticked off: the note turns to the accent, with a twinkling sparkle. */
  allDone: boolean;
  /** A line under the bar, e.g. "Mark each exercise as you clear it." */
  note: string;
  /** The set up next, on today's session: which exercise, how far through its sets, and (while the workout is going)
   * the button that counts it done. */
  now?: { name: string; label: string; pips: boolean[]; onDone?: () => void; doneAria: string } | null;
}

/** How far through a lifting session someone is, on the session page and in its editor. */
export function SessionProgress({ label, pct, allDone, note, now }: SessionProgressProps) {
  return (
    <Card style={{ marginTop: '16px' }}>
      <SectionHeader title="PROGRESS" value={label} />
      <ProgressBar value={pct} track="tint" style={{ marginTop: '12px' }} />
      {now ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px', marginTop: '14px' }}>
          <span style={{ flex: '1 1 160px', minWidth: 0 }}>
            <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
              {now.name}
            </Text>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <SetPips pips={now.pips} />
              <Text variant="caption" tone="slate" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {now.label}
              </Text>
            </span>
          </span>
          {now.onDone ? (
            <Button type="primary" size="sm" onClick={now.onDone} aria-label={now.doneAria}>
              Done set
            </Button>
          ) : null}
        </div>
      ) : null}
      <p
        style={{
          margin: '12px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: 'var(--text-md)',
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
    </Card>
  );
}
