import { vars } from '@moonshot/design-system/colors';
import { Check, Sparkle } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** The Day view’s quest for the day: all of it, kept compact so the workouts start close under it. */
export function QuestCard({ v }: { v: PlannerVals }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginTop: '16px',
        padding: '12px 16px',
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
          <Check color="var(--color-on-accent)" strokeWidth={2.6} size={16} />
        ) : null}
        {v.questOpen ? (
          <Sparkle size={16} color={vars.pink} />
        ) : null}
      </span>
      {/* Beside the icon at any width: on a narrow phone the text wraps rather than dropping under it. */}
      <div style={{ flex: '1 1 0', minWidth: '0' }}>
        <Text variant="micro" as="div" tone="accent">
          {v.questEyebrow}
        </Text>
        <Text
          variant="subheading"
          as="div"
          tone={v.questCleared ? 'muted' : 'ink'}
          style={{ marginTop: '2px', textDecoration: v.questCleared ? 'line-through' : undefined }}
        >
          {v.questTitle}
        </Text>
        <Text
          variant="body"
          as="div"
          tone="slateDeep"
          style={{
            marginTop: '2px',
            textWrap: 'pretty',
          }}
        >
          {v.questNote}
        </Text>
      </div>
    </div>
  );
}
