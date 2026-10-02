// The workout editor: building a new workout, or changing a session or a saved one.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { t } from '@/frontend/features/planner/viewHelpers';
import { Card } from '@moonshot/design-system/card';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { ReorderableList } from '@moonshot/design-system/reorderable-list';
import { Stat } from '@moonshot/design-system/stat';
import { Text } from '@moonshot/design-system/typography';
import { Chip, ChipGroup } from '@moonshot/design-system/chip';
import { TextArea } from '@moonshot/design-system/text-field';
import { Button } from '@moonshot/design-system/buttons';
import { ChevronDown, Clock, ExerciseIcon, Plus, Repeat } from '@moonshot/design-system/icons';
import { BackBar } from '@/frontend/components/BackBar';
import { FormActions } from '@/frontend/components/FormActions';
import { RepeatWeekly } from '@/frontend/components/RepeatWeekly';
import { SessionProgress } from '@/frontend/components/SessionProgress';
import { AddExercisePanel } from '@/frontend/features/editor/AddExercisePanel';
import { DatePicker } from '@/frontend/features/editor/DatePicker';
import { EditorExerciseItem } from '@/frontend/features/editor/EditorExerciseItem';
import { EditorHeader } from '@/frontend/features/editor/EditorHeader';
import { LeaveEditorDialog } from '@/frontend/features/editor/LeaveEditorDialog';
import { RideActualCard } from '@/frontend/features/editor/RideActualCard';
import { RidePlanFields } from '@/frontend/features/editor/RidePlanFields';
import { WeekdayToggles } from '@/frontend/components/WeekdayToggles';

