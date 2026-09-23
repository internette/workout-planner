'use client';

import { useState } from 'react';
import { Button, IconButton } from '@/components/ui/buttons';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from '@/components/ui/icons';
import { Text } from '@/components/ui/typography';
import { RankUp } from '@/components/planner/RankUp';
import { RANKS } from '@/components/planner/constants';
import styles from './design-system.module.css';

const gemFill = (ix: number) => (ix === RANKS.length - 1 ? 'var(--gradient-gem)' : RANKS[ix].gem);

// The rank-up transformation from the planner, played on demand for any rank. In the app it plays once, the first
// time a new rank is reached (components/planner/RankUp.tsx, triggered from components/Planner.tsx).
export function RankUpDemo() {
  const [ix, setIx] = useState(1);
  const [open, setOpen] = useState(false);
  const step = (d: number) => setIx((i) => Math.min(RANKS.length - 1, Math.max(1, i + d)));

  return (
    <Card pad="sm">
      <div className={styles.brandStage} style={{ background: 'radial-gradient(circle at 50% 45%, #3b416f 0%, var(--color-ink) 70%)' }}>
        <span className={styles.demoGem} style={{ background: gemFill(ix) }} />
      </div>
      <Text variant="itemTitle" tone="ink" as="h3" style={{ margin: 0 }}>
        Rank-up transformation
      </Text>
      <Text variant="caption" tone="muted" as="p" style={{ margin: '4px 0 10px' }}>
        Plays once, the first time a new rank is reached, wherever you are in the app. Night falls, ribbons and sparkles
        spiral in, the rank&apos;s gem forms, then its name. With reduced motion the finished card appears at once.
      </Text>
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
    </Card>
  );
}
