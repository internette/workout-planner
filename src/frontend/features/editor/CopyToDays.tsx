import { Card } from '@moonshot/design-system/card';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Pressable } from '@moonshot/design-system/buttons';
import { Text } from '@moonshot/design-system/typography';
import { StepButton } from '@/frontend/components/StepButton';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

type Copy = NonNullable<PlannerVals['copy']>;

/** "Copy to other days", in a session's editor: a switch, then a week to pick days from (each with a dot for every
 * workout already on it), and the days picked. The copies are made when the edit is saved. */
export function CopyToDays({ copy }: { copy: Copy }) {
  return (
    <Card pad="sm" style={{ marginTop: 'var(--space-4)' }}>
      <Checkbox switch checked={copy.on} onChange={copy.setOn} description={copy.note}>
        Copy to other days
      </Checkbox>
      {copy.on ? (
        <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <StepButton dir="prev" unit="week" onClick={copy.prev} />
            <Text variant="subheading" as="div" style={{ flex: '1', textAlign: 'center' }} aria-live="polite">
              {copy.range}
            </Text>
            <StepButton dir="next" unit="week" onClick={copy.next} />
          </div>
          <div
            role="group"
            aria-label="Days to copy it to"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 'var(--space-1)', marginTop: 'var(--space-2)' }}
          >
            {copy.days.map((d, i) => (
              <Pressable
                key={i}
                onClick={d.toggle}
                disabled={d.disabled}
                aria-pressed={d.disabled ? undefined : d.on}
                aria-label={d.aria}
                aria-current={d.today ? 'date' : undefined}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  minHeight: '60px',
                  padding: 'var(--space-2) 0',
                  borderRadius: 'var(--radius-sm)',
                  boxSizing: 'border-box',
                  background: d.on ? 'var(--color-pink)' : d.own ? 'var(--color-pink-tint)' : d.disabled ? 'var(--color-mist)' : 'var(--color-surface)',
                  border: d.own
                    ? '1.5px dashed var(--color-pink)'
                    : '1px solid ' + (d.on ? 'var(--color-pink)' : d.disabled ? 'transparent' : 'var(--color-line)'),
                  color: d.on ? 'var(--color-surface)' : d.own ? 'var(--color-pink-deep)' : d.disabled ? 'var(--color-muted)' : 'var(--color-ink)',
                  cursor: d.disabled ? 'default' : undefined,
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {d.letter}
                </span>
                <span aria-hidden="true" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-bold)' }}>
                  {d.num}
                </span>
                <span aria-hidden="true" style={{ display: 'flex', gap: '2px', height: '6px' }}>
                  {d.dots.slice(0, 3).map((k, j) => (
                    <i
                      key={j}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: 'var(--radius-full)',
                        background: d.on ? 'var(--color-surface)' : k === 'calm' ? 'var(--color-teal-deep)' : 'var(--color-pink)',
                      }}
                    />
                  ))}
                </span>
              </Pressable>
            ))}
          </div>
          <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
            Dots are workouts already on that day.
          </Text>
          {copy.picks.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginTop: 'var(--space-3)' }}>
              {copy.picks.map((p, i) => (
                <Text key={i} variant="body" as="p" style={{ margin: 0 }}>
                  <Text variant="body" weight="semibold" tone="ink">
                    {p.day}
                  </Text>
                  <Text variant="body" tone="muted">
                    {' · ' + p.detail}
                  </Text>
                </Text>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
