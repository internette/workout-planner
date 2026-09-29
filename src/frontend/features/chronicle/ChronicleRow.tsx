import { IconButton } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ChevronRight, Close, MoodFace } from '@moonshot/design-system/icons';
import { StarRating } from '@moonshot/design-system/rating';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/frontend/features/planner/viewHelpers';
import { KindTag, kindOf } from '@/frontend/components/KindTag';

/** An entry in the Chronicle’s list: how it felt, its session and note, and deleting it. */
export function ChronicleRow({ entry }: { entry: any }) {
  return (
    <div style={{ position: 'relative' }}>
      <Card
        as="button"
        pad="none"
        interactive
        onClick={entry?.open}
        aria-label={entry?.aria}
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: '16px',
          padding: '18px 62px 18px 20px',
        }}
      >
        <span className="fc-keep" style={css(entry?.faceWrap)}>
          {entry?.mood ? <MoodFace mood={entry.mood} size={24} /> : null}
        </span>
        <span style={{ flex: '1 1 220px', minWidth: '0' }}>
          <Text variant="eyebrow" tone="muted" style={{ display: 'block' }}>
            {entry?.date}
          </Text>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              marginTop: '4px',
            }}
          >
            <Text variant="itemTitle">{entry?.name}</Text>
            <KindTag inline kind={kindOf(entry)} />
            <ChevronRight color="var(--color-subtle)" strokeWidth={2.2} size={16} />
          </span>
          <StarRating readOnly value={entry?.rpe ?? 0} style={{ marginTop: '6px' }} />
          <Text
            variant="caption"
            tone="muted"
            style={{
              display: 'block',
              lineHeight: 'var(--leading-snug)',
              marginTop: '7px',
              textWrap: 'pretty',
            }}
          >
            {entry?.note}
          </Text>
        </span>
      </Card>
      <IconButton
        label={entry?.deleteLabel}
        size="lg"
        tone="danger"
        onClick={entry?.remove}
        title="Delete entry"
        style={{ position: 'absolute', top: '6px', right: '6px' }}
      >
        <Close color="var(--color-subtle)" strokeWidth={2.2} size={14} />
      </IconButton>
    </div>
  );
}
