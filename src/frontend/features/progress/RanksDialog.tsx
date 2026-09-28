import { Fragment } from 'react';
import { Dialog } from '@moonshot/design-system/dialog';
import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { RankGem } from '@/frontend/components/RankGem';

/** The rank ladder, opened from the rank badge. */
export function RanksDialog({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.ranksOpen}
      onClose={v.closeRanks}
      title="Ranks"
      aside={v.ranksAside}
      size="md"
      description="Earned with experience — 10 XP per exercise completed, 50 XP per workout finished."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
        {(v.rankLadder ?? []).map((r, i) => (
          <Fragment key={i}>
            <div style={css(r?.row)}>
              <RankGem fill={r?.gemFill} faded={!!r?.gemFaded} />
              <span style={css(r?.name)}>{r?.label}</span>
              <span style={css(r?.xp)}>{r?.req}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </Dialog>
  );
}
