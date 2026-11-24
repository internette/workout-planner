import type { CSSProperties } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import { Callout } from '@moonshot/design-system/callout';
import { Card } from '@moonshot/design-system/card';
import { Minus, Plus, Repeat } from '@moonshot/design-system/icons';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { SessionProgress } from '@/frontend/components/SessionProgress';
import { ExerciseName } from '@/frontend/components/ExerciseName';
import { SetPips } from '@/frontend/components/SetPips';
import { endCue } from '@/frontend/features/live/cue';
import styles from './hold.module.css';
import logStyles from './setlog.module.css';

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
          {v.holdShown ? (
            <HoldSection v={v} />
          ) : v.restShown ? (
            <RestSection v={v} />
          ) : v.setNow && !v.fixSet ? (
            <NextSet now={v.setNow} />
          ) : null}
          {v.fixSet ? <FixSet f={v.fixSet} /> : null}
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

/** The set up next: which exercise, how far through its sets, and "Done set" while the workout is going. While it's
 * going, what the set will be logged as sits after "Set 2 of 3" ("40 lb × 8"); tapped, its weight and reps open in
 * place, a row each, to change before "Done set". */
function NextSet({ now }: { now: NonNullable<PlannerVals['setNow']> }) {
  const log = now.log;
  const head = (
    <span style={{ flex: '1 1 160px', minWidth: 0 }}>
      <ExerciseName name={now.name} />
      <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
        <SetPips pips={now.pips} />
        <Text variant="body" tone="slate" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {now.label}
          {log && !log.editing ? ' ·' : ''}
        </Text>
        {log && !log.editing ? (
          <button type="button" className={logStyles.chip} onClick={log.open} aria-label={log.chipAria}>
            {log.chip}
          </button>
        ) : null}
      </span>
    </span>
  );
  if (log && log.editing && now.onDone)
    return (
      <div style={{ marginTop: 'var(--space-4)' }}>
        {head}
        <div className={logStyles.rows}>
          {log.weight ? <LogRow label="Weight" unit="lb" inputMode="decimal" f={log.weight} /> : null}
          {log.reps ? <LogRow label="Reps" inputMode="numeric" f={log.reps} /> : null}
        </div>
        {log.check ? (
          <Callout tone="warning" style={{ marginTop: 'var(--space-4)' }}>
            {log.check}
          </Callout>
        ) : null}
        {log.planNote ? (
          <Text variant="body" as="p" weight="medium" style={{ margin: 'var(--space-4) 0 0', color: 'var(--color-pink-deep)' }}>
            {log.planNote}
          </Text>
        ) : null}
        <Button type="primary" size="lg" fullWidth onClick={now.onDone} aria-label={now.doneAria} style={{ marginTop: 'var(--space-4)' }}>
          Done set
        </Button>
      </div>
    );
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2) var(--space-3)', marginTop: 'var(--space-4)' }}>
      {head}
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

type LogField = NonNullable<NonNullable<NonNullable<PlannerVals['setNow']>['log']>['weight']>;

/** The next set's weight or reps: its name, then − , the number to tap and type in, and +. */
function LogRow({ label, unit, inputMode, f }: { label: string; unit?: string; inputMode: 'decimal' | 'numeric'; f: LogField }) {
  return (
    <div className={logStyles.row}>
      <Text variant="body" tone="slate">
        {label}
      </Text>
      <div className={logStyles.stepper}>
        <button type="button" className={logStyles.step} onClick={f.less} aria-label={f.lessAria}>
          <Minus color="currentColor" size={18} strokeWidth={2.6} />
        </button>
        <label className={logStyles.field}>
          <input
            className={logStyles.input}
            inputMode={inputMode}
            enterKeyHint="done"
            aria-label={label + (unit ? ' in pounds' : '')}
            value={f.value}
            onChange={f.onChange}
            onFocus={(ev) => ev.currentTarget.select()}
          />
          {unit ? (
            <span className={logStyles.unit} aria-hidden="true">
              {unit}
            </span>
          ) : null}
        </label>
        <button type="button" className={logStyles.step} onClick={f.more} aria-label={f.moreAria}>
          <Plus color="currentColor" size={18} strokeWidth={2.6} />
        </button>
      </div>
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
      {/* The set just done, to fix a slip (a typo, a rep miscounted) before the next one. */}
      {v.lastSet ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-1) var(--space-3)',
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-2)',
            borderTop: '1px solid var(--color-line)',
          }}
        >
          <Text variant="body" tone="slate" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {v.lastSet.label}{' '}
            <Text variant="body" weight="semibold" tone="ink">
              {v.lastSet.value}
            </Text>
          </Text>
          <Button type="secondary" ghost size="sm" onClick={v.lastSet.change} aria-label={v.lastSet.changeAria} style={{ marginRight: 'calc(-1 * var(--space-3))' }}>
            Change
          </Button>
        </div>
      ) : null}
    </section>
  );
}

/** A set already done, opened to change: its weight and reps, a row each, then Save set or Cancel. */
function FixSet({ f }: { f: NonNullable<PlannerVals['fixSet']> }) {
  return (
    <section aria-label="Change set" style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-line)' }}>
      <Text variant="subheading" as="h3" style={{ margin: 0 }}>
        {f.title}
      </Text>
      <div className={logStyles.rows}>
        {f.weight ? <LogRow label="Weight" unit="lb" inputMode="decimal" f={f.weight} /> : null}
        {f.reps ? <LogRow label="Reps" inputMode="numeric" f={f.reps} /> : null}
      </div>
      {f.check ? (
        <Callout tone="warning" style={{ marginTop: 'var(--space-4)' }}>
          {f.check}
        </Callout>
      ) : null}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
        <Button type="neutral" ghost size="md" onClick={f.cancel}>
          Cancel
        </Button>
        <Button type="primary" size="md" onClick={f.save}>
          Save set
        </Button>
      </div>
    </section>
  );
}
