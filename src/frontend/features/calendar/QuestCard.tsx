import { vars } from '@moonshot/design-system/colors';
import { Check, Sparkle } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** The Day view’s quest for the day. */
export function QuestCard({ v }: { v: PlannerVals }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '14px',
        marginTop: '22px',
        padding: '18px 20px',
        borderRadius: 'var(--radius-lg)',
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
        <Sparkle size={10} color={vars.teal} glow={0.55} />
      </span>
      <span style={css(v.questIconWrap)}>
        {v.questDone ? (
          <>
            <Check color="var(--color-on-accent)" strokeWidth={2.6} size={19} />
          </>
        ) : null}
        {v.questOpen ? (
          <>
            <Sparkle size={19} color={vars.pink} />
          </>
        ) : null}
      </span>
      <div style={{ flex: '1 1 200px', minWidth: '0' }}>
        <Text variant="micro" as="div" tone="accent">
          {v.questEyebrow}
        </Text>
        <Text
          variant="itemTitle"
          as="div"
          tone={v.questCleared ? 'muted' : 'ink'}
          style={{ marginTop: '4px', textDecoration: v.questCleared ? 'line-through' : undefined }}
        >
          {v.questTitle}
        </Text>
        <Text
          variant="caption"
          as="div"
          tone="slateDeep"
          style={{
            lineHeight: 'var(--leading-snug)',
            marginTop: '3px',
            textWrap: 'pretty',
          }}
        >
          {v.questNote}
        </Text>
      </div>
    </div>
  );
}
