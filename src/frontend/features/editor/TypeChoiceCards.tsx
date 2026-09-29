import type { ReactNode } from 'react';
import { Card } from '@moonshot/design-system/card';
import { Bike, Check, Dumbbell, LotusFlower, Lunge } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** One kind of workout to start, as a row: its icon on a tinted square, and beside it its name over what it's for.
 * The one chosen already (when coming back to change it) has an accent ring and a tick; one it can't become is dimmed. */
function TypeChoiceCard({
  icon,
  tint,
  title,
  note,
  onClick,
  selected,
  disabled,
}: {
  icon: ReactNode;
  tint: string;
  title: string;
  note: string;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
}) {
  return (
    <Card
      as="button"
      pad="md"
      interactive={!disabled}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        textAlign: 'left',
        opacity: disabled ? 0.55 : 1,
        boxShadow: selected ? 'inset 0 0 0 2px var(--color-accent)' : undefined,
      }}
    >
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
      <span style={{ minWidth: 0, flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <Text variant="subheading" tone="ink" style={{ display: 'block' }}>
          {title}
        </Text>
        <Text variant="body" tone="muted" style={{ display: 'block', lineHeight: 'var(--leading-snug)', textWrap: 'pretty' }}>
          {note}
        </Text>
      </span>
      {selected ? (
        <span
          aria-hidden="true"
          style={{
            width: '24px',
            height: '24px',
            flex: 'none',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Check color="var(--color-on-accent)" size={14} strokeWidth={3} />
        </span>
      ) : null}
    </Card>
  );
}

/** A new workout's first choice: lifting, cycling, or (once the database has them) stretching or yoga. Coming back from
 * the editor to change it, the current one is chosen, and one it can't become is dimmed. */
export function TypeChoiceCards({ v }: { v: PlannerVals }) {
  const c = v.typeChoices;
  const card = (t: 'lift' | 'cycle' | 'stretch' | 'yoga') => ({
    onClick: () => c.pick(t),
    selected: c.selected === t,
    disabled: !c.can[t],
  });
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
        {...card('lift')}
      />
      <TypeChoiceCard
        icon={<Bike color="var(--color-periwinkle)" size={22} />}
        tint="var(--color-periwinkle-tint)"
        title="Cycling"
        note="Set a distance, duration and target effort for the ride."
        {...card('cycle')}
      />
      {c.stretch ? (
        <TypeChoiceCard
          // The deep teal: plain teal on its tint is too faint for an icon.
          icon={<Lunge color="var(--color-teal-deep)" size={22} />}
          tint="var(--color-teal-tint)"
          title="Stretching"
          note="A few held stretches, as a cool-down or on their own."
          {...card('stretch')}
        />
      ) : null}
      {c.yoga ? (
        <TypeChoiceCard
          // Slate, the palette's fourth colour after pink, periwinkle and teal: its deep shade on its tint, as the
          // rank badges have it.
          icon={<LotusFlower color="var(--color-slate-deep)" size={22} />}
          tint="var(--color-slate-tint)"
          title="Yoga"
          note="A flow of poses, each held for a few breaths."
          {...card('yoga')}
        />
      ) : null}
    </div>
  );
}
