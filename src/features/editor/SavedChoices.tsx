import { Card } from '@moonshot/design-system/card';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Plus } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { IconSquare } from '@/components/IconSquare';
import { WarmupTag } from '@/components/WarmupTag';
import type { PlannerVals } from '@/features/planner/store/types';

/** Picking a workout already in the Spellbook instead of making a new one. */
export function SavedChoices({ v }: { v: PlannerVals }) {
  return (
    <>
      <Text variant="eyebrow" tone="slate" as="h2" style={{ margin: '28px 0 4px' }}>
        OR ONE FROM YOUR SPELLBOOK
      </Text>
      <Text variant="caption" tone="muted" as="p" style={{ margin: '0 0 12px' }}>
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
              <Text variant="eyebrow" tone="muted" as="h3" style={{ margin: '0 2px 8px' }}>
                {g?.label}
              </Text>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(g?.items ?? []).map((w, i) => (
                <Card
                  key={i}
                  as="button"
                  pad="sm"
                  interactive
                  onClick={w?.pick}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', width: '100%' }}
                >
                  <IconSquare>{w?.svg}</IconSquare>
                  <span style={{ flex: '1', minWidth: '0' }}>
                    {w?.warmup ? <WarmupTag /> : null}
                    <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                      {w?.name}
                    </Text>
                    <Text variant="caption" tone="muted" style={{ display: 'block', marginTop: '2px' }}>
                      {w?.meta}
                    </Text>
                  </span>
                  <Plus color="var(--color-accent-deep)" size={17} />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
