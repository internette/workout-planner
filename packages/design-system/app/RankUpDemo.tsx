'use client';

import { useState } from 'react';
import { Button, IconButton } from '../src/buttons';
import { ChevronLeft, ChevronRight } from '../src/icons';
import { RankUp } from '../src/rank-up';
import { Text } from '../src/typography';
import { ShowcaseCard } from './ShowcaseCard';

// A few of the planner's ranks, to play the transformation with. The full ladder is the app's (its shared/constants.ts);
// the last one shows the top rank's gradient gem.
const SAMPLES = [
  { name: 'Novice guardian', step: 'Rank 2 of 20', next: 'Moonlit', gem: 'var(--color-pink)' },
  { name: 'Twilight guardian', step: 'Rank 6 of 20', next: 'Prism', gem: 'var(--color-periwinkle)' },
  { name: 'Nightbloom warden', step: 'Rank 14 of 20', next: 'Cometfall', gem: 'var(--color-teal)' },
  { name: 'Eternal sovereign', step: 'Rank 20 of 20', next: 'the next season', gem: 'var(--gradient-gem)' },
];

// The rank-up transformation (src/rank-up), played on demand on the Brand shelf. In the app it plays once, the first
// time a new rank is reached.
export function RankUpDemo() {
  const [ix, setIx] = useState(0);
  const [open, setOpen] = useState(false);
  const rank = SAMPLES[ix];
  const step = (d: number) => setIx((i) => Math.min(SAMPLES.length - 1, Math.max(0, i + d)));

  return (
    <ShowcaseCard
      stage={<span style={{ width: 44, height: 60, clipPath: 'polygon(50% 0, 100% 35%, 50% 100%, 0 35%)', background: rank.gem }} />}
      stageStyle={{ background: 'radial-gradient(circle at 50% 45%, #3b416f 0%, var(--color-ink) 70%)' }}
      title="Rank-up transformation"
      use="Plays once, the first time a new rank is reached, wherever you are in the app. Night falls, ribbons and sparkles spiral in, the rank’s gem forms, then its name. With reduced motion the finished card appears at once."
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <IconButton label="Previous rank" size="sm" onClick={() => step(-1)} disabled={ix <= 0}>
          <ChevronLeft color="var(--color-muted)" size={16} />
        </IconButton>
        <Text variant="label" tone="ink" style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
          {rank.name}
        </Text>
        <IconButton label="Next rank" size="sm" onClick={() => step(1)} disabled={ix >= SAMPLES.length - 1}>
          <ChevronRight color="var(--color-muted)" size={16} />
        </IconButton>
      </div>
      <Button type="primary" size="md" fullWidth onClick={() => setOpen(true)} style={{ marginTop: 10 }}>
        Play
      </Button>
      <RankUp open={open} name={rank.name} step={rank.step} next={rank.next} gem={rank.gem} onClose={() => setOpen(false)} />
    </ShowcaseCard>
  );
}
