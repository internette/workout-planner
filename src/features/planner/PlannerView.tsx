// Ported from the Claude Design prototype "Workout Planner.dc.html".
// Pure template: every value it reads comes from the `v` object built in Planner.tsx.
// @ts-nocheck
import { Fragment } from 'react';
import { css, t } from './viewHelpers';
import { Card } from '@moonshot/design-system/card';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Dialog } from '@moonshot/design-system/dialog';
import { OptionCard, OptionGroup } from '@moonshot/design-system/option-card';
import { Popover } from '@moonshot/design-system/popover';
import { Badge } from '@moonshot/design-system/badge';
import { EmptyState } from '@moonshot/design-system/empty-state';
import { IconChoiceGroup } from '@moonshot/design-system/icon-choice-group';
import { IconTile, IconTileButton } from '@moonshot/design-system/icon-tile';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { ReorderableList } from '@moonshot/design-system/reorderable-list';
import { MoodRating, StarRating } from '@moonshot/design-system/rating';
import { Stat } from '@moonshot/design-system/stat';
import { DeleteAccount } from '../profile/DeleteAccount';
import { AppearanceSetting } from '../profile/AppearanceSetting';
import { SUMMON_ON, SummonPlan } from '../summon/SummonPlan';
import { Text } from '@moonshot/design-system/typography';
import { Chip } from '@moonshot/design-system/chip';
import { Label, TextArea, TextField } from '@moonshot/design-system/text-field';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { Button, IconButton } from '@moonshot/design-system/buttons';
import {
  BarChart,
  Bike,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Close,
  Copy,
  Dumbbell,
  DumbbellSmall,
  Gem,
  Info,
  MoodFace,
  Moon,
  Pencil,
  Plus,
  Quill,
  Repeat,
  Search,
  SignOut,
  Sparkle,
  SpellCards,
  User,
} from '@moonshot/design-system/icons';
import { vars } from '@moonshot/design-system/colors';
import { AreaChoice } from '@/components/AreaChoice';
import { BackLink } from '@/components/BackLink';
import { DoneTick } from '@/components/DoneTick';
import { EquipmentPicker } from '@/components/EquipmentPicker';
import { FilterButton } from '@/components/FilterButton';
import { FormActions } from '@/components/FormActions';
import { IconSquare } from '@/components/IconSquare';
import { NeedsLine } from '@/components/NeedsLine';
import { RepeatWeekly } from '@/components/RepeatWeekly';
import { SessionProgress } from '@/components/SessionProgress';
import { SetsFields } from '@/components/SetsFields';
import { WarmupTag } from '@/components/WarmupTag';

import { AddToDayDialog } from '@/features/calendar/AddToDayDialog';
import { DayWorkoutCard } from '@/features/calendar/DayWorkoutCard';
import { MonthGrid } from '@/features/calendar/MonthGrid';
import { MonthPicker } from '@/features/calendar/MonthPicker';
import { QuestCard } from '@/features/calendar/QuestCard';
import { RestartDialog } from '@/features/calendar/RestartDialog';
import { WeekRow } from '@/features/calendar/WeekRow';
import { ChronicleRow } from '@/features/chronicle/ChronicleRow';
import { DiaryEntryForm } from '@/features/chronicle/DiaryEntryForm';
import { EntryReadView } from '@/features/chronicle/EntryReadView';
import { AddExercisePanel } from '@/features/editor/AddExercisePanel';
import { DatePicker } from '@/features/editor/DatePicker';
import { EditorExerciseItem } from '@/features/editor/EditorExerciseItem';
import { EditorHeader } from '@/features/editor/EditorHeader';
import { LeaveEditorDialog } from '@/features/editor/LeaveEditorDialog';
import { RideActualCard } from '@/features/editor/RideActualCard';
import { RidePlanFields } from '@/features/editor/RidePlanFields';
import { SavedChoices } from '@/features/editor/SavedChoices';
import { TypeChoiceCards } from '@/features/editor/TypeChoiceCards';
import { ConfirmDialog } from '@/features/planner/ConfirmDialog';
import { NoticeBanner } from '@/features/planner/NoticeBanner';
import { SaveErrorBanner } from '@/features/planner/SaveErrorBanner';
import { Sidebar } from '@/features/planner/Sidebar';
import { TabBar } from '@/features/planner/TabBar';
import { AccountCard } from '@/features/profile/AccountCard';
import { MoodSplitCard } from '@/features/profile/MoodSplitCard';
import { PersonalBestsCard } from '@/features/profile/PersonalBestsCard';
import { ProfileHeaderCard } from '@/features/profile/ProfileHeaderCard';
import { QuestsClearedCard } from '@/features/profile/QuestsClearedCard';
import { SessionsPerWeekCard } from '@/features/profile/SessionsPerWeekCard';
import { SignOutDialog } from '@/features/profile/SignOutDialog';
import { NextUpCard } from '@/features/progress/NextUpCard';
import { progCard } from '@/features/progress/progCard';
import { RanksDialog } from '@/features/progress/RanksDialog';
import { StreakBanner } from '@/features/progress/StreakBanner';
import { ThisWeekCard } from '@/features/progress/ThisWeekCard';
import { WeekQuestsCard } from '@/features/progress/WeekQuestsCard';
import { FinishDialog } from '@/features/session/FinishDialog';
import { LeaveWorkoutDialog } from '@/features/session/LeaveWorkoutDialog';
import { RideSessionCard } from '@/features/session/RideSessionCard';
import { SessionExerciseRow } from '@/features/session/SessionExerciseRow';
import { SessionTimer } from '@/features/session/SessionTimer';
import { AreaFilter } from '@/features/spellbook/AreaFilter';
import { EquipmentFilter } from '@/features/spellbook/EquipmentFilter';
import { ExerciseEditForm } from '@/features/spellbook/ExerciseEditForm';
import { ExerciseRow } from '@/features/spellbook/ExerciseRow';
import { NewExerciseCard } from '@/features/spellbook/NewExerciseCard';
import { SaveScopeDialog } from '@/features/spellbook/SaveScopeDialog';
import { ScheduleDialog } from '@/features/spellbook/ScheduleDialog';
import { WorkoutRow } from '@/features/spellbook/WorkoutRow';

