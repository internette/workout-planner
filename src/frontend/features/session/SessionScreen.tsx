// A session on the calendar: its exercises or ride, the timer, and finishing it.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { t } from '@/frontend/features/planner/viewHelpers';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { Chip, ChipGroup } from '@moonshot/design-system/chip';
import { Button, Pressable } from '@moonshot/design-system/buttons';
import { Calendar, ChevronDown, ChevronRight, Clock, Pencil, Repeat } from '@moonshot/design-system/icons';
import { Popover } from '@moonshot/design-system/popover';
import { Dialog } from '@moonshot/design-system/dialog';
import { TextField } from '@moonshot/design-system/text-field';
import { BackBar } from '@/frontend/components/BackBar';
import { FormActions } from '@/frontend/components/FormActions';
import { NeedsLine } from '@/frontend/components/NeedsLine';
import { PageTitle } from '@/frontend/components/PageTitle';
import { FinishDialog } from '@/frontend/features/session/FinishDialog';
import { LeaveWorkoutDialog } from '@/frontend/features/session/LeaveWorkoutDialog';
import { RideSessionCard } from '@/frontend/features/session/RideSessionCard';
import { SessionExerciseRow } from '@/frontend/features/session/SessionExerciseRow';
import { WorkoutCard } from '@/frontend/features/session/WorkoutCard';
import { RestartDialog } from '@/frontend/features/calendar/RestartDialog';
import { KindTag } from '@/frontend/components/KindTag';

export function SessionScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      <LeaveWorkoutDialog v={v} />
      <FinishDialog v={v} />
      <BackBar label={v.backLabel} onBack={v.backToDay}>
        <Button type="secondary" size="sm" onClick={v.goEdit} style={{ whiteSpace: 'nowrap' }}>
          <Pencil color="var(--color-pink-deep)" size={16} />
          Edit
        </Button>
      </BackBar>
      <PageTitle icon={v.dayIcoSvg} eyebrow={<>{v.eDate}<KindTag inline kind={v.eKind ?? null} /></>} title={v.eName} />
      {v.eProgram ? (
        v.eProgram.open ? (
          <Pressable
            onClick={v.eProgram.open}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', minHeight: '44px', marginTop: 'var(--space-1)'}}
          >
            <Text variant="body" weight="semibold" tone="accent">
              {v.eProgram.label}
            </Text>
            <ChevronRight color="var(--color-pink-deep)" size={15} />
          </Pressable>
        ) : (
          <Text variant="body" weight="semibold" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
            {v.eProgram.label}
          </Text>
        )
      ) : null}
      <ChipGroup style={{ marginTop: 'var(--space-5)' }}>
        {/* Not done or started yet: its day is a chip that moves it to another day. */}
        {v.moveDay ? (
          <Chip
            icon={<Calendar color="var(--color-muted)" size={15} />}
            onClick={v.moveDay.open}
            trailing={<ChevronDown color="var(--color-muted)" strokeWidth={2.2} size={14} />}
          >
            {v.moveDay.label}
          </Chip>
        ) : null}
        <Chip
          icon={<Clock color="var(--color-muted)" size={15} />}
          onClick={v.editTook}
          title={v.editTook ? 'Change what you recorded' : undefined}
          // Only a finished session's time can be changed; the ▾ says when it can.
          trailing={v.editTook ? <ChevronDown color="var(--color-muted)" strokeWidth={2.2} size={14} /> : undefined}
        >
          {t(v.eTime)}
        </Chip>
        {v.inSeries ? (
          <>
            {/* Opens a panel saying when it repeats, with End series: a × on the chip read as removing a tag. */}
            <Popover
              open={!!v.seriesOpen}
              onClose={v.closeSeries}
              width={240}
              top={44}
              pad="sm"
              as="span"
              content={
                <>
                  <Text variant="body" tone="ink" as="p" style={{ margin: 0 }}>
                    {v.seriesRepeats}
                  </Text>
                  <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-1) 0 var(--space-3)' }}>
                    Ending it takes the repeats still ahead off the calendar.
                  </Text>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                    {v.makeProgram ? (
                      <Button type="secondary" size="sm" onClick={v.makeProgram} style={{ whiteSpace: 'nowrap' }}>
                        Make this a program
                      </Button>
                    ) : null}
                    <Button type="danger" size="sm" onClick={v.endSeries}>
                      End series
                    </Button>
                  </div>
                </>
              }
            >
              <Chip
                tone="accent"
                icon={<Repeat color="var(--color-surface)" size={15} />}
                onClick={v.toggleSeries}
                aria-expanded={!!v.seriesOpen}
                trailing={<ChevronDown color="var(--color-surface)" strokeWidth={2.2} size={14} />}
              >
                Weekly series
              </Chip>
            </Popover>
          </>
        ) : null}
        {(v.areaPills ?? []).map((a, i) => (
          <Chip key={i}>{a}</Chip>
        ))}
      </ChipGroup>
      <NeedsLine text={v.needs} />
      {v.isFuture ? (
        <Card style={{ marginTop: 'var(--space-4)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
            <Text variant="micro" tone="slate" as="div">
              Coming up
            </Text>
            <Text variant="body" tone="ink" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
              {v.futureNote} Doing it now? Move it to today.
            </Text>
          </div>
          <Button type="primary" size="md" onClick={v.doItToday}>
            Do it today
          </Button>
        </Card>
      ) : null}
      {/* The clock, and for a lift its progress, sets and rest (nothing to tick off before its day). */}
      <WorkoutCard v={v} />
      <RestartDialog v={v} />
      {v.moveDay ? (
        <Dialog
          open={v.moveDay.isOpen}
          onClose={v.moveDay.cancel}
          title={v.moveDay.title}
          actions={
            <>
              <Button type="neutral" ghost size="md" onClick={v.moveDay.cancel}>
                Cancel
              </Button>
              <Button type="primary" size="md" onClick={v.moveDay.save} disabled={!v.moveDay.canSave}>
                Move it
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <TextField label="Day" type="date" value={v.moveDay.date} onChange={v.moveDay.setDate} />
            <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
              {v.moveDay.note}
            </Text>
          </div>
        </Dialog>
      ) : null}
      {v.dayIsRide ? <RideSessionCard v={v} /> : null}
      {v.dayIsLift ? (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}
        >
          {(v.exercises ?? []).map((ex, i) => (
            <SessionExerciseRow key={i} exercise={ex} />
          ))}
        </div>
      ) : null}
      {/* Edit is in the top bar; down here, only writing about it. */}
      {!v.isFuture && v.showCta && !v.writeInCard ? (
        <FormActions>
          <Button type="primary" size="lg" onClick={v.goDiary}>
            {v.ctaLabel}
          </Button>
        </FormActions>
      ) : null}
    </div>
  );
}
