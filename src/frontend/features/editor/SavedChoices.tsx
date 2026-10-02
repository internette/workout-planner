import { IconTile } from '@moonshot/design-system/icon-tile';
import { Card } from '@moonshot/design-system/card';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { LinkRow } from '@/frontend/components/LinkRow';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { kindOf } from '@/frontend/components/KindTag';

/** Picking a workout already in the Spellbook instead of making a new one. */
export function SavedChoices({ v }: { v: PlannerVals }) {
  return (
    <>
      <SectionLabel label="OR ONE FROM YOUR SPELLBOOK" style={{ margin: '28px 0 4px' }} />
      <Text variant="body" tone="muted" as="p" style={{ margin: '0 0 12px' }}>
        {v.savedChoicesNote}
      </Text>
      {v.showLogDone ? (
        <Card pad="sm" style={{ margin: '0 0 12px' }}>
          <Checkbox switch checked={!!v.logDoneOn} onChange={v.setLogDone}>
            Log it as done
          </Checkbox>
        </Card>
      ) : null}
      {/* The person's own, then the built-in ones by group, as the Spellbook lists them. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {(v.savedChoiceGroups ?? []).map((g, gi) => (
          <div key={gi}>
            {g?.label ? (
              <SectionLabel list label={g?.label} as="h3" />
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(g?.items ?? []).map((w, i) => (
                <LinkRow key={i} leading={<IconTile as="span" size="xs" variant="flat">{w?.svg}</IconTile>} title={w?.name} detail={w?.meta} kind={kindOf(w)} action="add" onClick={w?.pick} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
