import { Pressable } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Check, ChevronRight } from '@moonshot/design-system/icons';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Progress: this week’s quests, each opening its session. */
export function WeekQuestsCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: 'var(--space-4)' }}>
      <SectionLabel as="span" label="This week's quests" aside={v.wkHas ? v.questsDoneLabel : undefined} />
      {v.wkEmpty ? (
        <Text variant="strong" as="p" tone="muted" style={{ margin: 'var(--space-3) 0 0' }}>
          No quests this week yet. Plan a session and its day gets one.
        </Text>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginTop: 'var(--space-4)' }}>
        {(v.weekQuests ?? []).map((q, i) => (
          <Pressable
            key={i}
            onClick={q?.open}
            aria-label={q?.aria}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%', minHeight: '44px', padding: 'var(--space-2) 0', borderBottom: q?.last ? undefined : '1px solid var(--color-line)' }}
          >
            {/* Cleared: a filled mark with a tick. */}
            <span style={{ width: '18px', height: '18px', flex: 'none', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: q?.done ? 'var(--color-pink)' : 'transparent' }}>
              {q?.done ? (
                <Check color="var(--color-surface)" strokeWidth={3} size={10} />
              ) : null}
            </span>
            <Text variant="micro" tone="muted" style={{ flex: 'none', width: '44px' }}>
              {q?.day}
            </Text>
            <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-medium)', color: q?.done ? 'var(--color-pink-deep)' : 'var(--color-ink)' }}>{q?.name}</span>
            {/* It opens its day on the calendar. */}
            <ChevronRight color="var(--color-muted)" size={15} style={{ flex: 'none', marginLeft: 'auto' }} />
          </Pressable>
        ))}
      </div>
    </Card>
  );
}
