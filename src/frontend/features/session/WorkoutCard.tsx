import type { CSSProperties } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Repeat } from '@moonshot/design-system/icons';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { SessionProgress } from '@/frontend/components/SessionProgress';
import { ExerciseName } from '@/frontend/components/ExerciseName';
import { SetPips } from '@/frontend/components/SetPips';
import { endCue } from '@/frontend/features/live/cue';
import styles from './hold.module.css';

const divider: CSSProperties = { border: 0, borderTop: '1px solid var(--color-line)', margin: 'var(--space-4) 0' };

/**
 * The session being done, in one card: its clock (start, pause, finish), then for a lift how far through it is, with
 * the set up next and "Done set" while the workout is going ("Start set" for a timed one, then its time counting down),
 * or, between sets, the rest counting down.
 */
export function WorkoutCard({ v }: { v: PlannerVals }) {
  const progress = v.dayIsLift && !v.isFuture;
  if (!v.showTimer && !progress) return null;
  // For a few seconds after a rest or timed set runs out, the card glows and says so (screen readers hear it from the
  // page's announcement instead).
  const cue = progress && !v.holdShown && !v.restShown ? endCue() : null;
  return (
    <Card style={{ marginTop: 'var(--space-4)', ...(cue ? { boxShadow: '0 0 0 3px var(--color-pink), 0 0 22px color-mix(in srgb, var(--color-pink) 35%, transparent)' } : null) }}>
      {v.showTimer ? <TimerSection v={v} /> : null}
      {v.showTimer && progress ? <hr style={divider} /> : null}
      {progress ? (
        <SessionProgress bare label={v.progLabel} pct={v.progPct ?? 0} allDone={!!v.allDone} note={v.progNote ?? ''}>
          {cue ? (
            <div
              aria-hidden="true"
              style={{ marginTop: 'var(--space-4)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-pink)', color: 'var(--color-surface)', fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-semibold)' }}
            >
              {cue.label}
            </div>
          ) : null}
          {v.holdShown ? <HoldSection v={v} /> : v.restShown ? <RestSection v={v} /> : v.setNow ? <NextSet now={v.setNow} /> : null}
          {v.finishNow ? (
            <Button type="primary" size="lg" fullWidth onClick={v.finishNow} style={{ marginTop: 'var(--space-4)' }}>
              Finish workout
            </Button>
          ) : v.writeInCard ? (
            <Button type="primary" size="lg" fullWidth onClick={v.goDiary} style={{ marginTop: 'var(--space-4)' }}>
              {v.ctaLabel}
            </Button>
          ) : null}
        </SessionProgress>
      ) : null}
    </Card>
  );
}

/** The session's clock, with start, pause and finish, and starting over while it's stopped (never mid-set). */
function TimerSection({ v }: { v: PlannerVals }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', minHeight: '32px' }}>
        <Text variant="micro" tone="slate">
          Workout timer
        </Text>
        {/* Clears the ticks and starts the clock from zero (asking first when there's something to lose). */}
        {v.canRestart ? (
          <Button type="neutral" ghost size="sm" onClick={v.restartWorkout} style={{ marginRight: 'calc(-1 * var(--space-2))' }}>
            <Repeat color="var(--color-muted)" size={15} />
            Start over
          </Button>
        ) : null}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <div>
          <Text variant="title" as="div" style={{ margin: '0', fontVariantNumeric: 'tabular-nums' }}>
            {v.timerLabel}
          </Text>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button
            type={v.canFinish || v.timerButtonLabel === 'Pause' ? 'secondary' : 'primary'}
            size="md"
            onClick={v.timerButtonAction}
          >
            {v.timerButtonLabel}
          </Button>
          {/* With everything done, the big Finish workout below takes over. */}
          {v.canFinish && !v.finishNow ? (
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
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2) var(--space-3)', marginTop: 'var(--space-4)' }}>
      <span style={{ flex: '1 1 160px', minWidth: 0 }}>
        <ExerciseName name={now.name} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
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
      ) : now.onStart ? (
        <Button type="primary" size="sm" onClick={now.onStart} aria-label={now.startAria}>
          Start set
        </Button>
      ) : now.paused ? (
        <Text variant="body" tone="muted">
          Paused
        </Text>
      ) : null}
    </div>
  );
}

