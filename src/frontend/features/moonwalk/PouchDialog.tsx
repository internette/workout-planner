import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { FindGlyph } from './FindGlyph';

/** A finished Run/Walk or Cycling session's pouch, opened: a Find for each star, and which are new to the Starbook. */
export function PouchDialog({ v }: { v: PlannerVals | null }) {
  if (!v) return null;
  return (
    <Dialog
      open={v.pouchOpen}
      onClose={v.closePouch}
      title={v.pouchTitle}
      description={v.pouchNote}
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={v.closePouch}>
            Done
          </Button>
          {v.pouchFinds.length ? (
            <Button type="primary" size="md" onClick={v.pouchToStarbook}>
              See in Starbook
            </Button>
          ) : null}
        </>
      }
    >
      {v.pouchFinds.length ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-4) 0 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 'var(--space-3)' }}>
          {v.pouchFinds.map((f) => (
            <li key={f.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)', textAlign: 'center' }}>
              <FindGlyph rarity={f.rarity} found tint={f.tint} fill={f.fill} />
              <Text variant="small" tone="ink" weight="semibold">
                {f.name}
              </Text>
              <Text variant="small" style={{ color: f.deep }}>
                {f.rarityLabel} · {f.isNew ? 'New' : 'Copy'}
              </Text>
            </li>
          ))}
        </ul>
      ) : null}
    </Dialog>
  );
}
