// Ported from the Claude Design prototype "Workout Planner.dc.html".
// Pure template: every value it reads comes from the `v` object built in Planner.tsx.
/* eslint-disable */
// @ts-nocheck
import { Fragment } from 'react';
import { css, t } from './viewHelpers';

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
                background: '#fff',
                borderRadius: '24px',
                boxShadow: '0 8px 24px rgba(35,42,69,.14)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px' }}>
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700', letterSpacing: '-.02em' }}>
                  Ranks
                </h2>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#746E88' }}>
                  {v.rankStepLabel}
                </span>
                <button
                  onClick={v.closeRanks}
                  style={{
                    marginLeft: 'auto',
                    width: '36px',
                    height: '36px',
                    border: 'none',
                    borderRadius: '12px',
                    background: 'none',
                    padding: '0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  className="hv0"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#746E88"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: '16px', height: '16px', flex: 'none' }}
                  >
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                  </svg>
                </button>
              </div>
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: '13.5px',
                  fontWeight: '400',
                  lineHeight: '1.6',
                  color: '#746E88',
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
                background: '#fff',
                borderRadius: '24px',
                boxShadow: '0 8px 24px rgba(35,42,69,.14)',
              }}
            >
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700', letterSpacing: '-.02em' }}>
                {v.confirmTitle}
              </h2>
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '1.6',
                  color: '#746E88',
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
                <button
                  onClick={v.confirmCancel}
                  style={{
                    height: '48px',
                    padding: '0 18px',
                    border: 'none',
                    borderRadius: '15px',
                    background: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#746E88',
                    cursor: 'pointer',
                  }}
                  className="hv1"
                >
                  Keep it
                </button>
                <button
                  onClick={v.confirmRun}
                  style={{
                    height: '48px',
                    padding: '0 22px',
                    border: 'none',
                    borderRadius: '15px',
                    background: '#B23A4C',
                    color: '#fff',
                    fontSize: '14.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                  className="hv2"
                >
                  {v.confirmLabel}
                </button>
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
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={v.navCalInk}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: '18px', height: '18px', flex: 'none' }}
                >
                  <rect x="3" y="5" width="18" height="16" rx="3"></rect>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <line x1="8" y1="3" x2="8" y2="6"></line>
                  <line x1="16" y1="3" x2="16" y2="6"></line>
                </svg>
                {'Calendar '}
              </button>
              <button onClick={v.goDiaryList} aria-current={v.navDiaryOn} style={css(v.navDiary)}>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={v.navDiaryInk}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: '18px', height: '18px', flex: 'none' }}
                >
                  <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"></path>
                  <path d="M5 17h14"></path>
                </svg>
                {'Chronicle '}
              </button>
              <button onClick={v.goArsenal} aria-current={v.navArsenalOn} style={css(v.navArsenal)}>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={v.navArsenalInk}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: '18px', height: '18px', flex: 'none' }}
                >
                  <line x1="6" y1="12" x2="18" y2="12"></line>
                  <line x1="4" y1="9" x2="4" y2="15"></line>
                  <line x1="20" y1="9" x2="20" y2="15"></line>
                  <line x1="7" y1="9" x2="7" y2="15"></line>
                  <line x1="17" y1="9" x2="17" y2="15"></line>
                </svg>
                {'Arsenal '}
              </button>
              <button onClick={v.goSummary} aria-current={v.navSummaryOn} style={css(v.navSummary)}>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={v.navSummaryInk}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: '18px', height: '18px', flex: 'none' }}
                >
                  <line x1="5" y1="20" x2="5" y2="13"></line>
                  <line x1="12" y1="20" x2="12" y2="8"></line>
                  <line x1="19" y1="20" x2="19" y2="4"></line>
                </svg>
                {'Progress '}
              </button>
              <button onClick={v.goProfile} aria-current={v.navProfileOn} style={css(v.navProfile)}>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={v.navProfileInk}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: '18px', height: '18px', flex: 'none' }}
                >
                  <circle cx="12" cy="8.5" r="3.6"></circle>
                  <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0"></path>
                </svg>
                {'Profile '}
              </button>
            </div>
          </nav>
          <main style={{ flex: '1 1 560px', minWidth: '0' }}>
            {v.saveError ? (
              <div
                role="alert"
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', padding: '12px 16px',
                  borderRadius: '14px', background: '#FBE9EC', color: '#B23A4C', fontSize: '13.5px',
                }}
              >
                <span style={{ flex: '1', minWidth: '0' }}>Couldn't save: {v.saveError}</span>
                <button
                  onClick={v.dismissError}
                  style={{ border: 'none', background: 'none', color: '#B23A4C', fontWeight: '600', cursor: 'pointer' }}
                >
                  Dismiss
                </button>
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
                            fontFamily: "'Space Grotesk',system-ui,sans-serif",
                            fontSize: '20px',
                            fontWeight: '700',
                            letterSpacing: '-.02em',
                            color: '#232A45',
                          }}
                        >
                          {v.monthName}
                        </span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#746E88"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: '17px', height: '17px', flex: 'none' }}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
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
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              style={{
                                width: '11px',
                                height: '11px',
                                flex: 'none',
                                animation: 'twinkle 3.4s ease-in-out 0s infinite',
                              }}
                            >
                              <path
                                d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                fill="#E1699C"
                                style={{ filter: 'drop-shadow(0 0 3px rgba(225,105,156,0.45))' }}
                              ></path>
                            </svg>
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(3px)' }}>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              style={{
                                width: '8px',
                                height: '8px',
                                flex: 'none',
                                animation: 'twinkle 4.6s ease-in-out .4s infinite',
                              }}
                            >
                              <path
                                d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                fill="#7C8FC9"
                                style={{ filter: 'drop-shadow(0 0 3px rgba(124,143,201,0.45))' }}
                              ></path>
                            </svg>
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-4px)' }}>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              style={{
                                width: '9px',
                                height: '9px',
                                flex: 'none',
                                animation: 'twinkle 5.4s ease-in-out .15s infinite',
                              }}
                            >
                              <path
                                d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                fill="#5EC4D6"
                                style={{ filter: 'drop-shadow(0 0 3px rgba(94,196,214,0.45))' }}
                              ></path>
                            </svg>
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(7px)' }}>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              style={{
                                width: '6px',
                                height: '6px',
                                flex: 'none',
                                animation: 'twinkle 6s ease-in-out .9s infinite',
                              }}
                            >
                              <path
                                d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                fill="#E1699C"
                                style={{ filter: 'drop-shadow(0 0 3px rgba(225,105,156,0.4))' }}
                              ></path>
                            </svg>
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-7px)' }}>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              style={{
                                width: '7px',
                                height: '7px',
                                flex: 'none',
                                animation: 'twinkle 4.2s ease-in-out 1.1s infinite',
                              }}
                            >
                              <path
                                d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                fill="#7C8FC9"
                                style={{ filter: 'drop-shadow(0 0 3px rgba(124,143,201,0.42))' }}
                              ></path>
                            </svg>
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(1px)' }}>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              style={{
                                width: '5px',
                                height: '5px',
                                flex: 'none',
                                animation: 'twinkle 5.2s ease-in-out 1.3s infinite',
                              }}
                            >
                              <path
                                d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                fill="#5EC4D6"
                                style={{ filter: 'drop-shadow(0 0 3px rgba(94,196,214,0.4))' }}
                              ></path>
                            </svg>
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-2px)' }}>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              style={{
                                width: '6px',
                                height: '6px',
                                flex: 'none',
                                animation: 'twinkle 6.6s ease-in-out 1.7s infinite',
                              }}
                            >
                              <path
                                d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                fill="#E1699C"
                                style={{ filter: 'drop-shadow(0 0 3px rgba(225,105,156,0.38))' }}
                              ></path>
                            </svg>
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(5px)' }}>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              style={{
                                width: '4px',
                                height: '4px',
                                flex: 'none',
                                animation: 'twinkle 4.8s ease-in-out 2s infinite',
                              }}
                            >
                              <path
                                d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                fill="#7C8FC9"
                                style={{ filter: 'drop-shadow(0 0 3px rgba(124,143,201,0.36))' }}
                              ></path>
                            </svg>
                          </span>
                          <span style={{ display: 'flex', flex: 'none', transform: 'translateY(-5px)' }}>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              style={{
                                width: '3px',
                                height: '3px',
                                flex: 'none',
                                animation: 'twinkle 5.8s ease-in-out 2.4s infinite',
                              }}
                            >
                              <path
                                d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                fill="#5EC4D6"
                                style={{ filter: 'drop-shadow(0 0 3px rgba(94,196,214,0.34))' }}
                              ></path>
                            </svg>
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
                              background: '#fff',
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
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#C7C4D0"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ width: '17px', height: '17px', flex: 'none' }}
                                >
                                  <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                              </span>
                              <span
                                style={{
                                  fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                  fontSize: '17px',
                                  fontWeight: '700',
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
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#C7C4D0"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ width: '17px', height: '17px', flex: 'none' }}
                                >
                                  <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
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
                            fontSize: '22px',
                            fontWeight: '700',
                            letterSpacing: '-.02em',
                          }}
                        >
                          {v.dayName}
                        </h1>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#746E88' }}>
                          {v.shortDate}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px' }}>
                        <button
                          onClick={v.prevWeek}
                          aria-label="Previous week"
                          style={{
                            width: '36px',
                            height: '36px',
                            flex: 'none',
                            border: 'none',
                            borderRadius: '12px',
                            background: 'none',
                            padding: '0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          className="hv0"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#746E88"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: '17px', height: '17px', flex: 'none' }}
                          >
                            <polyline points="15 18 9 12 15 6"></polyline>
                          </svg>
                        </button>
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
                        <button
                          onClick={v.nextWeek}
                          aria-label="Next week"
                          style={{
                            width: '36px',
                            height: '36px',
                            flex: 'none',
                            border: 'none',
                            borderRadius: '12px',
                            background: 'none',
                            padding: '0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          className="hv0"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#746E88"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: '17px', height: '17px', flex: 'none' }}
                          >
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
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
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            style={{ width: '10px', height: '10px', flex: 'none' }}
                          >
                            <path
                              d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                              fill="#5EC4D6"
                              style={{ filter: 'drop-shadow(0 0 4px rgba(94,196,214,0.55))' }}
                            ></path>
                          </svg>
                        </span>
                        <span style={css(v.questIconWrap)}>
                          {v.questDone ? (
                            <>
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="2.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ width: '19px', height: '19px', flex: 'none' }}
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </>
                          ) : null}
                          {v.questOpen ? (
                            <>
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                style={{ width: '19px', height: '19px', flex: 'none' }}
                              >
                                <path
                                  d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                  fill="#E1699C"
                                ></path>
                              </svg>
                            </>
                          ) : null}
                        </span>
                        <div style={{ flex: '1 1 200px', minWidth: '0' }}>
                          <div
                            style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              letterSpacing: '.11em',
                              color: '#c4548a',
                            }}
                          >
                            {v.questEyebrow}
                          </div>
                          <div style={css(v.questTitleStyle)}>{v.questTitle}</div>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: '400',
                              lineHeight: '1.5',
                              color: '#5C6684',
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
                            background: '#fff',
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
                                background: '#FCE8F1',
                                border: '2px solid #fff',
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
                                  fontSize: '20px',
                                  fontWeight: '700',
                                  letterSpacing: '-.02em',
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
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#746E88"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ width: '17px', height: '17px', flex: 'none' }}
                                  >
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                  </svg>
                                </button>
                              </h2>
                              <p
                                style={{
                                  margin: '4px 0 0',
                                  fontSize: '13.5px',
                                  fontWeight: '500',
                                  color: '#746E88',
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
                                    background: '#FCE8F1',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div style={css(v.dayProgBar)}></div>
                                </div>
                                <span
                                  style={{
                                    fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    color: '#232A45',
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
                                          fontSize: '10px',
                                          fontWeight: '700',
                                          letterSpacing: '.1em',
                                          color: '#A9A2B4',
                                        }}
                                      >
                                        {r?.label}
                                      </div>
                                      <div
                                        style={{
                                          fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                          fontSize: '16px',
                                          fontWeight: '700',
                                          color: '#232A45',
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
                                          <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#E1699C"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ width: '20px', height: '20px', flex: 'none' }}
                                          >
                                            <line x1="6" y1="12" x2="18" y2="12"></line>
                                            <line x1="4" y1="9" x2="4" y2="15"></line>
                                            <line x1="20" y1="9" x2="20" y2="15"></line>
                                            <line x1="7" y1="9" x2="7" y2="15"></line>
                                            <line x1="17" y1="9" x2="17" y2="15"></line>
                                          </svg>
                                        </>
                                      ) : null}
                                      {x?.isV ? (
                                        <>
                                          <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#E1699C"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{
                                              width: '17px',
                                              height: '17px',
                                              flex: 'none',
                                              transform: 'rotate(90deg)',
                                            }}
                                          >
                                            <line x1="6" y1="12" x2="18" y2="12"></line>
                                            <line x1="4" y1="9" x2="4" y2="15"></line>
                                            <line x1="20" y1="9" x2="20" y2="15"></line>
                                            <line x1="7" y1="9" x2="7" y2="15"></line>
                                            <line x1="17" y1="9" x2="17" y2="15"></line>
                                          </svg>
                                        </>
                                      ) : null}
                                      {x?.isD ? (
                                        <>
                                          <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#E1699C"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ width: '20px', height: '20px', flex: 'none' }}
                                          >
                                            <line x1="9" y1="12" x2="15" y2="12"></line>
                                            <line x1="6" y1="9" x2="6" y2="15"></line>
                                            <line x1="18" y1="9" x2="18" y2="15"></line>
                                          </svg>
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
                                  color: '#746E88',
                                  fontSize: '13.5px',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                }}
                                className="hv1"
                              >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  {t(v.moreLabel)}
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#746E88"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={css(v.moreCaret)}
                                  >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                  </svg>
                                </span>
                              </button>
                            </>
                          ) : null}
                          <button
                            onClick={v.goDiary}
                            style={{
                              width: '100%',
                              marginTop: '20px',
                              padding: '17px',
                              border: 'none',
                              borderRadius: '17px',
                              background: '#E1699C',
                              color: '#fff',
                              fontSize: '15px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                            className="hv4"
                          >
                            {v.ctaLabel}
                          </button>
                        </div>
                        <aside style={{ display: 'flex', marginTop: '14px' }}>
                          <button
                            onClick={v.goNewWorkout}
                            style={{
                              flex: '1',
                              padding: '15px',
                              border: '1px dashed rgba(225,105,156,.5)',
                              borderRadius: '18px',
                              background: 'rgba(252,231,239,.5)',
                              color: '#c4548a',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '7px',
                            }}
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#c4548a"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ width: '17px', height: '17px', flex: 'none' }}
                            >
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add workout
                          </button>
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
                            background: '#fff',
                            boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7C8FC9"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: '40px', height: '40px', flex: 'none' }}
                          >
                            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>
                          </svg>
                          <span style={{ position: 'absolute', top: '21px', right: '20px', display: 'flex' }}>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#E0A93A"
                              strokeWidth="2.2"
                              strokeLinejoin="round"
                              style={{ width: '9.5px', height: '9.5px', flex: 'none' }}
                            >
                              <path d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"></path>
                            </svg>
                          </span>
                        </div>
                        <h2
                          style={{
                            margin: '22px 0 0',
                            fontSize: '21px',
                            fontWeight: '700',
                            letterSpacing: '-.02em',
                          }}
                        >
                          The city is quiet
                        </h2>
                        <p
                          style={{
                            margin: '10px auto 0',
                            maxWidth: '330px',
                            fontSize: '14.5px',
                            fontWeight: '500',
                            lineHeight: '1.6',
                            color: '#746E88',
                            textWrap: 'pretty',
                          }}
                        >
                          No quest today. Rest is how the power comes back — or add a workout if you're
                          feeling it.
                        </p>
                        <button
                          onClick={v.goNewWorkout}
                          style={{
                            marginTop: '24px',
                            padding: '15px 28px',
                            border: 'none',
                            borderRadius: '16px',
                            background: '#E1699C',
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(225,105,156,.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: '16px', height: '16px', flex: 'none' }}
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                          Add workout
                        </button>
                        <span
                          style={{
                            position: 'absolute',
                            left: '14%',
                            bottom: '120px',
                            animation: 'twinkle 4s ease-in-out infinite',
                          }}
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            style={{ width: '13px', height: '13px', flex: 'none' }}
                          >
                            <path
                              d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                              fill="#7C8FC9"
                              style={{ filter: 'drop-shadow(0 0 4px rgba(124,143,201,0.5))' }}
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </>
                  ) : null}
                  {v.showWeek ? (
                    <>
                      <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={v.prevWeek}
                            aria-label="Previous week"
                            style={{
                              width: '36px',
                              height: '36px',
                              flex: 'none',
                              border: 'none',
                              borderRadius: '12px',
                              background: 'none',
                              padding: '0',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            className="hv0"
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#746E88"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ width: '17px', height: '17px', flex: 'none' }}
                            >
                              <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                          </button>
                          <span
                            style={{
                              flex: 'none',
                              fontFamily: "'Space Grotesk',system-ui,sans-serif",
                              fontSize: '15px',
                              fontWeight: '700',
                              letterSpacing: '-.01em',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {v.weekLabel}
                          </span>
                          <button
                            onClick={v.nextWeek}
                            aria-label="Next week"
                            style={{
                              width: '36px',
                              height: '36px',
                              flex: 'none',
                              border: 'none',
                              borderRadius: '12px',
                              background: 'none',
                              padding: '0',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            className="hv0"
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#746E88"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ width: '17px', height: '17px', flex: 'none' }}
                            >
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </button>
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
                                          background: '#DAD7E0',
                                        }}
                                      ></span>
                                      <span
                                        style={{ fontSize: '13.5px', fontWeight: '500', color: '#746E88' }}
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
                                        background: '#fff',
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
                                          <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#7C8FC9"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ width: '19px', height: '19px', flex: 'none' }}
                                          >
                                            <circle cx="6" cy="17" r="3.4"></circle>
                                            <circle cx="18" cy="17" r="3.4"></circle>
                                            <path d="M6 17l5-8h5l2 8"></path>
                                          </svg>
                                        </>
                                      ) : null}
                                      {w?.isPush ? (
                                        <>
                                          <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            style={{ width: '16px', height: '16px', flex: 'none' }}
                                          >
                                            <path
                                              d="M12.5 2c1.2 3.4 3.5 5.6 3.5 9.2a4.5 4.5 0 1 1-9 0c0-2.6 1.2-4 1.9-5.6.4 1.6 1.3 2.2 1.6 3.4.5-1.3.6-3.5 2-7z"
                                              fill="#E1699C"
                                            ></path>
                                          </svg>
                                        </>
                                      ) : null}
                                      {w?.isPull ? (
                                        <>
                                          <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#7C8FC9"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ width: '20px', height: '20px', flex: 'none' }}
                                          >
                                            <path d="M2 10c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0 4.4-2 6.6 0"></path>
                                            <path d="M2 15c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0 4.4-2 6.6 0"></path>
                                          </svg>
                                        </>
                                      ) : null}
                                      {w?.isLegs ? (
                                        <>
                                          <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            style={{ width: '16px', height: '16px', flex: 'none' }}
                                          >
                                            <path d="M2 20 L9 8 L13 14 L17 6 L22 20 Z" fill="#5C6684"></path>
                                          </svg>
                                        </>
                                      ) : null}
                                      {w?.isCore ? (
                                        <>
                                          <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#5EC4D6"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ width: '20px', height: '20px', flex: 'none' }}
                                          >
                                            <path d="M3 8c4-3 8-1 8 2s-3 4-6 2"></path>
                                            <path d="M3 15c5-2 11 0 15 3s6-1 5-5"></path>
                                          </svg>
                                        </>
                                      ) : null}
                                      <div style={{ minWidth: '0', flex: '1' }}>
                                        <div
                                          style={{
                                            fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            letterSpacing: '-.01em',
                                          }}
                                        >
                                          {w?.name}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: '13px',
                                            fontWeight: '400',
                                            color: '#746E88',
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
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  style={{ width: '12px', height: '12px', flex: 'none' }}
                                >
                                  <path
                                    d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                    fill="#7C8FC9"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(124,143,201,0.5))' }}
                                  ></path>
                                </svg>
                              </span>
                              <span
                                style={{
                                  position: 'absolute',
                                  right: '15%',
                                  top: '34px',
                                  animation: 'twinkle 4.6s ease-in-out infinite',
                                }}
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  style={{ width: '10px', height: '10px', flex: 'none' }}
                                >
                                  <path
                                    d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                    fill="#5EC4D6"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(94,196,214,0.55))' }}
                                  ></path>
                                </svg>
                              </span>
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '24%',
                                  bottom: '18px',
                                  animation: 'twinkle 6s ease-in-out infinite',
                                }}
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  style={{ width: '9px', height: '9px', flex: 'none' }}
                                >
                                  <path
                                    d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                    fill="#F0A385"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(240,163,133,0.55))' }}
                                  ></path>
                                </svg>
                              </span>
                              <div
                                style={{
                                  width: '56px',
                                  height: '56px',
                                  margin: '0 auto',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#fff"
                                  strokeWidth="2.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ width: '26px', height: '26px', flex: 'none' }}
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                              <h3
                                style={{
                                  margin: '16px 0 0',
                                  fontSize: '17px',
                                  fontWeight: '700',
                                  letterSpacing: '-.02em',
                                }}
                              >
                                Week sealed
                              </h3>
                              <p
                                style={{
                                  margin: '8px auto 0',
                                  maxWidth: '320px',
                                  fontSize: '13.5px',
                                  fontWeight: '400',
                                  lineHeight: '1.6',
                                  color: '#5C6684',
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
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  style={{ width: '13px', height: '13px', flex: 'none' }}
                                >
                                  <path
                                    d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                    fill="#7C8FC9"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(124,143,201,0.5))' }}
                                  ></path>
                                </svg>
                              </span>
                              <span
                                style={{
                                  position: 'absolute',
                                  right: '13%',
                                  top: '40px',
                                  animation: 'twinkle 4.6s ease-in-out infinite',
                                }}
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  style={{ width: '10px', height: '10px', flex: 'none' }}
                                >
                                  <path
                                    d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                    fill="#5EC4D6"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(94,196,214,0.55))' }}
                                  ></path>
                                </svg>
                              </span>
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '22%',
                                  bottom: '22px',
                                  animation: 'twinkle 6s ease-in-out infinite',
                                }}
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  style={{ width: '10px', height: '10px', flex: 'none' }}
                                >
                                  <path
                                    d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                    fill="#F0A385"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(240,163,133,0.55))' }}
                                  ></path>
                                </svg>
                              </span>
                              <div
                                style={{
                                  width: '66px',
                                  height: '66px',
                                  margin: '0 auto',
                                  borderRadius: '50%',
                                  background: '#fff',
                                  boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  style={{ width: '32px', height: '32px', flex: 'none' }}
                                >
                                  <defs>
                                    <linearGradient id="gemEmptyWk" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#E1699C"></stop>
                                      <stop offset="50%" stopColor="#7C8FC9"></stop>
                                      <stop offset="100%" stopColor="#5EC4D6"></stop>
                                    </linearGradient>
                                  </defs>
                                  <path
                                    d="M12 2 L20 8 L17 14 L12 22 L7 14 L4 8 Z"
                                    fill="url(#gemEmptyWk)"
                                  ></path>
                                  <path
                                    d="M12 2 L12 22 M4 8 L20 8 M4 8 L12 22 M20 8 L12 22"
                                    stroke="rgba(255,255,255,0.45)"
                                    strokeWidth="0.6"
                                    fill="none"
                                  ></path>
                                </svg>
                              </div>
                              <h3
                                style={{
                                  margin: '20px 0 0',
                                  fontSize: '18px',
                                  fontWeight: '700',
                                  letterSpacing: '-.02em',
                                }}
                              >
                                Your wand's still charging
                              </h3>
                              <p
                                style={{
                                  margin: '10px auto 0',
                                  maxWidth: '340px',
                                  fontSize: '14px',
                                  fontWeight: '400',
                                  lineHeight: '1.6',
                                  color: '#5C6684',
                                  textWrap: 'pretty',
                                }}
                              >
                                {v.emptyWeekNote}
                              </p>
                              <button
                                onClick={v.goNewWorkout}
                                style={{
                                  marginTop: '22px',
                                  padding: '15px 26px',
                                  border: 'none',
                                  borderRadius: '16px',
                                  background: '#E1699C',
                                  color: '#fff',
                                  fontSize: '15px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                                className="hv4"
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#fff"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ width: '16px', height: '16px', flex: 'none' }}
                                >
                                  <line x1="12" y1="5" x2="12" y2="19"></line>
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add workout
                              </button>
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
                              background: '#fff',
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
                                background: '#FCE8F1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                style={{ width: '20px', height: '20px', flex: 'none' }}
                              >
                                <defs>
                                  <linearGradient id="gemStat" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#E1699C"></stop>
                                    <stop offset="50%" stopColor="#7C8FC9"></stop>
                                    <stop offset="100%" stopColor="#5EC4D6"></stop>
                                  </linearGradient>
                                </defs>
                                <path d="M12 2 L20 8 L17 14 L12 22 L7 14 L4 8 Z" fill="url(#gemStat)"></path>
                                <path
                                  d="M12 2 L12 22 M4 8 L20 8 M4 8 L12 22 M20 8 L12 22"
                                  stroke="rgba(255,255,255,0.45)"
                                  strokeWidth="0.6"
                                  fill="none"
                                ></path>
                              </svg>
                            </div>
                            <div style={{ minWidth: '0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                  style={{
                                    fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                    fontSize: '17px',
                                    fontWeight: '700',
                                  }}
                                >
                                  {v.streakCount}
                                </span>
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '400',
                                  color: '#746E88',
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
                              background: '#fff',
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
                                background: 'linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)',
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
                                  background: '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#E1699C"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ width: '20px', height: '20px', flex: 'none' }}
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </span>
                            </div>
                            <div style={{ minWidth: '0' }}>
                              <div
                                style={{
                                  fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                  fontSize: '17px',
                                  fontWeight: '700',
                                }}
                              >
                                {v.monthDone}
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '400',
                                  color: '#746E88',
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
                                  fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#746E88',
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
                              fontSize: '12px',
                              fontWeight: '400',
                              color: '#746E88',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: 'none',
                                boxShadow: 'inset 0 0 0 1.5px #5EC4D6',
                              }}
                            ></span>
                            Planned
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                              fontSize: '12px',
                              fontWeight: '400',
                              color: '#746E88',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#5C6684',
                              }}
                            ></span>
                            Completed
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                              fontSize: '12px',
                              fontWeight: '400',
                              color: '#746E88',
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: 'none',
                                boxShadow: 'inset 0 0 0 1.5px #746E88',
                              }}
                            ></span>
                            Missed
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                              fontSize: '12px',
                              fontWeight: '400',
                              color: '#746E88',
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '1.5px',
                                borderRadius: '1px',
                                background: '#DAD7E0',
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
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  letterSpacing: '.11em',
                                  color: '#746E88',
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
                                  background: '#fff',
                                  borderRadius: '20px',
                                  boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                                  cursor: 'pointer',
                                }}
                              >
                                <div style={{ minWidth: '0' }}>
                                  <div
                                    style={{
                                      fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                      fontSize: '15px',
                                      fontWeight: '700',
                                      letterSpacing: '-.01em',
                                    }}
                                  >
                                    {v.todayName}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: '400',
                                      color: '#746E88',
                                      marginTop: '3px',
                                    }}
                                  >
                                    {v.todayMeta}
                                  </div>
                                </div>
                                <span style={{ marginLeft: 'auto', display: 'flex' }}>
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#746E88"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ width: '20px', height: '20px', flex: 'none' }}
                                  >
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                  </svg>
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
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      style={{ width: '13px', height: '13px', flex: 'none' }}
                    >
                      <path
                        d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                        fill="#7C8FC9"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(124,143,201,0.5))' }}
                      ></path>
                    </svg>
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      right: '14%',
                      top: '70px',
                      animation: 'twinkle 4.6s ease-in-out infinite',
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      style={{ width: '11px', height: '11px', flex: 'none' }}
                    >
                      <path
                        d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                        fill="#5EC4D6"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(94,196,214,0.55))' }}
                      ></path>
                    </svg>
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '20%',
                      bottom: '70px',
                      animation: 'twinkle 6s ease-in-out infinite',
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      style={{ width: '10px', height: '10px', flex: 'none' }}
                    >
                      <path
                        d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                        fill="#F0A385"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(240,163,133,0.55))' }}
                      ></path>
                    </svg>
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
                        background: '#fff',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#E1699C"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          width: '30px',
                          height: '30px',
                          flex: 'none',
                          strokeDasharray: '30',
                          animation: 'draw .5s .2s ease-out both',
                        }}
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                  <h1
                    style={{
                      margin: '22px 0 0',
                      fontSize: '22px',
                      fontWeight: '700',
                      letterSpacing: '-.02em',
                    }}
                  >
                    Entry saved
                  </h1>
                  <p
                    style={{
                      margin: '10px auto 0',
                      maxWidth: '340px',
                      fontSize: '14px',
                      fontWeight: '400',
                      lineHeight: '1.6',
                      color: '#746E88',
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
                        background: '#fff',
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
                            fontFamily: "'Space Grotesk',system-ui,sans-serif",
                            fontSize: '15px',
                            fontWeight: '700',
                            letterSpacing: '-.01em',
                            color: '#232A45',
                          }}
                        >
                          Read your chronicle
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '400',
                            color: '#746E88',
                            marginTop: '3px',
                          }}
                        >
                          {v.savedCount}
                        </span>
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#746E88"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '20px', height: '20px', flex: 'none' }}
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
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
                        background: '#fff',
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
                            fontFamily: "'Space Grotesk',system-ui,sans-serif",
                            fontSize: '15px',
                            fontWeight: '700',
                            letterSpacing: '-.01em',
                            color: '#232A45',
                          }}
                        >
                          {v.savedNextTitle}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '400',
                            color: '#746E88',
                            marginTop: '3px',
                          }}
                        >
                          {v.savedNextMeta}
                        </span>
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#746E88"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '20px', height: '20px', flex: 'none' }}
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
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
                        background: '#fff',
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
                            fontFamily: "'Space Grotesk',system-ui,sans-serif",
                            fontSize: '15px',
                            fontWeight: '700',
                            letterSpacing: '-.01em',
                            color: '#232A45',
                          }}
                        >
                          See your progress
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '400',
                            color: '#746E88',
                            marginTop: '3px',
                          }}
                        >
                          Streak, week and month totals
                        </span>
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#746E88"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '20px', height: '20px', flex: 'none' }}
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={v.backToDay}
                    style={{
                      marginTop: '20px',
                      padding: '14px 24px',
                      border: 'none',
                      borderRadius: '16px',
                      background: 'none',
                      color: '#5C6684',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Back to calendar
                  </button>
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
                      background: '#fff',
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
                        background: 'linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Space Grotesk',system-ui,sans-serif",
                          fontSize: '26px',
                          fontWeight: '700',
                          color: '#fff',
                        }}
                      >
                        {v.profileInitial}
                      </span>
                      <span style={{ position: 'absolute', top: '-2px', right: '-2px' }}>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          style={{ width: '16px', height: '16px', flex: 'none' }}
                        >
                          <path
                            d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                            fill="#F0C060"
                            style={{ filter: 'drop-shadow(0 0 4px rgba(240,192,96,0.6))' }}
                          ></path>
                        </svg>
                      </span>
                    </div>
                    <div style={{ minWidth: '0', flex: '1 1 200px' }}>
                      <h1
                        style={{ margin: '0', fontSize: '22px', fontWeight: '700', letterSpacing: '-.02em' }}
                      >
                        {v.profileName}
                      </h1>
                      <p
                        style={{ margin: '5px 0 0', fontSize: '13.5px', fontWeight: '400', color: '#746E88' }}
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
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: '12px', height: '12px', flex: 'none', opacity: '.7' }}
                        >
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
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
                            background: '#F4EFF1',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={css(v.rankBar)}></div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#5C6684' }}>
                          {v.rankProgress}
                        </span>
                        <button
                          onClick={v.toggleXpInfo}
                          title="How XP works"
                          style={{
                            width: '36px',
                            height: '36px',
                            flex: 'none',
                            margin: '-6px',
                            border: 'none',
                            borderRadius: '50%',
                            background: 'none',
                            padding: '0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          className="hv0"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#746E88"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: '16px', height: '16px', flex: 'none' }}
                          >
                            <circle cx="12" cy="12" r="9"></circle>
                            <line x1="12" y1="11" x2="12" y2="16.5"></line>
                            <line x1="12" y1="7.8" x2="12" y2="8"></line>
                          </svg>
                        </button>
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
                                background: '#fff',
                                borderRadius: '18px',
                                boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                              }}
                            >
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: '10.5px',
                                  fontWeight: '700',
                                  letterSpacing: '.11em',
                                  color: '#5C6684',
                                }}
                              >
                                HOW PROGRESS WORKS
                              </span>
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: '13.5px',
                                  fontWeight: '400',
                                  lineHeight: '1.6',
                                  color: '#232A45',
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
                                  fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  color: '#c4548a',
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
                            background: '#fff',
                            borderRadius: '20px',
                            boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              letterSpacing: '.11em',
                              color: '#746E88',
                            }}
                          >
                            {s?.label}
                          </div>
                          <div
                            style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginTop: '6px' }}
                          >
                            <span
                              style={{
                                fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#232A45',
                              }}
                            >
                              {s?.value}
                            </span>
                            <span style={{ fontSize: '12px', fontWeight: '500', color: '#746E88' }}>
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
                      background: '#fff',
                      borderRadius: '22px',
                      boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.11em',
                          color: '#5C6684',
                        }}
                      >
                        SESSIONS PER WEEK
                      </span>
                      <span
                        style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: '500', color: '#746E88' }}
                      >
                        {v.chartRangeLabel}
                      </span>
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: '12.5px', fontWeight: '400', color: '#746E88' }}>
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
                              background: '#FBF1F3',
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
                                fontSize: '11px',
                                fontWeight: '700',
                                letterSpacing: '.08em',
                                color: '#746E88',
                              }}
                            >
                              {w?.day}
                            </span>
                            <span
                              style={{
                                flex: '1 1 140px',
                                minWidth: '0',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#232A45',
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
                          <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '400', color: '#746E88' }}>
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
                      background: '#fff',
                      borderRadius: '22px',
                      boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.11em',
                          color: '#5C6684',
                        }}
                      >
                        QUESTS CLEARED
                      </span>
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontFamily: "'Space Grotesk',system-ui,sans-serif",
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#232A45',
                        }}
                      >
                        {v.questsClearedLabel}
                      </span>
                    </div>
                    <div
                      style={{
                        height: '8px',
                        borderRadius: '5px',
                        background: '#F4EFF1',
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
                                fontSize: '13.5px',
                                fontWeight: '500',
                                color: '#232A45',
                              }}
                            >
                              {q?.name}
                            </span>
                            <span
                              style={{
                                fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                fontSize: '13px',
                                fontWeight: '700',
                                color: '#5C6684',
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
                        background: '#fff',
                        borderRadius: '22px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.11em',
                          color: '#5C6684',
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
                                  fontSize: '13.5px',
                                  fontWeight: '500',
                                  color: '#232A45',
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
                                  background: '#F4EFF1',
                                  overflow: 'hidden',
                                }}
                              >
                                <span style={css(m?.bar)}></span>
                              </span>
                              <span
                                style={{
                                  fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                  fontSize: '12.5px',
                                  fontWeight: '700',
                                  color: '#5C6684',
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
                        background: '#fff',
                        borderRadius: '22px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.11em',
                          color: '#5C6684',
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
                                  fontSize: '13.5px',
                                  fontWeight: '500',
                                  color: '#232A45',
                                  flex: '1',
                                  minWidth: '0',
                                }}
                              >
                                {r?.name}
                              </span>
                              <span
                                style={{
                                  fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                  fontSize: '14px',
                                  fontWeight: '700',
                                  color: '#232A45',
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
                  <h1 style={{ margin: '0', fontSize: '22px', fontWeight: '700', letterSpacing: '-.02em' }}>
                    Progress
                  </h1>
                  <p
                    style={{
                      margin: '10px 0 0',
                      maxWidth: '460px',
                      fontSize: '14px',
                      fontWeight: '400',
                      lineHeight: '1.6',
                      color: '#746E88',
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
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        style={{ width: '30px', height: '30px', flex: 'none' }}
                      >
                        <defs>
                          <linearGradient id="gemStreak" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#E1699C"></stop>
                            <stop offset="50%" stopColor="#7C8FC9"></stop>
                            <stop offset="100%" stopColor="#5EC4D6"></stop>
                          </linearGradient>
                        </defs>
                        <path d="M12 2 L20 8 L17 14 L12 22 L7 14 L4 8 Z" fill="url(#gemStreak)"></path>
                        <path
                          d="M12 2 L12 22 M4 8 L20 8 M4 8 L12 22 M20 8 L12 22"
                          stroke="rgba(255,255,255,0.45)"
                          strokeWidth="0.6"
                          fill="none"
                        ></path>
                      </svg>
                      <div style={{ minWidth: '0' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
                          <span
                            style={{
                              fontFamily: "'Space Grotesk',system-ui,sans-serif",
                              fontSize: '32px',
                              fontWeight: '700',
                              lineHeight: '1',
                              color: '#232A45',
                            }}
                          >
                            {v.streakCount}
                          </span>
                          <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#c4548a' }}>
                            {t(v.streakUnit)}
                            {' unbroken'}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: '6px 0 0',
                            fontSize: '12.5px',
                            fontWeight: '500',
                            color: '#746E88',
                          }}
                        >
                          {v.streakNote}
                        </p>
                      </div>
                    </div>
                    <div style={{ flex: '1 1 180px', minWidth: '0' }}>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          letterSpacing: '.11em',
                          color: '#5C6684',
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
                        background: '#fff',
                        borderRadius: '22px',
                        padding: '20px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.1em',
                          color: '#746E88',
                        }}
                      >
                        THIS WEEK
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                        <span
                          style={{
                            fontFamily: "'Space Grotesk',system-ui,sans-serif",
                            fontSize: '17px',
                            fontWeight: '700',
                          }}
                        >
                          {v.wkDone}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#746E88' }}>
                          {'of '}
                          {t(v.wkTotal)}
                          {' sessions'}
                        </span>
                      </div>
                      <div
                        style={{
                          height: '7px',
                          borderRadius: '4px',
                          background: '#FCE8F1',
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
                        background: '#fff',
                        borderRadius: '22px',
                        padding: '20px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.1em',
                          color: '#746E88',
                        }}
                      >
                        NEXT CALL
                      </div>
                      {v.hasNext ? (
                        <>
                          <p
                            style={{
                              fontFamily: "'Space Grotesk',system-ui,sans-serif",
                              margin: '9px 0 0',
                              fontSize: '14.5px',
                              fontWeight: '600',
                            }}
                          >
                            {v.nextName}
                          </p>
                          <p
                            style={{
                              margin: '3px 0 0',
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#746E88',
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
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#746E88',
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
                      background: '#fff',
                      borderRadius: '22px',
                      boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.11em',
                          color: '#5C6684',
                        }}
                      >
                        THIS WEEK'S QUESTS
                      </span>
                      <span
                        style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: '500', color: '#746E88' }}
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
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ width: '10px', height: '10px', flex: 'none' }}
                                  >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </>
                              ) : null}
                            </span>
                            <span
                              style={{
                                flex: 'none',
                                width: '44px',
                                fontSize: '11px',
                                fontWeight: '700',
                                letterSpacing: '.08em',
                                color: '#746E88',
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
                        background: '#fff',
                        borderRadius: '22px',
                        padding: '20px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.1em',
                          color: '#746E88',
                        }}
                      >
                        LOGGED
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                        <span
                          style={{
                            fontFamily: "'Space Grotesk',system-ui,sans-serif",
                            fontSize: '17px',
                            fontWeight: '700',
                          }}
                        >
                          {v.loggedCount}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#746E88' }}>entries</span>
                      </div>
                    </div>
                    <div
                      style={{
                        flex: '1 1 170px',
                        background: '#fff',
                        borderRadius: '22px',
                        padding: '20px',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.1em',
                          color: '#746E88',
                        }}
                      >
                        SEPTEMBER
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                        <span
                          style={{
                            fontFamily: "'Space Grotesk',system-ui,sans-serif",
                            fontSize: '17px',
                            fontWeight: '700',
                          }}
                        >
                          {v.monthDone}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#746E88' }}>
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
                    <h1 style={{ margin: '0', fontSize: '22px', fontWeight: '700', letterSpacing: '-.02em' }}>
                      Arsenal
                    </h1>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#746E88' }}>
                      {v.movesCount}
                    </span>
                    <button
                      onClick={v.openArsenalAdd}
                      style={{
                        marginLeft: 'auto',
                        height: '44px',
                        padding: '0 20px',
                        border: 'none',
                        borderRadius: '15px',
                        background: '#E1699C',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      className="hv4"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '16px', height: '16px', flex: 'none' }}
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      New exercise
                    </button>
                  </div>
                  <p
                    style={{
                      margin: '10px 0 0',
                      maxWidth: '460px',
                      fontSize: '14px',
                      fontWeight: '400',
                      lineHeight: '1.6',
                      color: '#746E88',
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
                      background: '#fff',
                      borderRadius: '15px',
                      boxShadow: '0 1px 3px rgba(35,42,69,.06)',
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#A9A2B4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: '17px', height: '17px', flex: 'none' }}
                    >
                      <circle cx="11" cy="11" r="7"></circle>
                      <line x1="16.5" y1="16.5" x2="21" y2="21"></line>
                    </svg>
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
                        fontSize: '14.5px',
                        fontWeight: '500',
                        color: '#232A45',
                      }}
                    />
                    {v.hasQuery ? (
                      <>
                        <button
                          onClick={v.clearArsenalQuery}
                          title="Clear search"
                          style={{
                            width: '26px',
                            height: '26px',
                            flex: 'none',
                            border: 'none',
                            borderRadius: '9px',
                            background: 'none',
                            padding: '0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          className="hv8"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#746E88"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: '14px', height: '14px', flex: 'none' }}
                          >
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                          </svg>
                        </button>
                      </>
                    ) : null}
                  </div>
                  {v.noMatches ? (
                    <>
                      <p
                        style={{ margin: '20px 0 0', fontSize: '14px', fontWeight: '400', color: '#746E88' }}
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
                          background: '#fff',
                          borderRadius: '20px',
                          boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                        }}
                      >
                        <span
                          style={{
                            display: 'block',
                            fontFamily: "'Space Grotesk',system-ui,sans-serif",
                            fontSize: '16px',
                            fontWeight: '700',
                            letterSpacing: '-.01em',
                          }}
                        >
                          New exercise
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '10px',
                            fontWeight: '700',
                            letterSpacing: '.1em',
                            color: '#746E88',
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
                            background: '#FBF1F3',
                            fontSize: '14.5px',
                            fontWeight: '500',
                            color: '#232A45',
                          }}
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '14px' }}>
                          <label style={{ flex: '1 1 120px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#746E88',
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
                                background: '#FBF1F3',
                                fontSize: '14.5px',
                                fontWeight: '500',
                                color: '#232A45',
                              }}
                            />
                          </label>
                          <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#746E88',
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
                                background: '#FBF1F3',
                                fontSize: '14.5px',
                                fontWeight: '500',
                                color: '#232A45',
                              }}
                            />
                          </label>
                          <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#746E88',
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
                                background: '#FBF1F3',
                                fontSize: '14.5px',
                                fontWeight: '500',
                                color: '#232A45',
                              }}
                            />
                          </label>
                        </div>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '10px',
                            fontWeight: '700',
                            letterSpacing: '.1em',
                            color: '#746E88',
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
                          <button
                            onClick={v.closeArsenalAdd}
                            style={{
                              height: '52px',
                              padding: '0 22px',
                              border: 'none',
                              borderRadius: '16px',
                              background: 'none',
                              fontSize: '14.5px',
                              fontWeight: '600',
                              color: '#5C6684',
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                          <button onClick={v.commitArsenal} style={css(v.commitStyle)}>
                            Add to Arsenal
                          </button>
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
                                fontSize: '10.5px',
                                fontWeight: '700',
                                letterSpacing: '.11em',
                                color: '#5C6684',
                              }}
                            >
                              {g?.label}
                            </span>
                            <span style={{ fontSize: '11.5px', fontWeight: '500', color: '#746E88' }}>
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
                                      background: '#FCE8F1',
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
                                        fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        letterSpacing: '-.01em',
                                        color: '#232A45',
                                      }}
                                    >
                                      {m?.name}
                                    </span>
                                    <span
                                      style={{
                                        display: 'block',
                                        fontSize: '13px',
                                        fontWeight: '400',
                                        color: '#746E88',
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
                    <button
                      onClick={v.goBack}
                      aria-label="Back"
                      style={{
                        width: '36px',
                        height: '36px',
                        flex: 'none',
                        border: 'none',
                        borderRadius: '12px',
                        background: 'none',
                        padding: '0',
                        marginLeft: '-8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className="hv0"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#5C6684"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '18px', height: '18px', flex: 'none' }}
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                  </div>
                  <h1
                    style={{
                      margin: '24px 0 0',
                      fontSize: '22px',
                      fontWeight: '700',
                      letterSpacing: '-.02em',
                    }}
                  >
                    Which session are you writing about?
                  </h1>
                  <p
                    style={{
                      margin: '10px 0 0',
                      maxWidth: '460px',
                      fontSize: '14px',
                      fontWeight: '400',
                      lineHeight: '1.6',
                      color: '#746E88',
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
                                fontSize: '11px',
                                fontWeight: '700',
                                letterSpacing: '.08em',
                                color: '#746E88',
                              }}
                            >
                              {u?.day}
                            </span>
                            <span
                              style={{
                                flex: '1 1 140px',
                                minWidth: '0',
                                fontSize: '14.5px',
                                fontWeight: '600',
                                color: '#232A45',
                              }}
                            >
                              {u?.name}
                            </span>
                            <span
                              style={{
                                flex: 'none',
                                fontSize: '12.5px',
                                fontWeight: '500',
                                color: '#746E88',
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
                            fontSize: '14px',
                            fontWeight: '400',
                            color: '#746E88',
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
                      <button
                        onClick={v.closeNewEntry}
                        style={{
                          height: '48px',
                          padding: '0 20px',
                          border: 'none',
                          borderRadius: '15px',
                          background: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#5C6684',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.isDiaryList ? (
              <>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px' }}>
                    <h1 style={{ margin: '0', fontSize: '22px', fontWeight: '700', letterSpacing: '-.02em' }}>
                      Chronicle
                    </h1>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#746E88' }}>
                      {v.diaryCount}
                    </span>
                    <button
                      onClick={v.openNewEntry}
                      style={{
                        marginLeft: 'auto',
                        height: '44px',
                        padding: '0 20px',
                        border: 'none',
                        borderRadius: '15px',
                        background: '#E1699C',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      className="hv4"
                    >
                      New entry
                    </button>
                  </div>
                  <p
                    style={{
                      margin: '10px 0 0',
                      maxWidth: '620px',
                      fontSize: '14px',
                      fontWeight: '400',
                      lineHeight: '1.6',
                      color: '#746E88',
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
                        background: '#fff',
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
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#A9A2B4"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: '16px', height: '16px', flex: 'none' }}
                          >
                            <rect x="3" y="5" width="18" height="16" rx="3"></rect>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                            <line x1="8" y1="3" x2="8" y2="6"></line>
                            <line x1="16" y1="3" x2="16" y2="6"></line>
                          </svg>
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
                              fontFamily: "'IBM Plex Sans',system-ui,sans-serif",
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#5C6684',
                            }}
                          />
                          <span
                            style={{ flex: 'none', fontSize: '13px', fontWeight: '600', color: '#C7C4D0' }}
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
                              fontFamily: "'IBM Plex Sans',system-ui,sans-serif",
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#5C6684',
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
                              background: '#fff',
                              borderRadius: '20px',
                              boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                              color: '#232A45',
                              textAlign: 'left',
                              font: 'inherit',
                              cursor: 'pointer',
                            }}
                            className="hv5"
                          >
                            <span style={css(e?.faceWrap)}>
                              {e?.isHappy ? (
                                <>
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FBF1F3"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    style={{ width: '24px', height: '24px' }}
                                  >
                                    <circle cx="9" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                    <circle cx="15" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                    <path d="M8.5 14.5c1.1 1.7 5.9 1.7 7 0"></path>
                                  </svg>
                                </>
                              ) : null}
                              {e?.isNeutral ? (
                                <>
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FBF1F3"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    style={{ width: '24px', height: '24px' }}
                                  >
                                    <circle cx="9" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                    <circle cx="15" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                    <line x1="8.5" y1="15" x2="15.5" y2="15"></line>
                                  </svg>
                                </>
                              ) : null}
                              {e?.isSad ? (
                                <>
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FBF1F3"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    style={{ width: '24px', height: '24px' }}
                                  >
                                    <circle cx="9" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                    <circle cx="15" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                    <path d="M8.5 16c1.1-1.7 5.9-1.7 7 0"></path>
                                  </svg>
                                </>
                              ) : null}
                              {e?.isMad ? (
                                <>
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FBF1F3"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    style={{ width: '24px', height: '24px' }}
                                  >
                                    <line x1="7.4" y1="8.4" x2="10.6" y2="10.2"></line>
                                    <line x1="16.6" y1="8.4" x2="13.4" y2="10.2"></line>
                                    <path d="M8.5 16c1.1-1.7 5.9-1.7 7 0"></path>
                                  </svg>
                                </>
                              ) : null}
                            </span>
                            <span style={{ flex: '1 1 220px', minWidth: '0' }}>
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  letterSpacing: '.11em',
                                  color: '#746E88',
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
                                    fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    letterSpacing: '-.01em',
                                  }}
                                >
                                  {e?.name}
                                </span>
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#A9A2B4"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ width: '16px', height: '16px', flex: 'none' }}
                                >
                                  <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
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
                                  fontSize: '13px',
                                  fontWeight: '400',
                                  lineHeight: '1.5',
                                  color: '#746E88',
                                  marginTop: '7px',
                                  textWrap: 'pretty',
                                }}
                              >
                                {e?.note}
                              </span>
                            </span>
                          </button>
                          <button
                            onClick={e?.remove}
                            title="Delete entry"
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              width: '44px',
                              height: '44px',
                              border: 'none',
                              borderRadius: '13px',
                              background: 'none',
                              padding: '0',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            className="hv9"
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#A9A2B4"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ width: '14px', height: '14px', flex: 'none' }}
                            >
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  {v.diaryEmpty ? (
                    <>
                      <p
                        style={{ margin: '24px 0 0', fontSize: '14px', fontWeight: '400', color: '#746E88' }}
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
                    <button
                      onClick={v.backToDay}
                      aria-label="Back"
                      style={{
                        width: '36px',
                        height: '36px',
                        flex: 'none',
                        border: 'none',
                        borderRadius: '12px',
                        background: 'none',
                        padding: '0',
                        marginLeft: '-8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className="hv0"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#5C6684"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '18px', height: '18px', flex: 'none' }}
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        flex: 'none',
                        borderRadius: '15px',
                        background: '#FCE8F1',
                        border: '2px solid #fff',
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
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.11em',
                          color: '#5C6684',
                        }}
                      >
                        {v.eDate}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '9px' }}>
                        <h1
                          style={{
                            margin: '3px 0 0',
                            fontSize: '22px',
                            fontWeight: '700',
                            letterSpacing: '-.02em',
                          }}
                        >
                          {v.eName}
                        </h1>
                        <button
                          onClick={v.goEdit}
                          title="Edit workout"
                          style={{
                            width: '36px',
                            height: '36px',
                            flex: 'none',
                            marginBottom: '-2px',
                            border: 'none',
                            borderRadius: '12px',
                            background: 'none',
                            padding: '0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          className="hv0"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#746E88"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: '17px', height: '17px', flex: 'none' }}
                          >
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
                          </svg>
                        </button>
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
                        background: '#fff',
                        fontSize: '12.5px',
                        fontWeight: '500',
                        color: '#5C6684',
                        boxShadow: '0 1px 3px rgba(35,42,69,.06)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#746E88"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '15px', height: '15px', flex: 'none' }}
                      >
                        <circle cx="12" cy="12" r="9"></circle>
                        <polyline points="12 7 12 12 15.5 14"></polyline>
                      </svg>
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
                            background: '#E1699C',
                            fontSize: '12.5px',
                            fontWeight: '600',
                            color: '#fff',
                          }}
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: '15px', height: '15px', flex: 'none' }}
                          >
                            <polyline points="17 1 21 5 17 9"></polyline>
                            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                            <polyline points="7 23 3 19 7 15"></polyline>
                            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                          </svg>
                          {'Weekly series '}
                          <button
                            onClick={v.endSeries}
                            title="End this series"
                            style={{
                              width: '24px',
                              height: '24px',
                              flex: 'none',
                              border: 'none',
                              borderRadius: '8px',
                              background: 'none',
                              padding: '0',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            className="hv10"
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="rgba(255,255,255,0.85)"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ width: '13px', height: '13px', flex: 'none' }}
                            >
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                            </svg>
                          </button>
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
                            background: '#fff',
                            fontSize: '12.5px',
                            fontWeight: '500',
                            color: '#5C6684',
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
                          background: '#fff',
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
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    letterSpacing: '.1em',
                                    color: '#A9A2B4',
                                  }}
                                >
                                  {r?.label}
                                </div>
                                <div
                                  style={{
                                    fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: '#232A45',
                                    marginTop: '4px',
                                  }}
                                >
                                  {r?.value}
                                </div>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                        <button onClick={v.toggleRideDone} style={css(v.rideDoneBtn)}>
                          <span style={css(v.rideDoneMark)}>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={v.rideDoneStroke}
                              strokeWidth="2.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ width: '13px', height: '13px', flex: 'none' }}
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          {t(v.rideDoneLabel)}
                        </button>
                      </div>
                    </>
                  ) : null}
                  {v.dayIsLift ? (
                    <>
                      <div
                        style={{
                          marginTop: '16px',
                          padding: '20px 22px',
                          background: '#fff',
                          borderRadius: '20px',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        }}
                      >
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
                        >
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: '700',
                              letterSpacing: '.11em',
                              color: '#5C6684',
                            }}
                          >
                            PROGRESS
                          </span>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontFamily: "'Space Grotesk',system-ui,sans-serif",
                              fontSize: '15px',
                              fontWeight: '700',
                              color: '#232A45',
                            }}
                          >
                            {v.progLabel}
                          </span>
                        </div>
                        <div
                          style={{
                            height: '8px',
                            borderRadius: '5px',
                            background: '#FCE8F1',
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
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  style={{ width: '14px', height: '14px', flex: 'none' }}
                                >
                                  <path
                                    d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                    fill="#E1699C"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(225,105,156,0.55))' }}
                                  ></path>
                                </svg>
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
                                background: '#fff',
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
                                  background: '#FCE8F1',
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
                                    fontSize: '13px',
                                    fontWeight: '400',
                                    color: '#746E88',
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
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={ex?.doneStroke}
                                  strokeWidth="2.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ width: '15px', height: '15px', flex: 'none' }}
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
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
                    <button
                      onClick={v.goEdit}
                      style={{
                        height: '52px',
                        padding: '0 22px',
                        border: 'none',
                        borderRadius: '16px',
                        background: 'none',
                        fontSize: '14.5px',
                        fontWeight: '600',
                        color: '#5C6684',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      className="hv1"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#5C6684"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '17px', height: '17px', flex: 'none' }}
                      >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
                      </svg>
                      Edit workout
                    </button>
                    <button
                      onClick={v.goDiary}
                      style={{
                        height: '52px',
                        padding: '0 30px',
                        border: 'none',
                        borderRadius: '16px',
                        background: '#E1699C',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                      className="hv4"
                    >
                      {v.ctaLabel}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
            {v.needsType ? (
              <>
                <div style={{ maxWidth: '560px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={v.backToDay}
                      aria-label="Back"
                      style={{
                        width: '36px',
                        height: '36px',
                        flex: 'none',
                        border: 'none',
                        borderRadius: '12px',
                        background: 'none',
                        padding: '0',
                        marginLeft: '-8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className="hv0"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#5C6684"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '18px', height: '18px', flex: 'none' }}
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <div>
                      <div
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.11em',
                          color: '#5C6684',
                        }}
                      >
                        NEW WORKOUT
                      </div>
                      <h1
                        style={{
                          margin: '3px 0 0',
                          fontSize: '19px',
                          fontWeight: '700',
                          letterSpacing: '-.02em',
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
                        background: '#fff',
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
                          background: '#FCE8F1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#E1699C"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: '22px', height: '22px', flex: 'none' }}
                        >
                          <line x1="6" y1="12" x2="18" y2="12"></line>
                          <line x1="4" y1="9" x2="4" y2="15"></line>
                          <line x1="20" y1="9" x2="20" y2="15"></line>
                          <line x1="7" y1="9" x2="7" y2="15"></line>
                          <line x1="17" y1="9" x2="17" y2="15"></line>
                        </svg>
                      </span>
                      <span>
                        <span
                          style={{
                            display: 'block',
                            fontFamily: "'Space Grotesk',system-ui,sans-serif",
                            fontSize: '17px',
                            fontWeight: '700',
                            letterSpacing: '-.01em',
                            color: '#232A45',
                          }}
                        >
                          Lifting
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '13.5px',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#746E88',
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
                        background: '#fff',
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
                          background: '#E9EEF9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#7C8FC9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: '22px', height: '22px', flex: 'none' }}
                        >
                          <circle cx="6" cy="17" r="3.4"></circle>
                          <circle cx="18" cy="17" r="3.4"></circle>
                          <path d="M6 17l5-8h5l2 8"></path>
                        </svg>
                      </span>
                      <span>
                        <span
                          style={{
                            display: 'block',
                            fontFamily: "'Space Grotesk',system-ui,sans-serif",
                            fontSize: '17px',
                            fontWeight: '700',
                            letterSpacing: '-.01em',
                            color: '#232A45',
                          }}
                        >
                          Cycling
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '13.5px',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#746E88',
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
                            background: '#fff',
                            borderRadius: '24px',
                            boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                          }}
                        >
                          <h2
                            style={{
                              margin: '0',
                              fontSize: '18px',
                              fontWeight: '700',
                              letterSpacing: '-.02em',
                            }}
                          >
                            Keep your changes?
                          </h2>
                          <p
                            style={{
                              margin: '10px 0 0',
                              fontSize: '14px',
                              fontWeight: '400',
                              lineHeight: '1.6',
                              color: '#746E88',
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
                            <button
                              onClick={v.discardLeave}
                              style={{
                                height: '48px',
                                padding: '0 20px',
                                border: 'none',
                                borderRadius: '15px',
                                background: 'none',
                                fontSize: '14.5px',
                                fontWeight: '600',
                                color: '#B23A4C',
                                cursor: 'pointer',
                              }}
                              className="hv11"
                            >
                              Discard changes
                            </button>
                            <button
                              onClick={v.saveLeave}
                              style={{
                                height: '48px',
                                padding: '0 24px',
                                border: 'none',
                                borderRadius: '15px',
                                background: '#E1699C',
                                color: '#fff',
                                fontSize: '14.5px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                              className="hv4"
                            >
                              Save changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 12px' }}>
                    <button
                      onClick={v.tryLeave}
                      aria-label="Back"
                      style={{
                        width: '36px',
                        height: '36px',
                        flex: 'none',
                        border: 'none',
                        borderRadius: '12px',
                        background: 'none',
                        padding: '0',
                        marginLeft: '-8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className="hv0"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#5C6684"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '18px', height: '18px', flex: 'none' }}
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
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
                              background: '#fff',
                              borderRadius: '20px',
                              boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '10.5px',
                                fontWeight: '700',
                                letterSpacing: '.11em',
                                color: '#5C6684',
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
                                fontSize: '10.5px',
                                fontWeight: '700',
                                letterSpacing: '.11em',
                                color: '#5C6684',
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
                          fontSize: '10.5px',
                          fontWeight: '700',
                          letterSpacing: '.11em',
                          color: '#5C6684',
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
                              fontFamily: "'Space Grotesk',system-ui,sans-serif",
                              fontSize: '19px',
                              fontWeight: '700',
                              letterSpacing: '-.02em',
                              color: '#232A45',
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
                              fontFamily: "'Space Grotesk',system-ui,sans-serif",
                              fontSize: '19px',
                              fontWeight: '700',
                              letterSpacing: '-.02em',
                              color: '#232A45',
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
                          background: '#fff',
                          fontSize: '12.5px',
                          fontWeight: '500',
                          color: '#5C6684',
                          boxShadow: '0 1px 3px rgba(35,42,69,.06)',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                        }}
                        className="hv12"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#746E88"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: '15px', height: '15px', flex: 'none' }}
                        >
                          <rect x="3" y="5" width="18" height="16" rx="3"></rect>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                          <line x1="8" y1="3" x2="8" y2="6"></line>
                          <line x1="16" y1="3" x2="16" y2="6"></line>
                        </svg>
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
                              background: '#fff',
                              borderRadius: '20px',
                              boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                onClick={v.prevMonth}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  flex: 'none',
                                  border: 'none',
                                  borderRadius: '12px',
                                  background: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                className="hv8"
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#5C6684"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ width: '15px', height: '15px', flex: 'none' }}
                                >
                                  <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                              </button>
                              <span
                                style={{
                                  flex: '1',
                                  textAlign: 'center',
                                  fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                  fontSize: '14.5px',
                                  fontWeight: '700',
                                }}
                              >
                                {v.monthName}
                              </span>
                              <button
                                onClick={v.nextMonth}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  flex: 'none',
                                  border: 'none',
                                  borderRadius: '12px',
                                  background: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                className="hv8"
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#5C6684"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ width: '15px', height: '15px', flex: 'none' }}
                                >
                                  <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                              </button>
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
                                      fontSize: '10px',
                                      fontWeight: '700',
                                      color: '#A9A2B4',
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
                            background: '#E1699C',
                            fontSize: '12.5px',
                            fontWeight: '600',
                            color: '#fff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: '15px', height: '15px', flex: 'none' }}
                          >
                            <polyline points="17 1 21 5 17 9"></polyline>
                            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                            <polyline points="7 23 3 19 7 15"></polyline>
                            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                          </svg>
                          Weekly
                        </span>
                      </>
                    ) : null}
                    <span
                      style={{
                        padding: '8px 14px',
                        borderRadius: '999px',
                        background: '#fff',
                        fontSize: '12.5px',
                        fontWeight: '500',
                        color: '#5C6684',
                        boxShadow: '0 1px 3px rgba(35,42,69,.06)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        flex: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#746E88"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '17px', height: '17px', flex: 'none' }}
                      >
                        <circle cx="12" cy="12" r="9"></circle>
                        <polyline points="12 7 12 12 15.5 14"></polyline>
                      </svg>
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
                      background: '#fff',
                      borderRadius: '20px',
                      boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                    }}
                  >
                    <span style={{ display: 'flex' }}>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#746E88"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '20px', height: '20px', flex: 'none' }}
                      >
                        <polyline points="17 1 21 5 17 9"></polyline>
                        <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                        <polyline points="7 23 3 19 7 15"></polyline>
                        <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                      </svg>
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: '600' }}>Repeat weekly</span>
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
                              fontSize: '10.5px',
                              fontWeight: '700',
                              letterSpacing: '.11em',
                              color: '#5C6684',
                            }}
                          >
                            RIDE PLAN
                          </span>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#A9A2B4',
                            }}
                          >
                            {v.rideLockNote}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '22px', marginTop: '12px' }}>
                          <div>
                            <div
                              style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#A9A2B4',
                              }}
                            >
                              DISTANCE
                            </div>
                            <div
                              style={{
                                fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#232A45',
                                marginTop: '4px',
                              }}
                            >
                              {v.planDistText}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#A9A2B4',
                              }}
                            >
                              DURATION
                            </div>
                            <div
                              style={{
                                fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#232A45',
                                marginTop: '4px',
                              }}
                            >
                              {v.planDurText}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#A9A2B4',
                              }}
                            >
                              ELEVATION
                            </div>
                            <div
                              style={{
                                fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#232A45',
                                marginTop: '4px',
                              }}
                            >
                              {v.planElevText}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#A9A2B4',
                              }}
                            >
                              TARGET EFFORT
                            </div>
                            <div
                              style={{
                                fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#232A45',
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
                          background: '#fff',
                          borderRadius: '20px',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '10.5px',
                            fontWeight: '700',
                            letterSpacing: '.11em',
                            color: '#5C6684',
                          }}
                        >
                          RIDE PLAN
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
                          <label style={{ flex: '1 1 130px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#746E88',
                                marginBottom: '7px',
                              }}
                            >
                              {'DISTANCE '}
                              <span style={{ color: '#A9A2B4' }}>(MILES)</span>
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
                                background: '#FBF1F3',
                                fontSize: '14.5px',
                                fontWeight: '500',
                                color: '#232A45',
                              }}
                            />
                          </label>
                          <label style={{ flex: '1 1 130px', minWidth: '0', display: 'block' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#746E88',
                                marginBottom: '7px',
                              }}
                            >
                              {'ELEVATION '}
                              <span style={{ color: '#A9A2B4' }}>(FEET)</span>
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
                                background: '#FBF1F3',
                                fontSize: '14.5px',
                                fontWeight: '500',
                                color: '#232A45',
                              }}
                            />
                          </label>
                          <div style={{ flex: '1 1 210px', minWidth: '0' }}>
                            <span
                              style={{
                                display: 'block',
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#746E88',
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
                                  background: '#FBF1F3',
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
                                    fontSize: '14.5px',
                                    fontWeight: '500',
                                    color: '#232A45',
                                  }}
                                />
                                <span
                                  style={{
                                    flex: 'none',
                                    fontSize: '12.5px',
                                    fontWeight: '600',
                                    color: '#746E88',
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
                                  background: '#FBF1F3',
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
                                    fontSize: '14.5px',
                                    fontWeight: '500',
                                    color: '#232A45',
                                  }}
                                />
                                <span
                                  style={{
                                    flex: 'none',
                                    fontSize: '12.5px',
                                    fontWeight: '600',
                                    color: '#746E88',
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
                            fontSize: '10px',
                            fontWeight: '700',
                            letterSpacing: '.1em',
                            color: '#746E88',
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
                          background: '#fff',
                          borderRadius: '20px',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        }}
                      >
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
                        >
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: '700',
                              letterSpacing: '.11em',
                              color: '#5C6684',
                            }}
                          >
                            WHAT YOU ACTUALLY RODE
                          </span>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontFamily: "'Space Grotesk',system-ui,sans-serif",
                              fontSize: '14px',
                              fontWeight: '700',
                              color: '#232A45',
                            }}
                          >
                            {v.ridePctLabel}
                          </span>
                        </div>
                        <div
                          style={{
                            height: '8px',
                            borderRadius: '5px',
                            background: '#F4EFF1',
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
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#746E88',
                                marginBottom: '7px',
                              }}
                            >
                              {'DISTANCE '}
                              <span style={{ color: '#A9A2B4' }}>(MILES)</span>
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
                                background: '#FBF1F3',
                                fontSize: '14.5px',
                                fontWeight: '500',
                                color: '#232A45',
                              }}
                            />
                            <span
                              style={{
                                display: 'block',
                                fontSize: '11px',
                                fontWeight: '400',
                                color: '#A9A2B4',
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
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#746E88',
                                marginBottom: '7px',
                              }}
                            >
                              {'ELEVATION '}
                              <span style={{ color: '#A9A2B4' }}>(FEET)</span>
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
                                background: '#FBF1F3',
                                fontSize: '14.5px',
                                fontWeight: '500',
                                color: '#232A45',
                              }}
                            />
                            <span
                              style={{
                                display: 'block',
                                fontSize: '11px',
                                fontWeight: '400',
                                color: '#A9A2B4',
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
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.1em',
                                color: '#746E88',
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
                                  background: '#FBF1F3',
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
                                    fontSize: '14.5px',
                                    fontWeight: '500',
                                    color: '#232A45',
                                  }}
                                />
                                <span
                                  style={{
                                    flex: 'none',
                                    fontSize: '12.5px',
                                    fontWeight: '600',
                                    color: '#746E88',
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
                                  background: '#FBF1F3',
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
                                    fontSize: '14.5px',
                                    fontWeight: '500',
                                    color: '#232A45',
                                  }}
                                />
                                <span
                                  style={{
                                    flex: 'none',
                                    fontSize: '12.5px',
                                    fontWeight: '600',
                                    color: '#746E88',
                                  }}
                                >
                                  min
                                </span>
                              </span>
                            </div>
                            <span
                              style={{
                                display: 'block',
                                fontSize: '11px',
                                fontWeight: '400',
                                color: '#A9A2B4',
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
                          background: '#fff',
                          borderRadius: '20px',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '10.5px',
                            fontWeight: '700',
                            letterSpacing: '.11em',
                            color: '#5C6684',
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
                          background: '#fff',
                          borderRadius: '20px',
                          boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        }}
                      >
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
                        >
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: '700',
                              letterSpacing: '.11em',
                              color: '#5C6684',
                            }}
                          >
                            PROGRESS
                          </span>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontFamily: "'Space Grotesk',system-ui,sans-serif",
                              fontSize: '15px',
                              fontWeight: '700',
                              color: '#232A45',
                            }}
                          >
                            {v.progLabel}
                          </span>
                        </div>
                        <div
                          style={{
                            height: '8px',
                            borderRadius: '5px',
                            background: '#FCE8F1',
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
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  style={{ width: '14px', height: '14px', flex: 'none' }}
                                >
                                  <path
                                    d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                                    fill="#E1699C"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(225,105,156,0.55))' }}
                                  ></path>
                                </svg>
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
                                background: '#fff',
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
                                      background: '#FCE8F1',
                                      border: '2px solid #fff',
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
                                            <svg
                                              aria-hidden="true"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="#E1699C"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              style={{ width: '19px', height: '19px', flex: 'none' }}
                                            >
                                              <line x1="6" y1="12" x2="18" y2="12"></line>
                                              <line x1="4" y1="9" x2="4" y2="15"></line>
                                              <line x1="20" y1="9" x2="20" y2="15"></line>
                                              <line x1="7" y1="9" x2="7" y2="15"></line>
                                              <line x1="17" y1="9" x2="17" y2="15"></line>
                                            </svg>
                                          </>
                                        ) : null}
                                        {ex?.isV ? (
                                          <>
                                            <svg
                                              aria-hidden="true"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="#E1699C"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              style={{
                                                width: '19px',
                                                height: '19px',
                                                flex: 'none',
                                                transform: 'rotate(90deg)',
                                              }}
                                            >
                                              <line x1="6" y1="12" x2="18" y2="12"></line>
                                              <line x1="4" y1="9" x2="4" y2="15"></line>
                                              <line x1="20" y1="9" x2="20" y2="15"></line>
                                              <line x1="7" y1="9" x2="7" y2="15"></line>
                                              <line x1="17" y1="9" x2="17" y2="15"></line>
                                            </svg>
                                          </>
                                        ) : null}
                                        {ex?.isD ? (
                                          <>
                                            <svg
                                              aria-hidden="true"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="#E1699C"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              style={{ width: '19px', height: '19px', flex: 'none' }}
                                            >
                                              <line x1="9" y1="12" x2="15" y2="12"></line>
                                              <line x1="6" y1="9" x2="6" y2="15"></line>
                                              <line x1="18" y1="9" x2="18" y2="15"></line>
                                            </svg>
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
                                          background: '#fff',
                                          borderRadius: '18px',
                                          boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                                        }}
                                      >
                                        <div
                                          style={{
                                            fontSize: '10px',
                                            fontWeight: '700',
                                            letterSpacing: '.11em',
                                            color: '#5C6684',
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
                                            <svg
                                              aria-hidden="true"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="#E1699C"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              style={{ width: '20px', height: '20px', flex: 'none' }}
                                            >
                                              <line x1="6" y1="12" x2="18" y2="12"></line>
                                              <line x1="4" y1="9" x2="4" y2="15"></line>
                                              <line x1="20" y1="9" x2="20" y2="15"></line>
                                              <line x1="7" y1="9" x2="7" y2="15"></line>
                                              <line x1="17" y1="9" x2="17" y2="15"></line>
                                            </svg>
                                          </button>
                                          <button onClick={ex?.pickV} style={css(ex?.optV)}>
                                            <svg
                                              aria-hidden="true"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="#E1699C"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              style={{
                                                width: '20px',
                                                height: '20px',
                                                flex: 'none',
                                                transform: 'rotate(90deg)',
                                              }}
                                            >
                                              <line x1="6" y1="12" x2="18" y2="12"></line>
                                              <line x1="4" y1="9" x2="4" y2="15"></line>
                                              <line x1="20" y1="9" x2="20" y2="15"></line>
                                              <line x1="7" y1="9" x2="7" y2="15"></line>
                                              <line x1="17" y1="9" x2="17" y2="15"></line>
                                            </svg>
                                          </button>
                                          <button onClick={ex?.pickD} style={css(ex?.optD)}>
                                            <svg
                                              aria-hidden="true"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="#E1699C"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              style={{ width: '20px', height: '20px', flex: 'none' }}
                                            >
                                              <line x1="9" y1="12" x2="15" y2="12"></line>
                                              <line x1="6" y1="9" x2="6" y2="15"></line>
                                              <line x1="18" y1="9" x2="18" y2="15"></line>
                                            </svg>
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
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={ex?.doneStroke}
                                    strokeWidth="2.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ width: '15px', height: '15px', flex: 'none' }}
                                  >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </button>
                                <button
                                  onClick={ex?.remove}
                                  aria-label={ex?.removeAria}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '34px',
                                    height: '34px',
                                    flex: 'none',
                                    border: 'none',
                                    borderRadius: '11px',
                                    background: 'none',
                                    cursor: 'pointer',
                                  }}
                                  className="hv8"
                                >
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#746E88"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ width: '19px', height: '19px', flex: 'none' }}
                                  >
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                  </svg>
                                </button>
                              </div>
                              <div
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}
                              >
                                <label style={{ flex: '1 1 120px', minWidth: '0', display: 'block' }}>
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: '10px',
                                      fontWeight: '700',
                                      letterSpacing: '.1em',
                                      color: '#746E88',
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
                                      background: '#FBF1F3',
                                      fontSize: '14.5px',
                                      fontWeight: '500',
                                      color: '#232A45',
                                    }}
                                  />
                                </label>
                                <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: '10px',
                                      fontWeight: '700',
                                      letterSpacing: '.1em',
                                      color: '#746E88',
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
                                      background: '#FBF1F3',
                                      fontSize: '14.5px',
                                      fontWeight: '500',
                                      color: '#232A45',
                                    }}
                                  />
                                </label>
                                <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: '10px',
                                      fontWeight: '700',
                                      letterSpacing: '.1em',
                                      color: '#746E88',
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
                                      background: '#FBF1F3',
                                      fontSize: '14.5px',
                                      fontWeight: '500',
                                      color: '#232A45',
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
                      <button
                        onClick={v.openAdd}
                        style={{
                          width: '100%',
                          marginTop: '16px',
                          padding: '18px',
                          border: '1.5px dashed rgba(225,105,156,.45)',
                          borderRadius: '18px',
                          background: 'none',
                          color: '#E1699C',
                          fontSize: '14.5px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#E1699C"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: '19px', height: '19px', flex: 'none' }}
                        >
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add exercise
                      </button>
                    </>
                  ) : null}
                  {v.addOpen ? (
                    <>
                      <div
                        style={{
                          marginTop: '14px',
                          padding: '22px',
                          background: '#fff',
                          borderRadius: '20px',
                          boxShadow: '0 8px 24px rgba(35,42,69,.14)',
                        }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                          <span
                            style={{
                              fontFamily: "'Space Grotesk',system-ui,sans-serif",
                              fontSize: '16px',
                              fontWeight: '700',
                              letterSpacing: '-.01em',
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
                              background: '#FBF1F3',
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
                                    <span style={{ fontSize: '14.5px', fontWeight: '600', color: '#232A45' }}>
                                      {l?.name}
                                    </span>
                                    <span
                                      style={{
                                        marginLeft: 'auto',
                                        fontSize: '13px',
                                        fontWeight: '400',
                                        color: '#746E88',
                                      }}
                                    >
                                      {l?.detail}
                                    </span>
                                  </button>
                                </Fragment>
                              ))}
                              <button
                                onClick={v.goArsenal}
                                style={{
                                  marginTop: '4px',
                                  padding: '12px',
                                  border: 'none',
                                  borderRadius: '14px',
                                  background: 'none',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#c4548a',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '7px',
                                }}
                                className="hv7"
                              >
                                Browse the Arsenal
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#c4548a"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ width: '14px', height: '14px', flex: 'none' }}
                                >
                                  <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                              </button>
                            </div>
                          </>
                        ) : null}
                        {v.addNew ? (
                          <>
                            <div style={{ marginTop: '18px' }}>
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: '10px',
                                  fontWeight: '700',
                                  letterSpacing: '.1em',
                                  color: '#746E88',
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
                                  background: '#FBF1F3',
                                  fontSize: '14.5px',
                                  fontWeight: '500',
                                  color: '#232A45',
                                }}
                              />
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: '10px',
                                  fontWeight: '700',
                                  letterSpacing: '.1em',
                                  color: '#746E88',
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
                                      fontSize: '10px',
                                      fontWeight: '700',
                                      letterSpacing: '.1em',
                                      color: '#746E88',
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
                                      background: '#FBF1F3',
                                      fontSize: '14.5px',
                                      fontWeight: '500',
                                      color: '#232A45',
                                    }}
                                  />
                                </label>
                                <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: '10px',
                                      fontWeight: '700',
                                      letterSpacing: '.1em',
                                      color: '#746E88',
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
                                      background: '#FBF1F3',
                                      fontSize: '14.5px',
                                      fontWeight: '500',
                                      color: '#232A45',
                                    }}
                                  />
                                </label>
                                <label style={{ flex: '1 1 110px', minWidth: '0', display: 'block' }}>
                                  <span
                                    style={{
                                      display: 'block',
                                      fontSize: '10px',
                                      fontWeight: '700',
                                      letterSpacing: '.1em',
                                      color: '#746E88',
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
                                      background: '#FBF1F3',
                                      fontSize: '14.5px',
                                      fontWeight: '500',
                                      color: '#232A45',
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
                          <button
                            onClick={v.closeAdd}
                            style={{
                              height: '52px',
                              padding: '0 22px',
                              border: 'none',
                              borderRadius: '16px',
                              background: 'none',
                              fontSize: '14.5px',
                              fontWeight: '600',
                              color: '#5C6684',
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                          {v.addNew ? (
                            <>
                              <button onClick={v.commitNew} style={css(v.commitStyle)}>
                                Add to workout
                              </button>
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
                        fontSize: '10.5px',
                        fontWeight: '700',
                        letterSpacing: '.1em',
                        color: '#746E88',
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
                        background: '#fff',
                        boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                        fontSize: '14.5px',
                        fontWeight: '500',
                        color: '#232A45',
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
                    <button onClick={v.footerSecondary} style={css(v.eCancelStyle)}>
                      {v.eCancelLabel}
                    </button>
                    <button
                      onClick={v.saveWorkout}
                      style={{
                        height: '52px',
                        padding: '0 30px',
                        border: 'none',
                        borderRadius: '16px',
                        background: '#E1699C',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                      className="hv4"
                    >
                      {v.eSaveLabel}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
            {v.isDiary ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={v.diaryBack}
                      style={{
                        height: '30px',
                        padding: '0 12px 0 6px',
                        flex: 'none',
                        border: 'none',
                        borderRadius: '10px',
                        background: 'none',
                        marginLeft: '-4px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#5C6684',
                      }}
                      className="hv0"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#5C6684"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '17px', height: '17px', flex: 'none' }}
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                      Back
                    </button>
                  </div>
                  {v.diaryReading ? (
                    <>
                      <div style={{ marginTop: '30px' }}>
                        <div
                          style={{
                            fontSize: '10.5px',
                            fontWeight: '700',
                            letterSpacing: '.11em',
                            color: '#A9A2B4',
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
                              fontSize: '26px',
                              fontWeight: '700',
                              letterSpacing: '-.025em',
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
                              fontSize: '12.5px',
                              fontWeight: '600',
                              color: '#c4548a',
                            }}
                            className="hv7"
                          >
                            View workout
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#c4548a"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ width: '15px', height: '15px', flex: 'none' }}
                            >
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
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
                              background: '#fff',
                              borderRadius: '20px',
                              boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                            }}
                          >
                            <span style={css(v.readMoodFace)}>{v.readMoodSvg}</span>
                            <div style={{ minWidth: '0' }}>
                              <div
                                style={{
                                  fontSize: '10px',
                                  fontWeight: '700',
                                  letterSpacing: '.11em',
                                  color: '#A9A2B4',
                                }}
                              >
                                MOOD
                              </div>
                              <div
                                style={{
                                  fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                  fontSize: '16px',
                                  fontWeight: '700',
                                  color: '#232A45',
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
                              background: '#fff',
                              borderRadius: '20px',
                              boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '.11em',
                                color: '#A9A2B4',
                              }}
                            >
                              EFFORT
                            </div>
                            <div
                              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}
                            >
                              <span
                                style={{
                                  fontFamily: "'Space Grotesk',system-ui,sans-serif",
                                  fontSize: '16px',
                                  fontWeight: '700',
                                  color: '#232A45',
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
                            background: '#fff',
                            borderRadius: '20px',
                            boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              letterSpacing: '.11em',
                              color: '#A9A2B4',
                            }}
                          >
                            NOTES
                          </div>
                          <p
                            style={{
                              margin: '10px 0 0',
                              fontSize: '15px',
                              fontWeight: '400',
                              lineHeight: '1.65',
                              color: '#232A45',
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
                          <button
                            onClick={v.deleteEntry}
                            style={{
                              height: '52px',
                              padding: '0 20px',
                              border: 'none',
                              borderRadius: '16px',
                              background: 'none',
                              fontSize: '14.5px',
                              fontWeight: '600',
                              color: '#B23A4C',
                              cursor: 'pointer',
                            }}
                            className="hv11"
                          >
                            Delete entry
                          </button>
                          <button
                            onClick={v.editEntry}
                            style={{
                              height: '52px',
                              padding: '0 26px',
                              border: 'none',
                              borderRadius: '16px',
                              background: '#E1699C',
                              color: '#fff',
                              fontSize: '15px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                            className="hv4"
                          >
                            Edit entry
                          </button>
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
                            fontSize: '22px',
                            fontWeight: '700',
                            letterSpacing: '-.02em',
                          }}
                        >
                          {'How did that feel? '}
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            style={{
                              width: '17px',
                              height: '17px',
                              flex: 'none',
                              display: 'inline-block',
                              verticalAlign: 'middle',
                            }}
                          >
                            <path
                              d="M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z"
                              fill="#7C8FC9"
                              style={{ filter: 'drop-shadow(0 0 4px rgba(124,143,201,0.5))' }}
                            ></path>
                          </svg>
                        </h1>
                        <p
                          style={{
                            margin: '9px 0 0',
                            fontSize: '14.5px',
                            fontWeight: '500',
                            color: '#746E88',
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
                                    <svg
                                      aria-hidden="true"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#FBF1F3"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      style={{ width: '34px', height: '34px' }}
                                    >
                                      <circle cx="9" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                      <circle cx="15" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                      <path d="M8.5 14.5c1.1 1.7 5.9 1.7 7 0"></path>
                                    </svg>
                                  </>
                                ) : null}
                                {m?.isNeutral ? (
                                  <>
                                    <svg
                                      aria-hidden="true"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#FBF1F3"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      style={{ width: '34px', height: '34px' }}
                                    >
                                      <circle cx="9" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                      <circle cx="15" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                      <line x1="8.5" y1="15" x2="15.5" y2="15"></line>
                                    </svg>
                                  </>
                                ) : null}
                                {m?.isSad ? (
                                  <>
                                    <svg
                                      aria-hidden="true"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#FBF1F3"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      style={{ width: '34px', height: '34px' }}
                                    >
                                      <circle cx="9" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                      <circle cx="15" cy="10" r="1.1" fill="#FBF1F3" stroke="none"></circle>
                                      <path d="M8.5 16c1.1-1.7 5.9-1.7 7 0"></path>
                                    </svg>
                                  </>
                                ) : null}
                                {m?.isMad ? (
                                  <>
                                    <svg
                                      aria-hidden="true"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#FBF1F3"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      style={{ width: '34px', height: '34px' }}
                                    >
                                      <line x1="7.4" y1="8.4" x2="10.6" y2="10.2"></line>
                                      <line x1="16.6" y1="8.4" x2="13.4" y2="10.2"></line>
                                      <path d="M8.5 16c1.1-1.7 5.9-1.7 7 0"></path>
                                    </svg>
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
                          <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600', color: '#5C6684' }}>
                            How hard did it feel?
                          </p>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#c4548a',
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
                            fontSize: '13.5px',
                            fontWeight: '600',
                            color: '#5C6684',
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
                            background: '#fff',
                            boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                            fontSize: '14.5px',
                            fontWeight: '500',
                            color: '#232A45',
                            resize: 'vertical',
                          }}
                        />
                        <button
                          onClick={v.saveEntry}
                          style={{
                            width: '100%',
                            marginTop: '22px',
                            padding: '18px',
                            border: 'none',
                            borderRadius: '18px',
                            background: '#E1699C',
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(225,105,156,.4)',
                          }}
                        >
                          {v.saveEntryLabel}
                        </button>
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
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke={v.mCalColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: '22px', height: '22px', flex: 'none' }}
            >
              <rect x="3" y="5" width="18" height="16" rx="3"></rect>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <line x1="8" y1="3" x2="8" y2="6"></line>
              <line x1="16" y1="3" x2="16" y2="6"></line>
            </svg>
            <span style={css(v.mCalLabel)}>Calendar</span>
          </button>
          <button onClick={v.goDiaryList} style={css(v.mTabDiary)}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke={v.mDiaryColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: '22px', height: '22px', flex: 'none' }}
            >
              <path d="M5 4h11a3 3 0 0 1 3 3v13H7a2 2 0 0 1-2-2z"></path>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="13" x2="14" y2="13"></line>
            </svg>
            <span style={css(v.mDiaryLabel)}>Chronicle</span>
          </button>
          <button onClick={v.goSummary} style={css(v.mTabSummary)}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke={v.mSummaryColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: '22px', height: '22px', flex: 'none' }}
            >
              <line x1="6" y1="20" x2="6" y2="13"></line>
              <line x1="12" y1="20" x2="12" y2="8"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
            </svg>
            <span style={css(v.mSummaryLabel)}>Progress</span>
          </button>
          <button onClick={v.goProfile} style={css(v.mTabProfile)}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke={v.mProfileColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: '22px', height: '22px', flex: 'none' }}
            >
              <circle cx="12" cy="8.5" r="3.6"></circle>
              <path d="M4.8 20a7.4 7.4 0 0 1 14.4 0"></path>
            </svg>
            <span style={css(v.mProfileLabel)}>Profile</span>
          </button>
        </nav>
      </div>
    </>
  );
}