export function EditorScreen({ v }: { v: PlannerVals }) {
  return (
    <div style={{ position: 'relative' }}>
      <LeaveEditorDialog v={v} />
      <BackBar label={v.backLabel} onBack={v.tryLeave} />
      <EditorHeader v={v} />
      <ChipGroup style={{ marginTop: '20px' }}>
        {v.showDate ? (
        <DatePicker v={v} />
        ) : null}
        {v.repeatOn ? (
          <Chip tone="accent" icon={<Repeat color="var(--color-on-strong)" size={15} />}>
            Weekly
          </Chip>
        ) : null}
        <Chip icon={<Clock color="var(--color-muted)" size={17} />}>{t(v.eTime)}</Chip>
        {v.editType ? (
          // Goes back to "What kind of workout?" to change it.
          <Chip
            icon={<ExerciseIcon name={v.editType.icon} color="var(--color-muted)" size={17} />}
            onClick={v.openRetype}
            trailing={<ChevronDown color="var(--color-muted)" strokeWidth={2.2} size={14} />}
            aria-label={'Type: ' + v.editType.label + '. Change it'}
          >
            {v.editType.label}
          </Chip>
        ) : null}
      </ChipGroup>
      {v.canUseSaved ? (
        <Button type="secondary" size="md" onClick={v.useSaved} style={{ marginTop: '12px' }}>
          {v.useSavedLabel}
        </Button>
      ) : null}
      {v.isCreating ? (
        <Card pad="sm" style={{ marginTop: '16px' }}>
          <Checkbox switch checked={!!v.scheduleOn} onChange={v.setSchedule} description={v.scheduleNote}>
            Add to calendar
          </Checkbox>
          {v.showRepeatDays ? <RepeatDays v={v} /> : null}
          {v.daysNote ? (
            <Text variant="body" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
              {v.daysNote}
            </Text>
          ) : null}
          {v.showLogDone ? (
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--color-line)' }}>
              <Checkbox switch checked={!!v.logDoneOn} onChange={v.setLogDone}>
                Log it as done
              </Checkbox>
            </div>
          ) : null}
          {v.scheduleOn ? (
            <div
              style={{
                marginTop: '14px',
                paddingTop: '14px',
                borderTop: '1px solid var(--color-line)',
              }}
            >
              <RepeatWeekly
                on={!!v.repeatOn}
                onChange={v.setRepeat}
                note={v.repeatNote}
                weeks={v.repeatWeeks}
                onWeeks={v.setRepeatWeeks}
              />
            </div>
          ) : null}
        </Card>
      ) : (
        <>
          {v.inSeries ? (
            <Card pad="sm" style={{ marginTop: '16px' }}>
              <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
                {v.seriesNote}
              </Text>
            </Card>
          ) : null}
          {v.canRepeat ? (
            <Card pad="sm" style={{ marginTop: '16px' }}>
              <RepeatWeekly
                on={!!v.repeatOn}
                onChange={v.setRepeat}
                note={v.repeatNote}
                weeks={v.repeatWeeks}
                onWeeks={v.setRepeatWeeks}
              >
                {v.showRepeatDays ? <RepeatDays v={v} /> : null}
              </RepeatWeekly>
            </Card>
          ) : null}
        </>
      )}
      {/* Whether it's a warm-up, whatever its kind: a workout, a stretch or yoga can each be one. */}
      {v.warmupShown ? (
        <Card pad="sm" style={{ marginTop: '16px' }}>
          <Checkbox switch checked={!!v.warmupOn} onChange={v.setWarmup}>
            Warm-up
          </Checkbox>
          <Text variant="body" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
            Listed before the other workouts on its day, and tagged as a warm-up.
          </Text>
        </Card>
      ) : null}
      {v.ridePlanStatic ? (
        <div style={{ marginTop: '18px' }}>
          <div
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
          >
            <Text variant="micro" tone="slate">
              Ride plan
            </Text>
            <Text variant="small" tone="muted" weight="medium" style={{ marginLeft: 'auto' }}>
              {v.rideLockNote}
            </Text>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '22px', marginTop: '12px' }}>
            <Stat label="Distance" value={v.planDistText} />
            <Stat label="Duration" value={v.planDurText} />
            <Stat label="Elevation" value={v.planElevText} />
            <Stat label="Target effort" value={v.rideZone} />
          </div>
        </div>
      ) : null}
      {v.ridePlanEdit ? <RidePlanFields v={v} /> : null}
      {v.ridePlanStatic ? <RideActualCard v={v} /> : null}
      {v.isLift ? (
        <Card style={{ marginTop: '16px' }}>
          <Text variant="micro" as="div" tone="slate">
            Target areas
          </Text>
          {v.hasTargetAreas ? (
            <ChipGroup style={{ marginTop: '14px' }}>
              {(v.targetAreaPills ?? []).map((name, i) => (
                <Chip key={i} size="md">{name}</Chip>
              ))}
            </ChipGroup>
          ) : (
            <Text variant="body" tone="muted" style={{ display: 'block', marginTop: '10px' }}>
              Give an exercise below a target area to see it here.
            </Text>
          )}
        </Card>
      ) : null}
      {v.hasProgress ? (
        <SessionProgress label={v.progLabel} pct={v.progPct ?? 0} allDone={!!v.allDone} note={v.progNote ?? ''} />
      ) : null}
      {v.isLift ? (
        <ReorderableList
          items={(v.exercises ?? []) as any[]}
          getKey={(ex, i) => ex?.name ?? String(i)}
          handleLabel={(ex) => ex?.moveAria ?? ''}
          onMove={(from, to) => v.exercises?.[from]?.moveTo(to)}
          style={{ marginTop: '16px' }}
          renderItem={(ex, _, handle) => (
              <EditorExerciseItem exercise={ex} handle={handle} />
          )}
        />
      ) : null}
      {v.isLift ? (
        <Button
          type="dashed"
          size="lg"
          fullWidth
          onClick={v.openAdd}
          aria-expanded={!!v.addOpen}
          aria-controls={v.addOpen ? 'add-exercise' : undefined}
          data-add-exercise
          style={{ marginTop: '16px' }}
        >
          <Plus color="var(--color-accent)" size={19} />
          Add exercise
        </Button>
      ) : null}
      {v.addOpen ? <AddExercisePanel v={v} /> : null}
      <div style={{ marginTop: '24px' }}>
        <Text variant="micro" tone="muted" style={{ display: 'block', marginBottom: '10px' }}>
          Workout notes
        </Text>
        <TextArea
          aria-label="Workout notes"
          rows={3}
          placeholder="Cues, targets, anything to remember…"
          value={v.eNotes}
          onChange={v.setNotes}
        />
      </div>
      <FormActions>
        {v.saveHint ? (
          <Text variant="body" tone="muted" as="p" style={{ margin: '0 auto 0 0', flex: '1 1 200px' }}>
            {v.saveHint}
          </Text>
        ) : null}
        {v.canDeleteSession ? (
          <Button type="danger" ghost size="lg" onClick={v.deleteSession} style={{ marginRight: 'auto' }}>
            Delete
          </Button>
        ) : null}
        <Button type="neutral" ghost size="lg" onClick={v.footerSecondary}>
          Cancel
        </Button>
        <Button type="primary" size="lg" onClick={v.saveWorkout} disabled={!!v.saveBlocked}>
          {v.eSaveLabel}
        </Button>
      </FormActions>
    </div>
  );
}

/** "On" and the week's days to pick from, under "Add to calendar" or a session's "Repeat weekly". */
function RepeatDays({ v }: { v: PlannerVals }) {
  return (
    <div style={{ marginTop: '14px' }}>
      <Text variant="micro" as="div" tone="slate" aria-hidden="true" style={{ marginBottom: '8px' }}>
        On
      </Text>
      <WeekdayToggles label="Days it goes on" days={v.repeatDays ?? []} onToggle={v.toggleRepeatDay} />
    </div>
  );
}