/** A timed set: after "Start set", a few seconds to get ready (big, counting 5 to 1), then its time counting down in
 * a ring, with "+30 sec" and "Done set" to end it early. Its last three seconds pulse. At 0:00 it's done, as if "Done
 * set" were pressed. */
function HoldSection({ v }: { v: PlannerVals }) {
  if (v.holdLead > 0)
    return (
      <section aria-label="Set" style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
        <Text variant="micro" tone="slate" as="div">
          {v.holdSet}
        </Text>
        <Text variant="micro" tone="slate" as="div" style={{ marginTop: 'var(--space-3)' }}>
          Get ready
        </Text>
        {/* Keyed by the second, so each number pops in. Read out once, when the set is started. */}
        <div key={v.holdLead} className={styles.lead} aria-hidden="true" style={{ margin: 'var(--space-2) 0' }}>
          {v.holdLead}
        </div>
        <Text variant="subheading" as="div">
          {v.holdName}
        </Text>
        <Text variant="body" tone="muted" as="div" style={{ marginTop: 'var(--space-1)' }}>
          {v.holdLine}
        </Text>
      </section>
    );
  const r = 86;
  const c = 2 * Math.PI * r;
  const last = v.holdSecLeft > 0 && v.holdSecLeft <= 3;
  return (
    <section aria-label="Set" style={{ marginTop: 'var(--space-4)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-1) var(--space-3)' }}>
        <Text variant="micro" tone="slate" as="div">
          {v.holdSet}
        </Text>
        <Text variant="body" tone="muted" as="div">
          {v.holdName} · {v.holdLine}
        </Text>
      </div>
      {/* Read out once a second would be too much; the set's start and end are announced instead. */}
      <div className={last ? styles.ring + ' ' + styles.last : styles.ring} aria-hidden="true" style={{ marginTop: 'var(--space-3)' }}>
        <svg viewBox="0 0 196 196">
          <circle cx="98" cy="98" r={r} fill="none" stroke="var(--color-mist)" strokeWidth="12" />
          <circle
            className={styles.arc}
            cx="98"
            cy="98"
            r={r}
            fill="none"
            stroke="var(--color-pink)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - v.holdPct / 100)}
          />
        </svg>
        <div className={styles.time}>
          <span className={styles.digits}>{v.holdLabel}</span>
          <Text variant="body" tone="muted" as="span" style={{ marginTop: 'var(--space-1)' }}>
            of {v.holdTotalLabel}
          </Text>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
        <Button type="secondary" size="sm" onClick={v.holdMore}>
          +30 sec
        </Button>
        <Button type="primary" size="sm" onClick={v.holdDone}>
          Done set
        </Button>
      </div>
    </section>
  );
}

/** The rest between sets, counting down, with what's up next. */
function RestSection({ v }: { v: PlannerVals }) {
  return (
    <section aria-label="Rest" style={{ marginTop: 'var(--space-4)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <div>
          <Text variant="micro" tone="slate" as="div">
            Rest
          </Text>
          {/* Read out once a second would be too much; the rest's end is announced instead. */}
          <Text variant="title" as="div" aria-hidden="true" style={{ margin: 'var(--space-1) 0 0', fontVariantNumeric: 'tabular-nums' }}>
            {v.restLabel}
          </Text>
        </div>
        {v.restNextName ? (
          <div style={{ flex: '1 1 160px', minWidth: 0, textAlign: 'right' }}>
            <Text variant="micro" tone="slate" as="div">
              Up next
            </Text>
            <Text variant="subheading" as="div" style={{ marginTop: 'var(--space-1)' }}>
              {v.restNextName}
            </Text>
            <Text variant="body" tone="muted" as="div" style={{ marginTop: 'var(--space-1)' }}>
              {v.restNextLine}
            </Text>
          </div>
        ) : null}
      </div>
      <ProgressBar value={v.restPct} style={{ marginTop: 'var(--space-3)' }} />
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
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
