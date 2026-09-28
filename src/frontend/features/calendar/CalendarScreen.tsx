// The calendar: the Day, Week and Month views and the month picker.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Fragment } from 'react';
import { css } from '@/frontend/features/planner/viewHelpers';
import { Card } from '@moonshot/design-system/card';
import { EmptyState } from '@moonshot/design-system/empty-state';
import { SUMMON_ON, SummonPlan } from '@/frontend/features/summon/SummonPlan';
import { Text } from '@moonshot/design-system/typography';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { Button } from '@moonshot/design-system/buttons';
import { Check, ChevronLeft, ChevronRight, Gem, Moon, Plus, Sparkle } from '@moonshot/design-system/icons';
import { vars } from '@moonshot/design-system/colors';
import { IconSquare } from '@/frontend/components/IconSquare';
import { LinkRow } from '@/frontend/components/LinkRow';
import { STATUS_NAMES, StatusDot } from '@/frontend/components/StatusDot';
import { Twinkles } from '@/frontend/components/Twinkles';
import { StepButton } from '@/frontend/components/StepButton';
import { DayWorkoutCard } from '@/frontend/features/calendar/DayWorkoutCard';
import { MonthGrid } from '@/frontend/features/calendar/MonthGrid';
import { MonthPicker } from '@/frontend/features/calendar/MonthPicker';
import { QuestCard } from '@/frontend/features/calendar/QuestCard';
import { RestartDialog } from '@/frontend/features/calendar/RestartDialog';
import { WeekRow } from '@/frontend/features/calendar/WeekRow';

export function CalendarScreen({ v }: { v: PlannerVals }) {
  return (
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
          {/* Takes the room left on the row, so Today stays on it beside a long month name on a narrow phone. */}
          <span style={{ display: 'flex', alignItems: 'center', flex: '1 1 0', minWidth: 0 }}>
            <MonthPicker v={v} />
          </span>
          {/* On the right: at the end of the first row on a phone (the view switch wraps below), beside the view
              switch on a wider screen. */}
          {v.awayFromToday ? (
            <Button type="secondary" ghost size="xs" onClick={v.goToday} style={{ marginLeft: 'auto' }}>
              Today
            </Button>
          ) : null}
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
              <StepButton dir="prev" unit="week" onClick={v.prevWeek} />
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
                      <StatusDot status={d?.dot} onAccent={!!d?.selected} />
                    </button>
                  </Fragment>
                ))}
              </div>
              <StepButton dir="next" unit="week" onClick={v.nextWeek} />
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
                <StepButton dir="prev" unit="week" onClick={v.prevWeek} />
                <Text variant="itemTitle" as="h1" style={{ flex: 'none', whiteSpace: 'nowrap', margin: 0 }}>
                  {v.weekLabel}
                </Text>
                <StepButton dir="next" unit="week" onClick={v.nextWeek} />
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '26px', paddingBottom: v.hasRows ? '8px' : 0 }}
              >
                {(v.weekRows ?? []).map((w, i) => (
                  <Fragment key={i}>
                    <WeekRow row={w} />
                  </Fragment>
                ))}
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
                    <Twinkles />
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
                      <Twinkles />
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
                  <IconSquare size={40} decorative>
                    <Gem size={20} />
                  </IconSquare>
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
                {STATUS_NAMES.map(([status, name]) => (
                  <Text key={status} variant="small" tone="muted" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <StatusDot status={status} />
                    {name}
                  </Text>
                ))}
              </div>
              {v.hasToday ? (
                <>
                  <div style={{ marginTop: '30px' }}>
                    <Text variant="eyebrow" as="div" tone="muted">
                      {v.todayLabel}
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: '12px' }}>
                      {(v.todayCards ?? []).map((c, i) => (
                        <LinkRow key={i} title={c?.name} detail={c?.meta} warmup={!!c?.warmup} onClick={c?.open} />
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </>
        ) : null}
        </div>
      </div>
    </>
  );
}
