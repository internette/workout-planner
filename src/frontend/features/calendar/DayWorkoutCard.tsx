import { Fragment } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { ChevronDown, ChevronRight, Dumbbell, DumbbellSmall } from '@moonshot/design-system/icons';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import { RideStats } from '@/frontend/components/RideStats';
import { WarmupTag } from '@/frontend/components/WarmupTag';
import { css, t } from '@/frontend/features/planner/viewHelpers';

/** A session on the Day view: its exercises or ride, progress, and what to do next. */
export function DayWorkoutCard({ card }: { card: any }) {
  return (
    <Card pad="lg">
        <div
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}
        >
          <IconTile size="sm">{card?.icoSvg}</IconTile>
          <div style={{ minWidth: '0' }}>
            {card?.warmup ? <WarmupTag /> : null}
            <Text variant="heading" as="h2" style={{ margin: '0' }}>
              <button
                onClick={card?.open}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  margin: '-6px -10px',
                  padding: '6px 10px',
                  minHeight: '36px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: 'none',
                  font: 'inherit',
                  color: 'inherit',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                className="hv3 hit"
              >
                {t(card?.name)}
                <ChevronRight color="var(--color-muted)" size={17} />
              </button>
            </Text>
            <Text variant="label" as="p" tone="muted" style={{ margin: '4px 0 0' }}>
              {card?.meta}
            </Text>
          </div>
        </div>
        {card?.isLift ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '20px',
              }}
            >
              <ProgressBar value={card?.progPct ?? 0} track="tint" style={{ flex: '1' }} />
              <Text variant="figure" tone="ink" style={{ flex: 'none' }}>
                {card?.progLabel}
              </Text>
            </div>
          </>
        ) : null}
        {card?.isRide ? (
          <>
            <RideStats stats={card?.rideStats ?? []} style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--color-line)' }} />
          </>
        ) : null}
        {card?.isLift ? (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                marginTop: '16px',
              }}
            >
              {(card?.preview ?? []).map((x, i) => (
                <Fragment key={i}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '11px',
                      padding: '9px 0',
                      borderBottom: '1px solid var(--color-line)',
                    }}
                  >
                    {x?.isH ? (
                      <>
                        <Dumbbell color="var(--color-accent)" size={20} />
                      </>
                    ) : null}
                    {x?.isV ? (
                      <>
                        <Dumbbell
                          color="var(--color-accent)"
                          size={17}
                          style={{ transform: 'rotate(90deg)' }}
                        />
                      </>
                    ) : null}
                    {x?.isD ? (
                      <>
                        <DumbbellSmall color="var(--color-accent)" size={20} />
                      </>
                    ) : null}
                    <span style={css(x?.textStyle)}>{x?.text}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          </>
        ) : null}
        {card?.hasMore ? (
          <>
            <Button
              type="neutral"
              link
              size="sm"
              aria-expanded={!!card?.moreOpen}
              onClick={card?.toggleMore}
              // On a line of its own, so it keeps the row height of the buttons below it.
              style={{ marginTop: '10px', minHeight: '44px' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {t(card?.moreLabel)}
                <ChevronDown
                  color="var(--color-muted)"
                  strokeWidth={2.2}
                  style={css(card?.moreCaret)}
                />
              </span>
            </Button>
          </>
        ) : null}
        {card?.ctaTwoButtons ? (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
              <Button
                type="secondary"
                size="lg"
                style={{ flex: '1 1 120px', minWidth: '0' }}
                onClick={card?.restart}
              >
                {card?.restartLabel}
              </Button>
              <Button
                type="primary"
                size="lg"
                style={{ flex: '1 1 120px', minWidth: '0' }}
                onClick={card?.continue}
              >
                {card?.continueLabel}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button
              type="primary"
              size="lg"
              fullWidth
              onClick={card?.cta}
              style={{ marginTop: '20px' }}
            >
              {card?.ctaLabel}
            </Button>
          </>
        )}
      </Card>
  );
}
