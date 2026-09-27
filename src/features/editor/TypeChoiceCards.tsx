import { Card } from '@moonshot/design-system/card';
import { Bike, Dumbbell } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/features/planner/store/types';

/** A new workout’s first choice: lifting or cycling. */
export function TypeChoiceCards({ v }: { v: PlannerVals }) {
  return (
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
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent-tint)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Dumbbell color="var(--color-accent)" size={22} />
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
            borderRadius: 'var(--radius-md)',
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
  );
}
