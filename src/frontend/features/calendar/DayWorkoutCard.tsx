import { DisclosureChevron } from '@moonshot/design-system/disclosure';
import { Button, Pressable } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { ChevronRight, Dumbbell, DumbbellSmall } from '@moonshot/design-system/icons';
import { WorkoutIcon } from '@/frontend/shared/icons';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import { StatRow } from '@/frontend/components/StatRow';
import { t } from '@/frontend/features/planner/viewHelpers';
import { SessionTags } from '@/frontend/components/SessionTags';
import { StatusDot } from '@/frontend/components/StatusDot';

/** A session on the Day view: its exercises or ride, progress, and what to do next. Only one on the day is open at a
 * time; the others are folded to a row, which opens it. */
export function DayWorkoutCard({ card }: { card: any }) {
  if (!card?.isOpen) return <FoldedCard card={card} />;
  return (
    <Card pad="lg" className="day-card">
        <div
          style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}
        >
          <IconTile size="sm" compact>{card?.icoSvg}</IconTile>
          {/* Takes the rest of the row, so a long name wraps beside the icon rather than dropping below it. */}
          <div style={{ minWidth: '0', flex: '1 1 0' }}>
            <SessionTags program={card?.programName} type={card?.typeLabel} />
            <Text variant="heading" as="h2" style={{ margin: '0' }}>
              <Pressable
                onClick={card?.open}
                hit
                style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', margin: 'calc(-1 * var(--space-1)) calc(-1 * var(--space-2))', padding: 'var(--space-1) var(--space-2)', minHeight: '36px', borderRadius: 'var(--radius-sm)' }}
              >
                {t(card?.name)}
                <ChevronRight color="var(--color-muted)" size={17} />
              </Pressable>
            </Text>
            {/* Under way, its status and time in pink, with a dot that pulses while the clock runs. */}
            <Text
              variant="strong"
              as="p"
              tone={card?.live && card.live !== 'paused' ? 'accent' : 'muted'}
              style={{ margin: 'var(--space-1) 0 0', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              {card?.live ? <span aria-hidden="true" className={card.live === 'paused' ? undefined : 'live-dot'} style={{ width: '8px', height: '8px', flex: 'none', borderRadius: 'var(--radius-full)', background: card.live === 'paused' ? 'var(--color-muted)' : 'var(--color-pink)' }} /> : null}
              {card?.openMeta || card?.meta}
            </Text>
          </div>
        </div>
        {card?.showProg ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-5)',
            }}
          >
            <ProgressBar value={card?.progPct ?? 0} track="tint" style={{ flex: '1' }} />
            <Text variant="figure" tone="ink" style={{ flex: 'none' }}>
              {card?.progLabel}
            </Text>
          </div>
        ) : null}
        {card?.ridePlan ? (
          <Text variant="strong" as="p" tone="ink" weight="semibold" style={{ margin: 'var(--space-4) 0 0' }}>
            {card.ridePlan}
          </Text>
        ) : null}
        {card?.rideStats?.length ? (
          <StatRow stats={card?.rideStats ?? []} style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-line)' }} />
        ) : null}
        {card?.isLift ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-1)',
              marginTop: 'var(--space-4)',
            }}
          >
            {(card?.preview ?? []).map((x, i) => (
              <div key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-2) 0',
                  borderBottom: '1px solid var(--color-line)',
                }}
              >
                {/* The icon sits by the name's line; the details go under the name, so they never break mid-figure. */}
                <span aria-hidden="true" style={{ flex: 'none', width: '20px', height: '24px', display: 'grid', placeItems: 'center' }}>
                  {x?.isH ? <Dumbbell color="var(--color-pink)" size={20} /> : null}
                  {x?.isV ? <Dumbbell color="var(--color-pink)" size={17} style={{ transform: 'rotate(90deg)' }} /> : null}
                  {x?.isD ? <DumbbellSmall color="var(--color-pink)" size={20} /> : null}
                  {x?.otherIcon ? <WorkoutIcon name={x.otherIcon} color="var(--color-pink)" size={20} /> : null}
                </span>
                <span style={{ flex: '1', minWidth: '0' }}>
                  <Text
                    variant="strong"
                    weight="semibold"
                    tone={x?.exDone ? 'muted' : 'ink'}
                    style={{ display: 'block', textDecoration: x?.exDone ? 'line-through' : undefined }}
                  >
                    {x?.exName}
                  </Text>
                  <Text variant="body" tone="muted" style={{ display: 'block', marginTop: 'var(--space-1)' }}>
                    {x?.exDetail}
                  </Text>
                  {x?.setNow ? (
                    <Text variant="small" tone="accent" weight="semibold" style={{ display: 'block', marginTop: 'var(--space-1)' }}>
                      {x.setNow}
                    </Text>
                  ) : null}
                </span>
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
            style={{ marginTop: 'var(--space-3)', minHeight: '44px' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              {t(card?.moreLabel)}
              <DisclosureChevron open={!!card?.moreOpen} />
            </span>
          </Button>
        ) : null}
        {card?.ctaTwoButtons ? (
          // Carrying on is the one big button; starting over (which wipes the clock and ticks) is a quiet link under it.
          <>
            <Button type="primary" size="lg" fullWidth onClick={card?.continue} style={{ marginTop: 'var(--space-5)' }}>
              {card?.continueLabel}
            </Button>
            <Button type="neutral" link size="sm" onClick={card?.restart} style={{ display: 'flex', margin: 'var(--space-2) auto 0', minHeight: '44px' }}>
              {card?.restartLabel}
            </Button>
          </>
        ) : (
          <Button
            type="primary"
            size="lg"
            fullWidth
            onClick={card?.cta}
            style={{ marginTop: 'var(--space-5)' }}
          >
            {card?.ctaLabel}
          </Button>
        )}
        {card?.doToday ? (
          <Button type="secondary" link size="sm" onClick={card.doToday} style={{ display: 'flex', margin: 'var(--space-2) auto 0', minHeight: '44px' }}>
            Do it today instead
          </Button>
        ) : null}
      </Card>
  );
}

/** A session folded to a row: its icon, name, where it stands, and its status dot. The whole row opens it. */
function FoldedCard({ card }: { card: any }) {
  return (
    <Card pad="none">
      <Pressable
        onClick={card?.expand}
        aria-expanded={false}
        aria-label={card?.expandLabel + ', ' + card?.meta}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%', padding: 'var(--space-3) var(--space-5)', borderRadius: 'inherit' }}
      >
        <IconTile size="sm" compact>{card?.icoSvg}</IconTile>
        <span style={{ flex: '1', minWidth: '0' }}>
          <SessionTags program={card?.programName} type={card?.typeLabel} />
          <Text variant="subheading" as="span" style={{ display: 'block' }}>
            {t(card?.name)}
          </Text>
          <Text variant="body" as="span" tone="muted" style={{ display: 'block', marginTop: 'var(--space-1)' }}>
            {card?.meta}
          </Text>
        </span>
        <StatusDot status={card?.dot} size="md" />
      </Pressable>
    </Card>
  );
}
