import { Fragment } from 'react';
import { Card } from '@moonshot/design-system/card';
import { Check } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/features/planner/viewHelpers';
import type { PlannerVals } from '@/features/planner/store/types';

/** Progress: this week’s quests, each opening its session. */
export function WeekQuestsCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
        <Text variant="eyebrow" tone="slate">
          THIS WEEK&apos;S QUESTS
        </Text>
        {v.wkHas ? (
          <Text variant="small" tone="muted" weight="medium" style={{ marginLeft: 'auto' }}>
            {v.questsDoneLabel}
          </Text>
        ) : null}
      </div>
      {v.wkEmpty ? (
        <Text variant="caption" as="p" tone="muted" weight="medium" style={{ margin: '10px 0 0' }}>
          No quests this week yet. Plan a session and its day gets one.
        </Text>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '14px' }}>
        {(v.weekQuests ?? []).map((q, i) => (
          <Fragment key={i}>
            <button type="button" onClick={q?.open} aria-label={q?.aria} style={css(q?.row)}>
              <span style={css(q?.mark)}>
                {q?.done ? (
                  <>
                    <Check color="var(--color-on-accent)" strokeWidth={3} size={10} />
                  </>
                ) : null}
              </span>
              <Text variant="eyebrow" tone="muted" style={{ flex: 'none', width: '44px' }}>
                {q?.day}
              </Text>
              <span style={css(q?.title)}>
                {q?.name}
                {q?.doneLine ? (
                  <Text variant="caption" tone="muted" as="span" style={{ display: 'block', marginTop: '2px', fontWeight: 'var(--font-weight-regular)' }}>
                    {q?.doneLine}
                  </Text>
                ) : null}
              </span>
            </button>
          </Fragment>
        ))}
      </div>
    </Card>
  );
}
