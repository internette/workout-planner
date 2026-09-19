// Ported from the Claude Design prototype "Workout Planner.dc.html".
// Pure template: every value it reads comes from the `v` object built in Planner.tsx.
/* eslint-disable */
// @ts-nocheck
import { Fragment } from 'react';
import { css, t } from './viewHelpers';
import { Button, IconButton } from '@/components/ui/buttons';
import {
  BarChart,
  Bike,
  Book,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Close,
  Dumbbell,
  DumbbellSmall,
  Flame,
  Gem,
  Info,
  MoodFace,
  Moon,
  Mountain,
  Notebook,
  Pencil,
  Plus,
  Repeat,
  Search,
  Sparkle,
  Swirl,
  User,
  Waves,
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
      {v.ranksOpen ? (
        <>
          <div
            style={{
              position: 'fixed',
              inset: '0',
              zIndex: '70',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              background: 'rgba(35,42,69,.35)',
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Ranks"
              style={{
                width: '100%',
                maxWidth: '440px',
                maxHeight: '80vh',
                overflowY: 'auto',
                padding: '26px',
                background: 'var(--color-white)',
                borderRadius: '24px',
                boxShadow: '0 8px 24px rgba(35,42,69,.14)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px' }}>
                <h2
                  style={{
                    margin: '0',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    letterSpacing: 'var(--tracking-tight)',
                  }}
                >
                  Ranks
                </h2>
                <span
                  style={{
                    fontSize: 'var(--text-md)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-muted)',
                  }}
                >
                  {v.rankStepLabel}
                </span>
                <IconButton label="Close" size="md" onClick={v.closeRanks} style={{ marginLeft: 'auto' }}>
                  <Close color="var(--color-muted)" strokeWidth={2.2} size={16} />
                </IconButton>
              </div>
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-regular)',
                  lineHeight: 'var(--leading-relaxed)',
                  color: 'var(--color-muted)',
                  textWrap: 'pretty',
                }}
              >
                Earned with experience — 10 XP per exercise completed, 50 XP per workout finished.
              </p>
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
            </div>
          </div>
        </>
      ) : null}
      {v.confirmOpen ? (
        <>
          <div
            style={{
              position: 'fixed',
              inset: '0',
              zIndex: '70',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              background: 'rgba(35,42,69,.35)',
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={v.confirmTitle}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '26px',
                background: 'var(--color-white)',
                borderRadius: '24px',
                boxShadow: '0 8px 24px rgba(35,42,69,.14)',
              }}
            >
              <h2
                style={{
                  margin: '0',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  letterSpacing: 'var(--tracking-tight)',
                }}
              >
                {v.confirmTitle}
              </h2>
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-regular)',
                  lineHeight: 'var(--leading-relaxed)',
                  color: 'var(--color-muted)',
                  textWrap: 'pretty',
                }}
              >
                {v.confirmBody}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '22px',
                }}
              >
                <Button type="neutral" ghost size="md" onClick={v.confirmCancel}>
                  Keep it
                </Button>
                <Button type="danger" size="md" onClick={v.confirmRun}>
                  {v.confirmLabel}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
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
          <nav style={css(v.sidebarStyle)}>
            <div style={css(v.navListStyle)}>
              <button onClick={v.goDay} aria-current={v.navCalOn} style={css(v.navCal)}>
                <Calendar color={v.navCalInk} size={18} />
                {'Calendar '}
              </button>
              <button onClick={v.goDiaryList} aria-current={v.navDiaryOn} style={css(v.navDiary)}>
                <Book color={v.navDiaryInk} size={18} />
                {'Chronicle '}
              </button>
              <button onClick={v.goArsenal} aria-current={v.navArsenalOn} style={css(v.navArsenal)}>
                <Dumbbell color={v.navArsenalInk} size={18} />
                {'Arsenal '}
              </button>
              <button onClick={v.goSummary} aria-current={v.navSummaryOn} style={css(v.navSummary)}>
                <BarChart color={v.navSummaryInk} strokeWidth={2.2} size={18} />
                {'Progress '}
              </button>
              <button onClick={v.goProfile} aria-current={v.navProfileOn} style={css(v.navProfile)}>
                <User color={v.navProfileInk} size={18} />
                {'Profile '}
              </button>
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
                <span style={{ flex: '1', minWidth: '0' }}>Couldn't save: {v.saveError}</span>
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
                    <div data-pop="month" style={{ position: 'relative', flex: 'none' }}>
                      <button onClick={v.toggleMonth} style={css(v.monthBtn)} className="hv1">
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-tight)',
                            color: 'var(--color-ink)',
                          }}
                        >
                          {v.monthName}
                        </span>
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
                      {v.monthOpen ? (
                        <>
                          <div
                            style={{
                              position: 'absolute',
                              top: '40px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '300px',
                              background: 'var(--color-white)',
                              borderRadius: '22px',
                              padding: '16px',
                              boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                              zIndex: '20',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingBottom: '12px',
                                borderBottom: '1px solid rgba(35,42,69,.09)',
                              }}
                            >
                              <span
                                style={{
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '11px',
                                  border: '1px solid rgba(35,42,69,.12)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <ChevronLeft color="var(--color-hairline)" size={17} />
                              </span>
                              <span
                                style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: 'var(--text-2xl)',
                                  fontWeight: 'var(--font-weight-bold)',
                                }}
                              >
                                {v.yearLabel}
                              </span>
                              <span
                                style={{
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '11px',
                                  border: '1px solid rgba(35,42,69,.12)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <ChevronRight color="var(--color-hairline)" size={17} />
                              </span>
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
                                  <button onClick={m?.pick} style={css(m?.style)}>
                                    {m?.short}
                                  </button>
                                </Fragment>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div role="tablist" aria-label="Calendar view" style={css(v.segRowStyle)}>
                      <button
                        onClick={v.segDay}
                        role="tab"
                        aria-selected={v.segDayOn}
                        style={css(v.segDayStyle)}
                      >
                        Day
                      </button>
                      <button
                        onClick={v.segWeek}
                        role="tab"
                        aria-selected={v.segWeekOn}
                        style={css(v.segWeekStyle)}
                      >
                        Week
                      </button>
                      <button
                        onClick={v.segMonth}
                        role="tab"
                        aria-selected={v.segMonthOn}
                        style={css(v.segMonthStyle)}
                      >
                        Month
                      </button>
                    </div>
                  </div>
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
                        <h1
                          style={{
                            margin: '0',
                            fontSize: 'var(--text-4xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-tight)',
                          }}
                        >
                          {v.dayName}
                        </h1>
                        <span
                          style={{
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-muted)',
                          }}
                        >
                          {v.shortDate}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px' }}>
                        <IconButton label="Previous week" size="md" onClick={v.prevWeek}>
                          <ChevronLeft color="var(--color-muted)" size={17} />
                        </IconButton>
                        <div style={{ flex: '1', display: 'flex', gap: '4px' }}>
                          {(v.days ?? []).map((d, i) => (
                            <Fragment key={i}>
                              <button
                                onClick={d?.pick}
                                aria-label={d?.aria}
                                aria-current={d?.isToday}
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
                            'linear-gradient(135deg,rgba(225,105,156,.16) 0%,rgba(124,143,201,.16) 50%,rgba(94,196,214,.16) 100%)',
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
                          <div
                            style={{
                              fontSize: 'var(--text-2xs)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-wide)',
                              color: 'var(--color-pink-deep)',
                            }}
                          >
                            {v.questEyebrow}
                          </div>
                          <div style={css(v.questTitleStyle)}>{v.questTitle}</div>
                          <div
                            style={{
                              fontSize: 'var(--text-md)',
                              fontWeight: 'var(--font-weight-regular)',
                              lineHeight: 'var(--leading-snug)',
                              color: 'var(--color-slate)',
                              marginTop: '3px',
                              textWrap: 'pretty',
                            }}
                          >
                            {v.questNote}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {v.hasWorkout ? (
                    <>
                      <div style={{ marginTop: '14px' }}>
                        <div
                          style={{
                            background: 'var(--color-white)',
                            borderRadius: '24px',
                            padding: '24px',
                            boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                          }}
                        >
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
                                boxShadow: '0 2px 6px rgba(214,96,139,.28),0 0 0 1px rgba(35,42,69,.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {v.dayIcoSvg}
                            </div>
                            <div style={{ minWidth: '0' }}>
                              <h2
                                style={{
                                  margin: '0',
                                  fontSize: 'var(--text-3xl)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  letterSpacing: 'var(--tracking-tight)',
                                }}
                              >
                                <button
                                  onClick={v.goDetail}
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
                                  className="hv3"
                                >
                                  {t(v.wName)}
                                  <ChevronRight color="var(--color-muted)" size={17} />
                                </button>
                              </h2>
                              <p
                                style={{
                                  margin: '4px 0 0',
                                  fontSize: 'var(--text-base)',
                                  fontWeight: 'var(--font-weight-medium)',
                                  color: 'var(--color-muted)',
                                }}
                              >
                                {v.wMeta}
                              </p>
                            </div>
                          </div>
                          {v.dayIsLift ? (
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
                                  <div style={css(v.dayProgBar)}></div>
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
                                  {v.dayProgLabel}
                                </span>
                              </div>
                            </>
                          ) : null}
                          {v.dayIsRide ? (
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
                                {(v.rideStats ?? []).map((r, i) => (
                                  <Fragment key={i}>
                                    <div>
                                      <div
                                        style={{
                                          fontSize: 'var(--text-2xs)',
                                          fontWeight: 'var(--font-weight-bold)',
                                          letterSpacing: 'var(--tracking-wide)',
                                          color: 'var(--color-subtle)',
                                        }}
                                      >
                                        {r?.label}
                                      </div>
                                      <div
                                        style={{
                                          fontFamily: 'var(--font-heading)',
                                          fontSize: 'var(--text-xl)',
                                          fontWeight: 'var(--font-weight-bold)',
                                          color: 'var(--color-ink)',
                                          marginTop: '4px',
                                        }}
                                      >
                                        {r?.value}
                                      </div>
                                    </div>
                                  </Fragment>
                                ))}
                              </div>
                            </>
                          ) : null}
                          {v.dayIsLift ? (
                            <>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '2px',
                                  marginTop: '16px',
                                }}
                              >
                                {(v.preview ?? []).map((x, i) => (
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
                          {v.hasMore ? (
                            <>
                              <button
                                onClick={v.toggleMore}
                                style={{
                                  margin: '10px 0 0 -12px',
                                  minHeight: '36px',
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
                                  {t(v.moreLabel)}
                                  <ChevronDown
                                    color="var(--color-muted)"
                                    strokeWidth={2.2}
                                    style={css(v.moreCaret)}
                                  />
                                </span>
                              </button>
                            </>
                          ) : null}
                          <Button
                            type="primary"
                            size="lg"
                            fullWidth
                            onClick={v.goDiary}
                            style={{ marginTop: '20px' }}
                          >
                            {v.ctaLabel}
                          </Button>
                        </div>
                        <aside style={{ display: 'flex', marginTop: '14px' }}>
                          <Button type="dashed" size="md" onClick={v.goNewWorkout} style={{ flex: '1' }}>
                            <Plus color="var(--color-pink-deep)" size={17} />
                            Add workout
                          </Button>
                        </aside>
                      </div>
                    </>
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
                        <h2
                          style={{
                            margin: '22px 0 0',
                            fontSize: 'var(--text-4xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-tight)',
                          }}
                        >
                          The city is quiet
                        </h2>
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
                          No quest today. Rest is how the power comes back — or add a workout if you're
                          feeling it.
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
                          <span
                            style={{
                              flex: 'none',
                              fontFamily: 'var(--font-heading)',
                              fontSize: 'var(--text-lg)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-snug)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {v.weekLabel}
                          </span>
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
                                      <span
                                        style={{
                                          fontSize: 'var(--text-base)',
                                          fontWeight: 'var(--font-weight-medium)',
                                          color: 'var(--color-muted)',
                                        }}
                                      >
                                        Rest day
                                      </span>
                                    </div>
                                  </>
                                ) : null}
                                {w?.hasRow ? (
                                  <>
                                    <button
                                      onClick={w?.open}
                                      aria-label={w?.aria}
                                      style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '13px',
                                        padding: '18px 20px',
                                        border: 'none',
                                        background: 'var(--color-white)',
                                        borderRadius: '20px',
                                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                                        textAlign: 'left',
                                        font: 'inherit',
                                        color: 'inherit',
                                        cursor: 'pointer',
                                      }}
                                      className="hv5"
                                    >
                                      {w?.isRideRow ? (
                                        <>
                                          <Bike color="var(--color-periwinkle)" size={19} />
                                        </>
                                      ) : null}
                                      {w?.isPush ? (
                                        <>
                                          <Flame color="var(--color-pink)" size={16} />
                                        </>
                                      ) : null}
                                      {w?.isPull ? (
                                        <>
                                          <Waves color="var(--color-periwinkle)" size={20} />
                                        </>
                                      ) : null}
                                      {w?.isLegs ? (
                                        <>
                                          <Mountain color="var(--color-slate)" size={16} />
                                        </>
                                      ) : null}
                                      {w?.isCore ? (
                                        <>
                                          <Swirl color="var(--color-teal)" size={20} />
                                        </>
                                      ) : null}
                                      <div style={{ minWidth: '0', flex: '1' }}>
                                        <div
                                          style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: 'var(--text-lg)',
                                            fontWeight: 'var(--font-weight-bold)',
                                            letterSpacing: 'var(--tracking-snug)',
                                          }}
                                        >
                                          {w?.name}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: 'var(--text-md)',
                                            fontWeight: 'var(--font-weight-regular)',
                                            color: 'var(--color-muted)',
                                            marginTop: '3px',
                                          }}
                                        >
                                          {w?.meta}
                                        </div>
                                      </div>
                                      <span style={css(w?.stateDot)}></span>
                                    </button>
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
                                  'linear-gradient(135deg,rgba(225,105,156,.16) 0%,rgba(124,143,201,.16) 50%,rgba(94,196,214,.16) 100%)',
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
                                    'linear-gradient(135deg,var(--color-pink) 0%,var(--color-periwinkle) 50%,var(--color-teal) 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Check color="var(--color-white)" strokeWidth={2.6} size={26} />
                              </div>
                              <h3
                                style={{
                                  margin: '16px 0 0',
                                  fontSize: 'var(--text-2xl)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  letterSpacing: 'var(--tracking-tight)',
                                }}
                              >
                                Week sealed
                              </h3>
                              <p
                                style={{
                                  margin: '8px auto 0',
                                  maxWidth: '320px',
                                  fontSize: 'var(--text-base)',
                                  fontWeight: 'var(--font-weight-regular)',
                                  lineHeight: 'var(--leading-relaxed)',
                                  color: 'var(--color-slate)',
                                  textWrap: 'pretty',
                                }}
                              >
                                {v.weekDoneNote}
                              </p>
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
                                  'linear-gradient(135deg,rgba(225,105,156,.16) 0%,rgba(124,143,201,.16) 50%,rgba(94,196,214,.16) 100%)',
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
                              <h3
                                style={{
                                  margin: '20px 0 0',
                                  fontSize: 'var(--text-2xl)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  letterSpacing: 'var(--tracking-tight)',
                                }}
                              >
                                Your wand's still charging
                              </h3>
                              <p
                                style={{
                                  margin: '10px auto 0',
                                  maxWidth: '340px',
                                  fontSize: 'var(--text-base)',
                                  fontWeight: 'var(--font-weight-regular)',
                                  lineHeight: 'var(--leading-relaxed)',
                                  color: 'var(--color-slate)',
                                  textWrap: 'pretty',
                                }}
                              >
                                {v.emptyWeekNote}
                              </p>
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
                      <div style={{ marginTop: '18px' }}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            alignItems: 'stretch',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '13px',
                              padding: '18px 20px',
                              background: 'var(--color-white)',
                              borderRadius: '20px',
                              boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                            }}
                          >
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
                                <span
                                  style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 'var(--font-weight-bold)',
                                  }}
                                >
                                  {v.streakCount}
                                </span>
                              </div>
                              <div
                                style={{
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: 'var(--font-weight-regular)',
                                  color: 'var(--color-muted)',
                                  marginTop: '2px',
                                }}
                              >
                                day streak
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '13px',
                              padding: '18px 20px',
                              background: 'var(--color-white)',
                              borderRadius: '20px',
                              boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                            }}
                          >
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                flex: 'none',
                                borderRadius: '50%',
                                background:
                                  'linear-gradient(135deg,var(--color-pink) 0%,var(--color-periwinkle) 50%,var(--color-teal) 100%)',
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
                              <div
                                style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: 'var(--text-2xl)',
                                  fontWeight: 'var(--font-weight-bold)',
                                }}
                              >
                                {v.monthDone}
                              </div>
                              <div
                                style={{
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: 'var(--font-weight-regular)',
                                  color: 'var(--color-muted)',
                                  marginTop: '2px',
                                }}
                              >
                                {v.monthDoneUnit}
                              </div>
                            </div>
                          </div>
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
                            style={{
                              position: 'relative',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
                              gap: '4px',
                            }}
                          >
                            {(v.monthCells ?? []).map((c, i) => (
                              <Fragment key={i}>
                                <button
                                  onClick={c?.pick}
                                  aria-label={c?.aria}
                                  aria-current={c?.isToday}
                                  style={css(c?.wrap)}
                                >
                                  <span style={css(c?.num)}>{c?.label}</span>
                                  <span style={css(c?.dot)}></span>
                                </button>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginTop: '20px' }}>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-regular)',
                              color: 'var(--color-muted)',
                            }}
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
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-regular)',
                              color: 'var(--color-muted)',
                            }}
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
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-regular)',
                              color: 'var(--color-muted)',
                            }}
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
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-regular)',
                              color: 'var(--color-muted)',
                            }}
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
                          </span>
                        </div>
                        {v.hasToday ? (
                          <>
                            <div style={{ marginTop: '30px' }}>
                              <div
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  letterSpacing: 'var(--tracking-wide)',
                                  color: 'var(--color-muted)',
                                }}
                              >
                                {v.todayLabel}
                              </div>
                              <div
                                onClick={v.openToday}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '14px',
                                  marginTop: '12px',
                                  padding: '20px 22px',
                                  background: 'var(--color-white)',
                                  borderRadius: '20px',
                                  boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                                  cursor: 'pointer',
                                }}
                              >
                                <div style={{ minWidth: '0' }}>
                                  <div
                                    style={{
                                      fontFamily: 'var(--font-heading)',
                                      fontSize: 'var(--text-lg)',
                                      fontWeight: 'var(--font-weight-bold)',
                                      letterSpacing: 'var(--tracking-snug)',
                                    }}
                                  >
                                    {v.todayName}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 'var(--text-md)',
                                      fontWeight: 'var(--font-weight-regular)',
                                      color: 'var(--color-muted)',
                                      marginTop: '3px',
                                    }}
                                  >
                                    {v.todayMeta}
                                  </div>
                                </div>
                                <span style={{ marginLeft: 'auto', display: 'flex' }}>
                                  <ChevronRight color="var(--color-muted)" size={20} />
                                </span>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </>
                  ) : null}
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
                        'linear-gradient(135deg,rgba(225,105,156,.16) 0%,rgba(124,143,201,.16) 50%,rgba(94,196,214,.16) 100%)',
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
                  <h1
                    style={{
                      margin: '22px 0 0',
                      fontSize: 'var(--text-4xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      letterSpacing: 'var(--tracking-tight)',
                    }}
                  >
                    Entry saved
                  </h1>
                  <p
                    style={{
                      margin: '10px auto 0',
                      maxWidth: '340px',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-regular)',
                      lineHeight: 'var(--leading-relaxed)',
                      color: 'var(--color-muted)',
                      textWrap: 'pretty',
                    }}
                  >
                    {v.savedLine}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      marginTop: '30px',
                      textAlign: 'left',
                    }}
                  >
                    <button
                      onClick={v.goDiaryList}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '18px 20px',
                        border: 'none',
                        borderRadius: '20px',
                        background: 'var(--color-white)',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      className="hv5"
                    >
                      <span style={{ flex: '1', minWidth: '0' }}>
                        <span
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-snug)',
                            color: 'var(--color-ink)',
                          }}
                        >
                          Read your chronicle
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 'var(--text-md)',
                            fontWeight: 'var(--font-weight-regular)',
                            color: 'var(--color-muted)',
                            marginTop: '3px',
                          }}
                        >
                          {v.savedCount}
                        </span>
                      </span>
                      <ChevronRight color="var(--color-muted)" size={20} />
                    </button>
                    <button
                      onClick={v.goNextUp}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '18px 20px',
                        border: 'none',
                        borderRadius: '20px',
                        background: 'var(--color-white)',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      className="hv5"
                    >
                      <span style={{ flex: '1', minWidth: '0' }}>
                        <span
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-snug)',
                            color: 'var(--color-ink)',
                          }}
                        >
                          {v.savedNextTitle}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 'var(--text-md)',
                            fontWeight: 'var(--font-weight-regular)',
                            color: 'var(--color-muted)',
                            marginTop: '3px',
                          }}
                        >
                          {v.savedNextMeta}
                        </span>
                      </span>
                      <ChevronRight color="var(--color-muted)" size={20} />
                    </button>
                    <button
                      onClick={v.goSummary}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '18px 20px',
                        border: 'none',
                        borderRadius: '20px',
                        background: 'var(--color-white)',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      className="hv5"
                    >
                      <span style={{ flex: '1', minWidth: '0' }}>
                        <span
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-snug)',
                            color: 'var(--color-ink)',
                          }}
                        >
                          See your progress
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 'var(--text-md)',
                            fontWeight: 'var(--font-weight-regular)',
                            color: 'var(--color-muted)',
                            marginTop: '3px',
                          }}
                        >
                          Streak, week and month totals
                        </span>
                      </span>
                      <ChevronRight color="var(--color-muted)" size={20} />
                    </button>
                  </div>
                  <Button type="neutral" ghost size="md" onClick={v.backToDay} style={{ marginTop: '20px' }}>
                    Back to calendar
                  </Button>
                </div>
              </>
            ) : null}
            {v.isProfile ? (
              <>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '18px',
                      padding: '24px',
                      background: 'var(--color-white)',
                      borderRadius: '24px',
                      boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '74px',
                        height: '74px',
                        flex: 'none',
                        borderRadius: '50%',
                        background:
                          'linear-gradient(135deg,var(--color-pink) 0%,var(--color-periwinkle) 50%,var(--color-teal) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'var(--text-5xl)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-white)',
                        }}
                      >
                        {v.profileInitial}
                      </span>
                      <span style={{ position: 'absolute', top: '-2px', right: '-2px' }}>
                        <Sparkle size={16} color={colors.goldLight} glow={0.6} />
                      </span>
                    </div>
                    <div style={{ minWidth: '0', flex: '1 1 200px' }}>
                      <h1
                        style={{
                          margin: '0',
                          fontSize: 'var(--text-4xl)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-tight)',
                        }}
                      >
                        {v.profileName}
                      </h1>
                      <p
                        style={{
                          margin: '5px 0 0',
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-regular)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        {v.profileSince}
                      </p>
                      <button
                        onClick={v.openRanks}
                        title="See all 20 ranks"
                        style={css(v.rankPillBtn)}
                        className="hv6"
                      >
                        <span style={css(v.rankGem)}></span>
                        {t(v.rankName)}
                        <ChevronRight strokeWidth={2.4} size={12} style={{ opacity: '.7' }} />
                      </button>
                      <div
                        data-pop="xp"
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '10px',
                          marginTop: '14px',
                        }}
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
                          onClick={v.toggleXpInfo}
                          title="How XP works"
                          style={{ margin: '-6px' }}
                        >
                          <Info color="var(--color-muted)" size={16} />
                        </IconButton>
                        {v.xpInfoOpen ? (
                          <>
                            <span
                              style={{
                                position: 'absolute',
                                top: '34px',
                                left: '0',
                                zIndex: '40',
                                display: 'block',
                                width: '280px',
                                padding: '16px 18px',
                                background: 'var(--color-white)',
                                borderRadius: '18px',
                                boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                              }}
                            >
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: 'var(--text-xs)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  letterSpacing: 'var(--tracking-wide)',
                                  color: 'var(--color-slate)',
                                }}
                              >
                                HOW PROGRESS WORKS
                              </span>
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: 'var(--text-base)',
                                  fontWeight: 'var(--font-weight-regular)',
                                  lineHeight: 'var(--leading-relaxed)',
                                  color: 'var(--color-ink)',
                                  marginTop: '9px',
                                  textWrap: 'pretty',
                                }}
                              >
                                Each exercise you complete earns 10 XP, and finishing a whole workout earns 50
                                XP on top. Ranks unlock at fixed XP totals.
                              </span>
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
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div id="profileStats" style={{ display: 'grid', gap: '12px', marginTop: '14px' }}>
                    {(v.profileStats ?? []).map((s, i) => (
                      <Fragment key={i}>
                        <div
                          style={{
                            padding: '18px 20px',
                            background: 'var(--color-white)',
                            borderRadius: '20px',
                            boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: 'var(--text-2xs)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-wide)',
                              color: 'var(--color-muted)',
                            }}
                          >
                            {s?.label}
                          </div>
                          <div
                            style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginTop: '6px' }}
                          >
                            <span
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-3xl)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: 'var(--color-ink)',
                              }}
                            >
                              {s?.value}
                            </span>
                            <span
                              style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-muted)',
                              }}
                            >
                              {s?.unit}
                            </span>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: '14px',
                      padding: '22px',
                      background: 'var(--color-white)',
                      borderRadius: '22px',
                      boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-slate)',
                        }}
                      >
                        SESSIONS PER WEEK
                      </span>
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        {v.chartRangeLabel}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: '8px 0 0',
                        fontSize: 'var(--text-md)',
                        fontWeight: 'var(--font-weight-regular)',
                        color: 'var(--color-muted)',
                      }}
                    >
                      {v.chartCaption}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '6px',
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
                              border: 'none',
                              background: 'none',
                              padding: '0',
                              display: 'flex',
                              flexDirection: 'column',
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
                            <span
                              style={{
                                flex: 'none',
                                width: '56px',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                              }}
                            >
                              {w?.day}
                            </span>
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
                          <p
                            style={{
                              margin: '0',
                              fontSize: 'var(--text-base)',
                              fontWeight: 'var(--font-weight-regular)',
                              color: 'var(--color-muted)',
                            }}
                          >
                            No sessions were planned that week.
                          </p>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: '14px',
                      padding: '22px',
                      background: 'var(--color-white)',
                      borderRadius: '22px',
                      boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-slate)',
                        }}
                      >
                        QUESTS CLEARED
                      </span>
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-ink)',
                        }}
                      >
                        {v.questsClearedLabel}
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
                      <div style={css(v.questsClearedBar)}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '16px' }}>
                      {(v.questStats ?? []).map((q, i) => (
                        <Fragment key={i}>
                          <div style={css(q?.row)}>
                            <span style={css(q?.swatch)}></span>
                            <span
                              style={{
                                flex: '1',
                                minWidth: '0',
                                fontSize: 'var(--text-base)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-ink)',
                              }}
                            >
                              {q?.name}
                            </span>
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
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
                      gap: '12px',
                      marginTop: '14px',
                    }}
                  >
                    <div
                      style={{
                        padding: '22px',
                        background: 'var(--color-white)',
                        borderRadius: '22px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-slate)',
                        }}
                      >
                        HOW IT FEELS
                      </div>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '18px' }}
                      >
                        {(v.moodSplit ?? []).map((m, i) => (
                          <Fragment key={i}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={css(m?.swatch)}></span>
                              <span
                                style={{
                                  fontSize: 'var(--text-base)',
                                  fontWeight: 'var(--font-weight-medium)',
                                  color: 'var(--color-ink)',
                                  flex: 'none',
                                  width: '66px',
                                }}
                              >
                                {m?.name}
                              </span>
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
                    </div>
                    <div
                      style={{
                        padding: '22px',
                        background: 'var(--color-white)',
                        borderRadius: '22px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-slate)',
                        }}
                      >
                        PERSONAL BESTS
                      </div>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '12px' }}
                      >
                        {(v.records ?? []).map((r, i) => (
                          <Fragment key={i}>
                            <div style={css(r?.rowStyle)}>
                              <span
                                style={{
                                  fontSize: 'var(--text-base)',
                                  fontWeight: 'var(--font-weight-medium)',
                                  color: 'var(--color-ink)',
                                  flex: '1',
                                  minWidth: '0',
                                }}
                              >
                                {r?.name}
                              </span>
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
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.isSummary ? (
              <>
                <div>
                  <h1
                    style={{
                      margin: '0',
                      fontSize: 'var(--text-4xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      letterSpacing: 'var(--tracking-tight)',
                    }}
                  >
                    Progress
                  </h1>
                  <p
                    style={{
                      margin: '10px 0 0',
                      maxWidth: '460px',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-regular)',
                      lineHeight: 'var(--leading-relaxed)',
                      color: 'var(--color-muted)',
                      textWrap: 'pretty',
                    }}
                  >
                    {v.summarySub}
                  </p>
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
                        'linear-gradient(135deg,rgba(225,105,156,.16) 0%,rgba(124,143,201,.16) 50%,rgba(94,196,214,.16) 100%)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 'none' }}>
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
                            {' unbroken'}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: '6px 0 0',
                            fontSize: 'var(--text-md)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-muted)',
                          }}
                        >
                          {v.streakNote}
                        </p>
                      </div>
                    </div>
                    <div style={{ flex: '1 1 180px', minWidth: '0' }}>
                      <div
                        style={{
                          fontSize: 'var(--text-2xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-slate)',
                        }}
                      >
                        LAST SEVEN SESSIONS
                      </div>
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
                    <div
                      style={{
                        flex: '1 1 260px',
                        background: 'var(--color-white)',
                        borderRadius: '22px',
                        padding: '20px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        THIS WEEK
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'var(--font-weight-bold)',
                          }}
                        >
                          {v.wkDone}
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--text-md)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-muted)',
                          }}
                        >
                          {'of '}
                          {t(v.wkTotal)}
                          {' sessions'}
                        </span>
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
                    </div>
                    <div
                      style={{
                        flex: '1 1 260px',
                        background: 'var(--color-white)',
                        borderRadius: '22px',
                        padding: '20px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        NEXT CALL
                      </div>
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
                          <p
                            style={{
                              margin: '3px 0 0',
                              fontSize: 'var(--text-md)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-muted)',
                            }}
                          >
                            {v.nextMeta}
                          </p>
                        </>
                      ) : null}
                      {v.noNext ? (
                        <>
                          <p
                            style={{
                              margin: '9px 0 0',
                              fontSize: 'var(--text-md)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-muted)',
                            }}
                          >
                            No call to answer yet.
                          </p>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: '14px',
                      padding: '22px',
                      background: 'var(--color-white)',
                      borderRadius: '22px',
                      boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-slate)',
                        }}
                      >
                        THIS WEEK'S QUESTS
                      </span>
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        {v.questsDoneLabel}
                      </span>
                    </div>
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
                            <span
                              style={{
                                flex: 'none',
                                width: '44px',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                              }}
                            >
                              {q?.day}
                            </span>
                            <span style={css(q?.title)}>{q?.name}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '14px' }}>
                    <div
                      style={{
                        flex: '1 1 170px',
                        background: 'var(--color-white)',
                        borderRadius: '22px',
                        padding: '20px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        LOGGED
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'var(--font-weight-bold)',
                          }}
                        >
                          {v.loggedCount}
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--text-md)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-muted)',
                          }}
                        >
                          entries
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        flex: '1 1 170px',
                        background: 'var(--color-white)',
                        borderRadius: '22px',
                        padding: '20px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        SEPTEMBER
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'var(--font-weight-bold)',
                          }}
                        >
                          {v.monthDone}
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--text-md)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-muted)',
                          }}
                        >
                          {v.monthDoneUnit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.isArsenal ? (
              <>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px' }}>
                    <h1
                      style={{
                        margin: '0',
                        fontSize: 'var(--text-4xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        letterSpacing: 'var(--tracking-tight)',
                      }}
                    >
                      Arsenal
                    </h1>
                    <span
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-muted)',
                      }}
                    >
                      {v.movesCount}
                    </span>
                    <Button
                      type="primary"
                      size="sm"
                      onClick={v.openArsenalAdd}
                      style={{ marginLeft: 'auto' }}
                    >
                      <Plus color="var(--color-white)" strokeWidth={2.2} size={16} />
                      New exercise
                    </Button>
                  </div>
                  <p
                    style={{
                      margin: '10px 0 0',
                      maxWidth: '460px',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-regular)',
                      lineHeight: 'var(--leading-relaxed)',
                      color: 'var(--color-muted)',
                      textWrap: 'pretty',
                    }}
                  >
                    Every exercise you've called on, grouped by the workout it belongs to.
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      marginTop: '18px',
                      padding: '12px 16px',
                      background: 'var(--color-white)',
                      borderRadius: '15px',
                      boxShadow: '0 1px 3px rgba(35,42,69,.06)',
                    }}
                  >
                    <Search color="var(--color-subtle)" size={17} />
                    <input
                      value={v.arsenalQuery ?? ''}
                      onChange={v.setArsenalQuery}
                      placeholder="Search exercises"
                      style={{
                        flex: '1',
                        minWidth: '0',
                        minHeight: '36px',
                        border: 'none',
                        background: 'none',
                        padding: '0',
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-ink)',
                      }}
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
                  {v.noMatches ? (
                    <>
                      <p
                        style={{
                          margin: '20px 0 0',
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-regular)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        {v.noMatchNote}
                      </p>
                    </>
                  ) : null}
                  {v.arsenalAddOpen ? (
                    <>
                      <div
                        style={{
                          marginTop: '18px',
                          padding: '22px',
                          background: 'var(--color-white)',
                          borderRadius: '20px',
                          boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                        }}
                      >
                        <span
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-snug)',
                          }}
                        >
                          New exercise
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 'var(--text-2xs)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-wide)',
                            color: 'var(--color-muted)',
                            margin: '16px 0 7px',
                          }}
                        >
                          EXERCISE NAME
                        </span>
                        <input
                          value={v.draftName ?? ''}
                          onChange={v.setName}
                          onKeyDown={v.commitOnEnter}
                          placeholder="e.g. Bulgarian Split Squat"
                          style={{
                            width: '100%',
                            padding: '13px 15px',
                            border: 'none',
                            borderRadius: '13px',
                            background: 'var(--color-canvas)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-ink)',
                          }}
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '14px' }}>
                          <label style={{ flex: '1 1 120px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                                marginBottom: '7px',
                              }}
                            >
                              SETS × REPS
                            </span>
                            <input
                              value={v.draftSets ?? ''}
                              onChange={v.setSets}
                              placeholder="3 × 10"
                              style={{
                                width: '100%',
                                padding: '13px 15px',
                                border: 'none',
                                borderRadius: '13px',
                                background: 'var(--color-canvas)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-ink)',
                              }}
                            />
                          </label>
                          <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                                marginBottom: '7px',
                              }}
                            >
                              WEIGHT
                            </span>
                            <input
                              value={v.draftWeight ?? ''}
                              onChange={v.setWeight}
                              placeholder="45 lb"
                              style={{
                                width: '100%',
                                padding: '13px 15px',
                                border: 'none',
                                borderRadius: '13px',
                                background: 'var(--color-canvas)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-ink)',
                              }}
                            />
                          </label>
                          <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                                marginBottom: '7px',
                              }}
                            >
                              REST
                            </span>
                            <input
                              value={v.draftRest ?? ''}
                              onChange={v.setRest}
                              placeholder="60 sec"
                              style={{
                                width: '100%',
                                padding: '13px 15px',
                                border: 'none',
                                borderRadius: '13px',
                                background: 'var(--color-canvas)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-ink)',
                              }}
                            />
                          </label>
                        </div>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 'var(--text-2xs)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-wide)',
                            color: 'var(--color-muted)',
                            margin: '16px 0 8px',
                          }}
                        >
                          ICON
                        </span>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
                            gap: '8px',
                          }}
                        >
                          {(v.iconGrid ?? []).map((g, i) => (
                            <Fragment key={i}>
                              <button onClick={g?.pick} style={css(g?.style)}>
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
                            Add to Arsenal
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginTop: '22px' }}>
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
                            <span
                              style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-slate)',
                              }}
                            >
                              {g?.label}
                            </span>
                            <span
                              style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-muted)',
                              }}
                            >
                              {g?.count}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(g?.items ?? []).map((m, i) => (
                              <Fragment key={i}>
                                <div onClick={m?.open} style={css(m?.rowStyle)}>
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
                                  <span style={{ flex: '1 1 180px', minWidth: '0' }}>
                                    <span
                                      style={{
                                        display: 'block',
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 'var(--font-weight-bold)',
                                        letterSpacing: 'var(--tracking-snug)',
                                        color: 'var(--color-ink)',
                                      }}
                                    >
                                      {m?.name}
                                    </span>
                                    <span
                                      style={{
                                        display: 'block',
                                        fontSize: 'var(--text-md)',
                                        fontWeight: 'var(--font-weight-regular)',
                                        color: 'var(--color-muted)',
                                        marginTop: '3px',
                                      }}
                                    >
                                      {m?.detail}
                                    </span>
                                  </span>
                                </div>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </Fragment>
                    ))}
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
                  <h1
                    style={{
                      margin: '24px 0 0',
                      fontSize: 'var(--text-4xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      letterSpacing: 'var(--tracking-tight)',
                    }}
                  >
                    Which session are you writing about?
                  </h1>
                  <p
                    style={{
                      margin: '10px 0 0',
                      maxWidth: '460px',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-regular)',
                      lineHeight: 'var(--leading-relaxed)',
                      color: 'var(--color-muted)',
                      textWrap: 'pretty',
                    }}
                  >
                    Entries attach to a workout on your plan. Only past sessions without an entry are listed.
                  </p>
                  <div style={{ marginTop: '22px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                      {(v.unlogged ?? []).map((u, i) => (
                        <Fragment key={i}>
                          <button onClick={u?.pick} style={css(u?.rowStyle)} className="hv7">
                            <span
                              style={{
                                flex: 'none',
                                width: '56px',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                              }}
                            >
                              {u?.day}
                            </span>
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
                            <span
                              style={{
                                flex: 'none',
                                fontSize: 'var(--text-md)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-muted)',
                              }}
                            >
                              {u?.meta}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    {v.noUnlogged ? (
                      <>
                        <p
                          style={{
                            margin: '16px 0 0',
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-regular)',
                            color: 'var(--color-muted)',
                          }}
                        >
                          Every workout on your plan already has an entry.
                        </p>
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
                    <h1
                      style={{
                        margin: '0',
                        fontSize: 'var(--text-4xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        letterSpacing: 'var(--tracking-tight)',
                      }}
                    >
                      Chronicle
                    </h1>
                    <span
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-muted)',
                      }}
                    >
                      {v.diaryCount}
                    </span>
                    <Button type="primary" size="sm" onClick={v.openNewEntry} style={{ marginLeft: 'auto' }}>
                      New entry
                    </Button>
                  </div>
                  <p
                    style={{
                      margin: '10px 0 0',
                      maxWidth: '620px',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-regular)',
                      lineHeight: 'var(--leading-relaxed)',
                      color: 'var(--color-muted)',
                      textWrap: 'pretty',
                    }}
                  >
                    Every session you've written down after the fact. Open one to read or edit it.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignSelf: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '4px',
                        padding: '5px',
                        background: 'var(--color-white)',
                        borderRadius: '15px',
                        boxShadow: '0 1px 3px rgba(35,42,69,.06)',
                      }}
                    >
                      <button onClick={v.diaryAll} aria-pressed={v.dScopeAll} style={css(v.diaryAllStyle)}>
                        All
                      </button>
                      <button
                        onClick={v.diaryToday}
                        aria-pressed={v.dScopeToday}
                        style={css(v.diaryTodayStyle)}
                      >
                        Today
                      </button>
                      <button onClick={v.diaryWeek} aria-pressed={v.dScopeWeek} style={css(v.diaryWeekStyle)}>
                        Week
                      </button>
                      <button onClick={v.diaryMonth} aria-pressed={v.dScope30} style={css(v.diaryMonthStyle)}>
                        30 days
                      </button>
                      <button
                        onClick={v.diaryRange}
                        aria-pressed={v.dScopeRange}
                        style={css(v.diaryRangeStyle)}
                      >
                        Range
                      </button>
                    </div>
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
                          <input
                            value={v.rangeFrom ?? ''}
                            onChange={v.setRangeFrom}
                            type="date"
                            style={{
                              flex: '1',
                              minWidth: '0',
                              minHeight: '36px',
                              border: 'none',
                              background: 'none',
                              padding: '8px 0',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--text-md)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-slate)',
                            }}
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
                          <input
                            value={v.rangeTo ?? ''}
                            onChange={v.setRangeTo}
                            type="date"
                            min={v.rangeMin}
                            style={{
                              flex: '1',
                              minWidth: '0',
                              minHeight: '36px',
                              border: 'none',
                              background: 'none',
                              padding: '8px 0',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--text-md)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-slate)',
                            }}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    {(v.diaryList ?? []).map((e, i) => (
                      <Fragment key={i}>
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={e?.open}
                            aria-label={e?.aria}
                            style={{
                              width: '100%',
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'flex-start',
                              gap: '16px',
                              padding: '18px 62px 18px 20px',
                              border: 'none',
                              background: 'var(--color-white)',
                              borderRadius: '20px',
                              boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                              color: 'var(--color-ink)',
                              textAlign: 'left',
                              font: 'inherit',
                              cursor: 'pointer',
                            }}
                            className="hv5"
                          >
                            <span style={css(e?.faceWrap)}>
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
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: 'var(--text-xs)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  letterSpacing: 'var(--tracking-wide)',
                                  color: 'var(--color-muted)',
                                }}
                              >
                                {e?.date}
                              </span>
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '7px',
                                  marginTop: '4px',
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 'var(--font-weight-bold)',
                                    letterSpacing: 'var(--tracking-snug)',
                                  }}
                                >
                                  {e?.name}
                                </span>
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
                                    <span style={css(s)}>★</span>
                                  </Fragment>
                                ))}
                              </span>
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: 'var(--text-md)',
                                  fontWeight: 'var(--font-weight-regular)',
                                  lineHeight: 'var(--leading-snug)',
                                  color: 'var(--color-muted)',
                                  marginTop: '7px',
                                  textWrap: 'pretty',
                                }}
                              >
                                {e?.note}
                              </span>
                            </span>
                          </button>
                          <IconButton
                            label="Delete entry"
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
                      <p
                        style={{
                          margin: '24px 0 0',
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-weight-regular)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        {v.diaryEmptyNote}
                      </p>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {v.isDetail ? (
              <>
                <div>
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
                        boxShadow: '0 2px 6px rgba(214,96,139,.28),0 0 0 1px rgba(35,42,69,.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {v.dayIcoSvg}
                    </div>
                    <div style={{ minWidth: '0' }}>
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-slate)',
                        }}
                      >
                        {v.eDate}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '9px' }}>
                        <h1
                          style={{
                            margin: '3px 0 0',
                            fontSize: 'var(--text-4xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-tight)',
                          }}
                        >
                          {v.eName}
                        </h1>
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
                    <span
                      style={{
                        flex: 'none',
                        whiteSpace: 'nowrap',
                        padding: '8px 14px',
                        borderRadius: '999px',
                        background: 'var(--color-white)',
                        fontSize: 'var(--text-md)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-slate)',
                        boxShadow: '0 1px 3px rgba(35,42,69,.06)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Clock color="var(--color-muted)" size={15} />
                      {t(v.eTime)}
                    </span>
                    {v.inSeries ? (
                      <>
                        <span
                          style={{
                            flex: 'none',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            padding: '8px 8px 8px 14px',
                            borderRadius: '999px',
                            background: 'var(--color-pink)',
                            fontSize: 'var(--text-md)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-white)',
                          }}
                        >
                          <Repeat color="var(--color-white)" size={15} />
                          {'Weekly series '}
                          <IconButton
                            label="End this series"
                            size="xs"
                            tone="inverse"
                            onClick={v.endSeries}
                            title="End this series"
                          >
                            <Close color="rgba(255,255,255,0.85)" strokeWidth={2.2} size={13} />
                          </IconButton>
                        </span>
                      </>
                    ) : null}
                    {(v.areaPills ?? []).map((a, i) => (
                      <Fragment key={i}>
                        <span
                          style={{
                            flex: 'none',
                            whiteSpace: 'nowrap',
                            padding: '8px 14px',
                            borderRadius: '999px',
                            background: 'var(--color-white)',
                            fontSize: 'var(--text-md)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-slate)',
                            boxShadow: '0 1px 3px rgba(35,42,69,.06)',
                          }}
                        >
                          {a}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  {v.dayIsRide ? (
                    <>
                      <div
                        style={{
                          marginTop: '18px',
                          padding: '20px 22px',
                          background: 'var(--color-white)',
                          borderRadius: '20px',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px' }}>
                          {(v.rideStats ?? []).map((r, i) => (
                            <Fragment key={i}>
                              <div>
                                <div
                                  style={{
                                    fontSize: 'var(--text-2xs)',
                                    fontWeight: 'var(--font-weight-bold)',
                                    letterSpacing: 'var(--tracking-wide)',
                                    color: 'var(--color-subtle)',
                                  }}
                                >
                                  {r?.label}
                                </div>
                                <div
                                  style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: 'var(--font-weight-bold)',
                                    color: 'var(--color-ink)',
                                    marginTop: '4px',
                                  }}
                                >
                                  {r?.value}
                                </div>
                              </div>
                            </Fragment>
                          ))}
                        </div>
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
                      </div>
                    </>
                  ) : null}
                  {v.dayIsLift ? (
                    <>
                      <div
                        style={{
                          marginTop: '16px',
                          padding: '20px 22px',
                          background: 'var(--color-white)',
                          borderRadius: '20px',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        }}
                      >
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
                        >
                          <span
                            style={{
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-wide)',
                              color: 'var(--color-slate)',
                            }}
                          >
                            PROGRESS
                          </span>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontFamily: 'var(--font-heading)',
                              fontSize: 'var(--text-lg)',
                              fontWeight: 'var(--font-weight-bold)',
                              color: 'var(--color-ink)',
                            }}
                          >
                            {v.progLabel}
                          </span>
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
                      </div>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}
                      >
                        {(v.exercises ?? []).map((ex, i) => (
                          <Fragment key={i}>
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: '13px',
                                padding: '16px 20px',
                                background: 'var(--color-white)',
                                borderRadius: '18px',
                                boxShadow: '0 4px 14px rgba(35,42,69,.07)',
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
                                {ex?.icoSvg}
                              </span>
                              <span style={{ minWidth: '0' }}>
                                <span style={css(ex?.nameStyle)}>{ex?.name}</span>
                                <span
                                  style={{
                                    display: 'block',
                                    fontSize: 'var(--text-md)',
                                    fontWeight: 'var(--font-weight-regular)',
                                    color: 'var(--color-muted)',
                                    marginTop: '3px',
                                  }}
                                >
                                  {ex?.detail}
                                </span>
                              </span>
                              <button
                                onClick={ex?.toggleDone}
                                aria-pressed={ex?.isDone}
                                aria-label={ex?.doneAria}
                                style={css(ex?.doneBtn)}
                              >
                                <Check color={ex?.doneStroke} strokeWidth={2.6} size={15} />
                              </button>
                            </div>
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
                    <Button type="secondary" size="lg" onClick={v.goEdit}>
                      <Pencil color="var(--color-slate)" size={17} />
                      Edit workout
                    </Button>
                    <Button type="primary" size="lg" onClick={v.goDiary}>
                      {v.ctaLabel}
                    </Button>
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
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-slate)',
                        }}
                      >
                        NEW WORKOUT
                      </div>
                      <h1
                        style={{
                          margin: '3px 0 0',
                          fontSize: 'var(--text-3xl)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-tight)',
                        }}
                      >
                        What kind of session?
                      </h1>
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
                    <button
                      onClick={v.pickTypeLift}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '24px',
                        border: 'none',
                        borderRadius: '22px',
                        background: 'var(--color-white)',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      className="hv5"
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
                        <span
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-snug)',
                            color: 'var(--color-ink)',
                          }}
                        >
                          Lifting
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-regular)',
                            lineHeight: 'var(--leading-snug)',
                            color: 'var(--color-muted)',
                            marginTop: '5px',
                            textWrap: 'pretty',
                          }}
                        >
                          Build a list of exercises with sets, reps and weight.
                        </span>
                      </span>
                    </button>
                    <button
                      onClick={v.pickTypeCycle}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '24px',
                        border: 'none',
                        borderRadius: '22px',
                        background: 'var(--color-white)',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      className="hv5"
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
                        <span
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-snug)',
                            color: 'var(--color-ink)',
                          }}
                        >
                          Cycling
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-regular)',
                            lineHeight: 'var(--leading-snug)',
                            color: 'var(--color-muted)',
                            marginTop: '5px',
                            textWrap: 'pretty',
                          }}
                        >
                          Set a distance, duration and target effort for the ride.
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </>
            ) : null}
            {v.isEdit ? (
              <>
                <div style={{ position: 'relative' }}>
                  {v.leaveOpen ? (
                    <>
                      <div
                        style={{
                          position: 'fixed',
                          inset: '0',
                          zIndex: '60',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '24px',
                          background: 'rgba(35,42,69,.35)',
                        }}
                      >
                        <div
                          role="dialog"
                          aria-modal="true"
                          aria-label="Keep your changes?"
                          style={{
                            width: '100%',
                            maxWidth: '400px',
                            padding: '26px',
                            background: 'var(--color-white)',
                            borderRadius: '24px',
                            boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                          }}
                        >
                          <h2
                            style={{
                              margin: '0',
                              fontSize: 'var(--text-2xl)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-tight)',
                            }}
                          >
                            Keep your changes?
                          </h2>
                          <p
                            style={{
                              margin: '10px 0 0',
                              fontSize: 'var(--text-base)',
                              fontWeight: 'var(--font-weight-regular)',
                              lineHeight: 'var(--leading-relaxed)',
                              color: 'var(--color-muted)',
                              textWrap: 'pretty',
                            }}
                          >
                            You've edited this workout. Save what you changed, or leave it as it was.
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                              gap: '10px',
                              marginTop: '22px',
                            }}
                          >
                            <Button type="danger" ghost size="md" onClick={v.discardLeave}>
                              Discard changes
                            </Button>
                            <Button type="primary" size="md" onClick={v.saveLeave}>
                              Save changes
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 12px' }}>
                    <IconButton label="Back" size="md" onClick={v.tryLeave} style={{ marginLeft: '-8px' }}>
                      <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={18} />
                    </IconButton>
                    <div data-pop="icons" style={{ position: 'relative', flex: 'none' }}>
                      <button
                        onClick={v.toggleIcons}
                        aria-label="Choose workout icon"
                        aria-expanded={v.iconsOpen}
                        style={css(v.iconBadge)}
                      >
                        {v.workoutIcoSvg}
                      </button>
                      {v.iconsOpen ? (
                        <>
                          <div
                            style={{
                              position: 'absolute',
                              top: '52px',
                              left: '0',
                              zIndex: '30',
                              width: '238px',
                              padding: '14px',
                              background: 'var(--color-white)',
                              borderRadius: '20px',
                              boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                            }}
                          >
                            <div
                              style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-slate)',
                                padding: '0 2px 10px',
                              }}
                            >
                              ICON
                            </div>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
                                gap: '8px',
                              }}
                            >
                              {(v.workoutIconGrid ?? []).map((w, i) => (
                                <Fragment key={i}>
                                  <button onClick={w?.pick} style={css(w?.style)}>
                                    {w?.svg}
                                  </button>
                                </Fragment>
                              ))}
                            </div>
                            <div
                              style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-slate)',
                                padding: '14px 2px 10px',
                              }}
                            >
                              COLOR
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {(v.iconColors ?? []).map((c, i) => (
                                <Fragment key={i}>
                                  <button onClick={c?.pick} style={css(c?.style)}></button>
                                </Fragment>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div style={{ flex: '1 1 220px', minWidth: '0' }}>
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-bold)',
                          letterSpacing: 'var(--tracking-wide)',
                          color: 'var(--color-slate)',
                        }}
                      >
                        {v.eEyebrow}
                      </div>
                      {v.eNamePlaceholder ? (
                        <>
                          <input
                            value={v.eName ?? ''}
                            onChange={v.setNewName}
                            onKeyDown={v.commitOnEnter}
                            placeholder="Name this workout"
                            style={{
                              margin: '3px 0 0',
                              width: '100%',
                              minHeight: '36px',
                              padding: '5px 0',
                              border: 'none',
                              borderBottom: '1.5px dashed rgba(35,42,69,.3)',
                              background: 'none',
                              fontFamily: 'var(--font-heading)',
                              fontSize: 'var(--text-3xl)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-tight)',
                              color: 'var(--color-ink)',
                            }}
                          />
                        </>
                      ) : null}
                      {v.eNameStatic ? (
                        <>
                          <input
                            value={v.eName ?? ''}
                            onChange={v.setEditName}
                            onKeyDown={v.commitOnEnter}
                            placeholder="Name this workout"
                            style={{
                              margin: '3px 0 0',
                              width: '100%',
                              minHeight: '36px',
                              padding: '5px 0',
                              border: 'none',
                              borderBottom: '1.5px dashed rgba(35,42,69,.3)',
                              background: 'none',
                              fontFamily: 'var(--font-heading)',
                              fontSize: 'var(--text-3xl)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-tight)',
                              color: 'var(--color-ink)',
                            }}
                          />
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
                    <span data-pop="date" style={{ position: 'relative', flex: 'none' }}>
                      <button
                        onClick={v.toggleDate}
                        style={{
                          padding: '8px 14px',
                          border: 'none',
                          borderRadius: '999px',
                          background: 'var(--color-white)',
                          fontSize: 'var(--text-md)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-slate)',
                          boxShadow: '0 1px 3px rgba(35,42,69,.06)',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                        }}
                        className="hv12"
                      >
                        <Calendar color="var(--color-muted)" size={15} />
                        {t(v.eDate)}
                      </button>
                      {v.dateOpen ? (
                        <>
                          <span
                            style={{
                              position: 'absolute',
                              top: '44px',
                              left: '0',
                              zIndex: '30',
                              display: 'block',
                              width: '280px',
                              padding: '16px',
                              background: 'var(--color-white)',
                              borderRadius: '20px',
                              boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <IconButton label="Previous month" size="md" onClick={v.prevMonth}>
                                <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={15} />
                              </IconButton>
                              <span
                                style={{
                                  flex: '1',
                                  textAlign: 'center',
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: 'var(--text-lg)',
                                  fontWeight: 'var(--font-weight-bold)',
                                }}
                              >
                                {v.monthName}
                              </span>
                              <IconButton label="Next month" size="md" onClick={v.nextMonth}>
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
                                  <button onClick={p?.pick} style={css(p?.style)}>
                                    {p?.label}
                                  </button>
                                </Fragment>
                              ))}
                            </span>
                          </span>
                        </>
                      ) : null}
                    </span>
                    {v.repeatOn ? (
                      <>
                        <span
                          style={{
                            flex: 'none',
                            whiteSpace: 'nowrap',
                            padding: '8px 14px',
                            borderRadius: '999px',
                            background: 'var(--color-pink)',
                            fontSize: 'var(--text-md)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-white)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Repeat color="var(--color-white)" size={15} />
                          Weekly
                        </span>
                      </>
                    ) : null}
                    <span
                      style={{
                        padding: '8px 14px',
                        borderRadius: '999px',
                        background: 'var(--color-white)',
                        fontSize: 'var(--text-md)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-slate)',
                        boxShadow: '0 1px 3px rgba(35,42,69,.06)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        flex: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Clock color="var(--color-muted)" size={17} />
                      {t(v.eTime)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '16px',
                      padding: '18px 20px',
                      background: 'var(--color-white)',
                      borderRadius: '20px',
                      boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                    }}
                  >
                    <span style={{ display: 'flex' }}>
                      <Repeat color="var(--color-muted)" size={20} />
                    </span>
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                      Repeat weekly
                    </span>
                    <button
                      onClick={v.toggleRepeat}
                      role="switch"
                      aria-checked={v.repeatOn}
                      aria-label="Repeat weekly"
                      style={css(v.switchTrack)}
                    >
                      <span style={css(v.switchKnob)}></span>
                    </button>
                  </div>
                  {v.ridePlanStatic ? (
                    <>
                      <div style={{ marginTop: '18px' }}>
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
                        >
                          <span
                            style={{
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-wide)',
                              color: 'var(--color-slate)',
                            }}
                          >
                            RIDE PLAN
                          </span>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-subtle)',
                            }}
                          >
                            {v.rideLockNote}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '22px', marginTop: '12px' }}>
                          <div>
                            <div
                              style={{
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-subtle)',
                              }}
                            >
                              DISTANCE
                            </div>
                            <div
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: 'var(--color-ink)',
                                marginTop: '4px',
                              }}
                            >
                              {v.planDistText}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-subtle)',
                              }}
                            >
                              DURATION
                            </div>
                            <div
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: 'var(--color-ink)',
                                marginTop: '4px',
                              }}
                            >
                              {v.planDurText}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-subtle)',
                              }}
                            >
                              ELEVATION
                            </div>
                            <div
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: 'var(--color-ink)',
                                marginTop: '4px',
                              }}
                            >
                              {v.planElevText}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-subtle)',
                              }}
                            >
                              TARGET EFFORT
                            </div>
                            <div
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: 'var(--color-ink)',
                                marginTop: '4px',
                              }}
                            >
                              {v.rideZone}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {v.ridePlanEdit ? (
                    <>
                      <div
                        style={{
                          marginTop: '16px',
                          padding: '22px',
                          background: 'var(--color-white)',
                          borderRadius: '20px',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-wide)',
                            color: 'var(--color-slate)',
                          }}
                        >
                          RIDE PLAN
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
                          <label style={{ flex: '1 1 130px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                                marginBottom: '7px',
                              }}
                            >
                              {'DISTANCE '}
                              <span style={{ color: 'var(--color-subtle)' }}>(MILES)</span>
                            </span>
                            <input
                              value={v.rideDistance ?? ''}
                              onChange={v.setDistance}
                              inputMode="decimal"
                              placeholder="24.5"
                              style={{
                                width: '100%',
                                padding: '13px 15px',
                                border: 'none',
                                borderRadius: '13px',
                                background: 'var(--color-canvas)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-ink)',
                              }}
                            />
                          </label>
                          <label style={{ flex: '1 1 130px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                                marginBottom: '7px',
                              }}
                            >
                              {'ELEVATION '}
                              <span style={{ color: 'var(--color-subtle)' }}>(FEET)</span>
                            </span>
                            <input
                              value={v.rideElev ?? ''}
                              onChange={v.setElev}
                              inputMode="numeric"
                              placeholder="1200"
                              style={{
                                width: '100%',
                                padding: '13px 15px',
                                border: 'none',
                                borderRadius: '13px',
                                background: 'var(--color-canvas)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-ink)',
                              }}
                            />
                          </label>
                          <div style={{ flex: '1 1 210px', minWidth: '0' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                                marginBottom: '7px',
                              }}
                            >
                              DURATION
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  flex: '1',
                                  minWidth: '0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '13px 15px',
                                  borderRadius: '13px',
                                  background: 'var(--color-canvas)',
                                }}
                              >
                                <input
                                  value={v.rideHours ?? ''}
                                  onChange={v.setHours}
                                  inputMode="numeric"
                                  placeholder="1"
                                  style={{
                                    width: '100%',
                                    minWidth: '0',
                                    border: 'none',
                                    background: 'none',
                                    padding: '0',
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: 'var(--color-ink)',
                                  }}
                                />
                                <span
                                  style={{
                                    flex: 'none',
                                    fontSize: 'var(--text-md)',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    color: 'var(--color-muted)',
                                  }}
                                >
                                  hr
                                </span>
                              </span>
                              <span
                                style={{
                                  flex: '1',
                                  minWidth: '0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '13px 15px',
                                  borderRadius: '13px',
                                  background: 'var(--color-canvas)',
                                }}
                              >
                                <input
                                  value={v.rideMins ?? ''}
                                  onChange={v.setMins}
                                  inputMode="numeric"
                                  placeholder="20"
                                  style={{
                                    width: '100%',
                                    minWidth: '0',
                                    border: 'none',
                                    background: 'none',
                                    padding: '0',
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: 'var(--color-ink)',
                                  }}
                                />
                                <span
                                  style={{
                                    flex: 'none',
                                    fontSize: 'var(--text-md)',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    color: 'var(--color-muted)',
                                  }}
                                >
                                  min
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 'var(--text-2xs)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-wide)',
                            color: 'var(--color-muted)',
                            margin: '18px 0 9px',
                          }}
                        >
                          TARGET EFFORT
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          <button onClick={v.setZoneRecovery} style={css(v.zoneRecovery)}>
                            Recovery
                          </button>
                          <button onClick={v.setZoneEndurance} style={css(v.zoneEndurance)}>
                            Endurance
                          </button>
                          <button onClick={v.setZoneTempo} style={css(v.zoneTempo)}>
                            Tempo
                          </button>
                          <button onClick={v.setZoneIntervals} style={css(v.zoneIntervals)}>
                            Intervals
                          </button>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {v.ridePlanStatic ? (
                    <>
                      <div
                        style={{
                          marginTop: '14px',
                          padding: '22px',
                          background: 'var(--color-white)',
                          borderRadius: '20px',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        }}
                      >
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
                        >
                          <span
                            style={{
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-wide)',
                              color: 'var(--color-slate)',
                            }}
                          >
                            WHAT YOU ACTUALLY RODE
                          </span>
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
                          <label style={{ flex: '1 1 130px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                                marginBottom: '7px',
                              }}
                            >
                              {'DISTANCE '}
                              <span style={{ color: 'var(--color-subtle)' }}>(MILES)</span>
                            </span>
                            <input
                              value={v.actDistance ?? ''}
                              onChange={v.setActDistance}
                              inputMode="decimal"
                              placeholder={v.plannedDistPh}
                              style={{
                                width: '100%',
                                padding: '13px 15px',
                                border: 'none',
                                borderRadius: '13px',
                                background: 'var(--color-canvas)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-ink)',
                              }}
                            />
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-regular)',
                                color: 'var(--color-subtle)',
                                marginTop: '6px',
                              }}
                            >
                              {v.plannedDist}
                            </span>
                          </label>
                          <label style={{ flex: '1 1 130px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                                marginBottom: '7px',
                              }}
                            >
                              {'ELEVATION '}
                              <span style={{ color: 'var(--color-subtle)' }}>(FEET)</span>
                            </span>
                            <input
                              value={v.actElev ?? ''}
                              onChange={v.setActElev}
                              inputMode="numeric"
                              placeholder={v.plannedElevPh}
                              style={{
                                width: '100%',
                                padding: '13px 15px',
                                border: 'none',
                                borderRadius: '13px',
                                background: 'var(--color-canvas)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-ink)',
                              }}
                            />
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-regular)',
                                color: 'var(--color-subtle)',
                                marginTop: '6px',
                              }}
                            >
                              {v.plannedElev}
                            </span>
                          </label>
                          <div style={{ flex: '1 1 210px', minWidth: '0' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-muted)',
                                marginBottom: '7px',
                              }}
                            >
                              DURATION
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  flex: '1',
                                  minWidth: '0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '13px 15px',
                                  borderRadius: '13px',
                                  background: 'var(--color-canvas)',
                                }}
                              >
                                <input
                                  value={v.actHours ?? ''}
                                  onChange={v.setActHours}
                                  inputMode="numeric"
                                  placeholder="0"
                                  style={{
                                    width: '100%',
                                    minWidth: '0',
                                    border: 'none',
                                    background: 'none',
                                    padding: '0',
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: 'var(--color-ink)',
                                  }}
                                />
                                <span
                                  style={{
                                    flex: 'none',
                                    fontSize: 'var(--text-md)',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    color: 'var(--color-muted)',
                                  }}
                                >
                                  hr
                                </span>
                              </span>
                              <span
                                style={{
                                  flex: '1',
                                  minWidth: '0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '13px 15px',
                                  borderRadius: '13px',
                                  background: 'var(--color-canvas)',
                                }}
                              >
                                <input
                                  value={v.actMins ?? ''}
                                  onChange={v.setActMins}
                                  inputMode="numeric"
                                  placeholder="0"
                                  style={{
                                    width: '100%',
                                    minWidth: '0',
                                    border: 'none',
                                    background: 'none',
                                    padding: '0',
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: 'var(--color-ink)',
                                  }}
                                />
                                <span
                                  style={{
                                    flex: 'none',
                                    fontSize: 'var(--text-md)',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    color: 'var(--color-muted)',
                                  }}
                                >
                                  min
                                </span>
                              </span>
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
                      </div>
                    </>
                  ) : null}
                  {v.isLift ? (
                    <>
                      <div
                        style={{
                          marginTop: '16px',
                          padding: '20px 22px',
                          background: 'var(--color-white)',
                          borderRadius: '20px',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-wide)',
                            color: 'var(--color-slate)',
                          }}
                        >
                          TARGET AREAS
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
                          {(v.targetAreas ?? []).map((t, i) => (
                            <Fragment key={i}>
                              <button onClick={t?.toggle} style={css(t?.style)}>
                                {t?.name}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                  {v.hasProgress ? (
                    <>
                      <div
                        style={{
                          marginTop: '16px',
                          padding: '20px 22px',
                          background: 'var(--color-white)',
                          borderRadius: '20px',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        }}
                      >
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
                        >
                          <span
                            style={{
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-wide)',
                              color: 'var(--color-slate)',
                            }}
                          >
                            PROGRESS
                          </span>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontFamily: 'var(--font-heading)',
                              fontSize: 'var(--text-lg)',
                              fontWeight: 'var(--font-weight-bold)',
                              color: 'var(--color-ink)',
                            }}
                          >
                            {v.progLabel}
                          </span>
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
                      </div>
                    </>
                  ) : null}
                  {v.isLift ? (
                    <>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}
                      >
                        {(v.exercises ?? []).map((ex, i) => (
                          <Fragment key={i}>
                            <div
                              style={{
                                background: 'var(--color-white)',
                                borderRadius: '20px',
                                padding: '20px',
                                boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                                <div data-pop="ex" style={{ position: 'relative', flex: 'none' }}>
                                  <button
                                    onClick={ex?.toggle}
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
                                        '0 2px 6px rgba(214,96,139,.28),0 0 0 1px rgba(35,42,69,.05)',
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
                                  {ex?.open ? (
                                    <>
                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: '48px',
                                          left: '0',
                                          zIndex: '30',
                                          width: '186px',
                                          padding: '12px',
                                          background: 'var(--color-white)',
                                          borderRadius: '18px',
                                          boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                                        }}
                                      >
                                        <div
                                          style={{
                                            fontSize: 'var(--text-2xs)',
                                            fontWeight: 'var(--font-weight-bold)',
                                            letterSpacing: 'var(--tracking-wide)',
                                            color: 'var(--color-slate)',
                                            padding: '0 2px 9px',
                                          }}
                                        >
                                          ICON
                                        </div>
                                        <div
                                          style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
                                            gap: '7px',
                                          }}
                                        >
                                          <button onClick={ex?.pickH} style={css(ex?.optH)}>
                                            <Dumbbell color="var(--color-pink)" size={20} />
                                          </button>
                                          <button onClick={ex?.pickV} style={css(ex?.optV)}>
                                            <Dumbbell
                                              color="var(--color-pink)"
                                              size={20}
                                              style={{ transform: 'rotate(90deg)' }}
                                            />
                                          </button>
                                          <button onClick={ex?.pickD} style={css(ex?.optD)}>
                                            <DumbbellSmall color="var(--color-pink)" size={20} />
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  ) : null}
                                </div>
                                <span style={css(ex?.nameStyle)}>{ex?.name}</span>
                                <button
                                  onClick={ex?.toggleDone}
                                  aria-pressed={ex?.isDone}
                                  aria-label={ex?.doneAria}
                                  style={css(ex?.doneBtn)}
                                >
                                  <Check color={ex?.doneStroke} strokeWidth={2.6} size={15} />
                                </button>
                                <IconButton label={ex?.removeAria} size="sm" onClick={ex?.remove}>
                                  <Close color="var(--color-muted)" size={19} />
                                </IconButton>
                              </div>
                              <div
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}
                              >
                                <label style={{ flex: '1 1 120px', minWidth: '0', display: 'block' }}>
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: 'var(--text-2xs)',
                                      fontWeight: 'var(--font-weight-bold)',
                                      letterSpacing: 'var(--tracking-wide)',
                                      color: 'var(--color-muted)',
                                      marginBottom: '7px',
                                    }}
                                  >
                                    SETS × REPS
                                  </span>
                                  <input
                                    value={ex?.sets ?? ''}
                                    onChange={ex?.setSets}
                                    style={{
                                      width: '100%',
                                      padding: '13px 15px',
                                      border: 'none',
                                      borderRadius: '13px',
                                      background: 'var(--color-canvas)',
                                      fontSize: 'var(--text-lg)',
                                      fontWeight: 'var(--font-weight-medium)',
                                      color: 'var(--color-ink)',
                                    }}
                                  />
                                </label>
                                <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: 'var(--text-2xs)',
                                      fontWeight: 'var(--font-weight-bold)',
                                      letterSpacing: 'var(--tracking-wide)',
                                      color: 'var(--color-muted)',
                                      marginBottom: '7px',
                                    }}
                                  >
                                    WEIGHT
                                  </span>
                                  <input
                                    value={ex?.weight ?? ''}
                                    onChange={ex?.setWeight}
                                    style={{
                                      width: '100%',
                                      padding: '13px 15px',
                                      border: 'none',
                                      borderRadius: '13px',
                                      background: 'var(--color-canvas)',
                                      fontSize: 'var(--text-lg)',
                                      fontWeight: 'var(--font-weight-medium)',
                                      color: 'var(--color-ink)',
                                    }}
                                  />
                                </label>
                                <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: 'var(--text-2xs)',
                                      fontWeight: 'var(--font-weight-bold)',
                                      letterSpacing: 'var(--tracking-wide)',
                                      color: 'var(--color-muted)',
                                      marginBottom: '7px',
                                    }}
                                  >
                                    REST
                                  </span>
                                  <input
                                    value={ex?.rest ?? ''}
                                    onChange={ex?.setRest}
                                    style={{
                                      width: '100%',
                                      padding: '13px 15px',
                                      border: 'none',
                                      borderRadius: '13px',
                                      background: 'var(--color-canvas)',
                                      fontSize: 'var(--text-lg)',
                                      fontWeight: 'var(--font-weight-medium)',
                                      color: 'var(--color-ink)',
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
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
                        style={{ marginTop: '16px' }}
                      >
                        <Plus color="var(--color-pink)" size={19} />
                        Add exercise
                      </Button>
                    </>
                  ) : null}
                  {v.addOpen ? (
                    <>
                      <div
                        style={{
                          marginTop: '14px',
                          padding: '22px',
                          background: 'var(--color-white)',
                          borderRadius: '20px',
                          boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                        }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: 'var(--text-xl)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-snug)',
                            }}
                          >
                            Add exercise
                          </span>
                          <div
                            style={{
                              marginLeft: 'auto',
                              display: 'flex',
                              gap: '4px',
                              padding: '4px',
                              background: 'var(--color-canvas)',
                              borderRadius: '13px',
                            }}
                          >
                            <button onClick={v.modeLib} style={css(v.modeLibStyle)}>
                              From Arsenal
                            </button>
                            <button onClick={v.modeNew} style={css(v.modeNewStyle)}>
                              Create new
                            </button>
                          </div>
                        </div>
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
                                  <button onClick={l?.add} style={css(l?.style)}>
                                    <span
                                      style={{
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 'var(--font-weight-semibold)',
                                        color: 'var(--color-ink)',
                                      }}
                                    >
                                      {l?.name}
                                    </span>
                                    <span
                                      style={{
                                        marginLeft: 'auto',
                                        fontSize: 'var(--text-md)',
                                        fontWeight: 'var(--font-weight-regular)',
                                        color: 'var(--color-muted)',
                                      }}
                                    >
                                      {l?.detail}
                                    </span>
                                  </button>
                                </Fragment>
                              ))}
                              <Button
                                type="secondary"
                                ghost
                                size="sm"
                                onClick={v.goArsenal}
                                style={{ marginTop: '4px' }}
                              >
                                Browse the Arsenal
                                <ChevronRight color="var(--color-pink-deep)" strokeWidth={2.2} size={14} />
                              </Button>
                            </div>
                          </>
                        ) : null}
                        {v.addNew ? (
                          <>
                            <div style={{ marginTop: '18px' }}>
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: 'var(--text-2xs)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  letterSpacing: 'var(--tracking-wide)',
                                  color: 'var(--color-muted)',
                                  marginBottom: '7px',
                                }}
                              >
                                EXERCISE NAME
                              </span>
                              <input
                                value={v.draftName ?? ''}
                                onChange={v.setName}
                                placeholder="e.g. Bulgarian Split Squat"
                                style={{
                                  width: '100%',
                                  padding: '13px 15px',
                                  border: 'none',
                                  borderRadius: '13px',
                                  background: 'var(--color-canvas)',
                                  fontSize: 'var(--text-lg)',
                                  fontWeight: 'var(--font-weight-medium)',
                                  color: 'var(--color-ink)',
                                }}
                              />
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: 'var(--text-2xs)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  letterSpacing: 'var(--tracking-wide)',
                                  color: 'var(--color-muted)',
                                  margin: '16px 0 8px',
                                }}
                              >
                                ICON
                              </span>
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
                                    <button onClick={g?.pick} style={css(g?.style)}>
                                      {g?.svg}
                                    </button>
                                  </Fragment>
                                ))}
                              </div>
                              <div
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '14px' }}
                              >
                                <label style={{ flex: '1 1 120px', minWidth: '0', display: 'block' }}>
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: 'var(--text-2xs)',
                                      fontWeight: 'var(--font-weight-bold)',
                                      letterSpacing: 'var(--tracking-wide)',
                                      color: 'var(--color-muted)',
                                      marginBottom: '7px',
                                    }}
                                  >
                                    SETS × REPS
                                  </span>
                                  <input
                                    value={v.draftSets ?? ''}
                                    onChange={v.setSets}
                                    placeholder="3 × 10"
                                    style={{
                                      width: '100%',
                                      padding: '13px 15px',
                                      border: 'none',
                                      borderRadius: '13px',
                                      background: 'var(--color-canvas)',
                                      fontSize: 'var(--text-lg)',
                                      fontWeight: 'var(--font-weight-medium)',
                                      color: 'var(--color-ink)',
                                    }}
                                  />
                                </label>
                                <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: 'var(--text-2xs)',
                                      fontWeight: 'var(--font-weight-bold)',
                                      letterSpacing: 'var(--tracking-wide)',
                                      color: 'var(--color-muted)',
                                      marginBottom: '7px',
                                    }}
                                  >
                                    WEIGHT
                                  </span>
                                  <input
                                    value={v.draftWeight ?? ''}
                                    onChange={v.setWeight}
                                    placeholder="45 lb"
                                    style={{
                                      width: '100%',
                                      padding: '13px 15px',
                                      border: 'none',
                                      borderRadius: '13px',
                                      background: 'var(--color-canvas)',
                                      fontSize: 'var(--text-lg)',
                                      fontWeight: 'var(--font-weight-medium)',
                                      color: 'var(--color-ink)',
                                    }}
                                  />
                                </label>
                                <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: 'var(--text-2xs)',
                                      fontWeight: 'var(--font-weight-bold)',
                                      letterSpacing: 'var(--tracking-wide)',
                                      color: 'var(--color-muted)',
                                      marginBottom: '7px',
                                    }}
                                  >
                                    REST
                                  </span>
                                  <input
                                    value={v.draftRest ?? ''}
                                    onChange={v.setRest}
                                    placeholder="60 sec"
                                    style={{
                                      width: '100%',
                                      padding: '13px 15px',
                                      border: 'none',
                                      borderRadius: '13px',
                                      background: 'var(--color-canvas)',
                                      fontSize: 'var(--text-lg)',
                                      fontWeight: 'var(--font-weight-medium)',
                                      color: 'var(--color-ink)',
                                    }}
                                  />
                                </label>
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
                            Cancel
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
                      </div>
                    </>
                  ) : null}
                  <div style={{ marginTop: '24px' }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-bold)',
                        letterSpacing: 'var(--tracking-wide)',
                        color: 'var(--color-muted)',
                        marginBottom: '10px',
                      }}
                    >
                      WORKOUT NOTES
                    </span>
                    <textarea
                      rows={3}
                      placeholder="Cues, targets, anything to remember…"
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: 'none',
                        borderRadius: '18px',
                        background: 'var(--color-white)',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-ink)',
                        resize: 'vertical',
                      }}
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
                    <Button type={v.eCancelType} ghost size="lg" onClick={v.footerSecondary}>
                      {v.eCancelLabel}
                    </Button>
                    <Button type="primary" size="lg" onClick={v.saveWorkout}>
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
                        <div
                          style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-wide)',
                            color: 'var(--color-subtle)',
                          }}
                        >
                          {v.longDate}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'baseline',
                            gap: '10px',
                            marginTop: '8px',
                          }}
                        >
                          <h1
                            style={{
                              margin: '0',
                              fontSize: 'var(--text-5xl)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-tight)',
                            }}
                          >
                            {v.eName}
                          </h1>
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
                          <div
                            style={{
                              flex: '1 1 200px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '18px 20px',
                              background: 'var(--color-white)',
                              borderRadius: '20px',
                              boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                            }}
                          >
                            <span style={css(v.readMoodFace)}>{v.readMoodSvg}</span>
                            <div style={{ minWidth: '0' }}>
                              <div
                                style={{
                                  fontSize: 'var(--text-2xs)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  letterSpacing: 'var(--tracking-wide)',
                                  color: 'var(--color-subtle)',
                                }}
                              >
                                MOOD
                              </div>
                              <div
                                style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: 'var(--text-xl)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  color: 'var(--color-ink)',
                                  marginTop: '3px',
                                }}
                              >
                                {v.readMood}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              flex: '1 1 200px',
                              padding: '18px 20px',
                              background: 'var(--color-white)',
                              borderRadius: '20px',
                              boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                            }}
                          >
                            <div
                              style={{
                                fontSize: 'var(--text-2xs)',
                                fontWeight: 'var(--font-weight-bold)',
                                letterSpacing: 'var(--tracking-wide)',
                                color: 'var(--color-subtle)',
                              }}
                            >
                              EFFORT
                            </div>
                            <div
                              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}
                            >
                              <span
                                style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: 'var(--text-xl)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  color: 'var(--color-ink)',
                                }}
                              >
                                {v.rpeLabel}
                              </span>
                              <span style={{ display: 'flex', gap: '3px' }}>
                                {(v.readStars ?? []).map((s, i) => (
                                  <Fragment key={i}>
                                    <span style={css(s)}>★</span>
                                  </Fragment>
                                ))}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: '12px',
                            padding: '22px',
                            background: 'var(--color-white)',
                            borderRadius: '20px',
                            boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: 'var(--text-2xs)',
                              fontWeight: 'var(--font-weight-bold)',
                              letterSpacing: 'var(--tracking-wide)',
                              color: 'var(--color-subtle)',
                            }}
                          >
                            NOTES
                          </div>
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
                        </div>
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
                          <Button type="secondary" size="lg" onClick={v.editEntry}>
                            Edit entry
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {v.diaryEditing ? (
                    <>
                      <div style={{ marginTop: '34px', textAlign: 'center' }}>
                        <h1
                          style={{
                            margin: '0',
                            fontSize: 'var(--text-4xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            letterSpacing: 'var(--tracking-tight)',
                          }}
                        >
                          {'How did that feel? '}
                          <Sparkle
                            size={17}
                            color={colors.periwinkle}
                            glow={0.5}
                            style={{ display: 'inline-block', verticalAlign: 'middle' }}
                          />
                        </h1>
                        <p
                          style={{
                            margin: '9px 0 0',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-muted)',
                          }}
                        >
                          {v.longDate}
                        </p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          gap: '22px',
                          marginTop: '34px',
                        }}
                      >
                        {(v.moods ?? []).map((m, i) => (
                          <Fragment key={i}>
                            <button onClick={m?.pick} style={css(m?.wrap)}>
                              <span style={css(m?.face)}>
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
                        <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
                          {(v.stars ?? []).map((s, i) => (
                            <Fragment key={i}>
                              <button onClick={s?.pick} style={css(s?.style)}>
                                {s?.glyph}
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
                        <textarea
                          rows={5}
                          value={v.entryNote ?? ''}
                          onChange={v.setEntryNote}
                          placeholder="Energy, soreness, what worked, what didn't…"
                          style={{
                            width: '100%',
                            padding: '18px',
                            border: 'none',
                            borderRadius: '20px',
                            background: 'var(--color-white)',
                            boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-ink)',
                            resize: 'vertical',
                          }}
                        />
                        <Button
                          type="primary"
                          size="lg"
                          fullWidth
                          glow
                          onClick={v.saveEntry}
                          style={{ marginTop: '22px' }}
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
        <nav style={css(v.tabbarStyle)}>
          <button onClick={v.goDay} style={css(v.mTabCal)}>
            <Calendar color={v.mCalColor} size={22} />
            <span style={css(v.mCalLabel)}>Calendar</span>
          </button>
          <button onClick={v.goDiaryList} style={css(v.mTabDiary)}>
            <Notebook color={v.mDiaryColor} size={22} />
            <span style={css(v.mDiaryLabel)}>Chronicle</span>
          </button>
          <button onClick={v.goSummary} style={css(v.mTabSummary)}>
            <BarChart color={v.mSummaryColor} size={22} />
            <span style={css(v.mSummaryLabel)}>Progress</span>
          </button>
          <button onClick={v.goProfile} style={css(v.mTabProfile)}>
            <User color={v.mProfileColor} size={22} />
            <span style={css(v.mProfileLabel)}>Profile</span>
          </button>
        </nav>
      </div>
    </>
  );
}
