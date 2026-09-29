import type { ReactNode } from 'react';
import { Card } from '@moonshot/design-system/card';
import { Bike, Dumbbell, LotusFlower, Lunge } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** One kind of workout to start, as a row: its icon on a tinted square, and beside it its name over what it's for. */
function TypeChoiceCard({ icon, tint, title, note, onClick }: { icon: ReactNode; tint: string; title: string; note: string; onClick: () => void }) {
  return (
    <Card as="button" pad="md" interactive onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
      <span
        style={{
          width: '44px',
          height: '44px',
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
      <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <Text variant="subheading" tone="ink" style={{ display: 'block' }}>
          {title}
        </Text>
        <Text variant="body" tone="muted" style={{ display: 'block', lineHeight: 'var(--leading-snug)', textWrap: 'pretty' }}>
          {note}
        </Text>
      </span>
    </Card>
  );
}

/** A new workout’s first choice: lifting, cycling, or (once the database has them) stretching or yoga. */
export function TypeChoiceCards({ v }: { v: PlannerVals }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
        gap: '12px',
        marginTop: '22px',
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
      {v.canPickStretch ? (
        <TypeChoiceCard
          // The deep teal: plain teal on its tint is too faint for an icon.
          icon={<Lunge color="var(--color-teal-deep)" size={22} />}
          tint="var(--color-teal-tint)"
          title="Stretching"
          note="A few held stretches, as a cool-down or on their own."
          onClick={v.pickTypeStretch}
        />
      ) : null}
      {v.canPickYoga ? (
        <TypeChoiceCard
          // Slate, the palette's fourth colour after pink, periwinkle and teal: its deep shade on its tint, as the
          // rank badges have it.
          icon={<LotusFlower color="var(--color-slate-deep)" size={22} />}
          tint="var(--color-slate-tint)"
          title="Yoga"
          note="A flow of poses, each held for a few breaths."
          onClick={v.pickTypeYoga}
        />
      ) : null}
    </div>
  );
}
