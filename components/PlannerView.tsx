// Ported from the Claude Design prototype "Workout Planner.dc.html".
// Pure template: every value it reads comes from the `v` object built in Planner.tsx.
// @ts-nocheck
import { Fragment } from 'react';
import { css, t } from './viewHelpers';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/dialog';
import { OptionCard, OptionGroup } from '@/components/ui/option-card';
import { Popover } from '@/components/ui/popover';
import { DeleteAccount } from './planner/DeleteAccount';
import { Text } from '@/components/ui/typography';
import { Chip } from '@/components/ui/chip';
import { Label, TextArea, TextField } from '@/components/ui/text-field';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Button, IconButton } from '@/components/ui/buttons';
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
} from '@/components/ui/icons';
import { colors } from '@/components/ui/colors';

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
      <Dialog
        open={!!v.ranksOpen}
        onClose={v.closeRanks}
        title="Ranks"
        aside={v.ranksAside}
        size="md"
        description="Earned with experience — 10 XP per exercise completed, 50 XP per workout finished."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '18px' }}>
          {(v.rankLadder ?? []).map((r, i) => (
            <Fragment key={i}>
              <div style={css(r?.row)}>
                <span style={css(r?.gem)}></span>
                <span style={css(r?.name)}>{r?.label}</span>
                <span style={css(r?.xp)}>{r?.req}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </Dialog>
      <Dialog
        open={!!v.signOutOpen}
        onClose={v.closeSignOut}
        title="Sign out?"
        description="Your plan, streak and chronicle stay exactly as they are. Sign back in with the same account and everything is where you left it."
        actions={
          <>
            <Button type="neutral" ghost size="md" onClick={v.closeSignOut} disabled={!!v.signingOut}>
              Stay signed in
            </Button>
            <Button type="danger" ghost size="md" onClick={v.confirmSignOut} disabled={!!v.signingOut}>
              {v.signingOut ? 'Signing out…' : 'Sign out'}
            </Button>
          </>
        }
      />
      <Dialog
        open={!!v.confirmOpen}
        onClose={v.confirmCancel}
        title={v.confirmTitle}
        description={v.confirmBody}
        actions={
          <>
            <Button type="neutral" ghost size="md" onClick={v.confirmCancel}>
              Keep it
            </Button>
            <Button type="danger" size="md" onClick={v.confirmRun}>
              {v.confirmLabel}
            </Button>
          </>
        }
      />
      <Dialog
        open={!!v.tplConfirmOpen}
        onClose={v.tplConfirmCancel}
        title={v.tplConfirmTitle}
        description={v.tplConfirmBody}
        size="md"
        actions={
          <>
            <Button type="neutral" ghost size="md" onClick={v.tplConfirmCancel}>
              Cancel
            </Button>
            <Button type="primary" size="md" onClick={v.tplConfirmSave} disabled={!!v.tplConfirmBlocked}>
              Save
            </Button>
          </>
        }
      >
        <div style={{ marginTop: '16px' }}>
          <OptionGroup label="How to save your changes">
            {(v.tplConfirmOptions ?? []).map((o) => (
              <OptionCard
                key={o.value}
                name="tplConfirmChoice"
                value={o.value}
                checked={v.tplConfirmChoice === o.value}
                onChange={v.tplConfirmSetChoice}
                title={o.title}
                description={o.description}
              >
                {o.value === 'update' && v.tplConfirmShowUpcoming ? (
                  <Checkbox switch checked={v.tplConfirmUpcoming} onChange={v.tplConfirmToggleUpcoming}>
                    {v.tplConfirmUpcomingLabel}
                  </Checkbox>
                ) : null}
                {o.value === 'new' && v.tplConfirmShowName ? (
                  <TextField
                    aria-label="New workout name"
                    value={v.tplConfirmName ?? ''}
                    onChange={v.tplConfirmSetName}
                    placeholder="Name the new workout"
                    error={v.tplConfirmNameError || undefined}
                  />
                ) : null}
              </OptionCard>
            ))}
          </OptionGroup>
        </div>
      </Dialog>
      <Dialog
        open={!!v.addToDialog?.open}
        onClose={v.addToDialog?.cancel}
        title={v.addToDialog?.title ?? ''}
        actions={
          <Button type="neutral" ghost size="md" onClick={v.addToDialog?.cancel}>
            Cancel
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
          {(v.addToDialog?.options ?? []).map((o, i) => (
            <Card
              key={i}
              as="button"
              pad="sm"
              interactive
              disabled={o?.disabled}
              onClick={o?.pick}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', width: '100%', opacity: o?.disabled ? 0.55 : 1 }}
            >
              <span style={{ flex: '1', minWidth: '0' }}>
                <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                  {o?.name}
                </Text>
                <Text variant="caption" tone="muted" style={{ display: 'block', marginTop: '2px' }}>
                  {o?.meta}
                </Text>
              </span>
              {o?.disabled ? null : <ChevronRight color="var(--color-muted)" size={16} />}
            </Card>
          ))}
          <Button type="dashed" size="md" fullWidth onClick={v.addToDialog?.pickNew}>
            <Plus color="var(--color-pink-deep)" size={16} />
            New workout
          </Button>
        </div>
      </Dialog>
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
          <nav aria-label="Main" style={css(v.sidebarStyle)}>
            <div style={css(v.navListStyle)}>
              <a href="/calendar" onClick={v.navGo(v.goDay, 'day')} aria-current={v.navCalOn} style={css(v.navCal)}>
                <Calendar color={v.navCalInk} size={18} />
                {'Calendar '}
              </a>
              <a href="/chronicle" onClick={v.navGo(v.goDiaryList, 'diaryList')} aria-current={v.navDiaryOn} style={css(v.navDiary)}>
                <Quill color={v.navDiaryInk} size={18} />
                {'Chronicle '}
              </a>
              <a href="/spellbook" onClick={v.navGo(v.goArsenal, 'arsenal')} aria-current={v.navArsenalOn} style={css(v.navArsenal)}>
                <SpellCards color={v.navArsenalInk} size={18} />
                {'Spellbook '}
              </a>
              <a href="/progress" onClick={v.navGo(v.goSummary, 'summary')} aria-current={v.navSummaryOn} style={css(v.navSummary)}>
                <BarChart color={v.navSummaryInk} strokeWidth={2.2} size={18} />
                {'Progress '}
              </a>
              <a href="/profile" onClick={v.navGo(v.goProfile, 'profile')} aria-current={v.navProfileOn} style={css(v.navProfile)}>
                <User color={v.navProfileInk} size={18} />
                {'Profile '}
              </a>
            </div>
          </nav>
          <main style={{ flex: '1 1 560px', minWidth: '0' }}>
            {v.saveError ? (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '14px',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'var(--color-danger-tint)',
                  color: 'var(--color-danger)',
                  fontSize: 'var(--text-base)',
                }}
              >
                <span style={{ flex: '1', minWidth: '0' }}>Couldn&apos;t save: {v.saveError}</span>
                <Button type="danger" ghost size="xs" onClick={v.dismissError}>
                  Dismiss
                </Button>
              </div>
            ) : null}
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
                    <Popover
                      open={!!v.monthOpen}
                      onClose={v.closeMonth}
                      width={300}
                      top={40}
                      align="center"
                      content={
                        <>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingBottom: '12px',
                              borderBottom: '1px solid rgba(35,42,69,.09)',
                            }}
                          >
                            <IconButton label="Previous year" size="md" onClick={v.prevYear}>
                              <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={17} />
                            </IconButton>
                            <Text variant="subheading">{v.yearLabel}</Text>
                            <IconButton label="Next year" size="md" onClick={v.nextYear}>
                              <ChevronRight color="var(--color-slate)" strokeWidth={2.2} size={17} />
                            </IconButton>
                          </div>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
                              gap: '4px',
                              marginTop: '10px',
                            }}
                          >
                            {(v.months ?? []).map((m, i) => (
                              <Fragment key={i}>
                                <button
                                  onClick={m?.pick}
                                  aria-label={m?.name}
                                  aria-current={m?.current ? 'date' : undefined}
                                  style={css(m?.style)}
                                >
                                  {m?.short}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              marginTop: '10px',
                              paddingTop: '10px',
                              borderTop: '1px solid rgba(35,42,69,.09)',
                            }}
                          >
                            <Button type="secondary" ghost size="sm" onClick={v.goToday}>
                              Go to today
                            </Button>
                          </div>
                        </>
                      }
                    >
                      <button
                        onClick={v.toggleMonth}
                        aria-expanded={!!v.monthOpen}
                        aria-haspopup="true"
                        style={css(v.monthBtn)}
                        className="hv1"
                      >
                        <Text variant="heading" tone="ink">
                          {v.monthName}
                        </Text>
                        <ChevronDown color="var(--color-muted)" strokeWidth={2.2} size={17} />
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            flex: 'none',
                            marginLeft: '9px',
                            pointerEvents: 'none',
                          }}
                        >
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-9px)' }}>
                            <Sparkle
                              size={11}
                              color={colors.pink}
                              glow={0.45}
                              glowBlur={3}
                              style={{ animation: 'twinkle 3.4s ease-in-out 0s infinite' }}
                            />
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(3px)' }}>
                            <Sparkle
                              size={8}
                              color={colors.periwinkle}
                              glow={0.45}
                              glowBlur={3}
                              style={{ animation: 'twinkle 4.6s ease-in-out .4s infinite' }}
                            />
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-4px)' }}>
                            <Sparkle
                              size={9}
                              color={colors.teal}
                              glow={0.45}
                              glowBlur={3}
                              style={{ animation: 'twinkle 5.4s ease-in-out .15s infinite' }}
                            />
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(7px)' }}>
                            <Sparkle
                              size={6}
                              color={colors.pink}
                              glow={0.4}
                              glowBlur={3}
                              style={{ animation: 'twinkle 6s ease-in-out .9s infinite' }}
                            />
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-7px)' }}>
                            <Sparkle
                              size={7}
                              color={colors.periwinkle}
                              glow={0.42}
                              glowBlur={3}
                              style={{ animation: 'twinkle 4.2s ease-in-out 1.1s infinite' }}
                            />
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(1px)' }}>
                            <Sparkle
                              size={5}
                              color={colors.teal}
                              glow={0.4}
                              glowBlur={3}
                              style={{ animation: 'twinkle 5.2s ease-in-out 1.3s infinite' }}
                            />
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-2px)' }}>
                            <Sparkle
                              size={6}
                              color={colors.pink}
                              glow={0.38}
                              glowBlur={3}
                              style={{ animation: 'twinkle 6.6s ease-in-out 1.7s infinite' }}
                            />
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(5px)' }}>
                            <Sparkle
                              size={4}
                              color={colors.periwinkle}
                              glow={0.36}
                              glowBlur={3}
                              style={{ animation: 'twinkle 4.8s ease-in-out 2s infinite' }}
                            />
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-5px)' }}>
                            <Sparkle
                              size={3}
                              color={colors.teal}
                              glow={0.34}
                              glowBlur={3}
                              style={{ animation: 'twinkle 5.8s ease-in-out 2.4s infinite' }}
                            />
                          </span>
                        </span>
                      </button>
                    </Popover>
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
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '14px',
                          marginTop: '22px',
                          padding: '18px 20px',
                          borderRadius: '20px',
                          background:
                            'var(--gradient-gem-tint)',
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            right: '16%',
                            top: '12px',
                            animation: 'twinkle 4.6s ease-in-out infinite',
                          }}
                        >
                          <Sparkle size={10} color={colors.teal} glow={0.55} />
                        </span>
                        <span style={css(v.questIconWrap)}>
                          {v.questDone ? (
                            <>
                              <Check color="var(--color-white)" strokeWidth={2.6} size={19} />
                            </>
                          ) : null}
                          {v.questOpen ? (
                            <>
                              <Sparkle size={19} color={colors.pink} />
                            </>
                          ) : null}
                        </span>
                        <div style={{ flex: '1 1 200px', minWidth: '0' }}>
                          <Text variant="micro" as="div" tone="accent">
                            {v.questEyebrow}
                          </Text>
                          <div style={css(v.questTitleStyle)}>{v.questTitle}</div>
                          <Text
                            variant="caption"
                            as="div"
                            style={{
                              color: 'var(--color-slate-deep)',
                              lineHeight: 'var(--leading-snug)',
                              marginTop: '3px',
                              textWrap: 'pretty',
                            }}
                          >
                            {v.questNote}
                          </Text>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <Dialog
                    open={!!v.restartPromptOpen}
                    onClose={v.cancelRestart}
                    title="Restart this workout?"
                    description={v.restartPromptBody}
                    actions={
                      <>
                        <Button type="neutral" ghost size="md" onClick={v.cancelRestart}>
                          Keep my progress
                        </Button>
                        <Button type="danger" size="md" onClick={v.confirmRestart}>
                          Restart
                        </Button>
                      </>
                    }
                  />
                  {v.hasWorkout ? (
                    <>
                      <div style={{ marginTop: '14px' }}>
                        {(v.dayCards ?? []).map((c, i) => (
                          <Fragment key={c?.key}>
                            <div style={{ marginTop: i ? '12px' : '0' }}>
                              <Card pad="lg">
                                  <div
                                    style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}
                                  >
                                    <div
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        flex: 'none',
                                        borderRadius: '13px',
                                        background: 'var(--color-pink-tint)',
                                        border: '2px solid var(--color-white)',
                                        boxShadow: '0 2px 6px rgba(213,49,129,.28),0 0 0 1px rgba(35,42,69,.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      {c?.icoSvg}
                                    </div>
                                    <div style={{ minWidth: '0' }}>
                                      <Text variant="heading" as="h2" style={{ margin: '0' }}>
                                        <button
                                          onClick={c?.open}
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '7px',
                                            margin: '-6px -10px',
                                            padding: '6px 10px',
                                            minHeight: '36px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            background: 'none',
                                            font: 'inherit',
                                            color: 'inherit',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                          }}
                                          className="hv3 hit"
                                        >
                                          {t(c?.name)}
                                          <ChevronRight color="var(--color-muted)" size={17} />
                                        </button>
                                      </Text>
                                      <Text variant="label" as="p" tone="muted" style={{ margin: '4px 0 0' }}>
                                        {c?.meta}
                                      </Text>
                                    </div>
                                  </div>
                                  {c?.isLift ? (
                                    <>
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '12px',
                                          marginTop: '20px',
                                        }}
                                      >
                                        <div
                                          style={{
                                            flex: '1',
                                            height: '8px',
                                            borderRadius: '5px',
                                            background: 'var(--color-pink-tint)',
                                            overflow: 'hidden',
                                          }}
                                        >
                                          <div style={css(c?.progBar)}></div>
                                        </div>
                                        <span
                                          style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: 'var(--text-md)',
                                            fontWeight: 'var(--font-weight-bold)',
                                            color: 'var(--color-ink)',
                                            flex: 'none',
                                          }}
                                        >
                                          {c?.progLabel}
                                        </span>
                                      </div>
                                    </>
                                  ) : null}
                                  {c?.isRide ? (
                                    <>
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                          gap: '26px',
                                          marginTop: '20px',
                                          paddingTop: '18px',
                                          borderTop: '1px solid rgba(35,42,69,.07)',
                                        }}
                                      >
                                        {(c?.rideStats ?? []).map((r, i) => (
                                          <Fragment key={i}>
                                            <div>
                                              <Text variant="micro" as="div" tone="subtle">
                                                {r?.label}
                                              </Text>
                                              <Text
                                                variant="cardTitle"
                                                as="div"
                                                tone="ink"
                                                style={{ marginTop: '4px' }}
                                              >
                                                {r?.value}
                                              </Text>
                                              {r?.note ? (
                                                <Text variant="caption" as="div" tone="muted" style={{ marginTop: '2px' }}>
                                                  {r.note}
                                                </Text>
                                              ) : null}
                                            </div>
                                          </Fragment>
                                        ))}
                                      </div>
                                    </>
                                  ) : null}
                                  {c?.isLift ? (
                                    <>
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '2px',
                                          marginTop: '16px',
                                        }}
                                      >
                                        {(c?.preview ?? []).map((x, i) => (
                                          <Fragment key={i}>
                                            <div
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '11px',
                                                padding: '9px 0',
                                                borderBottom: '1px solid rgba(35,42,69,.055)',
                                              }}
                                            >
                                              {x?.isH ? (
                                                <>
                                                  <Dumbbell color="var(--color-pink)" size={20} />
                                                </>
                                              ) : null}
                                              {x?.isV ? (
                                                <>
                                                  <Dumbbell
                                                    color="var(--color-pink)"
                                                    size={17}
                                                    style={{ transform: 'rotate(90deg)' }}
                                                  />
                                                </>
                                              ) : null}
                                              {x?.isD ? (
                                                <>
                                                  <DumbbellSmall color="var(--color-pink)" size={20} />
                                                </>
                                              ) : null}
                                              <span style={css(x?.textStyle)}>{x?.text}</span>
                                            </div>
                                          </Fragment>
                                        ))}
                                      </div>
                                    </>
                                  ) : null}
                                  {c?.hasMore ? (
                                    <>
                                      <button
                                        aria-expanded={!!c?.moreOpen}
                                        onClick={c?.toggleMore}
                                        style={{
                                          margin: '10px 0 0 -12px',
                                          minHeight: '44px',
                                          border: 'none',
                                          borderRadius: '12px',
                                          background: 'none',
                                          padding: '0 12px',
                                          color: 'var(--color-muted)',
                                          fontSize: 'var(--text-base)',
                                          fontWeight: 'var(--font-weight-medium)',
                                          cursor: 'pointer',
                                        }}
                                        className="hv1"
                                      >
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                          {t(c?.moreLabel)}
                                          <ChevronDown
                                            color="var(--color-muted)"
                                            strokeWidth={2.2}
                                            style={css(c?.moreCaret)}
                                          />
                                        </span>
                                      </button>
                                    </>
                                  ) : null}
                                  {c?.ctaTwoButtons ? (
                                    <>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                                        <Button
                                          type="secondary"
                                          size="lg"
                                          style={{ flex: '1 1 120px', minWidth: '0' }}
                                          onClick={c?.restart}
                                        >
                                          Restart workout
                                        </Button>
                                        <Button
                                          type="primary"
                                          size="lg"
                                          style={{ flex: '1 1 120px', minWidth: '0' }}
                                          onClick={c?.continue}
                                        >
                                          Continue workout
                                        </Button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        type="primary"
                                        size="lg"
                                        fullWidth
                                        onClick={c?.cta}
                                        style={{ marginTop: '20px' }}
                                      >
                                        {c?.ctaLabel}
                                      </Button>
                                    </>
                                  )}
                                </Card>
                            </div>
                          </Fragment>
                        ))}
                        <aside style={{ display: 'flex', marginTop: '14px' }}>
                          <Button type="dashed" size="md" onClick={v.goNewWorkout} style={{ flex: '1' }}>
                            <Plus color="var(--color-pink-deep)" size={17} />
                            Add workout
                          </Button>
                        </aside>
                      </div>
                    </>
                  ) : null}
                  {v.firstRun ? (
                    <div style={{ position: 'relative', marginTop: '48px', padding: '0 20px 80px', textAlign: 'center' }}>
                      <div
                        style={{
                          width: '78px',
                          height: '78px',
                          margin: '0 auto',
                          borderRadius: '50%',
                          background: 'var(--gradient-gem-tint)',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Gem size={40} />
                      </div>
                      <Text variant="title" as="h2" style={{ margin: '22px 0 0' }}>
                        The call is coming
                      </Text>
                      <p
                        style={{
                          margin: '10px auto 0',
                          maxWidth: '340px',
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-weight-medium)',
                          lineHeight: 'var(--leading-relaxed)',
                          color: 'var(--color-muted)',
                          textWrap: 'pretty',
                        }}
                      >
                        Put your first lift or ride on the calendar. That day gets a quest, and every exercise you
                        clear starts your climb from First spark.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '24px' }}>
                        <Button type="primary" size="lg" glow onClick={v.goNewWorkout}>
                          <Plus color="var(--color-white)" size={16} />
                          Plan your first workout
                        </Button>
                        <Button type="neutral" ghost size="md" onClick={v.goArsenal}>
                          Browse the Spellbook
                        </Button>
                      </div>
                    </div>
                  ) : null}
                  {v.isRest ? (
                    <>
                      <div
                        style={{
                          position: 'relative',
                          marginTop: '56px',
                          padding: '0 20px 80px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            position: 'relative',
                            width: '78px',
                            height: '78px',
                            margin: '0 auto',
                            borderRadius: '50%',
                            background: 'var(--color-white)',
                            boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Moon color="var(--color-periwinkle)" size={40} />
                          <span style={{ position: 'absolute', top: '21px', right: '20px', display: 'flex' }}>
                            <Sparkle size={9.5} outline color={colors.gold} strokeWidth={2.2} />
                          </span>
                        </div>
                        <Text variant="title" as="h2" style={{ margin: '22px 0 0' }}>
                          The city is quiet
                        </Text>
                        <p
                          style={{
                            margin: '10px auto 0',
                            maxWidth: '330px',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-weight-medium)',
                            lineHeight: 'var(--leading-relaxed)',
                            color: 'var(--color-muted)',
                            textWrap: 'pretty',
                          }}
                        >
                          No quest {v.restDayPhrase}. Rest is how the power comes back — or add a workout if
                          you&apos;re feeling it.
                        </p>
                        <Button
                          type="primary"
                          size="lg"
                          glow
                          onClick={v.goNewWorkout}
                          style={{ marginTop: '24px' }}
                        >
                          <Plus color="var(--color-white)" size={16} />
                          Add workout
                        </Button>
                        <span
                          style={{
                            position: 'absolute',
                            left: '14%',
                            bottom: '120px',
                            animation: 'twinkle 4s ease-in-out infinite',
                          }}
                        >
                          <Sparkle size={13} color={colors.periwinkle} glow={0.5} />
                        </span>
                      </div>
                    </>
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
                              <div>
                                <div style={css(w?.eyebrow)}>{w?.label}</div>
                                {w?.isRest ? (
                                  <>
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '15px 20px',
                                        borderRadius: '20px',
                                        background: 'rgba(255,255,255,.5)',
                                      }}
                                    >
                                      <span
                                        style={{
                                          width: '14px',
                                          height: '2px',
                                          flex: 'none',
                                          borderRadius: '1px',
                                          background: 'var(--color-divider)',
                                        }}
                                      ></span>
                                      <Text variant="label" tone="muted">
                                        Rest day
                                      </Text>
                                    </div>
                                  </>
                                ) : null}
                                {w?.hasRow ? (
                                  <>
                                    <Card
                                      as="button"
                                      pad="sm"
                                      interactive
                                      onClick={w?.open}
                                      aria-label={w?.aria}
                                      style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '13px',
                                      }}
                                    >
                                      <span
                                        aria-hidden="true"
                                        style={{
                                          width: '36px',
                                          height: '36px',
                                          flex: 'none',
                                          borderRadius: '12px',
                                          background: 'var(--color-pink-tint)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        {w?.icoSvg}
                                      </span>
                                      <div style={{ minWidth: '0', flex: '1' }}>
                                        <Text variant="itemTitle" as="div">
                                          {w?.name}
                                        </Text>
                                        <Text
                                          variant="caption"
                                          as="div"
                                          tone="muted"
                                          style={{ marginTop: '3px' }}
                                        >
                                          {w?.meta}
                                        </Text>
                                      </div>
                                      <span style={css(w?.stateDot)}></span>
                                    </Card>
                                  </>
                                ) : null}
                              </div>
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
                                borderRadius: '22px',
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
                                <Sparkle size={12} color={colors.periwinkle} glow={0.5} />
                              </span>
                              <span
                                style={{
                                  position: 'absolute',
                                  right: '15%',
                                  top: '34px',
                                  animation: 'twinkle 4.6s ease-in-out infinite',
                                }}
                              >
                                <Sparkle size={10} color={colors.teal} glow={0.55} />
                              </span>
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '24%',
                                  bottom: '18px',
                                  animation: 'twinkle 6s ease-in-out infinite',
                                }}
                              >
                                <Sparkle size={9} color={colors.coral} glow={0.55} />
                              </span>
                              <div
                                style={{
                                  width: '56px',
                                  height: '56px',
                                  margin: '0 auto',
                                  borderRadius: '50%',
                                  background:
                                    'var(--gradient-gem)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Check color="var(--color-white)" strokeWidth={2.6} size={26} />
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
                          <>
                            <div
                              style={{
                                position: 'relative',
                                margin: '34px 0 0',
                                padding: '34px 24px 30px',
                                borderRadius: '24px',
                                background:
                                  'var(--gradient-gem-tint)',
                                textAlign: 'center',
                                overflow: 'hidden',
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '11%',
                                  top: '18px',
                                  animation: 'twinkle 3.4s ease-in-out infinite',
                                }}
                              >
                                <Sparkle size={13} color={colors.periwinkle} glow={0.5} />
                              </span>
                              <span
                                style={{
                                  position: 'absolute',
                                  right: '13%',
                                  top: '40px',
                                  animation: 'twinkle 4.6s ease-in-out infinite',
                                }}
                              >
                                <Sparkle size={10} color={colors.teal} glow={0.55} />
                              </span>
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '22%',
                                  bottom: '22px',
                                  animation: 'twinkle 6s ease-in-out infinite',
                                }}
                              >
                                <Sparkle size={10} color={colors.coral} glow={0.55} />
                              </span>
                              <div
                                style={{
                                  width: '66px',
                                  height: '66px',
                                  margin: '0 auto',
                                  borderRadius: '50%',
                                  background: 'var(--color-white)',
                                  boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Gem size={32} />
                              </div>
                              <Text variant="subheading" as="h3" style={{ margin: '20px 0 0' }}>
                                Your wand&apos;s still charging
                              </Text>
                              <Text
                                variant="body"
                                as="p"
                                tone="slate"
                                style={{ margin: '10px auto 0', maxWidth: '340px', textWrap: 'pretty' }}
                              >
                                {v.emptyWeekNote}
                              </Text>
                              <Button
                                type="primary"
                                size="lg"
                                onClick={v.goNewWorkout}
                                style={{ marginTop: '22px' }}
                              >
                                <Plus color="var(--color-white)" size={16} />
                                Add workout
                              </Button>
                            </div>
                          </>
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
                            gridTemplateColumns: '1fr 1fr',
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
                                borderRadius: '13px',
                                background: 'var(--color-pink-tint)',
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
                                borderRadius: '50%',
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
                                  borderRadius: '50%',
                                  background: 'var(--color-white)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Check color="var(--color-pink)" size={20} />
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
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
                            marginTop: '26px',
                          }}
                        >
                          {(v.dowLabels ?? []).map((l, i) => (
                            <Fragment key={i}>
                              <div
                                style={{
                                  textAlign: 'center',
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: 'var(--text-md)',
                                  fontWeight: 'var(--font-weight-semibold)',
                                  color: 'var(--color-muted)',
                                  paddingBottom: '10px',
                                }}
                              >
                                {l}
                              </div>
                            </Fragment>
                          ))}
                        </div>
                        <div style={{ position: 'relative' }}>
                          <div
                            role="group"
                            aria-label={v.monthYear + '. Use the arrow keys to move between days.'}
                            onKeyDown={v.monthKeyDown}
                            style={{
                              position: 'relative',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
                              gap: '4px',
                            }}
                          >
                            {(v.monthCells ?? []).map((c, i) =>
                              c?.blank ? (
                                <div key={i} aria-hidden="true" style={css(c?.wrap)}></div>
                              ) : (
                                <button
                                  key={i}
                                  onClick={c?.pick}
                                  tabIndex={c?.tabStop}
                                  data-month-day={c?.day}
                                  aria-label={c?.aria}
                                  aria-current={c?.isToday}
                                  aria-pressed={c?.selected}
                                  style={css(c?.wrap)}
                                >
                                  <span style={css(c?.num)}>{c?.label}</span>
                                  <span style={css(c?.dot)}></span>
                                </button>
                              ),
                            )}
                          </div>
                        </div>
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
                                borderRadius: '50%',
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
                                borderRadius: '50%',
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
                                borderRadius: '50%',
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
                                borderRadius: '50%',
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
                    <Sparkle size={13} color={colors.periwinkle} glow={0.5} />
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      right: '14%',
                      top: '70px',
                      animation: 'twinkle 4.6s ease-in-out infinite',
                    }}
                  >
                    <Sparkle size={11} color={colors.teal} glow={0.55} />
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '20%',
                      bottom: '70px',
                      animation: 'twinkle 6s ease-in-out infinite',
                    }}
                  >
                    <Sparkle size={10} color={colors.coral} glow={0.55} />
                  </span>
                  <div
                    style={{
                      width: '96px',
                      height: '96px',
                      margin: '0 auto',
                      borderRadius: '50%',
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
                        borderRadius: '50%',
                        background: 'var(--color-white)',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check
                        color="var(--color-pink)"
                        strokeWidth={2.4}
                        size={30}
                        style={{ strokeDasharray: '30', animation: 'draw .5s .2s ease-out both' }}
                      />
                    </div>
                  </div>
                  <Text variant="title" as="h1" style={{ margin: '22px 0 0' }}>
                    Written into your chronicle
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
                      onClick={v.goDiaryList}
                      style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                    >
                      <span style={{ flex: '1', minWidth: '0' }}>
                        <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                          Read your chronicle
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
                  <Card
                    pad="lg"
                    style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '18px' }}
                  >
                    {/* The gem ring: the brand gradient, a white gap, then the photo (or the initial). The badge
                        carries the gem of the current rank. */}
                    <div
                      style={{
                        position: 'relative',
                        width: '86px',
                        height: '86px',
                        flex: 'none',
                        borderRadius: '50%',
                        background: 'var(--gradient-gem)',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          inset: '3px',
                          borderRadius: '50%',
                          background: 'var(--color-white)',
                        }}
                      ></span>
                      <div
                        style={{
                          position: 'absolute',
                          inset: '6px',
                          borderRadius: '50%',
                          background: 'var(--gradient-gem)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text variant="display" tone="inverse">
                          {v.profileInitial}
                        </Text>
                        {v.profilePicture ? (
                          // Covers the initial. If the photo will not load it hides itself and the initial shows.
                          // No referrer, because Google's image host refuses some. A plain <img>, since next/image would
                          // need this address listed in the config and cannot hide itself on error.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={v.profilePicture}
                            alt=""
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            style={{
                              position: 'absolute',
                              inset: '0',
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : null}
                      </div>
                      <span style={{ position: 'absolute', top: '0', right: '-3px' }}>
                        <Sparkle size={16} color={colors.goldLight} glow={0.6} />
                      </span>
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          right: '-3px',
                          bottom: '-3px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'var(--color-white)',
                          boxShadow: 'var(--elevation-raised)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            width: '10px',
                            height: '14px',
                            clipPath: 'polygon(50% 0,100% 35%,50% 100%,0 35%)',
                            background: v.avatarGem,
                          }}
                        ></span>
                      </span>
                    </div>
                    <div style={{ minWidth: '0', flex: '1 1 200px' }}>
                      <Text variant="title" as="h1" style={{ margin: '0' }}>
                        {v.profileName}
                      </Text>
                      {v.profileSince ? (
                        <Text variant="body" as="p" tone="muted" style={{ margin: '5px 0 0' }}>
                          {v.profileSince}
                        </Text>
                      ) : null}
                      <button
                        onClick={v.openRanks}
                        title="See all 20 ranks"
                        aria-label={v.rankName + ' — see all 20 ranks'}
                        aria-haspopup="dialog"
                        style={css(v.rankPillBtn)}
                        className="hv6 hit"
                      >
                        <span style={css(v.rankGem)}></span>
                        {t(v.rankName)}
                        <ChevronRight strokeWidth={2.4} size={12} style={{ opacity: '.7' }} />
                      </button>
                      <Popover
                        open={!!v.xpInfoOpen}
                        onClose={v.closeXp}
                        width={280}
                        top={34}
                        pad="sm"
                        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '14px' }}
                        content={
                          <>
                            <Text variant="eyebrow" tone="slate" style={{ display: 'block' }}>
                              HOW PROGRESS WORKS
                            </Text>
                            <Text
                              variant="body"
                              tone="ink"
                              style={{ display: 'block', marginTop: '9px', textWrap: 'pretty' }}
                            >
                              Each exercise you complete earns 10 XP, and finishing a whole workout earns 50
                              XP on top. Ranks unlock at fixed XP totals.
                            </Text>
                            <span
                              style={{
                                display: 'block',
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-md)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: 'var(--color-pink-deep)',
                                marginTop: '12px',
                              }}
                            >
                              {v.xpLine}
                            </span>
                          </>
                        }
                      >
                        <div
                          style={{
                            flex: '1 1 180px',
                            maxWidth: '260px',
                            height: '8px',
                            borderRadius: '5px',
                            background: 'var(--color-mist)',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={css(v.rankBar)}></div>
                        </div>
                        <span
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-slate)',
                          }}
                        >
                          {v.rankProgress}
                        </span>
                        <IconButton
                          label="How XP works"
                          size="md"
                          circle
                          aria-expanded={!!v.xpInfoOpen}
                          onClick={v.toggleXpInfo}
                          title="How XP works"
                          style={{ margin: '-6px' }}
                        >
                          <Info color="var(--color-muted)" size={16} />
                        </IconButton>
                      </Popover>
                    </div>
                  </Card>
                  <div id="profileStats" style={{ display: 'grid', gap: '12px', marginTop: '14px' }}>
                    {(v.profileStats ?? []).map((s, i) => (
                      <Fragment key={i}>
                        <Card pad="sm">
                          <Text variant="micro" as="div" tone="muted">
                            {s?.label}
                          </Text>
                          <div
                            style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginTop: '6px' }}
                          >
                            <Text variant="heading" tone="ink">
                              {s?.value}
                            </Text>
                            <Text variant="small" tone="muted" weight="medium">
                              {s?.unit}
                            </Text>
                          </div>
                          {s?.span ? (
                            <Text variant="caption" as="div" tone="muted" style={{ marginTop: '4px' }}>
                              {s.span}
                            </Text>
                          ) : null}
                        </Card>
                      </Fragment>
                    ))}
                  </div>
                  <Card style={{ marginTop: '14px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
                      <Text variant="eyebrow" tone="slate">
                        SESSIONS PER WEEK
                      </Text>
                      <Text variant="small" tone="muted" weight="medium" style={{ marginLeft: 'auto' }}>
                        {v.chartRangeLabel}
                      </Text>
                    </div>
                    <Text variant="caption" as="p" tone="muted" style={{ margin: '8px 0 0' }}>
                      {v.chartCaption}
                    </Text>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '4px',
                        height: '132px',
                        marginTop: '14px',
                      }}
                    >
                      {(v.weeklyBars ?? []).map((b, i) => (
                        <Fragment key={i}>
                          <button
                            onClick={b?.pick}
                            aria-label={b?.aria}
                            aria-pressed={b?.on}
                            style={{
                              flex: '1',
                              minWidth: '0',
                              minHeight: '44px',
                              border: 'none',
                              background: 'none',
                              padding: '0',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer',
                            }}
                            title={b?.tip}
                          >
                            <span style={css(b?.value)}>{b?.count}</span>
                            <div style={css(b?.bar)}></div>
                            <span style={css(b?.label)}>{b?.week}</span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginTop: '18px',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(35,42,69,.07)',
                      }}
                    >
                      {(v.weekSessions ?? []).map((w, i) => (
                        <Fragment key={i}>
                          <button
                            onClick={w?.open}
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 14px',
                              border: 'none',
                              borderRadius: '14px',
                              background: 'var(--color-canvas)',
                              textAlign: 'left',
                              cursor: 'pointer',
                              width: '100%',
                            }}
                            className="hv7"
                          >
                            <Text variant="eyebrow" tone="muted" style={{ flex: 'none', width: '56px' }}>
                              {w?.day}
                            </Text>
                            <span
                              style={{
                                flex: '1 1 140px',
                                minWidth: '0',
                                fontSize: 'var(--text-base)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--color-ink)',
                              }}
                            >
                              {w?.name}
                            </span>
                            <span style={css(w?.status)}>{w?.statusLabel}</span>
                          </button>
                        </Fragment>
                      ))}
                      {v.weekEmpty ? (
                        <>
                          <Text variant="body" as="p" tone="muted" style={{ margin: '0' }}>
                            No sessions were planned that week.
                          </Text>
                        </>
                      ) : null}
                    </div>
                  </Card>
                  <Card style={{ marginTop: '14px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
                      <Text variant="eyebrow" tone="slate">
                        QUESTS CLEARED
                      </Text>
                      <Text variant="small" tone="muted" weight="medium">
                        {v.allTimeLabel}
                      </Text>
                      {v.questsHas ? (
                        <Text variant="itemTitle" tone="ink" style={{ marginLeft: 'auto' }}>
                          {v.questsClearedLabel}
                        </Text>
                      ) : null}
                    </div>
                    {v.questsNone ? (
                      <Text variant="caption" as="p" tone="muted" weight="medium" style={{ margin: '10px 0 0' }}>
                        Every day with a session gets a quest. The ones you clear gather here.
                      </Text>
                    ) : null}
                    {v.questsHas ? (
                      <div
                        style={{
                          height: '8px',
                          borderRadius: '5px',
                          background: 'var(--color-mist)',
                          marginTop: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={css(v.questsClearedBar)}></div>
                      </div>
                    ) : null}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '16px' }}>
                      {(v.questStats ?? []).map((q, i) => (
                        <Fragment key={i}>
                          <div style={css(q?.row)}>
                            <span style={css(q?.swatch)}></span>
                            <Text variant="label" tone="ink" style={{ flex: '1', minWidth: '0' }}>
                              {q?.name}
                            </Text>
                            <span
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-md)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: 'var(--color-slate)',
                                flex: 'none',
                              }}
                            >
                              {q?.count}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </Card>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
                      gap: '12px',
                      marginTop: '14px',
                    }}
                  >
                    <Card>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
                        <Text variant="eyebrow" tone="slate">
                          HOW IT FEELS
                        </Text>
                        <Text variant="small" tone="muted" weight="medium" style={{ marginLeft: 'auto' }}>
                          {v.allTimeLabel}
                        </Text>
                      </div>
                      {v.moodEmpty ? (
                        <Text variant="caption" as="p" tone="muted" weight="medium" style={{ margin: '10px 0 0' }}>
                          Write about a session in the Chronicle and your moods gather here.
                        </Text>
                      ) : null}
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '18px' }}
                      >
                        {(v.moodSplit ?? []).map((m, i) => (
                          <Fragment key={i}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={css(m?.swatch)}></span>
                              <Text variant="label" tone="ink" style={{ flex: 'none', width: '66px' }}>
                                {m?.name}
                              </Text>
                              <span
                                style={{
                                  flex: '1',
                                  height: '8px',
                                  borderRadius: '5px',
                                  background: 'var(--color-mist)',
                                  overflow: 'hidden',
                                }}
                              >
                                <span style={css(m?.bar)}></span>
                              </span>
                              <span
                                style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: 'var(--text-md)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  color: 'var(--color-slate)',
                                  flex: 'none',
                                  width: '30px',
                                  textAlign: 'right',
                                }}
                              >
                                {m?.pct}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </Card>
                    <Card>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
                        <Text variant="eyebrow" tone="slate">
                          PERSONAL BESTS
                        </Text>
                        <Text variant="small" tone="muted" weight="medium" style={{ marginLeft: 'auto' }}>
                          {v.allTimeLabel}
                        </Text>
                      </div>
                      {v.recordsEmpty ? (
                        <Text variant="caption" as="p" tone="muted" weight="medium" style={{ margin: '10px 0 0' }}>
                          Tick off an exercise with a weight, or finish a ride, and your bests show up here.
                        </Text>
                      ) : null}
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '12px' }}
                      >
                        {(v.records ?? []).map((r, i) => (
                          <Fragment key={i}>
                            <div style={css(r?.rowStyle)}>
                              <Text variant="label" tone="ink" style={{ flex: '1', minWidth: '0' }}>
                                {r?.name}
                              </Text>
                              <span
                                style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: 'var(--text-base)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  color: 'var(--color-ink)',
                                  flex: 'none',
                                }}
                              >
                                {r?.value}
                              </span>
                              <span style={css(r?.deltaStyle)}>{r?.delta}</span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </Card>
                  </div>
                  {v.canSignOut ? (
                    <Card style={{ marginTop: '14px' }}>
                      <Text variant="eyebrow" as="div" tone="slate">
                        ACCOUNT
                      </Text>
                      <div
                        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '12px' }}
                      >
                        <Text variant="body" as="p" tone="muted" style={{ flex: '1 1 180px', minWidth: '0', margin: '0' }}>
                          {v.accountProvider ? 'Signed in with ' + v.accountProvider : 'Signed in'}
                          {v.accountEmail ? (
                            <>
                              {' as '}
                              <Text variant="body" tone="ink" weight="medium" style={{ overflowWrap: 'anywhere' }}>
                                {v.accountEmail}
                              </Text>
                            </>
                          ) : null}
                        </Text>
                        <Button type="danger" ghost size="sm" onClick={v.openSignOut} style={{ flex: 'none' }}>
                          <SignOut size={16} />
                          Sign out
                        </Button>
                      </div>
                      <DeleteAccount />
                    </Card>
                  ) : null}
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
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '18px 26px',
                      marginTop: '22px',
                      padding: '22px 24px',
                      borderRadius: '22px',
                      background:
                        'var(--gradient-gem-tint)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 1 auto', minWidth: '0' }}>
                      <Gem size={30} />
                      <div style={{ minWidth: '0' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: 'var(--text-6xl)',
                              fontWeight: 'var(--font-weight-bold)',
                              lineHeight: 'var(--leading-none)',
                              color: 'var(--color-ink)',
                            }}
                          >
                            {v.streakCount}
                          </span>
                          <span
                            style={{
                              fontSize: 'var(--text-base)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-pink-deep)',
                            }}
                          >
                            {t(v.streakUnit)}
                            {' streak'}
                          </span>
                        </div>
                        <Text
                          variant="caption"
                          as="p"
                          weight="medium"
                          style={{ margin: '6px 0 0', color: 'var(--color-slate-deep)' }}
                        >
                          {v.streakNote}
                        </Text>
                      </div>
                    </div>
                    <div style={{ flex: '1 1 180px', minWidth: '0' }}>
                      <Text variant="micro" as="div" style={{ color: 'var(--color-slate-deep)' }}>
                        {v.ticksLabel}
                      </Text>
                      {v.ticksEmpty ? (
                        <Text variant="caption" as="p" weight="medium" style={{ margin: '9px 0 0', color: 'var(--color-slate-deep)' }}>
                          Finished sessions line up here.
                        </Text>
                      ) : null}
                      <div style={{ display: 'flex', gap: '6px', marginTop: '9px' }}>
                        {(v.streakTicks ?? []).map((t, i) => (
                          <Fragment key={i}>
                            <span style={{ flex: '1', minWidth: '0' }}>
                              <span style={css(t?.bar)}></span>
                              <span style={css(t?.cap)}>{t?.label}</span>
                            </span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '26px' }}>
                    <Card pad="sm" style={{ flex: '1 1 260px' }}>
                      <Text variant="eyebrow" as="div" tone="muted">
                        THIS WEEK
                      </Text>
                      {v.wkEmpty ? (
                        <Text variant="caption" as="p" tone="muted" weight="medium" style={{ margin: '6px 0 0' }}>
                          Nothing planned this week yet.
                        </Text>
                      ) : null}
                      {v.wkHas ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                            <Text variant="subheading">{v.wkDone}</Text>
                            <Text variant="caption" tone="muted" weight="medium">
                              {'of '}
                              {t(v.wkTotal)}
                              {' ' + v.wkTotalUnit}
                            </Text>
                          </div>
                          <div
                            style={{
                              height: '7px',
                              borderRadius: '4px',
                              background: 'var(--color-pink-tint)',
                              marginTop: '14px',
                              overflow: 'hidden',
                            }}
                          >
                            <div style={css(v.wkBar)}></div>
                          </div>
                        </>
                      ) : null}
                    </Card>
                    <Card pad="sm" style={{ flex: '1 1 260px' }}>
                      <Text variant="eyebrow" as="div" tone="muted">
                        NEXT CALL
                      </Text>
                      {v.hasNext ? (
                        <>
                          <p
                            style={{
                              fontFamily: 'var(--font-heading)',
                              margin: '9px 0 0',
                              fontSize: 'var(--text-lg)',
                              fontWeight: 'var(--font-weight-semibold)',
                            }}
                          >
                            {v.nextName}
                          </p>
                          <Text
                            variant="caption"
                            as="p"
                            tone="muted"
                            weight="medium"
                            style={{ margin: '3px 0 0' }}
                          >
                            {v.nextMeta}
                          </Text>
                        </>
                      ) : null}
                      {v.noNext ? (
                        <>
                          <Text
                            variant="caption"
                            as="p"
                            tone="muted"
                            weight="medium"
                            style={{ margin: '9px 0 0' }}
                          >
                            No call yet. Plan a session and it shows up here.
                          </Text>
                        </>
                      ) : null}
                    </Card>
                  </div>
                  <Card style={{ marginTop: '14px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
                      <Text variant="eyebrow" tone="slate">
                        THIS WEEK&apos;S QUESTS
                      </Text>
                      {v.wkHas ? (
                        <Text variant="small" tone="muted" weight="medium" style={{ marginLeft: 'auto' }}>
                          {v.questsDoneLabel}
                        </Text>
                      ) : null}
                    </div>
                    {v.wkEmpty ? (
                      <Text variant="caption" as="p" tone="muted" weight="medium" style={{ margin: '10px 0 0' }}>
                        No quests this week yet. Plan a session and its day gets one.
                      </Text>
                    ) : null}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '14px' }}>
                      {(v.weekQuests ?? []).map((q, i) => (
                        <Fragment key={i}>
                          <div style={css(q?.row)}>
                            <span style={css(q?.mark)}>
                              {q?.done ? (
                                <>
                                  <Check color="var(--color-white)" strokeWidth={3} size={10} />
                                </>
                              ) : null}
                            </span>
                            <Text variant="eyebrow" tone="muted" style={{ flex: 'none', width: '44px' }}>
                              {q?.day}
                            </Text>
                            <span style={css(q?.title)}>
                              {q?.name}
                              {q?.doneLine ? (
                                <Text variant="caption" tone="muted" as="span" style={{ display: 'block', marginTop: '2px', fontWeight: 'var(--font-weight-regular)' }}>
                                  {q?.doneLine}
                                </Text>
                              ) : null}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </Card>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '14px' }}>
                    <Card pad="sm" style={{ flex: '1 1 170px' }}>
                      <Text variant="eyebrow" as="div" tone="muted">
                        CHRONICLE
                      </Text>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                        <Text variant="subheading">{v.loggedCount}</Text>
                        <Text variant="caption" tone="muted" weight="medium">
                          {v.loggedUnit}
                        </Text>
                      </div>
                    </Card>
                    <Card pad="sm" style={{ flex: '1 1 170px' }}>
                      <Text variant="eyebrow" as="div" tone="muted">
                        {v.monthLabel}
                      </Text>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                        <Text variant="subheading">{v.monthDone}</Text>
                        <Text variant="caption" tone="muted" weight="medium">
                          {v.monthDoneUnit}
                        </Text>
                      </div>
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
                  {v.spellNotice ? (
                    <Card
                      pad="sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', background: 'var(--color-mist)', boxShadow: 'none' }}
                    >
                      <Check color="var(--color-slate-deep)" strokeWidth={2.4} size={16} />
                      <Text variant="body" weight="medium" style={{ flex: '1', minWidth: '0', color: 'var(--color-slate-deep)' }}>
                        {v.spellNotice}
                      </Text>
                      <IconButton label="Dismiss" size="sm" onClick={v.dismissSpellNotice}>
                        <Close color="var(--color-muted)" strokeWidth={2.2} size={14} />
                      </IconButton>
                    </Card>
                  ) : null}
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
                          <ChevronLeft color="var(--color-pink-deep)" strokeWidth={2.2} size={14} />
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
                      <Plus color="var(--color-white)" strokeWidth={2.2} size={16} />
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
                      background: 'var(--color-white)',
                      borderRadius: '15px',
                      boxShadow: '0 1px 3px rgba(35,42,69,.06)',
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
                  <Popover
                    open={!!v.areaFilterOpen}
                    onClose={v.closeAreaFilter}
                    width="anchor"
                    top={74}
                    pad="sm"
                    style={{ width: '100%', marginTop: '8px' }}
                    content={
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {(v.areaFilterOptions ?? []).map((o) => (
                            <Checkbox key={o?.name} checked={!!o?.on} onChange={o?.set}>
                              {o?.name}
                            </Checkbox>
                          ))}
                        </div>
                        {v.areaFilterActive ? (
                          <Button
                            type="neutral"
                            ghost
                            size="sm"
                            onClick={v.clearAreaFilter}
                            style={{ marginTop: '12px' }}
                          >
                            Clear filter
                          </Button>
                        ) : null}
                      </>
                    }
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={!!v.areaFilterOpen}
                      aria-label={'Filter by target area: ' + v.areaFilterLabel}
                      onClick={v.toggleAreaFilter}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        columnGap: '10px',
                        rowGap: '4px',
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--color-white)',
                        border: 'none',
                        borderRadius: '15px',
                        boxShadow: '0 1px 3px rgba(35,42,69,.06)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-ink)',
                      }}
                    >
                      <Text variant="eyebrow" as="span" tone="slate" style={{ flex: '1 1 100%' }}>
                        TARGET AREAS
                      </Text>
                      <span
                        style={{
                          flex: '1',
                          minWidth: '0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: v.areaFilterActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                        }}
                      >
                        {v.areaFilterLabel}
                      </span>
                      <ChevronDown
                        color="var(--color-muted)"
                        strokeWidth={2.2}
                        size={16}
                        style={{ flex: 'none', transition: 'transform .2s', transform: v.areaFilterOpen ? 'rotate(180deg)' : 'none' }}
                      />
                    </button>
                  </Popover>
                  {v.showArsenalExercises ? (
                    <>
                      {v.noMatches ? (
                        <>
                          <Text variant="body" as="p" tone="muted" style={{ margin: '20px 0 0' }}>
                            {v.noMatchNote}
                          </Text>
                        </>
                      ) : null}
                      {v.arsenalAddOpen ? (
                        <>
                          <Card elevation="overlay" id="new-exercise" data-arsenal-add style={{ marginTop: '18px' }}>
                            <Text variant="cardTitle" style={{ display: 'block' }}>
                              New exercise
                            </Text>
                            <Label style={{ margin: '16px 0 7px' }}>Exercise name</Label>
                            <TextField
                              aria-label="Exercise name"
                              value={v.draftName ?? ''}
                              onChange={v.setName}
                              onKeyDown={v.commitOnEnter}
                              placeholder="e.g. Bulgarian Split Squat"
                              error={v.draftNameError || undefined}
                            />
                            <div
                              style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '14px' }}
                            >
                              <TextField
                                label="Sets"
                                containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
                                value={v.draftSets ?? ''}
                                onChange={v.setSets}
                                placeholder="3"
                                inputMode="numeric"
                              />
                              <TextField
                                label="Reps"
                                containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
                                value={v.draftReps ?? ''}
                                onChange={v.setReps}
                                placeholder="10"
                                inputMode="numeric"
                              />
                              <TextField
                                label="Weight"
                                suffix="lbs"
                                containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
                                value={v.draftWeight ?? ''}
                                onChange={v.setWeight}
                                placeholder="Optional"
                                inputMode="decimal"
                              />
                              <TextField
                                label="Rest"
                                suffix="sec"
                                containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
                                value={v.draftRest ?? ''}
                                onChange={v.setRest}
                                placeholder="60"
                                inputMode="numeric"
                              />
                            </div>
                            <Label style={{ margin: '16px 0 8px' }}>Target areas</Label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {(v.draftAreas ?? []).map((t, i) => (
                                <Fragment key={i}>
                                  <Chip tone="choice" size="md" selected={t?.on} onClick={t?.toggle}>
                                    {t?.name}
                                  </Chip>
                                </Fragment>
                              ))}
                            </div>
                            <Label style={{ margin: '16px 0 8px' }}>Icon</Label>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
                                gap: '8px',
                              }}
                            >
                              {(v.iconGrid ?? []).map((g, i) => (
                                <Fragment key={i}>
                                  <button onClick={g?.pick} aria-label={g?.label} aria-pressed={!!g?.on} style={css(g?.style)}>
                                    {g?.svg}
                                  </button>
                                </Fragment>
                              ))}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                gap: '10px',
                                marginTop: '20px',
                                paddingTop: '18px',
                                borderTop: '1px solid rgba(35,42,69,.07)',
                              }}
                            >
                              <Button type="neutral" ghost size="lg" onClick={v.closeArsenalAdd}>
                                Cancel
                              </Button>
                              <Button
                                type="primary"
                                size="lg"
                                disabled={v.commitDisabled}
                                onClick={v.commitArsenal}
                              >
                                Add to Spellbook
                              </Button>
                            </div>
                          </Card>
                        </>
                      ) : null}
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
                                    <Card
                                      pad="sm"
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        width: '100%',
                                      }}
                                    >
                                      <button
                                        type="button"
                                        onClick={m?.open}
                                        aria-label={'View details for ' + m?.name}
                                        className="hv1"
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '14px',
                                          flex: '1 1 200px',
                                          minWidth: '0',
                                          margin: '-6px',
                                          padding: '6px',
                                          border: 'none',
                                          borderRadius: '12px',
                                          background: 'none',
                                          textAlign: 'left',
                                          cursor: 'pointer',
                                          fontFamily: 'inherit',
                                        }}
                                      >
                                        <span
                                          style={{
                                            width: '34px',
                                            height: '34px',
                                            flex: 'none',
                                            borderRadius: '11px',
                                            background: 'var(--color-pink-tint)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}
                                        >
                                          {m?.svg}
                                        </span>
                                        <span style={{ flex: '1', minWidth: '0' }}>
                                          <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                                            {m?.name}
                                          </Text>
                                          <Text
                                            variant="caption"
                                            tone="muted"
                                            style={{ display: 'block', marginTop: '3px' }}
                                          >
                                            {m?.detail}
                                          </Text>
                                        </span>
                                        <ChevronRight color="var(--color-muted)" strokeWidth={2.2} size={16} />
                                      </button>
                                      {m?.inWorkout ? (
                                        <Text
                                          variant="small"
                                          tone="muted"
                                          weight="medium"
                                          style={{ flex: 'none', whiteSpace: 'nowrap' }}
                                        >
                                          In workout
                                        </Text>
                                      ) : (
                                        <IconButton
                                          label={'Add ' + m?.name + ' to workout'}
                                          size="lg"
                                          onClick={m?.add}
                                          style={{ background: 'var(--color-pink-tint)' }}
                                        >
                                          <Plus color="var(--color-pink-deep)" strokeWidth={2.4} size={18} />
                                        </IconButton>
                                      )}
                                    </Card>
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
                          Your spellbook is empty. Write your first workout with New.
                        </Text>
                      ) : null}
                      {v.noWorkoutMatches ? (
                        <Text variant="body" as="p" tone="muted" style={{ margin: '20px 0 0' }}>
                          {v.noWorkoutMatchNote}
                        </Text>
                      ) : null}
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '18px' }}
                      >
                        {(v.savedWorkouts ?? []).map((w, i) => (
                          <Card
                            key={i}
                            as="button"
                            interactive
                            pad="sm"
                            onClick={w?.open}
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              gap: '14px',
                              width: '100%',
                            }}
                          >
                            <span
                              style={{
                                width: '40px',
                                height: '40px',
                                flex: 'none',
                                borderRadius: '13px',
                                background: 'var(--color-pink-tint)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {w?.svg}
                            </span>
                            <span style={{ flex: '1 1 200px', minWidth: '0' }}>
                              <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                                {w?.name}
                              </Text>
                              <Text
                                variant="caption"
                                tone="muted"
                                style={{ display: 'block', marginTop: '3px' }}
                              >
                                {w?.meta}
                              </Text>
                              {w?.exercises ? (
                                <Text
                                  variant="small"
                                  tone="subtle"
                                  style={{ display: 'block', marginTop: '3px' }}
                                >
                                  {w?.exercises}
                                </Text>
                              ) : null}
                              {(w?.areas ?? []).length ? (
                                <span
                                  style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}
                                >
                                  {(w?.areas ?? []).map((a, k) => (
                                    <Chip key={k}>{a}</Chip>
                                  ))}
                                </span>
                              ) : null}
                            </span>
                          </Card>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton label="Back" size="md" onClick={v.goBack} style={{ marginLeft: '-8px' }}>
                      <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={18} />
                    </IconButton>
                    <Text variant="eyebrow" tone="slate">
                      {v.exercise.builtin ? 'BUILT-IN' : 'EXERCISE'}
                    </Text>
                    {v.exercise.builtin ? (
                      <span style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flex: 'none' }}>
                        <Button type="secondary" size="sm" onClick={v.exercise.copy} style={{ whiteSpace: 'nowrap' }}>
                          <Copy color="var(--color-pink-deep)" size={16} />
                          Copy
                        </Button>
                        <Button type="primary" size="sm" onClick={v.exercise.add} style={{ whiteSpace: 'nowrap' }}>
                          <Plus color="var(--color-white)" size={16} />
                          Add
                        </Button>
                      </span>
                    ) : (
                      <Button
                        type="primary"
                        size="sm"
                        onClick={v.exercise.edit}
                        style={{ marginLeft: 'auto' }}
                      >
                        <Pencil color="var(--color-white)" size={16} />
                        Edit
                      </Button>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px' }}>
                    <span
                      style={{
                        width: '46px',
                        height: '46px',
                        flex: 'none',
                        borderRadius: '15px',
                        background: 'var(--color-pink-tint)',
                        border: '2px solid var(--color-white)',
                        boxShadow: '0 2px 6px rgba(213,49,129,.28),0 0 0 1px rgba(35,42,69,.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {v.exercise.svg}
                    </span>
                    <Text variant="title" as="h1" style={{ margin: '0' }}>
                      {v.exercise.name}
                    </Text>
                  </div>
                  <Card style={{ marginTop: '18px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px' }}>
                      <div>
                        <Text variant="micro" tone="subtle" as="div">
                          SETS × REPS
                        </Text>
                        <Text variant="subheading" tone="ink" as="div" style={{ marginTop: '4px' }}>
                          {v.exercise.sets}
                        </Text>
                      </div>
                      <div>
                        <Text variant="micro" tone="subtle" as="div">
                          WEIGHT
                        </Text>
                        <Text variant="subheading" tone="ink" as="div" style={{ marginTop: '4px' }}>
                          {v.exercise.weight}
                        </Text>
                      </div>
                      <div>
                        <Text variant="micro" tone="subtle" as="div">
                          REST
                        </Text>
                        <Text variant="subheading" tone="ink" as="div" style={{ marginTop: '4px' }}>
                          {v.exercise.rest}
                        </Text>
                      </div>
                    </div>
                    {(v.exercise.areas ?? []).length ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '18px' }}>
                        {(v.exercise.areas ?? []).map((a, i) => (
                          <Chip key={i}>{a}</Chip>
                        ))}
                      </div>
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
                    </>
                  )}
                  {v.exercise.canDelete ? (
                    <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid rgba(35,42,69,.07)' }}>
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
                <IconButton label="Back" size="md" onClick={v.goArsenal} style={{ marginLeft: '-8px' }}>
                  <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={18} />
                </IconButton>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton label="Back" size="md" onClick={v.goBack} style={{ marginLeft: '-8px' }}>
                      <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={18} />
                    </IconButton>
                    <Text variant="eyebrow" tone="slate">
                      SAVED WORKOUT
                    </Text>
                    <Button
                      type="secondary"
                      size="sm"
                      onClick={v.template.edit}
                      style={{ marginLeft: 'auto' }}
                    >
                      <Pencil color="var(--color-pink-deep)" size={16} />
                      Edit
                    </Button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px' }}>
                    <span
                      style={{
                        width: '46px',
                        height: '46px',
                        flex: 'none',
                        borderRadius: '15px',
                        background: 'var(--color-pink-tint)',
                        border: '2px solid var(--color-white)',
                        boxShadow: '0 2px 6px rgba(213,49,129,.28),0 0 0 1px rgba(35,42,69,.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {v.template.svg}
                    </span>
                    <Text variant="title" as="h1" style={{ margin: '0' }}>
                      {v.template.name}
                    </Text>
                  </div>
                  {v.spellNotice ? (
                    <Card
                      pad="sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', background: 'var(--color-mist)', boxShadow: 'none' }}
                    >
                      <Check color="var(--color-slate-deep)" strokeWidth={2.4} size={16} />
                      <Text variant="body" weight="medium" style={{ flex: '1', minWidth: '0', color: 'var(--color-slate-deep)' }}>
                        {v.spellNotice}
                      </Text>
                      <IconButton label="Dismiss" size="sm" onClick={v.dismissSpellNotice}>
                        <Close color="var(--color-muted)" strokeWidth={2.2} size={14} />
                      </IconButton>
                    </Card>
                  ) : null}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '18px' }}>
                    <Chip icon={<Clock color="var(--color-muted)" size={15} />}>{v.template.time}</Chip>
                    {(v.template.areas ?? []).map((a, i) => (
                      <Chip key={i}>{a}</Chip>
                    ))}
                  </div>
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
                    <Calendar color="var(--color-white)" size={17} />
                    Add to calendar
                  </Button>
                  {v.scheduleCalendar?.done ? (
                    <Card pad="sm" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }} role="status">
                      <Check color="var(--color-pink-deep)" strokeWidth={2.6} size={16} />
                      <Text variant="label" tone="ink" style={{ flex: '1 1 180px', minWidth: 0 }}>
                        {v.scheduleCalendar.done}
                      </Text>
                      <Button type="neutral" ghost size="sm" onClick={v.scheduleCalendar.viewDay}>
                        View day
                      </Button>
                    </Card>
                  ) : null}
                  <Dialog
                    open={!!v.scheduleCalendar?.open}
                    onClose={v.scheduleCalendar?.cancel}
                    title={v.scheduleCalendar?.title ?? ''}
                    actions={
                      <>
                        <Button type="neutral" ghost size="md" onClick={v.scheduleCalendar?.cancel}>
                          Cancel
                        </Button>
                        <Button type="primary" size="md" onClick={v.scheduleCalendar?.add} disabled={!v.scheduleCalendar?.canAdd}>
                          Add to calendar
                        </Button>
                      </>
                    }
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                      <TextField
                        label="Day"
                        type="date"
                        value={v.scheduleCalendar?.date ?? ''}
                        onChange={v.scheduleCalendar?.setDate}
                      />
                      <Checkbox switch checked={!!v.scheduleCalendar?.repeat} onChange={v.scheduleCalendar?.setRepeat}>
                        Repeat weekly
                      </Checkbox>
                      {v.scheduleCalendar?.showLogDone ? (
                        <Checkbox switch checked={!!v.scheduleCalendar?.logDone} onChange={v.scheduleCalendar?.setLogDone}>
                          Log it as done
                        </Checkbox>
                      ) : null}
                      <Text variant="caption" tone="muted" as="p" style={{ margin: 0 }}>
                        {v.scheduleCalendar?.note}
                      </Text>
                    </div>
                  </Dialog>
                  {v.template.isRide ? (
                    <Card style={{ marginTop: '18px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px' }}>
                        {(v.template.rideStats ?? []).map((r, i) => (
                          <div key={i}>
                            <Text variant="micro" tone="subtle" as="div">
                              {r?.label}
                            </Text>
                            <Text variant="subheading" tone="ink" as="div" style={{ marginTop: '4px' }}>
                              {r?.value}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '18px' }}>
                      {(v.template.exercises ?? []).map((e, i) => (
                        <Card key={i} pad="sm" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span
                            style={{
                              width: '34px',
                              height: '34px',
                              flex: 'none',
                              borderRadius: '11px',
                              background: 'var(--color-pink-tint)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {e?.svg}
                          </span>
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
                  <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid rgba(35,42,69,.07)' }}>
                    <Button type="danger" ghost size="md" onClick={v.template.remove}>
                      Delete workout
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
            {v.isExerciseEdit && v.exerciseEdit ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton
                      label="Cancel editing"
                      size="md"
                      onClick={v.exerciseEdit.cancel}
                      style={{ marginLeft: '-8px' }}
                    >
                      <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={18} />
                    </IconButton>
                    <Text variant="eyebrow" tone="slate">
                      {v.exerciseEdit.heading}
                    </Text>
                  </div>
                  <Card style={{ marginTop: '18px' }}>
                    <TextField
                      label="Name"
                      value={v.exerciseEdit.name}
                      onChange={v.exerciseEdit.setName}
                      placeholder="e.g. Bulgarian Split Squat"
                      error={v.exerciseEdit.nameError || undefined}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '14px' }}>
                      <TextField
                        label="Sets"
                        containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
                        value={v.exerciseEdit.sets}
                        onChange={v.exerciseEdit.setSets}
                        placeholder="3"
                        inputMode="numeric"
                      />
                      <TextField
                        label="Reps"
                        containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
                        value={v.exerciseEdit.reps}
                        onChange={v.exerciseEdit.setReps}
                        placeholder="10"
                        inputMode="numeric"
                      />
                      <TextField
                        label="Weight"
                        suffix="lbs"
                        containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
                        value={v.exerciseEdit.weight}
                        onChange={v.exerciseEdit.setWeight}
                        placeholder="Optional"
                        inputMode="decimal"
                      />
                      <TextField
                        label="Rest"
                        suffix="sec"
                        containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
                        value={v.exerciseEdit.rest}
                        onChange={v.exerciseEdit.setRest}
                        placeholder="60"
                        inputMode="numeric"
                      />
                    </div>
                    <Label style={{ margin: '16px 0 8px' }}>Target areas</Label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(v.exerciseEdit.areas ?? []).map((a, i) => (
                        <Fragment key={i}>
                          <Chip tone="choice" size="md" selected={a?.on} onClick={a?.toggle}>
                            {a?.name}
                          </Chip>
                        </Fragment>
                      ))}
                    </div>
                    <Label style={{ margin: '16px 0 8px' }}>Icon</Label>
                    <div
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '8px' }}
                    >
                      {(v.exerciseEdit.icons ?? []).map((g, i) => (
                        <button key={i} onClick={g?.pick} aria-label={g?.label} aria-pressed={!!g?.on} style={css(g?.style)}>
                          {g?.svg}
                        </button>
                      ))}
                    </div>
                  </Card>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '22px',
                      paddingTop: '20px',
                      borderTop: '1px solid rgba(35,42,69,.07)',
                    }}
                  >
                    <Button type="neutral" ghost size="lg" onClick={v.exerciseEdit.cancel}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      size="lg"
                      disabled={!v.exerciseEdit.canSave}
                      onClick={v.exerciseEdit.save}
                    >
                      {v.exerciseEdit.saveLabel}
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
            {v.isNewEntry ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton label="Back" size="md" onClick={v.goBack} style={{ marginLeft: '-8px' }}>
                      <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={18} />
                    </IconButton>
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
                    Entries attach to a workout on your plan. Listed: sessions from the last 60 days, up to today, that don&apos;t have one yet.
                  </Text>
                  <div style={{ marginTop: '22px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                      {(v.unlogged ?? []).map((u, i) => (
                        <Fragment key={i}>
                          <button onClick={u?.pick} style={css(u?.rowStyle)} className="hv7">
                            <Text variant="eyebrow" tone="muted" style={{ flex: 'none', width: '56px' }}>
                              {u?.day}
                            </Text>
                            <span
                              style={{
                                flex: '1 1 140px',
                                minWidth: '0',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--color-ink)',
                              }}
                            >
                              {u?.name}
                            </span>
                            <Text variant="caption" tone="muted" weight="medium" style={{ flex: 'none' }}>
                              {u?.meta}
                            </Text>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    {v.noUnlogged ? (
                      <>
                        <Text variant="body" as="p" tone="muted" style={{ margin: '16px 0 0' }}>
                          {v.noUnloggedNote}
                        </Text>
                      </>
                    ) : null}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '18px',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(35,42,69,.07)',
                      }}
                    >
                      <Button type="neutral" ghost size="md" onClick={v.closeNewEntry}>
                        Cancel
                      </Button>
                    </div>
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
                            borderBottom: '1.5px dashed rgba(35,42,69,.22)',
                          }}
                        >
                          <Calendar color="var(--color-subtle)" size={16} />
                          <TextField
                            variant="bare"
                            size="sm"
                            aria-label="From date"
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
                        <div style={{ position: 'relative' }}>
                          <Card
                            as="button"
                            pad="none"
                            interactive
                            onClick={e?.open}
                            aria-label={e?.aria}
                            style={{
                              width: '100%',
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'flex-start',
                              gap: '16px',
                              padding: '18px 62px 18px 20px',
                            }}
                          >
                            <span className="fc-keep" style={css(e?.faceWrap)}>
                              {e?.isHappy ? (
                                <>
                                  <MoodFace mood="Happy" size={24} />
                                </>
                              ) : null}
                              {e?.isNeutral ? (
                                <>
                                  <MoodFace mood="Neutral" size={24} />
                                </>
                              ) : null}
                              {e?.isSad ? (
                                <>
                                  <MoodFace mood="Sad" size={24} />
                                </>
                              ) : null}
                              {e?.isMad ? (
                                <>
                                  <MoodFace mood="Mad" size={24} />
                                </>
                              ) : null}
                            </span>
                            <span style={{ flex: '1 1 220px', minWidth: '0' }}>
                              <Text variant="eyebrow" tone="muted" style={{ display: 'block' }}>
                                {e?.date}
                              </Text>
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '7px',
                                  marginTop: '4px',
                                }}
                              >
                                <Text variant="itemTitle">{e?.name}</Text>
                                <ChevronRight color="var(--color-subtle)" strokeWidth={2.2} size={16} />
                              </span>
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  marginTop: '6px',
                                }}
                              >
                                {(e?.stars ?? []).map((s, i) => (
                                  <Fragment key={i}>
                                    <span className="fc-keep" style={css(s)}>★</span>
                                  </Fragment>
                                ))}
                              </span>
                              <Text
                                variant="caption"
                                tone="muted"
                                style={{
                                  display: 'block',
                                  lineHeight: 'var(--leading-snug)',
                                  marginTop: '7px',
                                  textWrap: 'pretty',
                                }}
                              >
                                {e?.note}
                              </Text>
                            </span>
                          </Card>
                          <IconButton
                            label={e?.deleteLabel}
                            size="lg"
                            tone="danger"
                            onClick={e?.remove}
                            title="Delete entry"
                            style={{ position: 'absolute', top: '6px', right: '6px' }}
                          >
                            <Close color="var(--color-subtle)" strokeWidth={2.2} size={14} />
                          </IconButton>
                        </div>
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
                  <Dialog
                    open={!!v.pausePromptOpen}
                    onClose={v.keepGoing}
                    title="Leave your workout?"
                    description="The timer can keep counting while you're elsewhere, or wait for you. Either way, pick up from the day card."
                    actions={
                      <>
                        <Button type="neutral" ghost size="md" onClick={v.confirmPause}>
                          Pause timer
                        </Button>
                        <Button type="primary" size="md" onClick={v.leaveRunning}>
                          Keep it running
                        </Button>
                      </>
                    }
                  />
                  <Dialog
                    open={!!v.finishOpen}
                    onClose={v.cancelFinish}
                    title={v.finishTitle}
                    description={v.finishNote || undefined}
                    actions={
                      <>
                        <Button type="neutral" ghost size="md" onClick={v.cancelFinish}>
                          {v.finishCancelLabel}
                        </Button>
                        <Button type="primary" size="md" onClick={v.saveFinish} disabled={!v.canSaveFinish}>
                          {v.finishSaveLabel}
                        </Button>
                      </>
                    }
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
                      {v.finishIsRide ? (
                        <TextField
                          label="Distance"
                          labelNote="(miles)"
                          inputMode="decimal"
                          containerStyle={{ flex: '1 1 100%', minWidth: '0' }}
                          value={v.finishDist}
                          onChange={v.setFinishDist}
                        />
                      ) : null}
                      <TextField
                        label="Hours"
                        inputMode="numeric"
                        containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
                        value={v.finishHrs}
                        onChange={v.setFinishHrs}
                      />
                      <TextField
                        label="Minutes"
                        inputMode="numeric"
                        containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
                        value={v.finishMins}
                        onChange={v.setFinishMins}
                      />
                      {v.finishIsRide ? (
                        <TextField
                          label="Elevation"
                          labelNote="(feet)"
                          inputMode="numeric"
                          containerStyle={{ flex: '1 1 100%', minWidth: '0' }}
                          value={v.finishElev}
                          onChange={v.setFinishElev}
                        />
                      ) : null}
                    </div>
                  </Dialog>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                    <IconButton label="Back" size="md" onClick={v.backToDay} style={{ marginLeft: '-8px' }}>
                      <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={18} />
                    </IconButton>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        flex: 'none',
                        borderRadius: '15px',
                        background: 'var(--color-pink-tint)',
                        border: '2px solid var(--color-white)',
                        boxShadow: '0 2px 6px rgba(213,49,129,.28),0 0 0 1px rgba(35,42,69,.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {v.dayIcoSvg}
                    </div>
                    <div style={{ minWidth: '0' }}>
                      <Text variant="eyebrow" as="div" tone="slate">
                        {v.eDate}
                      </Text>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '9px' }}>
                        <Text variant="title" as="h1" style={{ margin: '3px 0 0' }}>
                          {v.eName}
                        </Text>
                        <IconButton
                          label="Edit workout"
                          size="md"
                          onClick={v.goEdit}
                          title="Edit workout"
                          style={{ marginBottom: '-2px' }}
                        >
                          <Pencil color="var(--color-muted)" size={17} />
                        </IconButton>
                      </div>
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
                          icon={<Repeat color="var(--color-white)" size={15} />}
                          trailing={
                            <IconButton
                              label="End this series"
                              size="xs"
                              tone="inverse"
                              onClick={v.endSeries}
                              title="End this series"
                            >
                              <Close color="rgba(255,255,255,0.85)" strokeWidth={2.2} size={13} />
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
                  {v.showTimer ? (
                    <>
                      <Card style={{ marginTop: '16px' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                          }}
                        >
                          <div>
                            <Text variant="eyebrow" tone="slate">
                              WORKOUT TIMER
                            </Text>
                            <Text
                              variant="title"
                              as="div"
                              style={{ margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}
                            >
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
                      </Card>
                    </>
                  ) : null}
                  {v.dayIsRide ? (
                    <>
                      <Card style={{ marginTop: '18px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px' }}>
                          {(v.rideStats ?? []).map((r, i) => (
                            <Fragment key={i}>
                              <div>
                                <Text variant="micro" as="div" tone="subtle">
                                  {r?.label}
                                </Text>
                                <Text variant="cardTitle" as="div" tone="ink" style={{ marginTop: '4px' }}>
                                  {r?.value}
                                </Text>
                                {r?.note ? (
                                  <Text variant="caption" as="div" tone="muted" style={{ marginTop: '2px' }}>
                                    {r.note}
                                  </Text>
                                ) : null}
                              </div>
                            </Fragment>
                          ))}
                        </div>
                        {!v.isFuture ? (
                          <Button
                            type={v.rideDoneType}
                            size="md"
                            onClick={v.toggleRideDone}
                            style={{ marginTop: '20px' }}
                          >
                            <span style={css(v.rideDoneMark)}>
                              <Check color={v.rideDoneStroke} strokeWidth={2.8} size={13} />
                            </span>
                            {t(v.rideDoneLabel)}
                          </Button>
                        ) : null}
                      </Card>
                    </>
                  ) : null}
                  {v.dayIsLift ? (
                    <>
                      {/* Nothing to tick off before its day, so no progress to show. */}
                      {!v.isFuture ? (
                      <Card style={{ marginTop: '16px' }}>
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
                        >
                          <Text variant="eyebrow" tone="slate">
                            PROGRESS
                          </Text>
                          <Text variant="itemTitle" tone="ink" style={{ marginLeft: 'auto' }}>
                            {v.progLabel}
                          </Text>
                        </div>
                        <div
                          style={{
                            height: '8px',
                            borderRadius: '5px',
                            background: 'var(--color-pink-tint)',
                            marginTop: '12px',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={css(v.progBar)}></div>
                        </div>
                        <p style={css(v.progNoteStyle)}>
                          {v.allDone ? (
                            <>
                              <span
                                style={{ display: 'flex', animation: 'twinkle 2.6s ease-in-out infinite' }}
                              >
                                <Sparkle size={14} color={colors.pink} glow={0.55} />
                              </span>
                            </>
                          ) : null}
                          {t(v.progNote)}
                        </p>
                      </Card>
                      ) : null}
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}
                      >
                        {(v.exercises ?? []).map((ex, i) => (
                          <Fragment key={i}>
                            <Card
                              pad="sm"
                              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '13px' }}
                            >
                              <span
                                style={{
                                  width: '34px',
                                  height: '34px',
                                  flex: 'none',
                                  borderRadius: '11px',
                                  background: 'var(--color-pink-tint)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {ex?.icoSvg}
                              </span>
                              <span style={{ minWidth: '0' }}>
                                <span style={css(ex?.nameStyle)}>{ex?.name}</span>
                                <Text
                                  variant="caption"
                                  tone="muted"
                                  style={{ display: 'block', marginTop: '3px' }}
                                >
                                  {ex?.detail}
                                </Text>
                              </span>
                              {ex?.showTick ? (
                                <button
                                  onClick={ex?.toggleDone}
                                  aria-pressed={ex?.isDone}
                                  aria-label={ex?.doneAria}
                                  style={css(ex?.doneBtn)}
                                  className="hit"
                                >
                                  <Check color={ex?.doneStroke} strokeWidth={2.6} size={15} />
                                </button>
                              ) : null}
                            </Card>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '22px',
                      paddingTop: '20px',
                      borderTop: '1px solid rgba(35,42,69,.07)',
                    }}
                  >
                    <Button type="neutral" ghost size="lg" onClick={v.goEdit}>
                      <Pencil color="var(--color-slate)" size={17} />
                      Edit workout
                    </Button>
                    {!v.isFuture ? (
                      <Button type="primary" size="lg" onClick={v.goDiary}>
                        {v.ctaLabel}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
            {v.needsType ? (
              <>
                <div style={{ maxWidth: '560px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton label="Back" size="md" onClick={v.backToDay} style={{ marginLeft: '-8px' }}>
                      <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={18} />
                    </IconButton>
                    <div>
                      <Text variant="eyebrow" as="div" tone="slate">
                        NEW WORKOUT
                      </Text>
                      <Text variant="heading" as="h1" style={{ margin: '3px 0 0' }}>
                        What kind of workout?
                      </Text>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
                      gap: '12px',
                      marginTop: '22px',
                    }}
                  >
                    <Card
                      as="button"
                      pad="lg"
                      interactive
                      onClick={v.pickTypeLift}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '14px',
                      }}
                    >
                      <span
                        style={{
                          width: '46px',
                          height: '46px',
                          flex: 'none',
                          borderRadius: '15px',
                          background: 'var(--color-pink-tint)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Dumbbell color="var(--color-pink)" size={22} />
                      </span>
                      <span>
                        <Text variant="subheading" tone="ink" style={{ display: 'block' }}>
                          Lifting
                        </Text>
                        <Text
                          variant="body"
                          tone="muted"
                          style={{
                            display: 'block',
                            lineHeight: 'var(--leading-snug)',
                            marginTop: '5px',
                            textWrap: 'pretty',
                          }}
                        >
                          Build a list of exercises with sets, reps and weight.
                        </Text>
                      </span>
                    </Card>
                    <Card
                      as="button"
                      pad="lg"
                      interactive
                      onClick={v.pickTypeCycle}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '14px',
                      }}
                    >
                      <span
                        style={{
                          width: '46px',
                          height: '46px',
                          flex: 'none',
                          borderRadius: '15px',
                          background: 'var(--color-periwinkle-tint)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Bike color="var(--color-periwinkle)" size={22} />
                      </span>
                      <span>
                        <Text variant="subheading" tone="ink" style={{ display: 'block' }}>
                          Cycling
                        </Text>
                        <Text
                          variant="body"
                          tone="muted"
                          style={{
                            display: 'block',
                            lineHeight: 'var(--leading-snug)',
                            marginTop: '5px',
                            textWrap: 'pretty',
                          }}
                        >
                          Set a distance, duration and target effort for the ride.
                        </Text>
                      </span>
                    </Card>
                  </div>
                  {v.hasSavedChoices ? (
                    <>
                      <Text variant="eyebrow" tone="slate" as="h2" style={{ margin: '28px 0 4px' }}>
                        OR ONE FROM YOUR SPELLBOOK
                      </Text>
                      <Text variant="caption" tone="muted" as="p" style={{ margin: '0 0 12px' }}>
                        {v.savedChoicesNote}
                      </Text>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(v.savedChoices ?? []).map((w, i) => (
                          <Card
                            key={i}
                            as="button"
                            pad="sm"
                            interactive
                            onClick={w?.pick}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', width: '100%' }}
                          >
                            <span
                              style={{
                                width: '34px',
                                height: '34px',
                                flex: 'none',
                                borderRadius: '11px',
                                background: 'var(--color-pink-tint)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {w?.svg}
                            </span>
                            <span style={{ flex: '1', minWidth: '0' }}>
                              <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                                {w?.name}
                              </Text>
                              <Text variant="caption" tone="muted" style={{ display: 'block', marginTop: '2px' }}>
                                {w?.meta}
                              </Text>
                            </span>
                            <Plus color="var(--color-pink-deep)" size={17} />
                          </Card>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {v.isEdit ? (
              <>
                <div style={{ position: 'relative' }}>
                  <Dialog
                    open={!!v.leaveOpen}
                    onClose={v.stayHere}
                    title={v.leaveTitle}
                    description={v.leaveBody}
                    actions={
                      <>
                        <Button type="danger" ghost size="md" onClick={v.discardLeave}>
                          {v.leaveDiscardLabel}
                        </Button>
                        <Button type="primary" size="md" onClick={v.saveLeave}>
                          {v.leaveSaveLabel}
                        </Button>
                      </>
                    }
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 12px' }}>
                    <IconButton label="Back" size="md" onClick={v.tryLeave} style={{ marginLeft: '-8px' }}>
                      <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={18} />
                    </IconButton>
                    <Popover
                      open={!!v.iconsOpen}
                      onClose={v.closeIcons}
                      width={238}
                      top={52}
                      content={
                        <>
                          <Text variant="eyebrow" as="div" tone="slate" style={{ padding: '0 2px 10px' }}>
                            ICON
                          </Text>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
                              gap: '8px',
                            }}
                          >
                            {(v.workoutIconGrid ?? []).map((w, i) => (
                              <Fragment key={i}>
                                <button onClick={w?.pick} aria-label={w?.label} aria-pressed={!!w?.on} style={css(w?.style)}>
                                  {w?.svg}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                          <Text
                            variant="eyebrow"
                            as="div"
                            tone="slate"
                            style={{ padding: '14px 2px 10px' }}
                          >
                            COLOR
                          </Text>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {(v.iconColors ?? []).map((c, i) => (
                              <Fragment key={i}>
                                <button onClick={c?.pick} aria-label={c?.label} aria-pressed={!!c?.on} style={css(c?.style)}></button>
                              </Fragment>
                            ))}
                          </div>
                        </>
                      }
                    >
                      <button
                        onClick={v.toggleIcons}
                        aria-label="Choose workout icon"
                        aria-expanded={v.iconsOpen}
                        style={css(v.iconBadge)}
                      >
                        {v.workoutIcoSvg}
                      </button>
                    </Popover>
                    <div style={{ flex: '1 1 220px', minWidth: '0' }}>
                      <Text variant="eyebrow" as="h1" tone="slate" style={{ margin: 0 }}>
                        {v.eEyebrow}
                      </Text>
                      {v.eNamePlaceholder ? (
                        <>
                          <TextField
                            variant="title"
                            aria-label="Workout name"
                            value={v.eName ?? ''}
                            onChange={v.setNewName}
                            onKeyDown={v.commitOnEnter}
                            placeholder="Name this workout"
                            error={v.nameError || undefined}
                          />
                        </>
                      ) : null}
                      {v.eNameStatic ? (
                        <>
                          <TextField
                            variant="title"
                            aria-label="Workout name"
                            value={v.eName ?? ''}
                            onChange={v.setEditName}
                            onKeyDown={v.commitOnEnter}
                            placeholder="Name this workout"
                            error={v.nameError || undefined}
                          />
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
                    {v.showDate ? (
                    <Popover
                      open={!!v.dateOpen}
                      onClose={v.closeDate}
                      width={280}
                      top={44}
                      as="span"
                      content={
                        <>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IconButton label="Previous month" size="md" onClick={v.pickPrevMonth}>
                              <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={15} />
                            </IconButton>
                            <Text variant="itemTitle" style={{ flex: '1', textAlign: 'center' }}>
                              {v.pickMonthName}
                            </Text>
                            <IconButton label="Next month" size="md" onClick={v.pickNextMonth}>
                              <ChevronRight color="var(--color-slate)" strokeWidth={2.2} size={15} />
                            </IconButton>
                          </span>
                          <span
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
                              gap: '2px',
                              marginTop: '10px',
                            }}
                          >
                            {(v.dowLabels ?? []).map((l, i) => (
                              <Fragment key={i}>
                                <span
                                  aria-hidden="true"
                                  style={{
                                    textAlign: 'center',
                                    fontSize: 'var(--text-2xs)',
                                    fontWeight: 'var(--font-weight-bold)',
                                    color: 'var(--color-subtle)',
                                    paddingBottom: '4px',
                                  }}
                                >
                                  {l}
                                </span>
                              </Fragment>
                            ))}
                            {(v.pickerCells ?? []).map((p, i) => (
                              <Fragment key={i}>
                                {p?.blank ? (
                                  <span aria-hidden="true" style={css(p?.style)} />
                                ) : (
                                  <button
                                    onClick={p?.pick}
                                    onKeyDown={p?.keys}
                                    tabIndex={p?.tab}
                                    data-pick-day={p?.day}
                                    aria-label={p?.aria}
                                    aria-current={p?.today}
                                    aria-pressed={!!p?.selected}
                                    style={css(p?.style)}
                                  >
                                    {p?.label}
                                  </button>
                                )}
                              </Fragment>
                            ))}
                          </span>
                        </>
                      }
                    >
                      <Chip
                        icon={<Calendar color="var(--color-muted)" size={15} />}
                        onClick={v.toggleDate}
                        aria-expanded={!!v.dateOpen}
                        aria-label={'Date: ' + v.eDateAria + '. Change date'}
                      >
                        {t(v.eDate)}
                      </Chip>
                    </Popover>
                    ) : null}
                    {v.repeatOn ? (
                      <>
                        <Chip tone="accent" icon={<Repeat color="var(--color-white)" size={15} />}>
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
                      {v.scheduleOn ? (
                        <div
                          style={{
                            marginTop: '14px',
                            paddingTop: '14px',
                            borderTop: '1px solid rgba(35,42,69,.07)',
                          }}
                        >
                          <Checkbox switch checked={!!v.repeatOn} onChange={v.setRepeat}>
                            Repeat weekly
                          </Checkbox>
                          {v.repeatOn ? (
                            <Text variant="caption" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
                              {v.repeatNote}
                            </Text>
                          ) : null}
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
                          <Checkbox switch checked={!!v.repeatOn} onChange={v.setRepeat}>
                            Repeat weekly
                          </Checkbox>
                          {v.repeatOn ? (
                            <Text variant="caption" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
                              {v.repeatNote}
                            </Text>
                          ) : null}
                        </Card>
                      ) : null}
                    </>
                  )}
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
                          <div>
                            <Text variant="micro" as="div" tone="subtle">
                              DISTANCE
                            </Text>
                            <Text variant="itemTitle" as="div" tone="ink" style={{ marginTop: '4px' }}>
                              {v.planDistText}
                            </Text>
                          </div>
                          <div>
                            <Text variant="micro" as="div" tone="subtle">
                              DURATION
                            </Text>
                            <Text variant="itemTitle" as="div" tone="ink" style={{ marginTop: '4px' }}>
                              {v.planDurText}
                            </Text>
                          </div>
                          <div>
                            <Text variant="micro" as="div" tone="subtle">
                              ELEVATION
                            </Text>
                            <Text variant="itemTitle" as="div" tone="ink" style={{ marginTop: '4px' }}>
                              {v.planElevText}
                            </Text>
                          </div>
                          <div>
                            <Text variant="micro" as="div" tone="subtle">
                              TARGET EFFORT
                            </Text>
                            <Text variant="itemTitle" as="div" tone="ink" style={{ marginTop: '4px' }}>
                              {v.rideZone}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {v.ridePlanEdit ? (
                    <>
                      <Card style={{ marginTop: '16px' }}>
                        <Text variant="eyebrow" as="div" tone="slate">
                          RIDE PLAN
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
                          <TextField
                            label="Distance"
                            labelNote="(miles)"
                            containerStyle={{ flex: '1 1 130px', minWidth: '0' }}
                            value={v.rideDistance ?? ''}
                            onChange={v.setDistance}
                            inputMode="decimal"
                            placeholder="24.5"
                          />
                          <TextField
                            label="Elevation"
                            labelNote="(feet)"
                            containerStyle={{ flex: '1 1 130px', minWidth: '0' }}
                            value={v.rideElev ?? ''}
                            onChange={v.setElev}
                            inputMode="numeric"
                            placeholder="1200"
                          />
                          <div style={{ flex: '1 1 210px', minWidth: '0' }}>
                            <Label>Duration</Label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <TextField
                                suffix="hr"
                                containerStyle={{ flex: '1', minWidth: '0' }}
                                aria-label="Duration, hours"
                                value={v.rideHours ?? ''}
                                onChange={v.setHours}
                                inputMode="numeric"
                                placeholder="1"
                              />
                              <TextField
                                suffix="min"
                                containerStyle={{ flex: '1', minWidth: '0' }}
                                aria-label="Duration, minutes"
                                value={v.rideMins ?? ''}
                                onChange={v.setMins}
                                inputMode="numeric"
                                placeholder="20"
                              />
                            </div>
                          </div>
                        </div>
                        <Label style={{ margin: '18px 0 9px' }}>Target effort</Label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {['Recovery', 'Endurance', 'Tempo', 'Intervals'].map((zone) => (
                            <Chip
                              key={zone}
                              tone="choice"
                              size="md"
                              selected={v.rideZone === zone}
                              onClick={() => v.setRideZone(zone)}
                            >
                              {zone}
                            </Chip>
                          ))}
                        </div>
                      </Card>
                    </>
                  ) : null}
                  {v.ridePlanStatic ? (
                    <>
                      <Card style={{ marginTop: '14px' }}>
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
                        >
                          <Text variant="eyebrow" tone="slate">
                            WHAT YOU ACTUALLY RODE
                          </Text>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontFamily: 'var(--font-heading)',
                              fontSize: 'var(--text-base)',
                              fontWeight: 'var(--font-weight-bold)',
                              color: 'var(--color-ink)',
                            }}
                          >
                            {v.ridePctLabel}
                          </span>
                        </div>
                        <div
                          style={{
                            height: '8px',
                            borderRadius: '5px',
                            background: 'var(--color-mist)',
                            marginTop: '12px',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={css(v.rideBar)}></div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '18px' }}>
                          <TextField
                            label="Distance"
                            labelNote="(miles)"
                            hint={v.plannedDist}
                            containerStyle={{ flex: '1 1 130px', minWidth: '0' }}
                            value={v.actDistance ?? ''}
                            onChange={v.setActDistance}
                            inputMode="decimal"
                            placeholder={v.plannedDistPh}
                          />
                          <TextField
                            label="Elevation"
                            labelNote="(feet)"
                            hint={v.plannedElev}
                            containerStyle={{ flex: '1 1 130px', minWidth: '0' }}
                            value={v.actElev ?? ''}
                            onChange={v.setActElev}
                            inputMode="numeric"
                            placeholder={v.plannedElevPh}
                          />
                          <div style={{ flex: '1 1 210px', minWidth: '0' }}>
                            <Label>Duration</Label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <TextField
                                suffix="hr"
                                containerStyle={{ flex: '1', minWidth: '0' }}
                                aria-label="Actual duration, hours"
                                value={v.actHours ?? ''}
                                onChange={v.setActHours}
                                inputMode="numeric"
                                placeholder="0"
                              />
                              <TextField
                                suffix="min"
                                containerStyle={{ flex: '1', minWidth: '0' }}
                                aria-label="Actual duration, minutes"
                                value={v.actMins ?? ''}
                                onChange={v.setActMins}
                                inputMode="numeric"
                                placeholder="0"
                              />
                            </div>
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-regular)',
                                color: 'var(--color-subtle)',
                                marginTop: '6px',
                              }}
                            >
                              {v.plannedDur}
                            </span>
                          </div>
                        </div>
                        <p style={css(v.rideNoteStyle)}>{v.rideNote}</p>
                      </Card>
                    </>
                  ) : null}
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
                      <Card style={{ marginTop: '16px' }}>
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
                        >
                          <Text variant="eyebrow" tone="slate">
                            PROGRESS
                          </Text>
                          <Text variant="itemTitle" tone="ink" style={{ marginLeft: 'auto' }}>
                            {v.progLabel}
                          </Text>
                        </div>
                        <div
                          style={{
                            height: '8px',
                            borderRadius: '5px',
                            background: 'var(--color-pink-tint)',
                            marginTop: '12px',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={css(v.progBar)}></div>
                        </div>
                        <p style={css(v.progNoteStyle)}>
                          {v.allDone ? (
                            <>
                              <span
                                style={{ display: 'flex', animation: 'twinkle 2.6s ease-in-out infinite' }}
                              >
                                <Sparkle size={14} color={colors.pink} glow={0.55} />
                              </span>
                            </>
                          ) : null}
                          {t(v.progNote)}
                        </p>
                      </Card>
                    </>
                  ) : null}
                  {v.isLift ? (
                    <>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}
                      >
                        {(v.exercises ?? []).map((ex, i) => (
                          <Fragment key={i}>
                            <Card pad="sm">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                                <Popover
                                  open={!!ex?.open}
                                  onClose={ex?.close}
                                  width={186}
                                  top={48}
                                  content={
                                    <>
                                      <Text
                                        variant="micro"
                                        as="div"
                                        tone="slate"
                                        style={{ padding: '0 2px 9px' }}
                                      >
                                        ICON
                                      </Text>
                                      <div
                                        style={{
                                          display: 'grid',
                                          gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
                                          gap: '7px',
                                        }}
                                      >
                                        <button onClick={ex?.pickH} aria-label="Dumbbell icon" aria-pressed={!!ex?.isH} style={css(ex?.optH)}>
                                          <Dumbbell color="var(--color-pink)" size={20} />
                                        </button>
                                        <button onClick={ex?.pickV} aria-label="Upright dumbbell icon" aria-pressed={!!ex?.isV} style={css(ex?.optV)}>
                                          <Dumbbell
                                            color="var(--color-pink)"
                                            size={20}
                                            style={{ transform: 'rotate(90deg)' }}
                                          />
                                        </button>
                                        <button onClick={ex?.pickD} aria-label="Small dumbbell icon" aria-pressed={!!ex?.isD} style={css(ex?.optD)}>
                                          <DumbbellSmall color="var(--color-pink)" size={20} />
                                        </button>
                                      </div>
                                    </>
                                  }
                                >
                                  <button
                                    onClick={ex?.toggle}
                                    className="hit"
                                    aria-label={ex?.iconAria}
                                    aria-expanded={ex?.open}
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      flex: 'none',
                                      borderRadius: '13px',
                                      background: 'var(--color-pink-tint)',
                                      border: '2px solid var(--color-white)',
                                      boxShadow:
                                        '0 2px 6px rgba(213,49,129,.28),0 0 0 1px rgba(35,42,69,.05)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {t(ex?.icoSvg)}
                                    {ex?.hideLegacy ? (
                                      <>
                                        {ex?.isH ? (
                                          <>
                                            <Dumbbell color="var(--color-pink)" size={19} />
                                          </>
                                        ) : null}
                                        {ex?.isV ? (
                                          <>
                                            <Dumbbell
                                              color="var(--color-pink)"
                                              size={19}
                                              style={{ transform: 'rotate(90deg)' }}
                                            />
                                          </>
                                        ) : null}
                                        {ex?.isD ? (
                                          <>
                                            <DumbbellSmall color="var(--color-pink)" size={19} />
                                          </>
                                        ) : null}
                                      </>
                                    ) : null}
                                  </button>
                                </Popover>
                                <button
                                  type="button"
                                  onClick={ex?.toggleExpand}
                                  aria-expanded={!!ex?.expanded}
                                  className="hit"
                                  style={{
                                    flex: '1',
                                    minWidth: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    border: 'none',
                                    background: 'none',
                                    padding: '0',
                                    textAlign: 'left',
                                    font: 'inherit',
                                    color: 'inherit',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <span style={{ minWidth: '0' }}>
                                    <span style={css(ex?.nameStyle)}>{ex?.name}</span>
                                    {!ex?.expanded ? (
                                      <Text variant="caption" tone="muted" style={{ display: 'block', marginTop: '3px' }}>
                                        {ex?.detail}
                                      </Text>
                                    ) : null}
                                  </span>
                                  <ChevronDown
                                    color="var(--color-muted)"
                                    size={16}
                                    style={{ flex: 'none', transform: ex?.expanded ? 'rotate(180deg)' : 'none' }}
                                  />
                                </button>
                                {ex?.showTick ? (
                                  <button
                                    onClick={ex?.toggleDone}
                                    aria-pressed={ex?.isDone}
                                    aria-label={ex?.doneAria}
                                    style={css(ex?.doneBtn)}
                                    className="hit"
                                  >
                                    <Check color={ex?.doneStroke} strokeWidth={2.6} size={15} />
                                  </button>
                                ) : (
                                  <span style={{ marginLeft: 'auto' }} />
                                )}
                                <IconButton label={ex?.removeAria} size="sm" onClick={ex?.remove}>
                                  <Close color="var(--color-muted)" size={19} />
                                </IconButton>
                              </div>
                              {ex?.expanded ? (
                              <>
                              <div
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}
                              >
                                <TextField
                                  label="Sets"
                                  containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
                                  value={ex?.sets ?? ''}
                                  onChange={ex?.setSets}
                                  inputMode="numeric"
                                />
                                <TextField
                                  label="Reps"
                                  containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
                                  value={ex?.reps ?? ''}
                                  onChange={ex?.setReps}
                                  inputMode="numeric"
                                />
                                <TextField
                                  label="Weight"
                                  suffix="lbs"
                                  containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
                                  value={ex?.weight ?? ''}
                                  onChange={ex?.setWeight}
                                  inputMode="decimal"
                                />
                                <TextField
                                  label="Rest"
                                  suffix="sec"
                                  containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
                                  value={ex?.rest ?? ''}
                                  onChange={ex?.setRest}
                                  inputMode="numeric"
                                />
                              </div>
                              <Label style={{ margin: '14px 0 7px' }}>Target areas</Label>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {(ex?.areas ?? []).map((a, i) => (
                                  <Fragment key={i}>
                                    <Chip tone="choice" size="md" selected={a?.on} onClick={a?.toggle}>
                                      {a?.name}
                                    </Chip>
                                  </Fragment>
                                ))}
                              </div>
                              </>
                              ) : null}
                            </Card>
                          </Fragment>
                        ))}
                      </div>
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
                        <Plus color="var(--color-pink)" size={19} />
                        Add exercise
                      </Button>
                    </>
                  ) : null}
                  {v.addOpen ? (
                    <>
                      <Card elevation="overlay" id="add-exercise" data-add-exercise-panel style={{ marginTop: '14px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                          <Text variant="cardTitle">Add exercise</Text>
                          <SegmentedControl
                            label="Add exercise from"
                            size="sm"
                            tone="quiet"
                            options={[
                              { value: 'lib', label: 'From Spellbook' },
                              { value: 'new', label: 'Create new' },
                            ]}
                            value={v.addMode}
                            onChange={v.setAddMode}
                            style={{ marginLeft: 'auto' }}
                          />
                        </div>
                        {v.addLib ? (
                          <>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginTop: '16px',
                                padding: '0 13px',
                                background: 'var(--color-canvas)',
                                border: '1px solid var(--color-outline)',
                                borderRadius: '14px',
                              }}
                            >
                              <Search color="var(--color-subtle)" size={16} />
                              <TextField
                                variant="bare"
                                aria-label="Search exercises"
                                value={v.pickQuery ?? ''}
                                onChange={v.setPickQuery}
                                placeholder="Search exercises"
                              />
                              <span className="sr-only" role="status">
                                {v.libraryAnnounce}
                              </span>
                              {v.pickQuery ? (
                                <IconButton label="Clear search" size="xs" onClick={v.clearPickQuery}>
                                  <Close color="var(--color-muted)" strokeWidth={2.2} size={14} />
                                </IconButton>
                              ) : null}
                            </div>
                            {v.libraryFilterNote || v.libraryCanNarrow ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px', marginTop: '8px' }}>
                                {v.libraryFilterNote ? (
                                  <>
                                    <Text variant="caption" tone="muted">
                                      {v.libraryFilterNote}
                                    </Text>
                                    <Button type="secondary" ghost size="xs" onClick={v.libraryShowAll}>
                                      Show all
                                    </Button>
                                  </>
                                ) : (
                                  <Button type="secondary" ghost size="xs" onClick={v.libraryNarrow}>
                                    {v.libraryNarrowLabel}
                                  </Button>
                                )}
                              </div>
                            ) : null}
                          </>
                        ) : null}
                        {v.addLib ? (
                          <>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '7px',
                                marginTop: '18px',
                              }}
                            >
                              {(v.library ?? []).map((l, i) => (
                                <Fragment key={i}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      padding: '6px 6px 6px 16px',
                                      borderRadius: '14px',
                                      background: 'var(--color-canvas)',
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={l?.open ?? undefined}
                                      disabled={!l?.open}
                                      aria-label={'View details for ' + l?.name}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        flex: '1',
                                        minWidth: '0',
                                        minHeight: '44px',
                                        padding: '0',
                                        border: 'none',
                                        background: 'none',
                                        textAlign: 'left',
                                        cursor: l?.open ? 'pointer' : 'default',
                                        fontFamily: 'inherit',
                                      }}
                                    >
                                      <span
                                        style={{
                                          flex: '1',
                                          minWidth: '0',
                                          fontSize: 'var(--text-lg)',
                                          fontWeight: 'var(--font-weight-semibold)',
                                          color: 'var(--color-ink)',
                                        }}
                                      >
                                        {l?.name}
                                      </span>
                                      <Text
                                        variant="caption"
                                        tone="muted"
                                        style={{ flex: 'none', whiteSpace: 'nowrap' }}
                                      >
                                        {l?.detail}
                                      </Text>
                                      {l?.open ? (
                                        <ChevronRight color="var(--color-muted)" strokeWidth={2.2} size={16} />
                                      ) : null}
                                    </button>
                                    <IconButton
                                      label={'Add ' + l?.name + ' to workout'}
                                      size="lg"
                                      onClick={l?.add}
                                      style={{ background: 'var(--color-white)' }}
                                    >
                                      <Plus color="var(--color-pink-deep)" strokeWidth={2.4} size={18} />
                                    </IconButton>
                                  </div>
                                </Fragment>
                              ))}
                              {v.libraryEmpty ? (
                                <Text variant="caption" tone="muted" as="p" style={{ margin: '4px 0 0' }}>
                                  {v.libraryEmptyNote}
                                </Text>
                              ) : null}
                              {v.libraryMore ? (
                                <Text variant="caption" tone="muted" as="p" style={{ margin: '4px 0 0' }}>
                                  {v.libraryMore}
                                </Text>
                              ) : null}
                              <Button
                                type="secondary"
                                ghost
                                size="sm"
                                onClick={v.browseArsenal}
                                style={{ marginTop: '4px' }}
                              >
                                Browse the full Spellbook
                                <ChevronRight color="var(--color-pink-deep)" strokeWidth={2.2} size={14} />
                              </Button>
                            </div>
                          </>
                        ) : null}
                        {v.addNew ? (
                          <>
                            <div style={{ marginTop: '18px' }}>
                              <Label>Exercise name</Label>
                              <TextField
                                aria-label="Exercise name"
                                value={v.draftName ?? ''}
                                onChange={v.setName}
                                placeholder="e.g. Bulgarian Split Squat"
                                error={v.draftNameError || undefined}
                              />
                              <Label style={{ margin: '16px 0 8px' }}>Icon</Label>
                              <div
                                style={{
                                  maxHeight: '236px',
                                  overflowY: 'auto',
                                  padding: '2px',
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
                                  gap: '8px',
                                }}
                              >
                                {(v.iconGrid ?? []).map((g, i) => (
                                  <Fragment key={i}>
                                    <button onClick={g?.pick} aria-label={g?.label} aria-pressed={!!g?.on} style={css(g?.style)}>
                                      {g?.svg}
                                    </button>
                                  </Fragment>
                                ))}
                              </div>
                              <div
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '14px' }}
                              >
                                <TextField
                                  label="Sets"
                                  containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
                                  value={v.draftSets ?? ''}
                                  onChange={v.setSets}
                                  placeholder="3"
                                  inputMode="numeric"
                                />
                                <TextField
                                  label="Reps"
                                  containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
                                  value={v.draftReps ?? ''}
                                  onChange={v.setReps}
                                  placeholder="10"
                                  inputMode="numeric"
                                />
                                <TextField
                                  label="Weight"
                                  suffix="lbs"
                                  containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
                                  value={v.draftWeight ?? ''}
                                  onChange={v.setWeight}
                                  placeholder="Optional"
                                  inputMode="decimal"
                                />
                                <TextField
                                  label="Rest"
                                  suffix="sec"
                                  containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
                                  value={v.draftRest ?? ''}
                                  onChange={v.setRest}
                                  placeholder="60"
                                  inputMode="numeric"
                                />
                              </div>
                              <Label style={{ margin: '16px 0 8px' }}>Target areas</Label>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {(v.draftAreas ?? []).map((t, i) => (
                                  <Fragment key={i}>
                                    <Chip tone="choice" size="md" selected={t?.on} onClick={t?.toggle}>
                                      {t?.name}
                                    </Chip>
                                  </Fragment>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : null}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: '10px',
                            marginTop: '20px',
                            paddingTop: '18px',
                            borderTop: '1px solid rgba(35,42,69,.07)',
                          }}
                        >
                          <Button type="neutral" ghost size="lg" onClick={v.closeAdd}>
                            Close
                          </Button>
                          {v.addNew ? (
                            <>
                              <Button
                                type="primary"
                                size="lg"
                                disabled={v.commitDisabled}
                                onClick={v.commitNew}
                              >
                                Add to workout
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </Card>
                    </>
                  ) : null}
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
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '24px',
                      paddingTop: '20px',
                      borderTop: '1px solid rgba(35,42,69,.07)',
                    }}
                  >
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
                  </div>
                </div>
              </>
            ) : null}
            {v.isDiary ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Button
                      type="neutral"
                      ghost
                      size="xs"
                      onClick={v.diaryBack}
                      style={{ marginLeft: '-4px' }}
                    >
                      <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={17} />
                      Back
                    </Button>
                  </div>
                  {v.diaryReading ? (
                    <>
                      <div style={{ marginTop: '30px' }}>
                        <Text variant="eyebrow" as="div" tone="subtle">
                          {v.longDate}
                        </Text>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'baseline',
                            gap: '10px',
                            marginTop: '8px',
                          }}
                        >
                          <Text variant="display" as="h1" style={{ margin: '0' }}>
                            {v.eName}
                          </Text>
                          <button
                            onClick={v.goDetail}
                            style={{
                              alignSelf: 'center',
                              height: '30px',
                              padding: '0 12px',
                              border: 'none',
                              borderRadius: '10px',
                              background: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: 'var(--text-md)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-pink-deep)',
                            }}
                            className="hv7"
                          >
                            View workout
                            <ChevronRight color="var(--color-pink-deep)" strokeWidth={2.2} size={15} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '22px' }}>
                          <Card
                            pad="sm"
                            style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '14px' }}
                          >
                            <span className="fc-keep" style={css(v.readMoodFace)}>{v.readMoodSvg}</span>
                            <div style={{ minWidth: '0' }}>
                              <Text variant="micro" as="div" tone="subtle">
                                MOOD
                              </Text>
                              <Text variant="cardTitle" as="div" tone="ink" style={{ marginTop: '3px' }}>
                                {v.readMood}
                              </Text>
                            </div>
                          </Card>
                          <Card pad="sm" style={{ flex: '1 1 200px' }}>
                            <Text variant="micro" as="div" tone="subtle">
                              EFFORT
                            </Text>
                            <div
                              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}
                            >
                              <Text variant="cardTitle" tone="ink">
                                {v.rpeLabel}
                              </Text>
                              <span style={{ display: 'flex', gap: '3px' }}>
                                {(v.readStars ?? []).map((s, i) => (
                                  <Fragment key={i}>
                                    <span className="fc-keep" style={css(s)}>★</span>
                                  </Fragment>
                                ))}
                              </span>
                            </div>
                          </Card>
                        </div>
                        <Card style={{ marginTop: '12px' }}>
                          <Text variant="micro" as="div" tone="subtle">
                            NOTES
                          </Text>
                          <p
                            style={{
                              margin: '10px 0 0',
                              fontSize: 'var(--text-lg)',
                              fontWeight: 'var(--font-weight-regular)',
                              lineHeight: 'var(--leading-relaxed)',
                              color: 'var(--color-ink)',
                              textWrap: 'pretty',
                            }}
                          >
                            {v.readNote}
                          </p>
                        </Card>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-end',
                            gap: '10px',
                            marginTop: '22px',
                            paddingTop: '20px',
                            borderTop: '1px solid rgba(35,42,69,.07)',
                          }}
                        >
                          <Button type="danger" ghost size="lg" onClick={v.deleteEntry}>
                            Delete entry
                          </Button>
                          <Button type="primary" size="lg" onClick={v.editEntry}>
                            Edit entry
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {v.diaryEditing ? (
                    <>
                      <div style={{ marginTop: '34px', textAlign: 'center' }}>
                        <Text variant="title" as="h1" style={{ margin: '0' }}>
                          {'How did that feel? '}
                          <Sparkle
                            size={17}
                            color={colors.periwinkle}
                            glow={0.5}
                            style={{ display: 'inline-block', verticalAlign: 'middle' }}
                          />
                        </Text>
                        <p
                          style={{
                            margin: '9px 0 0',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-muted)',
                          }}
                        >
                          <span style={{ color: 'var(--color-ink)', fontWeight: 'var(--font-weight-semibold)' }}>{v.eName}</span>
                          {' · '}
                          {v.longDate}
                        </p>
                      </div>
                      <div
                        role="radiogroup"
                        aria-label="How did it feel?"
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          gap: '12px',
                          marginTop: '34px',
                        }}
                      >
                        {(v.moods ?? []).map((m, i) => (
                          <Fragment key={i}>
                            <button
                              role="radio"
                              aria-checked={!!m?.checked}
                              tabIndex={m?.tab}
                              data-mood={m?.index}
                              onKeyDown={m?.keys}
                              onClick={m?.pick}
                              style={css(m?.wrap)}
                            >
                              <span className="fc-keep" style={css(m?.face)}>
                                {m?.isHappy ? (
                                  <>
                                    <MoodFace mood="Happy" size={34} />
                                  </>
                                ) : null}
                                {m?.isNeutral ? (
                                  <>
                                    <MoodFace mood="Neutral" size={34} />
                                  </>
                                ) : null}
                                {m?.isSad ? (
                                  <>
                                    <MoodFace mood="Sad" size={34} />
                                  </>
                                ) : null}
                                {m?.isMad ? (
                                  <>
                                    <MoodFace mood="Mad" size={34} />
                                  </>
                                ) : null}
                              </span>
                              <span style={css(m?.label)}>{m?.name}</span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ maxWidth: '560px', margin: '40px auto 0' }}>
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
                        >
                          <p
                            style={{
                              margin: '0',
                              fontSize: 'var(--text-base)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-slate)',
                            }}
                          >
                            How hard did it feel?
                          </p>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontSize: 'var(--text-md)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-pink-deep)',
                            }}
                          >
                            {v.rpeLabel}
                          </span>
                        </div>
                        <div role="radiogroup" aria-label="How hard did it feel?" style={{ display: 'flex', gap: '4px', marginTop: '8px', marginLeft: '-6px' }}>
                          {(v.stars ?? []).map((s, i) => (
                            <Fragment key={i}>
                              <button
                                role="radio"
                                aria-checked={!!s?.checked}
                                aria-label={s?.label}
                                tabIndex={s?.tab}
                                data-star={s?.index}
                                onKeyDown={s?.keys}
                                onClick={s?.pick}
                                style={css(s?.style)}
                              >
                                <span aria-hidden="true">{s?.glyph}</span>
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <p
                          style={{
                            margin: '28px 0 10px',
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-slate)',
                          }}
                        >
                          Notes (optional)
                        </p>
                        <TextArea
                          aria-label="Notes"
                          rows={5}
                          value={v.entryNote ?? ''}
                          onChange={v.setEntryNote}
                          placeholder="Energy, soreness, what worked, what didn't…"
                        />
                        {v.saveEntryHint ? (
                          <Text id="save-entry-hint" variant="caption" tone="muted" as="p" style={{ margin: '18px 0 0', textAlign: 'center' }}>
                            {v.saveEntryHint}
                          </Text>
                        ) : null}
                        <Button
                          type="primary"
                          size="lg"
                          fullWidth
                          glow
                          onClick={v.saveEntry}
                          aria-disabled={!v.canSaveEntry}
                          aria-describedby={v.saveEntryHint ? 'save-entry-hint' : undefined}
                          style={{ marginTop: v.saveEntryHint ? '10px' : '22px' }}
                        >
                          {v.saveEntryLabel}
                        </Button>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
          </main>
        </div>
        <nav aria-label="Main" data-tabbar style={css(v.tabbarStyle)}>
          <a href="/calendar" onClick={v.navGo(v.goDay, 'day')} aria-current={v.navCalOn} style={css(v.mTabCal)}>
            <Calendar color={v.mCalColor} size={22} />
            <span className="mlabel" style={css(v.mCalLabel)}>
              Calendar
            </span>
          </a>
          <a href="/chronicle" onClick={v.navGo(v.goDiaryList, 'diaryList')} aria-current={v.navDiaryOn} style={css(v.mTabDiary)}>
            <Quill color={v.mDiaryColor} size={22} />
            <span className="mlabel" style={css(v.mDiaryLabel)}>
              Chronicle
            </span>
          </a>
          <a href="/spellbook" onClick={v.navGo(v.goArsenal, 'arsenal')} aria-current={v.navArsenalOn} style={css(v.mTabArsenal)}>
            <SpellCards color={v.mArsenalColor} size={22} />
            <span className="mlabel" style={css(v.mArsenalLabel)}>
              Spellbook
            </span>
          </a>
          <a href="/progress" onClick={v.navGo(v.goSummary, 'summary')} aria-current={v.navSummaryOn} style={css(v.mTabSummary)}>
            <BarChart color={v.mSummaryColor} size={22} />
            <span className="mlabel" style={css(v.mSummaryLabel)}>
              Progress
            </span>
          </a>
          <a href="/profile" onClick={v.navGo(v.goProfile, 'profile')} aria-current={v.navProfileOn} style={css(v.mTabProfile)}>
            <User color={v.mProfileColor} size={22} />
            <span className="mlabel" style={css(v.mProfileLabel)}>
              Profile
            </span>
          </a>
        </nav>
      </div>
    </>
  );
}
