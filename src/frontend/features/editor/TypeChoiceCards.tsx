import type { ReactNode } from 'react';
import { Card } from '@moonshot/design-system/card';
import { Bike, Dumbbell } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** One kind of workout to start: its icon on a tinted square, its name and what it's for. */
function TypeChoiceCard({ icon, tint, title, note, onClick }: { icon: ReactNode; tint: string; title: string; note: string; onClick: () => void }) {
  return (
    <Card
      as="button"
      pad="lg"
      interactive
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
      }}
    >
      <span
        style={{
          width: '46px',
          height: '46px',
          flex: 'none',
          borderRadius: 'var(--radius-md)',
          background: tint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </span>
      <span>
        <Text variant="subheading" tone="ink" style={{ display: 'block' }}>
          {title}
        </Text>
        <Text
          variant="body"
          tone="muted"
          style={{
            display: 'block',
            lineHeight: 'var(--leading-snug)',
            marginTop: '4px',
            textWrap: 'pretty',
          }}
        >
          {note}
        </Text>
      </span>
    </Card>
  );
}

/** A new workout’s first choice: lifting or cycling. */
export function TypeChoiceCards({ v }: { v: PlannerVals }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
        gap: '12px',
        marginTop: '24px',
      }}
    >
      <TypeChoiceCard
        icon={<Dumbbell color="var(--color-accent)" size={22} />}
        tint="var(--color-accent-tint)"
        title="Lifting"
        note="Build a list of exercises with sets, reps and weight."
        onClick={v.pickTypeLift}
      />
      <TypeChoiceCard
        icon={<Bike color="var(--color-periwinkle)" size={22} />}
        tint="var(--color-periwinkle-tint)"
        title="Cycling"
        note="Set a distance, duration and target effort for the ride."
        onClick={v.pickTypeCycle}
      />
    </div>
  );
}
