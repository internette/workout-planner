// The calendar: the Day, Week and Month views and the month picker.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Card } from '@moonshot/design-system/card';
import { EmptyState } from '@moonshot/design-system/empty-state';
import { SUMMON_ON, SummonPlan } from '@/frontend/features/summon/SummonPlan';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { Button, Pressable } from '@moonshot/design-system/buttons';
import { Check, ChevronLeft, ChevronRight, Gem, Moon, Plus, Sparkle } from '@moonshot/design-system/icons';
import { vars } from '@moonshot/design-system/colors';
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
import { kindOf } from '@/frontend/components/KindTag';

/** The day's cards in groups: each program's together, in the order they come, then the ones on their own. */
function groupByProgram(cards: any[]) {
  const groups: { program: string; place: string; cards: any[] }[] = [];
  cards.forEach((c) => {
    const g = groups.find((x) => x.program === (c?.programName || ''));
    if (g) g.cards.push(c);
    else groups.push({ program: c?.programName || '', place: c?.programPlace || '', cards: [c] });
  });
  return [...groups.filter((g) => g.program), ...groups.filter((g) => !g.program)];
}

export function CalendarScreen({ v }: { v: PlannerVals }) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
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
              gap: 'var(--space-2)',
              marginTop: 'var(--space-5)',
            }}
          >
            {/* The date is part of the heading, so "Wednesday" says which one. */}
            <Text variant="title" as="h1" style={{ margin: '0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)' }}>
              {v.dayName}
              <Text variant="strong" tone="muted" as="span">
                {v.shortDate}
              </Text>
            </Text>
          </div>
          {/* No wider than a form: on a wide screen the days stay close to each other and to their arrows. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-5)', maxWidth: 'var(--layout-form-max)' }}>
            <StepButton dir="prev" unit="week" onClick={v.prevWeek} />
            <div style={{ flex: '1', display: 'flex' }}>
              {(v.days ?? []).map((d, i) => (
                <Pressable
                  key={i}
                  onClick={d?.pick}
                  aria-label={d?.aria}
                  aria-current={d?.isToday}
                  aria-pressed={!!d?.selected}
                  style={{
                    position: 'relative',
                    flex: 1,
                    minWidth: 0,
                    padding: 'var(--space-2) var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-md)',
                    background: d?.selected ? 'var(--color-pink)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: d?.selected ? 'var(--color-surface)' : 'var(--color-muted)' }}>
                    {d?.letter}
                  </span>
                  {/* A week across two months says the new one once, above its 1st. */}
                  {d?.showMon ? (
                    <span style={{ position: 'absolute', left: 0, right: 0, top: '-14px', textAlign: 'center', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--tracking-loose)', color: 'var(--color-pink-deep)' }}>
                      {d?.mon}
                    </span>
                  ) : null}
                  {/* Another month's dates are dimmer than this month's, but still readable (muted meets 4.5:1). */}
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: d?.selected ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)',
                      color: d?.selected ? 'var(--color-surface)' : d?.inMonth ? 'var(--color-ink)' : 'var(--color-muted)',
                    }}
                  >
                    {d?.num}
                  </span>
                  <StatusDot status={d?.dot} selected={!!d?.selected} />
                </Pressable>
              ))}
            </div>
            <StepButton dir="next" unit="week" onClick={v.nextWeek} />
          </div>
          {v.weekKey?.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1) var(--space-3)', marginTop: 'var(--space-2)', paddingLeft: 'var(--space-3)' }}>
              {v.weekKey.map(([status, name]) => (
                <Text key={status} variant="small" tone="muted" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <StatusDot status={status} />
                  {name}
                </Text>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
      {v.showQuest ? (
        <QuestCard v={v} />
      ) : null}
      <RestartDialog v={v} />
      {v.hasWorkout ? (
        <div style={{ marginTop: 'var(--space-4)' }}>
          {/* A program's sessions sit together under its name, with where the day falls in it; one-offs come after. */}
          {groupByProgram(v.dayCards ?? []).map((g, gi) => (
            <section key={g.program || 'own'} aria-label={g.program || undefined} style={{ marginTop: gi ? 'var(--space-5)' : 0 }}>
              {g.program ? <SectionLabel list label={g.program} note={g.place} /> : null}
              {g.cards.map((c, i) => (
                <div key={c?.key} style={{ marginTop: i ? 'var(--space-3)' : '0' }}>
                  <DayWorkoutCard card={g.program ? { ...c, programName: '' } : c} headingAs={g.program ? 'h3' : 'h2'} />
                </div>
              ))}
            </section>
          ))}
          <aside style={{ display: 'flex', marginTop: 'var(--space-4)' }}>
            <Button type="dashed" size="md" onClick={v.goNewWorkout} style={{ flex: '1' }}>
              <Plus color="var(--color-pink-deep)" size={17} />
              Add workout
            </Button>
          </aside>
        </div>
      ) : null}
      {v.firstRun ? (
        <EmptyState
          style={{ marginTop: 'calc(2 * var(--space-6))' }}
          medallion="gem"
          icon={<Gem size={40} />}
          title="The call is coming"
          description="Put your first lift or ride on the calendar, or start a ready-made program. That day gets a quest, and every exercise you clear starts your climb from First spark."
          actions={
            <>
              <Button type="primary" size="lg" glow onClick={v.goNewWorkout}>
                <Plus color="var(--color-surface)" size={16} />
                Plan your first workout
              </Button>
              <Button type="secondary" size="md" onClick={v.goPrograms}>
                Start a program
              </Button>
            </>
          }
        />
      ) : null}
      {v.isRest ? (
        <EmptyState
          style={{ marginTop: 'calc(2 * var(--space-7))' }}
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
              <Plus color="var(--color-surface)" size={16} />
              Add workout
            </Button>
          }
          decoration={
            <span style={{ position: 'absolute', left: '14%', bottom: '120px', animation: 'twinkle 4s ease-in-out infinite' }}>
              <Sparkle size={13} color={vars.periwinkle} glow={5} />
            </span>
          }
        />
      ) : null}
      {v.showWeek ? (
        <div style={{ marginTop: 'var(--space-5)' }}>
          {/* On a narrow phone, Save as program drops to the line under the week rather than past the edge. */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2) var(--space-1)' }}>
            <StepButton dir="prev" unit="week" onClick={v.prevWeek} />
            <Text variant="subheading" as="h1" style={{ flex: 'none', whiteSpace: 'nowrap', margin: 0 }}>
              {v.weekLabel}
            </Text>
            <StepButton dir="next" unit="week" onClick={v.nextWeek} />
            {v.hasRows && v.saveWeek ? (
              <Button type="secondary" size="sm" onClick={v.saveWeek} disabled={v.savingWeek} style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                Save as program
              </Button>
            ) : null}
          </div>
          {v.weekRowsKey?.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1) var(--space-3)', marginTop: 'var(--space-3)' }}>
              {v.weekRowsKey.map(([status, name]) => (
                <Text key={status} variant="small" tone="muted" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <StatusDot status={status} />
                  {name}
                </Text>
              ))}
            </div>
          ) : null}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-7)', paddingBottom: v.hasRows ? 'var(--space-2)' : 0 }}
          >
            {(v.weekRows ?? []).map((w, i) => (
              <WeekRow key={i} row={w} />
            ))}
          </div>
          {v.weekAllDone ? (
            <div
              style={{
                position: 'relative',
                marginTop: 'var(--space-4)',
                padding: 'var(--space-6) var(--space-6)',
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
                <Check color="var(--color-surface)" strokeWidth={2.6} size={26} />
              </div>
              <Text variant="heading" as="h2" style={{ margin: 'var(--space-4) 0 0' }}>
                Week sealed
              </Text>
              <Text
                variant="body"
                as="p"
                tone="slate"
                style={{ margin: 'var(--space-2) auto 0', maxWidth: '320px', textWrap: 'pretty' }}
              >
                {v.weekDoneNote}
              </Text>
            </div>
          ) : null}
          {v.noRows ? (
            <EmptyState
              size="md"
              panel
              style={{ margin: 'var(--space-7) 0 0' }}
              icon={<Gem size={32} />}
              title="Your wand&apos;s still charging"
              description={v.emptyWeekNote}
              actions={
                <Button
                  type="primary"
                  size="lg"
                  onClick={v.goNewWorkout}
                >
                  <Plus color="var(--color-surface)" size={16} />
                  {'Add workout on ' + v.dayName.slice(0, 3) + ' ' + v.shortDate.split(' ')[1]}
                </Button>
              }
              decoration={
                <Twinkles />
              }
            />
          ) : null}
        </div>
      ) : null}
      {v.showMonth ? (
        <>
          <h1 className="sr-only">{v.monthName}</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            <Button type="neutral" ghost size="sm" onClick={v.prevMonth} aria-label={'Previous month, ' + v.prevMonthName}>
              <ChevronLeft color="var(--color-muted)" size={16} />
              {v.prevMonthShort}
            </Button>
            <Button type="neutral" ghost size="sm" onClick={v.nextMonth} aria-label={'Next month, ' + v.nextMonthName}>
              {v.nextMonthShort}
              <ChevronRight color="var(--color-muted)" size={16} />
            </Button>
          </div>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <MonthGrid v={v} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1) var(--space-3)', marginTop: 'var(--space-4)' }}>
              {STATUS_NAMES.map(([status, name]) => (
                <Text key={status} variant="small" tone="muted" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <StatusDot status={status} />
                  {name}
                </Text>
              ))}
            </div>
            {/* The month in two numbers, under its grid: the grid comes straight after the month's arrows. */}
            <Card
              pad="none"
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2) var(--space-4)', marginTop: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    flex: 'none',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--gradient-gem)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check color="var(--color-surface)" strokeWidth={2.6} size={12} />
                </span>
                <Text variant="subheading">{v.shownMonthDone}</Text>
                <Text variant="small" tone="muted">
                  {v.shownMonthDoneUnit}
                </Text>
              </span>
            </Card>
            {v.hasToday ? (
              <div style={{ marginTop: 'var(--space-7)' }}>
                <Text variant="micro" as="div" tone="muted">
                  {v.todayLabel}
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                  {(v.todayCards ?? []).map((c, i) => (
                    <LinkRow key={i} title={c?.name} detail={c?.meta} kind={kindOf(c)} onClick={c?.open} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
      </div>
    </div>
  );
}
