'use client';

import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { AchievementBadge } from './AchievementBadge';

type Row = ReturnType<PlannerVals['achSince']>[number];

/** What was just earned: the newest achievement up top, and the rest listed under it. */
export function AchievementUnlock({ rows, onClose, onSeeAll }: { rows: Row[] | null; onClose: () => void; onSeeAll: () => void }) {
  const open = !!rows && rows.length > 0;
  const list = rows ? [...rows].reverse() : [];
  const [top, ...rest] = list;
  const shown = rest.slice(0, 4);
  const more = rest.length - shown.length;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={list.length === 1 ? 'Achievement unlocked' : list.length.toLocaleString('en-US') + ' achievements unlocked'}
      actions={
        <>
          <Button type="secondary" onClick={onSeeAll}>
            See all
          </Button>
          <Button onClick={onClose}>Nice</Button>
        </>
      }
    >
      {top ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-2)' }}>
          <AchievementBadge tint={top.tint} deep={top.deep} fill={top.fill} size={84} />
          <Text variant="heading" as="p" style={{ margin: 0 }}>
            {top.name}
          </Text>
          <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
            {top.how}
          </Text>
        </div>
      ) : null}
      {shown.length ? (
        <ul style={{ listStyle: 'none', margin: 'var(--space-4) 0 0', padding: 'var(--space-3) 0 0', borderTop: '1px solid var(--color-line)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {shown.map((r) => (
            <li key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <AchievementBadge tint={r.tint} deep={r.deep} fill={r.fill} size={32} />
              <span style={{ minWidth: 0 }}>
                <Text variant="strong" tone="ink" as="span" style={{ display: 'block' }}>
                  {r.name}
                </Text>
                <Text variant="small" tone="muted" as="span" style={{ display: 'block' }}>
                  {r.how}
                </Text>
              </span>
            </li>
          ))}
          {more > 0 ? (
            <li>
              <Text variant="small" tone="muted">
                And {more.toLocaleString('en-US')} more.
              </Text>
            </li>
          ) : null}
        </ul>
      ) : null}
    </Dialog>
  );
}
