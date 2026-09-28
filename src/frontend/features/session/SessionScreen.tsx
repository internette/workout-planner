// A session on the calendar: its exercises or ride, the timer, and finishing it.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Fragment } from 'react';
import { t } from '@/frontend/features/planner/viewHelpers';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { Chip } from '@moonshot/design-system/chip';
import { Button, IconButton } from '@moonshot/design-system/buttons';
import { Clock, Close, Pencil, Repeat } from '@moonshot/design-system/icons';
import { BackBar } from '@/frontend/components/BackBar';
import { FormActions } from '@/frontend/components/FormActions';
import { NeedsLine } from '@/frontend/components/NeedsLine';
import { PageTitle } from '@/frontend/components/PageTitle';
import { SessionProgress } from '@/frontend/components/SessionProgress';
import { WarmupTag } from '@/frontend/components/WarmupTag';
import { FinishDialog } from '@/frontend/features/session/FinishDialog';
import { LeaveWorkoutDialog } from '@/frontend/features/session/LeaveWorkoutDialog';
import { RideSessionCard } from '@/frontend/features/session/RideSessionCard';
import { SessionExerciseRow } from '@/frontend/features/session/SessionExerciseRow';
import { SessionTimer } from '@/frontend/features/session/SessionTimer';
import { RestCard } from '@/frontend/features/session/RestCard';
import { ChipRow } from '@/frontend/components/ChipRow';

export function SessionScreen({ v }: { v: PlannerVals }) {
  return (
    <>
      <div>
        <LeaveWorkoutDialog v={v} />
        <FinishDialog v={v} />
        <BackBar label={v.backLabel} onBack={v.backToDay}>
          <Button type="secondary" size="sm" onClick={v.goEdit} style={{ whiteSpace: 'nowrap' }}>
            <Pencil color="var(--color-accent-deep)" size={16} />
            Edit
          </Button>
        </BackBar>
        <PageTitle icon={v.dayIcoSvg} eyebrow={<>{v.eDate}{v.eWarmup ? <WarmupTag inline /> : null}</>} title={v.eName} />
        <ChipRow style={{ marginTop: '20px' }}>
          <Chip
            icon={<Clock color="var(--color-muted)" size={15} />}
            onClick={v.editTook}
            title={v.editTook ? 'Change what you recorded' : undefined}
          >
            {t(v.eTime)}
          </Chip>
          {v.inSeries ? (
            <>
              <Chip
                tone="accent"
                icon={<Repeat color="var(--color-on-accent)" size={15} />}
                trailing={
                  <IconButton
                    label="End this series"
                    size="xs"
                    tone="inverse"
                    onClick={v.endSeries}
                    title="End this series"
                  >
                    <Close color="var(--color-on-accent-soft)" strokeWidth={2.2} size={13} />
                  </IconButton>
                }
              >
                {'Weekly series'}
              </Chip>
            </>
          ) : null}
          {(v.areaPills ?? []).map((a, i) => (
            <Fragment key={i}>
              <Chip>{a}</Chip>
            </Fragment>
          ))}
        </ChipRow>
        <NeedsLine text={v.needs} />
        {v.isFuture ? (
          <Card style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ flex: '1 1 180px', minWidth: 0 }}>
              <Text variant="eyebrow" tone="slate" as="div">
                COMING UP
              </Text>
              <Text variant="body" tone="ink" as="p" style={{ margin: '4px 0 0' }}>
                {v.futureNote} Doing it now? Move it to today.
              </Text>
            </div>
            <Button type="primary" size="md" onClick={v.doItToday}>
              Do it today
            </Button>
          </Card>
        ) : null}
        {v.showTimer ? <SessionTimer v={v} /> : null}
        {v.restShown ? <RestCard v={v} /> : null}
        {v.dayIsRide ? <RideSessionCard v={v} /> : null}
        {v.dayIsLift ? (
          <>
            {/* Nothing to tick off before its day, so no progress to show. */}
            {!v.isFuture ? (
            <SessionProgress label={v.progLabel} pct={v.progPct ?? 0} allDone={!!v.allDone} note={v.progNote ?? ''} />
            ) : null}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}
            >
              {(v.exercises ?? []).map((ex, i) => (
                <Fragment key={i}>
                  <SessionExerciseRow exercise={ex} />
                </Fragment>
              ))}
            </div>
          </>
        ) : null}
        {/* Edit is in the top bar; down here, only writing about it. */}
        {!v.isFuture ? (
          <FormActions>
            <Button type="primary" size="lg" onClick={v.goDiary}>
              {v.ctaLabel}
            </Button>
          </FormActions>
        ) : null}
      </div>
    </>
  );
}
