'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@moonshot/design-system/card';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { BossGlyph } from './BossGlyph';
import styles from './boss.module.css';

/** The boss being fought: its HP, the days left, and on the session page a hit for each tick. */
export function BossCard({ v, live = false }: { v: PlannerVals; live?: boolean }) {
  const b = v.bossCard;
  // A tick takes HP off; the session page shows that hit rising off the bar for a moment.
  const last = useRef<number | null>(null);
  const [hit, setHit] = useState<{ n: number; id: number } | null>(null);
  const hpLeft = b ? b.hpLeft : null;
  useEffect(() => {
    if (hpLeft == null) return;
    const before = last.current;
    last.current = hpLeft;
    if (!live || before == null || hpLeft >= before) return;
    const id = Date.now();
    setHit({ n: before - hpLeft, id });
    const t = window.setTimeout(() => setHit((h) => (h && h.id === id ? null : h)), 1200);
    return () => window.clearTimeout(t);
  }, [hpLeft, live]);
  if (!b) return null;
  return (
    <Card as="section" aria-label={'Boss battle: ' + b.name} style={{ marginTop: 'var(--space-4)', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span className={hit ? styles.shake : undefined} key={hit?.id} style={{ display: 'flex', flex: 'none' }}>
          <BossGlyph k={b.k} fill={b.gem} size={44} />
        </span>
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <Text variant="micro" as="div" tone="accent">
            {b.eyebrow}
          </Text>
          <Text variant="subheading" as="h2" tone="ink" style={{ margin: 0 }}>
            {b.name}
          </Text>
        </div>
        <Text variant="small" tone="slate" style={{ flex: 'none', background: 'var(--color-mist)', borderRadius: 'var(--radius-full)', padding: 'var(--space-1) var(--space-3)' }}>
          {b.daysLabel}
        </Text>
      </div>
      <ProgressBar value={b.pct} track="tint" fill="var(--color-pink)" label="Boss HP" valueText={b.hpLabel} style={{ marginTop: 'var(--space-3)' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 'var(--space-1) var(--space-3)', marginTop: 'var(--space-2)' }}>
        <Text variant="strong" tone="ink" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {b.hpLabel}
        </Text>
        <Text variant="body" tone="muted">
          {b.note}
        </Text>
      </div>
      <Text variant="body" tone="slate" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
        {b.blocked}
      </Text>
      <span className="sr-only" aria-live="polite">
        {hit ? hit.n + ' damage. ' + b.hpLabel : ''}
      </span>
      {hit ? (
        <span key={hit.id} aria-hidden="true" className={styles.hit}>
          −{hit.n}
        </span>
      ) : null}
    </Card>
  );
}
