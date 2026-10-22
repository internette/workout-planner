import { useEffect, useRef } from 'react';
import { Dialog } from '@moonshot/design-system/dialog';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { RankGem } from '@/frontend/components/RankGem';

/** The rank ladder, opened from the rank badge. */
export function RanksDialog({ v }: { v: PlannerVals }) {
  // Two hundred ranks are far too many to find yours by scrolling, so the ladder opens on the current one.
  const curRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (v.ranksOpen) curRef.current?.scrollIntoView({ block: 'center' });
  }, [v.ranksOpen]);
  return (
    <Dialog
      open={!!v.ranksOpen}
      onClose={v.closeRanks}
      title="Ranks"
      aside={v.ranksAside}
      size="md"
      description="Earned with experience — 10 XP per exercise completed, 50 XP per workout finished."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginTop: 'var(--space-5)' }}>
        {(v.rankLadder ?? []).map((r, i) => (
          <div
            key={i}
            ref={r?.cur ? curRef : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              // The current rank in its tier's colors, the ones reached on canvas, the rest to come quiet.
              ...(r?.cur ? r.pill : r?.reached ? { background: 'var(--color-canvas)', color: 'var(--color-slate)' } : { background: 'none', color: 'var(--color-muted)' }),
            }}
          >
            <RankGem fill={r?.gemFill} faded={!!r?.gemFaded} />
            <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', fontWeight: r?.cur ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)' }}>{r?.label}</span>
            {/* Full strength: faded to 80% it fell under 4.5:1 on both the white and the pink rows. */}
            <span style={{ flex: 'none', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{r?.req}</span>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
