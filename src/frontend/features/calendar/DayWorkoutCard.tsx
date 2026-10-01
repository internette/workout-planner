import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { ChevronRight, Dumbbell, DumbbellSmall, ExerciseIcon } from '@moonshot/design-system/icons';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import { StatRow } from '@/frontend/components/StatRow';
import { css, t } from '@/frontend/features/planner/viewHelpers';
import { DisclosureChevron } from '@/frontend/components/DisclosureChevron';
import { KindTag, kindOf } from '@/frontend/components/KindTag';
import { StatusDot } from '@/frontend/components/StatusDot';

/** A session on the Day view: its exercises or ride, progress, and what to do next. Only one on the day is open at a
 * time; the others are folded to a row, which opens it. */
export function DayWorkoutCard({ card }: { card: any }) {
  if (!card?.isOpen) return <FoldedCard card={card} />;
  return (
    <Card pad="lg" className="day-card">
        {card?.inProgress ? (
          <Text variant="eyebrow" as="div" tone="slate" style={{ marginBottom: '8px' }}>
            IN PROGRESS
          </Text>
        ) : null}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <IconTile size="sm" className="day-card-tile">{card?.icoSvg}</IconTile>
          {/* Takes the rest of the row, so a long name wraps beside the icon rather than dropping below it. */}
          <div style={{ minWidth: '0', flex: '1 1 0' }}>
            <KindTag kind={kindOf(card)} />
            <Text variant="heading" as="h2" className="day-card-title" style={{ margin: '0' }}>
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
              {card?.openMeta || card?.meta}
            </Text>
          </div>
        </div>
        {card?.isLift ? (
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
        ) : null}
        {card?.ridePlan ? (
          <Text variant="label" as="p" tone="ink" weight="semibold" style={{ margin: '14px 0 0' }}>
            {card.ridePlan}
          </Text>
        ) : null}
        {card?.rideStats?.length ? (
          <StatRow stats={card?.rideStats ?? []} style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--color-line)' }} />
        ) : null}
        {card?.isLift ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              marginTop: '16px',
            }}
          >
            {(card?.preview ?? []).map((x, i) => (
              <div key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  padding: '9px 0',
                  borderBottom: '1px solid var(--color-line)',
                }}
              >
                {x?.isH ? (
                  <Dumbbell color="var(--color-accent)" size={20} />
                ) : null}
                {x?.isV ? (
                  <Dumbbell
                    color="var(--color-accent)"
                    size={17}
                    style={{ transform: 'rotate(90deg)' }}
                  />
                ) : null}
                {x?.isD ? (
                  <DumbbellSmall color="var(--color-accent)" size={20} />
                ) : null}
                {x?.otherIcon ? <ExerciseIcon name={x.otherIcon} color="var(--color-accent)" size={20} /> : null}
                <span style={css(x?.textStyle)}>{x?.text}</span>
              </div>
            ))}
          </div>
        ) : null}
        {card?.hasMore ? (
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
              <DisclosureChevron open={!!card?.moreOpen} />
            </span>
          </Button>
        ) : null}
        {card?.ctaTwoButtons ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
            <Button
              type="secondary"
              size="lg"
              style={{ flex: '1 1 120px', minWidth: '0', whiteSpace: 'nowrap' }}
              onClick={card?.restart}
            >
              {card?.restartLabel}
            </Button>
            <Button
              type="primary"
              size="lg"
              style={{ flex: '1 1 120px', minWidth: '0', whiteSpace: 'nowrap' }}
              onClick={card?.continue}
            >
              {card?.continueLabel}
            </Button>
          </div>
        ) : (
          <Button
            type="primary"
            size="lg"
            fullWidth
            onClick={card?.cta}
            style={{ marginTop: '20px' }}
          >
            {card?.ctaLabel}
          </Button>
        )}
      </Card>
  );
}

/** A session folded to a row: its icon, name, where it stands, and its status dot. The whole row opens it. */
function FoldedCard({ card }: { card: any }) {
  return (
    <Card pad="none">
      <button
        type="button"
        onClick={card?.expand}
        aria-expanded={false}
        aria-label={card?.expandLabel + ', ' + card?.meta}
        className="hv6"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          width: '100%',
          padding: '14px 20px',
          border: 'none',
          borderRadius: 'inherit',
          background: 'none',
          font: 'inherit',
          color: 'inherit',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <IconTile size="sm" className="day-card-tile">{card?.icoSvg}</IconTile>
        <span style={{ flex: '1', minWidth: '0' }}>
          <KindTag kind={kindOf(card)} />
          <Text variant="cardTitle" as="span" style={{ display: 'block' }}>
            {t(card?.name)}
          </Text>
          <Text variant="caption" as="span" tone="muted" style={{ display: 'block', marginTop: '2px' }}>
            {card?.meta}
          </Text>
        </span>
        <StatusDot status={card?.dot} size="md" />
      </button>
    </Card>
  );
}
