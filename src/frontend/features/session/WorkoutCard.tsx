import type { CSSProperties } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Repeat } from '@moonshot/design-system/icons';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { SessionProgress } from '@/frontend/components/SessionProgress';
import { SetPips } from '@/frontend/components/SetPips';

const divider: CSSProperties = { border: 0, borderTop: '1px solid var(--color-divider)', margin: '16px 0' };

/**
 * The session being done, in one card: its clock (start, pause, finish), then for a lift how far through it is, with
 * the set up next and "Done set" while the workout is going, or, between sets, the rest counting down.
 */
export function WorkoutCard({ v }: { v: PlannerVals }) {
  const progress = v.dayIsLift && !v.isFuture;
  if (!v.showTimer && !progress) return null;
  return (
    <Card style={{ marginTop: '16px' }}>
      {v.showTimer ? <TimerSection v={v} /> : null}
      {v.showTimer && progress ? <hr style={divider} /> : null}
      {progress ? (
        <SessionProgress bare label={v.progLabel} pct={v.progPct ?? 0} allDone={!!v.allDone} note={v.progNote ?? ''}>
          {v.restShown ? <RestSection v={v} /> : v.setNow ? <NextSet now={v.setNow} /> : null}
        </SessionProgress>
      ) : null}
    </Card>
  );
}

/** The session's clock, with start, pause and finish, and starting over while it's stopped (never mid-set). */
function TimerSection({ v }: { v: PlannerVals }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', minHeight: '32px' }}>
        <Text variant="micro" tone="slate">
          WORKOUT TIMER
        </Text>
        {/* Clears the ticks and starts the clock from zero (asking first when there's something to lose). */}
        {v.canRestart ? (
          <Button type="neutral" ghost size="sm" onClick={v.restartWorkout} style={{ marginRight: '-10px' }}>
            <Repeat color="var(--color-muted)" size={15} />
            Start over
          </Button>
        ) : null}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <Text variant="title" as="div" style={{ margin: '0', fontVariantNumeric: 'tabular-nums' }}>
            {v.timerLabel}
          </Text>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type={v.canFinish || v.timerButtonLabel === 'Pause' ? 'secondary' : 'primary'}
            size="md"
            onClick={v.timerButtonAction}
          >
            {v.timerButtonLabel}
          </Button>
          {v.canFinish ? (
            <Button type="primary" size="md" onClick={v.openFinish}>
              Finish
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
}

/** The set up next: which exercise, how far through its sets, and "Done set" while the workout is going. */
function NextSet({ now }: { now: NonNullable<PlannerVals['setNow']> }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px', marginTop: '14px' }}>
      <span style={{ flex: '1 1 160px', minWidth: 0 }}>
        <Text variant="subheading" tone="ink" style={{ display: 'block' }}>
          {now.name}
        </Text>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <SetPips pips={now.pips} />
          <Text variant="body" tone="slate" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {now.label}
          </Text>
        </span>
      </span>
      {now.onDone ? (
        <Button type="primary" size="sm" onClick={now.onDone} aria-label={now.doneAria}>
          Done set
        </Button>
      ) : now.paused ? (
        <Text variant="body" tone="muted">
          Paused
        </Text>
      ) : null}
    </div>
  );
}

/** The rest between sets, counting down, with what's up next. */
function RestSection({ v }: { v: PlannerVals }) {
  return (
    <section aria-label="Rest" style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <Text variant="micro" tone="slate" as="div">
            REST
          </Text>
          {/* Read out once a second would be too much; the rest's end is announced instead. */}
          <Text variant="title" as="div" aria-hidden="true" style={{ margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
            {v.restLabel}
          </Text>
        </div>
        {v.restNextName ? (
          <div style={{ flex: '1 1 160px', minWidth: 0, textAlign: 'right' }}>
            <Text variant="micro" tone="slate" as="div">
              UP NEXT
            </Text>
            <Text variant="subheading" as="div" style={{ marginTop: '4px' }}>
              {v.restNextName}
            </Text>
            <Text variant="body" tone="muted" as="div" style={{ marginTop: '2px' }}>
              {v.restNextLine}
            </Text>
          </div>
        ) : null}
      </div>
      <ProgressBar value={v.restPct} style={{ marginTop: '12px' }} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <Button type="secondary" size="sm" onClick={v.restMore}>
          +30 sec
        </Button>
        <Button type="primary" size="sm" onClick={v.restSkip}>
          Skip rest
        </Button>
      </div>
    </section>
  );
}
