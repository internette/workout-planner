// The workout editor: building a new workout, or changing a session or a saved one.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import { Fragment } from 'react';
import { t } from '@/frontend/features/planner/viewHelpers';
import { Card } from '@moonshot/design-system/card';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { ReorderableList } from '@moonshot/design-system/reorderable-list';
import { Stat } from '@moonshot/design-system/stat';
import { Text } from '@moonshot/design-system/typography';
import { Chip } from '@moonshot/design-system/chip';
import { TextArea } from '@moonshot/design-system/text-field';
import { Button } from '@moonshot/design-system/buttons';
import { Clock, Plus, Repeat } from '@moonshot/design-system/icons';
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
import { ChipRow } from '@/frontend/components/ChipRow';

export function EditorScreen({ v }: { v: any }) {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <LeaveEditorDialog v={v} />
        <BackBar label={v.backLabel} onBack={v.tryLeave} />
        <EditorHeader v={v} />
        <ChipRow style={{ marginTop: '20px' }}>
          {v.showDate ? (
          <DatePicker v={v} />
          ) : null}
          {v.repeatOn ? (
            <>
              <Chip tone="accent" icon={<Repeat color="var(--color-on-accent)" size={15} />}>
                Weekly
              </Chip>
            </>
          ) : null}
          <Chip icon={<Clock color="var(--color-muted)" size={17} />}>{t(v.eTime)}</Chip>
        </ChipRow>
        {v.canUseSaved ? (
          <Button type="secondary" size="md" onClick={v.useSaved} style={{ marginTop: '12px' }}>
            {v.useSavedLabel}
          </Button>
        ) : null}
        {v.isCreating ? (
          <Card pad="sm" style={{ marginTop: '16px' }}>
            <Checkbox switch checked={!!v.scheduleOn} onChange={v.setSchedule}>
              Add to calendar
            </Checkbox>
            <Text variant="caption" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
              {v.scheduleNote}
            </Text>
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
                <RepeatWeekly on={!!v.repeatOn} onChange={v.setRepeat} note={v.repeatNote} />
              </div>
            ) : null}
          </Card>
        ) : (
          <>
            {v.inSeries ? (
              <Card pad="sm" style={{ marginTop: '16px' }}>
                <Text variant="caption" tone="muted" as="p" style={{ margin: 0 }}>
                  {v.seriesNote}
                </Text>
              </Card>
            ) : null}
            {v.canRepeat ? (
              <Card pad="sm" style={{ marginTop: '16px' }}>
                <RepeatWeekly on={!!v.repeatOn} onChange={v.setRepeat} note={v.repeatNote} />
              </Card>
            ) : null}
          </>
        )}
        {v.warmupShown ? (
          <Card pad="sm" style={{ marginTop: '16px' }}>
            <Checkbox switch checked={!!v.warmupOn} onChange={v.setWarmup}>
              Warm-up
            </Checkbox>
            <Text variant="caption" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
              Listed before the other workouts on its day, and tagged as a warm-up.
            </Text>
          </Card>
        ) : null}
        {v.ridePlanStatic ? (
          <>
            <div style={{ marginTop: '18px' }}>
              <div
                style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
              >
                <Text variant="eyebrow" tone="slate">
                  RIDE PLAN
                </Text>
                <Text variant="small" tone="subtle" weight="medium" style={{ marginLeft: 'auto' }}>
                  {v.rideLockNote}
                </Text>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '22px', marginTop: '12px' }}>
                <Stat size="sm" label="DISTANCE" value={v.planDistText} />
                <Stat size="sm" label="DURATION" value={v.planDurText} />
                <Stat size="sm" label="ELEVATION" value={v.planElevText} />
                <Stat size="sm" label="TARGET EFFORT" value={v.rideZone} />
              </div>
            </div>
          </>
        ) : null}
        {v.ridePlanEdit ? <RidePlanFields v={v} /> : null}
        {v.ridePlanStatic ? <RideActualCard v={v} /> : null}
        {v.isLift ? (
          <>
            <Card style={{ marginTop: '16px' }}>
              <Text variant="eyebrow" as="div" tone="slate">
                TARGET AREAS
              </Text>
              {v.hasTargetAreas ? (
                <ChipRow style={{ marginTop: '14px' }}>
                  {(v.targetAreaPills ?? []).map((name, i) => (
                    <Fragment key={i}>
                      <Chip size="md">{name}</Chip>
                    </Fragment>
                  ))}
                </ChipRow>
              ) : (
                <Text variant="body" tone="muted" style={{ display: 'block', marginTop: '10px' }}>
                  Give an exercise below a target area to see it here.
                </Text>
              )}
            </Card>
          </>
        ) : null}
        {v.hasProgress ? (
          <>
            <SessionProgress label={v.progLabel} pct={v.progPct ?? 0} allDone={!!v.allDone} note={v.progNote ?? ''} />
          </>
        ) : null}
        {v.isLift ? (
          <>
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
          </>
        ) : null}
        {v.isLift ? (
          <>
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
          </>
        ) : null}
        {v.addOpen ? <AddExercisePanel v={v} /> : null}
        <div style={{ marginTop: '24px' }}>
          <Text variant="eyebrow" tone="muted" style={{ display: 'block', marginBottom: '10px' }}>
            WORKOUT NOTES
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
            <Text variant="caption" tone="muted" as="p" style={{ margin: '0 auto 0 0', flex: '1 1 200px' }}>
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
    </>
  );
}
