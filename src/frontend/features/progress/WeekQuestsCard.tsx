import { Card } from '@moonshot/design-system/card';
import { Check, ChevronRight } from '@moonshot/design-system/icons';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Progress: this week’s quests, each opening its session. */
export function WeekQuestsCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: '14px' }}>
      <SectionLabel as="span" label="This week's quests" aside={v.wkHas ? v.questsDoneLabel : undefined} />
      {v.wkEmpty ? (
        <Text variant="strong" as="p" tone="muted" style={{ margin: '10px 0 0' }}>
          No quests this week yet. Plan a session and its day gets one.
        </Text>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '14px' }}>
        {(v.weekQuests ?? []).map((q, i) => (
          <button key={i} type="button" onClick={q?.open} aria-label={q?.aria} style={css(q?.row)}>
            <span style={css(q?.mark)}>
              {q?.done ? (
                <Check color="var(--color-surface)" strokeWidth={3} size={10} />
              ) : null}
            </span>
            <Text variant="micro" tone="muted" style={{ flex: 'none', width: '44px' }}>
              {q?.day}
            </Text>
            <span style={css(q?.title)}>{q?.name}</span>
            {/* It opens its day on the calendar. */}
            <ChevronRight color="var(--color-muted)" size={15} style={{ flex: 'none', marginLeft: 'auto' }} />
          </button>
        ))}
      </div>
    </Card>
  );
}