export function PlannerView({ v }: { v: any }) {
  return (
    <>
      <span
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          margin: '-1px',
          padding: '0',
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          border: '0',
        }}
      >
        {v.announce}
      </span>
      <RanksDialog v={v} />
      <SignOutDialog v={v} />
      <ConfirmDialog v={v} />
      <SaveScopeDialog v={v} />
      <AddToDayDialog v={v} />
      <div style={css(v.pageStyle)}>
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            padding: '28px 28px 0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '28px',
            alignItems: 'flex-start',
          }}
        >
          <Sidebar v={v} />
          <main style={{ flex: '1 1 560px', minWidth: '0' }}>
            {v.saveError ? <SaveErrorBanner v={v} /> : null}
            {v.notice ? <NoticeBanner v={v} /> : null}
            {v.isCal ? (
              <>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0 }}>
                    <MonthPicker v={v} />
                    {v.awayFromToday ? (
                      <Button type="secondary" ghost size="xs" onClick={v.goToday}>
                        Today
                      </Button>
                    ) : null}
                    </span>
                    <SegmentedControl
                      label="Calendar view"
                      semantics="tabs"
                      equalWidth
                      options={[
                        { value: 'Day', label: 'Day' },
                        { value: 'Week', label: 'Week' },
                        { value: 'Month', label: 'Month' },
                      ]}
                      value={v.calendarView}
                      onChange={v.setCalendarView}
                      panelId="calendar-view"
                      style={v.segLayout}
                    />
                  </div>
                  {SUMMON_ON ? <SummonPlan onAdd={v.addPlanDraft} adding={!!v.addingPlan} /> : null}
                  <div role="tabpanel" id="calendar-view" aria-labelledby={'calendar-view-' + v.calendarView}>
                  {v.showDay ? (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '10px',
                          marginTop: '20px',
                        }}
                      >
                        <Text variant="title" as="h1" style={{ margin: '0' }}>
                          {v.dayName}
                        </Text>
                        <Text variant="label" tone="muted">
                          {v.shortDate}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px' }}>
                        <IconButton label="Previous week" size="md" onClick={v.prevWeek}>
                          <ChevronLeft color="var(--color-muted)" size={17} />
                        </IconButton>
                        <div style={{ flex: '1', display: 'flex' }}>
                          {(v.days ?? []).map((d, i) => (
                            <Fragment key={i}>
                              <button
                                onClick={d?.pick}
                                aria-label={d?.aria}
                                aria-current={d?.isToday}
                                aria-pressed={!!d?.selected}
                                style={css(d?.wrapStyle)}
                              >
                                <span style={css(d?.letterStyle)}>{d?.letter}</span>
                                <span style={css(d?.monStyle)}>{d?.mon}</span>
                                <span style={css(d?.numStyle)}>{d?.num}</span>
                                <span style={css(d?.dotStyle)}></span>
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <IconButton label="Next week" size="md" onClick={v.nextWeek}>
                          <ChevronRight color="var(--color-muted)" size={17} />
                        </IconButton>
                      </div>
                    </>
                  ) : null}
                  {v.showQuest ? (
                    <>
                      <QuestCard v={v} />
                    </>
                  ) : null}
                  <RestartDialog v={v} />
                  {v.hasWorkout ? (
                    <>
                      <div style={{ marginTop: '14px' }}>
                        {(v.dayCards ?? []).map((c, i) => (
                          <Fragment key={c?.key}>
                            <div style={{ marginTop: i ? '12px' : '0' }}>
                              <DayWorkoutCard card={c} />
                            </div>
                          </Fragment>
                        ))}
                        <aside style={{ display: 'flex', marginTop: '14px' }}>
                          <Button type="dashed" size="md" onClick={v.goNewWorkout} style={{ flex: '1' }}>
                            <Plus color="var(--color-accent-deep)" size={17} />
                            Add workout
                          </Button>
                        </aside>
                      </div>
                    </>
                  ) : null}
                  {v.firstRun ? (
                    <EmptyState
                      style={{ marginTop: '48px' }}
                      medallion="gem"
                      icon={<Gem size={40} />}
                      title="The call is coming"
                      description="Put your first lift or ride on the calendar. That day gets a quest, and every exercise you clear starts your climb from First spark."
                      actions={
                        <>
                          <Button type="primary" size="lg" glow onClick={v.goNewWorkout}>
                            <Plus color="var(--color-on-accent)" size={16} />
                            Plan your first workout
                          </Button>
                          <Button type="neutral" ghost size="md" onClick={v.goArsenal}>
                            Browse the Spellbook
                          </Button>
                        </>
                      }
                    />
                  ) : null}
                  {v.isRest ? (
                    <EmptyState
                      style={{ marginTop: '56px' }}
                      icon={
                        <>
                          <Moon color="var(--color-periwinkle)" size={40} />
                          <span style={{ position: 'absolute', top: '21px', right: '20px', display: 'flex' }}>
                            <Sparkle size={9.5} outline color={vars.gold} strokeWidth={2.2} />
                          </span>
                        </>
                      }
                      title="The city is quiet"
                      description={
                        <>
                          No quest {v.restDayPhrase}. Rest is how the power comes back — or add a workout if you&apos;re
                          feeling it.
                        </>
                      }
                      actions={
                        <Button type="primary" size="lg" glow onClick={v.goNewWorkout}>
                          <Plus color="var(--color-on-accent)" size={16} />
                          Add workout
                        </Button>
                      }
                      decoration={
                        <span style={{ position: 'absolute', left: '14%', bottom: '120px', animation: 'twinkle 4s ease-in-out infinite' }}>
                          <Sparkle size={13} color={vars.periwinkle} glow={0.5} />
                        </span>
                      }
                    />
                  ) : null}
                  {v.showWeek ? (
                    <>
                      <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <IconButton label="Previous week" size="md" onClick={v.prevWeek}>
                            <ChevronLeft color="var(--color-muted)" size={17} />
                          </IconButton>
                          <Text variant="itemTitle" as="h1" style={{ flex: 'none', whiteSpace: 'nowrap', margin: 0 }}>
                            {v.weekLabel}
                          </Text>
                          <IconButton label="Next week" size="md" onClick={v.nextWeek}>
                            <ChevronRight color="var(--color-muted)" size={17} />
                          </IconButton>
                        </div>
                        <div
                          style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '26px' }}
                        >
                          {(v.weekRows ?? []).map((w, i) => (
                            <Fragment key={i}>
                              <WeekRow row={w} />
                            </Fragment>
                          ))}
                          {v.hasRows ? (
                            <>
                              <span></span>
                            </>
                          ) : null}
                        </div>
                        {v.weekAllDone ? (
                          <>
                            <div
                              style={{
                                position: 'relative',
                                marginTop: '16px',
                                padding: '26px 24px',
                                borderRadius: 'var(--radius-lg)',
                                background:
                                  'var(--gradient-gem-tint)',
                                textAlign: 'center',
                                overflow: 'hidden',
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '13%',
                                  top: '20px',
                                  animation: 'twinkle 3.4s ease-in-out infinite',
                                }}
                              >
                                <Sparkle size={12} color={vars.periwinkle} glow={0.5} />
                              </span>
                              <span
                                style={{
                                  position: 'absolute',
                                  right: '15%',
                                  top: '34px',
                                  animation: 'twinkle 4.6s ease-in-out infinite',
                                }}
                              >
                                <Sparkle size={10} color={vars.teal} glow={0.55} />
                              </span>
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '24%',
                                  bottom: '18px',
                                  animation: 'twinkle 6s ease-in-out infinite',
                                }}
                              >
                                <Sparkle size={9} color={vars.coral} glow={0.55} />
                              </span>
                              <div
                                style={{
                                  width: '56px',
                                  height: '56px',
                                  margin: '0 auto',
                                  borderRadius: 'var(--radius-full)',
                                  background:
                                    'var(--gradient-gem)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Check color="var(--color-on-accent)" strokeWidth={2.6} size={26} />
                              </div>
                              <Text variant="subheading" as="h3" style={{ margin: '16px 0 0' }}>
                                Week sealed
                              </Text>
                              <Text
                                variant="body"
                                as="p"
                                tone="slate"
                                style={{ margin: '8px auto 0', maxWidth: '320px', textWrap: 'pretty' }}
                              >
                                {v.weekDoneNote}
                              </Text>
                            </div>
                          </>
                        ) : null}
                        {v.noRows ? (
                          <EmptyState
                            size="md"
                            panel
                            titleAs="h3"
                            style={{ margin: '34px 0 0' }}
                            icon={<Gem size={32} />}
                            title="Your wand&apos;s still charging"
                            description={v.emptyWeekNote}
                            actions={
                              <Button
                                type="primary"
                                size="lg"
                                onClick={v.goNewWorkout}
                              >
                                <Plus color="var(--color-on-accent)" size={16} />
                                Add workout
                              </Button>
                            }
                            decoration={
                              <>
                                <span style={{ position: 'absolute', left: '11%', top: '18px', animation: 'twinkle 3.4s ease-in-out infinite' }}>
                                  <Sparkle size={13} color={vars.periwinkle} glow={0.5} />
                                </span>
                                <span style={{ position: 'absolute', right: '13%', top: '40px', animation: 'twinkle 4.6s ease-in-out infinite' }}>
                                  <Sparkle size={10} color={vars.teal} glow={0.55} />
                                </span>
                                <span style={{ position: 'absolute', left: '22%', bottom: '22px', animation: 'twinkle 6s ease-in-out infinite' }}>
                                  <Sparkle size={10} color={vars.coral} glow={0.55} />
                                </span>
                              </>
                            }
                          />
                        ) : null}
                      </div>
                    </>
                  ) : null}
                  {v.showMonth ? (
                    <>
                      <h1 className="sr-only">{v.monthName}</h1>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '14px' }}>
                        <Button type="neutral" ghost size="sm" onClick={v.prevMonth} aria-label={'Previous month, ' + v.prevMonthName}>
                          <ChevronLeft color="var(--color-muted)" size={16} />
                          {v.prevMonthShort}
                        </Button>
                        <Button type="neutral" ghost size="sm" onClick={v.nextMonth} aria-label={'Next month, ' + v.nextMonthName}>
                          {v.nextMonthShort}
                          <ChevronRight color="var(--color-muted)" size={16} />
                        </Button>
                      </div>
                      <div style={{ marginTop: '18px' }}>
                        <div
                          style={{
                            display: 'grid',
                            // Side by side, until that leaves too little room to say "of 16 done" on one line.
                            gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
                            gap: '12px',
                            alignItems: 'stretch',
                          }}
                        >
                          <Card pad="sm" style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                flex: 'none',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--color-accent-tint)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Gem size={20} />
                            </div>
                            <div style={{ minWidth: '0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Text variant="subheading">{v.streakCount}</Text>
                              </div>
                              <Text variant="small" as="div" tone="muted" style={{ marginTop: '2px' }}>
                                day streak
                              </Text>
                            </div>
                          </Card>
                          <Card pad="sm" style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                flex: 'none',
                                borderRadius: 'var(--radius-full)',
                                background:
                                  'var(--gradient-gem)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: 'var(--radius-full)',
                                  background: 'var(--color-surface)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Check color="var(--color-accent)" size={20} />
                              </span>
                            </div>
                            <div style={{ minWidth: '0' }}>
                              <Text variant="subheading" as="div">
                                {v.shownMonthDone}
                              </Text>
                              <Text variant="small" as="div" tone="muted" style={{ marginTop: '2px' }}>
                                {v.shownMonthDoneUnit}
                              </Text>
                            </div>
                          </Card>
                        </div>
                        <MonthGrid v={v} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginTop: '20px' }}>
                          <Text
                            variant="small"
                            tone="muted"
                            style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: 'var(--radius-full)',
                                background: 'none',
                                boxShadow: 'inset 0 0 0 1.5px var(--color-teal)',
                              }}
                            ></span>
                            Planned
                          </Text>
                          <Text
                            variant="small"
                            tone="muted"
                            style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--color-slate)',
                              }}
                            ></span>
                            Completed
                          </Text>
                          <Text
                            variant="small"
                            tone="muted"
                            style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                          >
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: 'var(--radius-full)',
                                boxShadow: 'inset 0 0 0 1.5px var(--color-slate)',
                                background: 'linear-gradient(90deg,var(--color-slate) 50%,transparent 50%)',
                              }}
                            ></span>
                            Partly done
                          </Text>
                          <Text
                            variant="small"
                            tone="muted"
                            style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: 'var(--radius-full)',
                                background: 'none',
                                boxShadow: 'inset 0 0 0 1.5px var(--color-muted)',
                              }}
                            ></span>
                            Missed
                          </Text>
                          <Text
                            variant="small"
                            tone="muted"
                            style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '1.5px',
                                borderRadius: '1px',
                                background: 'var(--color-divider)',
                              }}
                            ></span>
                            Rest
                          </Text>
                        </div>
                        {v.hasToday ? (
                          <>
                            <div style={{ marginTop: '30px' }}>
                              <Text variant="eyebrow" as="div" tone="muted">
                                {v.todayLabel}
                              </Text>
                              {(v.todayCards ?? []).map((c, i) => (
                                <Fragment key={i}>
                                  <Card
                                    as="button"
                                    interactive
                                    onClick={c?.open}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '14px',
                                      width: '100%',
                                      marginTop: i ? '8px' : '12px',
                                    }}
                                  >
                                    <span style={{ minWidth: '0' }}>
                                      {c?.warmup ? <WarmupTag /> : null}
                                      <Text variant="itemTitle" as="span" style={{ display: 'block' }}>
                                        {c?.name}
                                      </Text>
                                      <Text
                                        variant="caption"
                                        as="span"
                                        tone="muted"
                                        style={{ display: 'block', marginTop: '3px' }}
                                      >
                                        {c?.meta}
                                      </Text>
                                    </span>
                                    <span style={{ marginLeft: 'auto', display: 'flex' }}>
                                      <ChevronRight color="var(--color-muted)" size={20} />
                                    </span>
                                  </Card>
                                </Fragment>
                              ))}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                  </div>
                </div>
              </>
            ) : null}
            {v.isSaved ? (
              <>
                <div
                  style={{
                    position: 'relative',
                    maxWidth: '520px',
                    margin: '0 auto',
                    padding: '44px 20px 60px',
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '12%',
                      top: '34px',
                      animation: 'twinkle 3.4s ease-in-out infinite',
                    }}
                  >
                    <Sparkle size={13} color={vars.periwinkle} glow={0.5} />
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      right: '14%',
                      top: '70px',
                      animation: 'twinkle 4.6s ease-in-out infinite',
                    }}
                  >
                    <Sparkle size={11} color={vars.teal} glow={0.55} />
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '20%',
                      bottom: '70px',
                      animation: 'twinkle 6s ease-in-out infinite',
                    }}
                  >
                    <Sparkle size={10} color={vars.coral} glow={0.55} />
                  </span>
                  <div
                    style={{
                      width: '96px',
                      height: '96px',
                      margin: '0 auto',
                      borderRadius: 'var(--radius-full)',
                      background:
                        'var(--gradient-gem-tint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pop .5s cubic-bezier(.2,1.5,.4,1) both',
                    }}
                  >
                    <div
                      style={{
                        width: '66px',
                        height: '66px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-surface)',
                        boxShadow: 'var(--elevation-raised)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check
                        color="var(--color-accent)"
                        strokeWidth={2.4}
                        size={30}
                        style={{ strokeDasharray: '30', animation: 'draw .5s .2s ease-out both' }}
                      />
                    </div>
                  </div>
                  <Text variant="title" as="h1" style={{ margin: '22px 0 0' }}>
                    Written into your Chronicle
                  </Text>
                  <Text
                    variant="body"
                    as="p"
                    tone="muted"
                    style={{ margin: '10px auto 0', maxWidth: '340px', textWrap: 'pretty' }}
                  >
                    {v.savedLine}
                  </Text>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      marginTop: '30px',
                      textAlign: 'left',
                    }}
                  >
                    <Card
                      as="button"
                      pad="sm"
                      interactive
                      onClick={v.readSavedEntry}
                      style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                    >
                      <span style={{ flex: '1', minWidth: '0' }}>
                        <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                          Read this entry
                        </Text>
                        <Text variant="caption" tone="muted" style={{ display: 'block', marginTop: '3px' }}>
                          Change it any time
                        </Text>
                      </span>
                      <ChevronRight color="var(--color-muted)" size={20} />
                    </Card>
                    <Card
                      as="button"
                      pad="sm"
                      interactive
                      onClick={v.goDiaryList}
                      style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                    >
                      <span style={{ flex: '1', minWidth: '0' }}>
                        <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                          Read your Chronicle
                        </Text>
                        <Text variant="caption" tone="muted" style={{ display: 'block', marginTop: '3px' }}>
                          {v.savedCount}
                        </Text>
                      </span>
                      <ChevronRight color="var(--color-muted)" size={20} />
                    </Card>
                    <Card
                      as="button"
                      pad="sm"
                      interactive
                      onClick={v.goNextUp}
                      style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                    >
                      <span style={{ flex: '1', minWidth: '0' }}>
                        <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                          {v.savedNextTitle}
                        </Text>
                        <Text variant="caption" tone="muted" style={{ display: 'block', marginTop: '3px' }}>
                          {v.savedNextMeta}
                        </Text>
                      </span>
                      <ChevronRight color="var(--color-muted)" size={20} />
                    </Card>
                    <Card
                      as="button"
                      pad="sm"
                      interactive
                      onClick={v.goSummary}
                      style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                    >
                      <span style={{ flex: '1', minWidth: '0' }}>
                        <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                          See your progress
                        </Text>
                        <Text variant="caption" tone="muted" style={{ display: 'block', marginTop: '3px' }}>
                          Streak, week and month totals
                        </Text>
                      </span>
                      <ChevronRight color="var(--color-muted)" size={20} />
                    </Card>
                  </div>
                  <Button type="neutral" ghost size="md" onClick={v.backToCalendar} style={{ marginTop: '20px' }}>
                    Back to calendar
                  </Button>
                </div>
              </>
            ) : null}
            {v.isProfile ? (
              <>
                <div>
                  <ProfileHeaderCard v={v} />
                  <div id="profileStats" style={{ display: 'grid', gap: '12px', marginTop: '14px' }}>
                    {(v.profileStats ?? []).map((s, i) => (
                      <Fragment key={i}>
                        <Card pad="sm">
                          <Stat size="xl" labelTone="muted" label={s?.label} value={s?.value} unit={s?.unit ?? ''} note={s?.span} />
                        </Card>
                      </Fragment>
                    ))}
                  </div>
                  <SessionsPerWeekCard v={v} />
                  <QuestsClearedCard v={v} />
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
                      gap: '12px',
                      marginTop: '14px',
                    }}
                  >
                    <MoodSplitCard v={v} />
                    <PersonalBestsCard v={v} />
                  </div>
                  <Card style={{ marginTop: '14px' }}>
                    <Text variant="eyebrow" as="h2" tone="slate" style={{ margin: 0 }}>
                      SETTINGS
                    </Text>
                    <AppearanceSetting />
                  </Card>
                  {v.canSignOut ? <AccountCard v={v} /> : null}
                </div>
              </>
            ) : null}
            {v.isSummary ? (
              <>
                <div>
                  <Text variant="title" as="h1" style={{ margin: '0' }}>
                    Progress
                  </Text>
                  <Text
                    variant="body"
                    as="p"
                    tone="muted"
                    style={{ margin: '10px 0 0', maxWidth: '460px', textWrap: 'pretty' }}
                  >
                    {v.summarySub}
                  </Text>
                  <StreakBanner v={v} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '26px' }}>
                    <ThisWeekCard v={v} />
                    <NextUpCard v={v} />
                  </div>
                  <WeekQuestsCard v={v} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '14px' }}>
                    <Card as="button" interactive pad="sm" onClick={v.openChronicle} style={progCard('1 1 170px')}>
                      <Text variant="eyebrow" as="span" tone="muted" style={{ display: 'block' }}>
                        CHRONICLE
                      </Text>
                      <span style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                        <Text variant="subheading">{v.loggedCount}</Text>
                        <Text variant="caption" tone="muted" weight="medium">
                          {v.loggedUnit}
                        </Text>
                      </span>
                    </Card>
                    <Card as="button" interactive pad="sm" onClick={v.openMonth} style={progCard('1 1 170px')}>
                      <Text variant="eyebrow" as="span" tone="muted" style={{ display: 'block' }}>
                        {v.monthLabel}
                      </Text>
                      <span style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                        <Text variant="subheading">{v.monthDone}</Text>
                        <Text variant="caption" tone="muted" weight="medium">
                          {v.monthDoneUnit}
                        </Text>
                      </span>
                    </Card>
                  </div>
                </div>
              </>
            ) : null}
            {v.isArsenal ? (
              <>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px' }}>
                    <Text variant="title" as="h1" style={{ margin: '0' }}>
                      Spellbook
                    </Text>
                    <Text variant="label" tone="muted">
                      {v.arsenalCount}
                    </Text>
                  </div>
                  <Text
                    variant="body"
                    as="p"
                    tone="muted"
                    style={{ margin: '10px 0 0', maxWidth: '460px', textWrap: 'pretty' }}
                  >
                    {v.arsenalIntro}
                  </Text>
                  <span className="sr-only" role="status">
                    {v.arsenalResults}
                  </span>
                  {v.arsenalPicking ? (
                    // Stays in view down the long list, so it's always clear the Spellbook is picking for a workout.
                    // The page-coloured band behind it keeps the list from showing through above the card.
                    <div
                      style={{
                        position: 'sticky',
                        top: '0',
                        zIndex: 5,
                        margin: '4px -4px 0',
                        padding: '12px 4px 4px',
                        background: 'var(--color-canvas)',
                      }}
                    >
                      <Card
                        pad="xs"
                        elevation="overlay"
                        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px' }}
                      >
                        <Text variant="body" tone="ink" style={{ flex: '1 1 200px', minWidth: '0' }}>
                          Adding to <strong>{v.arsenalPickTitle}</strong>
                        </Text>
                        <Button type="secondary" size="sm" onClick={v.backToPickedWorkout}>
                          <ChevronLeft color="var(--color-accent-deep)" strokeWidth={2.2} size={14} />
                          Back to workout
                        </Button>
                      </Card>
                    </div>
                  ) : null}
                  {/* The "New" button sits with the toggle it follows: it makes whichever kind the list is showing. */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '18px',
                    }}
                  >
                    <SegmentedControl
                      label="Spellbook view"
                      size="sm"
                      options={[
                        { value: 'workouts', label: 'Workouts' },
                        { value: 'exercises', label: 'Exercises' },
                      ]}
                      value={v.arsenalView}
                      onChange={v.setArsenalView}
                    />
                    <Button
                      type="primary"
                      size="sm"
                      onClick={v.showArsenalWorkouts ? v.goNewWorkoutFromArsenal : v.openArsenalAdd}
                      aria-label={v.arsenalNewName}
                      aria-expanded={v.showArsenalWorkouts ? undefined : !!v.arsenalAddOpen}
                      aria-controls={!v.showArsenalWorkouts && v.arsenalAddOpen ? 'new-exercise' : undefined}
                      data-arsenal-new
                      style={{ marginLeft: 'auto' }}
                    >
                      <Plus color="var(--color-on-accent)" strokeWidth={2.2} size={16} />
                      {v.arsenalNewLabel}
                    </Button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      marginTop: '12px',
                      padding: '12px 16px',
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--elevation-hairline)',
                    }}
                  >
                    <Search color="var(--color-subtle)" size={17} />
                    <TextField
                      variant="bare"
                      value={v.arsenalQuery ?? ''}
                      onChange={v.setArsenalQuery}
                      placeholder={v.arsenalSearchPlaceholder}
                    />
                    {v.hasQuery ? (
                      <>
                        <IconButton
                          label="Clear search"
                          size="xs"
                          onClick={v.clearArsenalQuery}
                          title="Clear search"
                        >
                          <Close color="var(--color-muted)" strokeWidth={2.2} size={14} />
                        </IconButton>
                      </>
                    ) : null}
                  </div>
                  {/* The two filters side by side, where there's room for both. */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: v.equipFilterShown ? 'repeat(auto-fit,minmax(150px,1fr))' : '1fr',
                      gap: '10px',
                      marginTop: '8px',
                    }}
                  >
                    <AreaFilter v={v} />
                    {v.equipFilterShown ? <EquipmentFilter v={v} /> : null}
                  </div>
                  {v.showArsenalExercises ? (
                    <>
                      {v.noMatches ? (
                        <>
                          <Text variant="body" as="p" tone="muted" style={{ margin: '20px 0 0' }}>
                            {v.noMatchNote}
                          </Text>
                        </>
                      ) : null}
                      {v.arsenalAddOpen ? <NewExerciseCard v={v} /> : null}
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginTop: '22px' }}
                      >
                        {(v.moveGroups ?? []).map((g, i) => (
                          <Fragment key={i}>
                            <div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  alignItems: 'baseline',
                                  gap: '8px',
                                  padding: '0 2px 10px',
                                }}
                              >
                                <Text variant="eyebrow" tone="slate">
                                  {g?.label}
                                </Text>
                                <Text variant="small" tone="muted" weight="medium">
                                  {g?.count}
                                </Text>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {(g?.items ?? []).map((m, i) => (
                                  <Fragment key={i}>
                                    <ExerciseRow exercise={m} />
                                  </Fragment>
                                ))}
                              </div>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {v.showArsenalWorkouts ? (
                    <>
                      {v.noSavedWorkouts ? (
                        <Text variant="body" as="p" tone="muted" style={{ margin: '20px 0 0' }}>
                          Your Spellbook is empty. Write your first workout with New.
                        </Text>
                      ) : null}
                      {v.noWorkoutMatches ? (
                        <Text variant="body" as="p" tone="muted" style={{ margin: '20px 0 0' }}>
                          {v.noWorkoutMatchNote}
                        </Text>
                      ) : null}
                      {v.showKindFilter ? (
                        <div style={{ marginTop: '14px' }}>
                          <SegmentedControl
                            label="Show"
                            size="sm"
                            compact
                            options={[
                              { value: 'all', label: 'All' },
                              { value: 'main', label: 'Main workouts' },
                              { value: 'warmups', label: 'Warm-ups' },
                            ]}
                            value={v.workoutKind}
                            onChange={v.setWorkoutKind}
                          />
                        </div>
                      ) : null}
                      {/* Grouped like the Exercises tab: the person's own, then the built-in ones by group. */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginTop: '18px' }}>
                        {(v.workoutGroups ?? []).map((g, gi) => (
                          <div key={gi}>
                            {g?.label ? (
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  alignItems: 'baseline',
                                  gap: '8px',
                                  padding: '0 2px 10px',
                                }}
                              >
                                <Text variant="eyebrow" tone="slate" as="h2" style={{ margin: 0 }}>
                                  {g?.label}
                                </Text>
                                <Text variant="small" tone="muted" weight="medium">
                                  {g?.count}
                                </Text>
                              </div>
                            ) : null}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {(g?.items ?? []).map((w, i) => (
                                  <WorkoutRow key={i}  workout={w} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {v.isExercise && v.exercise ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', minHeight: '44px', gap: '10px' }}>
                    <BackLink label={v.backLabel} onClick={v.goBack} />
                    {v.exercise.builtin ? (
                      <span className="bar-actions" style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flex: 'none' }}>
                        <Button type="secondary" size="sm" onClick={v.exercise.copy} style={{ whiteSpace: 'nowrap' }}>
                          <Copy color="var(--color-accent-deep)" size={16} />
                          Copy
                        </Button>
                        <Button type="primary" size="sm" onClick={v.exercise.add} style={{ whiteSpace: 'nowrap' }}>
                          <Plus color="var(--color-on-accent)" size={16} />
                          Add
                        </Button>
                      </span>
                    ) : (
                      <span className="bar-actions" style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flex: 'none' }}>
                        <Button type="secondary" size="sm" onClick={v.exercise.edit} style={{ whiteSpace: 'nowrap' }}>
                          <Pencil color="var(--color-accent-deep)" size={16} />
                          Edit
                        </Button>
                        <Button type="primary" size="sm" onClick={v.exercise.add} style={{ whiteSpace: 'nowrap' }}>
                          <Plus color="var(--color-on-accent)" size={16} />
                          Add
                        </Button>
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px' }}>
                    <IconTile as="span">{v.exercise.svg}</IconTile>
                    <div style={{ minWidth: 0 }}>
                      <Text variant="eyebrow" as="div" tone="slate">
                        {v.exercise.builtin ? 'BUILT-IN EXERCISE' : 'EXERCISE'}
                      </Text>
                      <Text variant="title" as="h1" style={{ margin: '3px 0 0' }}>
                        {v.exercise.name}
                      </Text>
                    </div>
                  </div>
                  <Card style={{ marginTop: '18px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px' }}>
                      <Stat size="lg" label="SETS × REPS" value={v.exercise.sets} />
                      <Stat size="lg" label="WEIGHT" value={v.exercise.weight} />
                      <Stat size="lg" label="REST" value={v.exercise.rest} />
                    </div>
                    {(v.exercise.areas ?? []).length ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '18px' }}>
                        {(v.exercise.areas ?? []).map((a, i) => (
                          <Chip key={i}>{a}</Chip>
                        ))}
                      </div>
                    ) : null}
                    {v.exercise.equipment ? (
                      <>
                        <Text variant="eyebrow" as="h2" tone="slate" style={{ margin: '16px 0 8px' }}>
                          EQUIPMENT
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {v.exercise.equipment.map((a, i) => (
                            <Chip key={i}>{a}</Chip>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </Card>
                  {v.exercise.builtin ? (
                    <Text variant="body" as="p" tone="muted" style={{ margin: '18px 0 0' }}>
                      Built-in exercises can&apos;t be changed. Add it to any workout as it is, or copy it to make
                      your own version to edit.
                    </Text>
                  ) : (
                    <>
                      <Text variant="eyebrow" tone="slate" as="div" style={{ margin: '24px 0 10px' }}>
                        USED IN
                      </Text>
                      {(v.exercise.usedIn ?? []).length ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {(v.exercise.usedIn ?? []).map((w, i) => (
                            <Chip key={i} onClick={w?.open}>
                              {w?.name}
                            </Chip>
                          ))}
                        </div>
                      ) : (
                        <Text variant="body" as="p" tone="muted" style={{ margin: '0' }}>
                          Not part of a saved workout yet.
                        </Text>
                      )}
                      {v.exercise.usedInNote ? (
                        <Text variant="caption" as="p" tone="muted" style={{ margin: '10px 0 0' }}>
                          {v.exercise.usedInNote}
                        </Text>
                      ) : null}
                    </>
                  )}
                  {v.exercise.canDelete ? (
                    <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid var(--color-line)' }}>
                      <Button type="danger" ghost size="md" onClick={v.exercise.remove}>
                        Delete exercise
                      </Button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
            {(v.isTemplate && !v.template) || (v.isExercise && !v.exercise) ? (
              <div>
                <BackLink label="Spellbook" onClick={v.goArsenal} />
                <Text variant="title" as="h1" style={{ margin: '14px 0 0' }}>
                  Not in your Spellbook
                </Text>
                <Text variant="body" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
                  {v.isTemplate
                    ? 'This workout has been deleted, or the link is to someone else’s Spellbook.'
                    : 'This exercise has been deleted, or the link is to someone else’s Spellbook.'}
                </Text>
                <Button type="primary" size="md" onClick={v.goArsenal} style={{ marginTop: '18px' }}>
                  Go to your Spellbook
                </Button>
              </div>
            ) : null}
            {v.isTemplate && v.template ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', minHeight: '44px', gap: '10px' }}>
                    <BackLink label={v.backLabel} onClick={v.goBack} />
                    {v.template.builtin ? (
                      <Button
                        type="secondary"
                        size="sm"
                        onClick={v.template.copy}
                        style={{ marginLeft: 'auto' }}
                      >
                        <Copy color="var(--color-accent-deep)" size={16} />
                        {v.template.copyLabel}
                      </Button>
                    ) : (
                      <Button
                        type="secondary"
                        size="sm"
                        onClick={v.template.edit}
                        style={{ marginLeft: 'auto' }}
                      >
                        <Pencil color="var(--color-accent-deep)" size={16} />
                        Edit
                      </Button>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px' }}>
                    <IconTile as="span">{v.template.svg}</IconTile>
                    <div style={{ minWidth: 0 }}>
                      <Text variant="eyebrow" as="div" tone="slate">
                        {v.template.eyebrow}
                      </Text>
                      <Text variant="title" as="h1" style={{ margin: '3px 0 0' }}>
                        {v.template.name}
                      </Text>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '18px' }}>
                    <Chip icon={<Clock color="var(--color-muted)" size={15} />}>{v.template.time}</Chip>
                    {(v.template.areas ?? []).map((a, i) => (
                      <Chip key={i}>{a}</Chip>
                    ))}
                  </div>
                  <NeedsLine text={v.template.needs} />
                  {v.template.notes ? (
                    <Card pad="sm" style={{ marginTop: '14px' }}>
                      <Text variant="micro" tone="subtle" as="div">
                        NOTES
                      </Text>
                      <Text variant="body" tone="ink" as="p" style={{ margin: '6px 0 0', whiteSpace: 'pre-wrap' }}>
                        {v.template.notes}
                      </Text>
                    </Card>
                  ) : null}
                  <Button type="primary" size="lg" fullWidth onClick={v.template.schedule} style={{ marginTop: '18px' }}>
                    <Calendar color="var(--color-on-accent)" size={17} />
                    Add to calendar
                  </Button>
                  {v.scheduleCalendar?.done ? (
                    <Card pad="sm" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }} role="status">
                      <Check color="var(--color-accent-deep)" strokeWidth={2.6} size={16} />
                      <Text variant="label" tone="ink" style={{ flex: '1 1 180px', minWidth: 0 }}>
                        {v.scheduleCalendar.done}
                      </Text>
                      <Button type="neutral" ghost size="sm" onClick={v.scheduleCalendar.viewDay}>
                        View day
                      </Button>
                    </Card>
                  ) : null}
                  <ScheduleDialog v={v} />
                  {v.template.isRide ? (
                    <Card style={{ marginTop: '18px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px' }}>
                        {(v.template.rideStats ?? []).map((r, i) => (
                          <Stat key={i} size="lg" label={r?.label} value={r?.value} />
                        ))}
                      </div>
                    </Card>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '18px' }}>
                      {(v.template.exercises ?? []).map((e, i) => (
                        <Card key={i} pad="sm" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <IconSquare>{e?.svg}</IconSquare>
                          <span style={{ flex: '1', minWidth: '0' }}>
                            <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                              {e?.name}
                            </Text>
                            <Text
                              variant="caption"
                              tone="muted"
                              style={{ display: 'block', marginTop: '3px' }}
                            >
                              {e?.detail}
                            </Text>
                          </span>
                        </Card>
                      ))}
                      {(v.template.exercises ?? []).length === 0 ? (
                        <Text variant="body" as="p" tone="muted" style={{ margin: '4px 0 0' }}>
                          No exercises in this workout yet.
                        </Text>
                      ) : null}
                    </div>
                  )}
                  {v.template.builtin ? (
                    <Text variant="body" as="p" tone="slate" style={{ margin: '28px 0 0', maxWidth: '520px' }}>
                      {v.template.builtinNote}
                    </Text>
                  ) : (
                    <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid var(--color-line)' }}>
                      <Button type="danger" ghost size="md" onClick={v.template.remove}>
                        Delete workout
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : null}
            {v.isExerciseEdit && v.exerciseEdit ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', minHeight: '44px' }}>
                    <BackLink label={v.backLabel} onClick={v.exerciseEdit.cancel} />
                  </div>
                  {/* The same as the workout editor: Back on its own row, then what's being edited. */}
                  <Text variant="eyebrow" as="h1" tone="slate" style={{ margin: '18px 0 0' }}>
                    {v.exerciseEdit.heading}
                  </Text>
                  <ExerciseEditForm v={v} />
                </div>
              </>
            ) : null}
            {v.isNewEntry ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', minHeight: '44px', gap: '10px' }}>
                    <BackLink label={v.backLabel} onClick={v.goBack} />
                  </div>
                  <Text variant="title" as="h1" style={{ margin: '24px 0 0' }}>
                    Which session are you writing about?
                  </Text>
                  <Text
                    variant="body"
                    as="p"
                    tone="muted"
                    style={{ margin: '10px 0 0', maxWidth: '460px', textWrap: 'pretty' }}
                  >
                    Pick a session from the last 60 days. Ones you&apos;ve already written about aren&apos;t listed.
                  </Text>
                  <div style={{ marginTop: '26px', maxWidth: '620px' }}>
                    {/* One card per group (this week, last week, earlier), its sessions as rows. Back leaves. */}
                    {(v.unloggedGroups ?? []).map((g) => (
                      <div key={g.label} style={{ marginBottom: '16px' }}>
                        <Text variant="eyebrow" as="h2" tone="slate" style={{ margin: '0 4px 8px' }}>
                          {g.label}
                        </Text>
                        <Card pad="none" style={{ overflow: 'hidden' }}>
                          {g.items.map((u, i) => (
                            <button
                              key={i}
                              onClick={u.pick}
                              className="hv7"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                width: '100%',
                                minHeight: '60px',
                                padding: '12px 18px',
                                border: 'none',
                                borderTop: i ? '1px solid var(--color-line)' : 'none',
                                background: 'none',
                                fontFamily: 'inherit',
                                textAlign: 'left',
                                cursor: 'pointer',
                              }}
                            >
                              <Text variant="eyebrow" as="span" tone="slate" style={{ flex: 'none', width: '52px', lineHeight: 1.35 }}>
                                {u.dayTop}
                                <br />
                                {u.dayBottom}
                              </Text>
                              <span style={{ flex: '1', minWidth: '0' }}>
                                {u.warmup ? <WarmupTag /> : null}
                                <Text variant="itemTitle" as="span" tone="ink" style={{ display: 'block' }}>
                                  {u.name}
                                </Text>
                                <Text variant="caption" as="span" tone="muted" style={{ display: 'block', marginTop: '1px' }}>
                                  {u.meta}
                                </Text>
                              </span>
                              <Badge tone={u.statusTone}>{u.status}</Badge>
                            </button>
                          ))}
                        </Card>
                      </div>
                    ))}
                    {v.noUnlogged ? (
                      <>
                        <Text variant="body" as="p" tone="muted" style={{ margin: '16px 0 0' }}>
                          {v.noUnloggedNote}
                        </Text>
                      </>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
            {v.isDiaryList ? (
              <>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px' }}>
                    <Text variant="title" as="h1" style={{ margin: '0' }}>
                      Chronicle
                    </Text>
                    <Text variant="label" tone="muted">
                      {v.diaryCount}
                    </Text>
                    <Button type="primary" size="sm" onClick={v.openNewEntry} style={{ marginLeft: 'auto' }}>
                      New entry
                    </Button>
                  </div>
                  <Text
                    variant="body"
                    as="p"
                    tone="muted"
                    style={{ margin: '10px 0 0', maxWidth: '620px', textWrap: 'pretty' }}
                  >
                    Every session you&apos;ve written about, newest first. Open one to read or edit it.
                  </Text>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                    <span className="sr-only" role="status">
                      {v.diaryResults}
                    </span>
                    <SegmentedControl
                      label="Show entries from"
                      size="sm"
                      compact
                      wrap
                      options={[
                        { value: 'all', label: 'All' },
                        { value: 'today', label: 'Today' },
                        { value: 'week', label: 'Week' },
                        { value: 'month', label: '30 days' },
                        { value: 'range', label: 'Range' },
                      ]}
                      value={v.diaryScope}
                      onChange={v.setDiaryScope}
                      style={{ alignSelf: 'flex-start' }}
                    />
                    {v.rangeShown ? (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '9px',
                            width: '100%',
                            padding: '4px 2px',
                            borderBottom: '1.5px dashed color-mix(in srgb, var(--color-ink) 22%, transparent)',
                          }}
                        >
                          <Calendar color="var(--color-subtle)" size={16} />
                          <TextField
                            variant="bare"
                            size="sm"
                            aria-label="From date"
                            style={{ minHeight: '44px' }}
                            value={v.rangeFrom ?? ''}
                            onChange={v.setRangeFrom}
                            type="date"
                          />
                          <span
                            style={{
                              flex: 'none',
                              fontSize: 'var(--text-md)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-hairline)',
                            }}
                          >
                            →
                          </span>
                          <TextField
                            variant="bare"
                            size="sm"
                            aria-label="To date"
                            style={{ minHeight: '44px' }}
                            value={v.rangeTo ?? ''}
                            onChange={v.setRangeTo}
                            type="date"
                            min={v.rangeMin}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    {(v.diaryList ?? []).map((e, i) => (
                      <Fragment key={i}>
                        <ChronicleRow entry={e} />
                      </Fragment>
                    ))}
                  </div>
                  {v.diaryEmpty ? (
                    <>
                      <Text variant="body" as="p" tone="muted" style={{ margin: '24px 0 0' }}>
                        {v.diaryEmptyNote}
                      </Text>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {v.isDetail ? (
              <>
                <div>
                  <LeaveWorkoutDialog v={v} />
                  <FinishDialog v={v} />
                  <div style={{ display: 'flex', alignItems: 'center', minHeight: '44px', gap: '10px' }}>
                    <BackLink label={v.backLabel} onClick={v.backToDay} />
                    <Button type="secondary" size="sm" onClick={v.goEdit} style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                      <Pencil color="var(--color-accent-deep)" size={16} />
                      Edit
                    </Button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px' }}>
                    <IconTile>{v.dayIcoSvg}</IconTile>
                    <div style={{ minWidth: '0' }}>
                      <Text variant="eyebrow" as="div" tone="slate">
                        {v.eDate}
                        {v.eWarmup ? <WarmupTag inline /> : null}
                      </Text>
                      <Text variant="title" as="h1" style={{ margin: '3px 0 0' }}>
                        {v.eName}
                      </Text>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
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
                  </div>
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
            ) : null}
            {v.needsType ? (
              <>
                <div style={{ maxWidth: '560px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', minHeight: '44px' }}>
                    <BackLink label={v.backLabel} onClick={v.backToDay} />
                  </div>
                  <div style={{ marginTop: '18px' }}>
                    <Text variant="eyebrow" as="div" tone="slate">
                      NEW WORKOUT
                    </Text>
                    <Text variant="heading" as="h1" style={{ margin: '3px 0 0' }}>
                      What kind of workout?
                    </Text>
                  </div>
                  <TypeChoiceCards v={v} />
                  {v.hasSavedChoices ? <SavedChoices v={v} /> : null}
                </div>
              </>
            ) : null}
            {v.isEdit ? (
              <>
                <div style={{ position: 'relative' }}>
                  <LeaveEditorDialog v={v} />
                  <div style={{ display: 'flex', alignItems: 'center', minHeight: '44px' }}>
                    <BackLink label={v.backLabel} onClick={v.tryLeave} />
                  </div>
                  <EditorHeader v={v} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
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
                  </div>
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
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
                            {(v.targetAreaPills ?? []).map((name, i) => (
                              <Fragment key={i}>
                                <Chip size="md">{name}</Chip>
                              </Fragment>
                            ))}
                          </div>
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
                        items={v.exercises ?? []}
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
            ) : null}
            {v.isDiary ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', minHeight: '44px', gap: '10px' }}>
                    <BackLink label={v.diaryBackLabel || v.backLabel} onClick={v.diaryBack} />
                    {v.diaryReading ? (
                      <Button type="secondary" size="sm" onClick={v.editEntry} style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                        <Pencil color="var(--color-accent-deep)" size={16} />
                        Edit
                      </Button>
                    ) : null}
                  </div>
                  {v.diaryReading ? <EntryReadView v={v} /> : null}
                  {v.diaryEditing ? <DiaryEntryForm v={v} /> : null}
                </div>
              </>
            ) : null}
          </main>
        </div>
        <TabBar v={v} />
      </div>
    </>
  );
}
