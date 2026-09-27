'use client';

import { useState } from 'react';
import { Button, IconButton } from '@moonshot/design-system/buttons';
import { ShowcaseCard } from '@moonshot/design-system/docs/ShowcaseCard';
import { ChevronLeft, ChevronRight } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { RankUp } from './RankUp';
import { RANKS } from '../../shared/constants';

const gemFill = (ix: number) => (ix === RANKS.length - 1 ? 'var(--gradient-gem)' : RANKS[ix].gem);

// The rank-up transformation from the planner, played on demand for any rank, on the design system's Brand shelf
// (app/design-system/page.tsx). In the app it plays once, the first time a new rank is reached (RankUp.tsx, triggered from features/planner/Planner.tsx).
export function RankUpDemo() {
  const [ix, setIx] = useState(1);
  const [open, setOpen] = useState(false);
  const step = (d: number) => setIx((i) => Math.min(RANKS.length - 1, Math.max(1, i + d)));

  return (
    <ShowcaseCard
      stage={<span style={{ width: 44, height: 60, clipPath: 'polygon(50% 0, 100% 35%, 50% 100%, 0 35%)', background: gemFill(ix) }} />}
      stageStyle={{ background: 'radial-gradient(circle at 50% 45%, #3b416f 0%, var(--color-ink) 70%)' }}
      title="Rank-up transformation"
      use="Plays once, the first time a new rank is reached, wherever you are in the app. Night falls, ribbons and sparkles spiral in, the rank’s gem forms, then its name. With reduced motion the finished card appears at once."
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <IconButton label="Previous rank" size="sm" onClick={() => step(-1)} disabled={ix <= 1}>
          <ChevronLeft color="var(--color-muted)" size={16} />
        </IconButton>
        <Text variant="label" tone="ink" style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
          {RANKS[ix].name}
        </Text>
        <IconButton label="Next rank" size="sm" onClick={() => step(1)} disabled={ix >= RANKS.length - 1}>
          <ChevronRight color="var(--color-muted)" size={16} />
        </IconButton>
      </div>
      <Button type="primary" size="md" fullWidth onClick={() => setOpen(true)} style={{ marginTop: 10 }}>
        Play
      </Button>
      <RankUp
        open={open}
        name={RANKS[ix].name}
        step={'Rank ' + (ix + 1) + ' of ' + RANKS.length}
        next={RANKS[ix].next}
        gem={gemFill(ix)}
        onClose={() => setOpen(false)}
      />
    </ShowcaseCard>
  );
}
