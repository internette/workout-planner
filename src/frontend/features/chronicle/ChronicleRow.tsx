import { Card } from '@moonshot/design-system/card';
import { ChevronRight, MoodFace } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/frontend/features/planner/viewHelpers';
import { KindTag, kindOf } from '@/frontend/components/KindTag';

/** An entry in the Chronicle’s list, a card of its own: how it felt beside its day, session and the start of its note. Opening it
 * reads it; deleting it is done there. */
export function ChronicleRow({ entry }: { entry: any }) {
  return (
    <Card
      as="button"
      pad="none"
      interactive
      onClick={entry?.open}
      aria-label={entry?.aria}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        textAlign: 'left',
      }}
    >
      <span className="fc-keep" style={css(entry?.faceWrap)}>
        {entry?.mood ? <MoodFace mood={entry.mood} size={24} /> : null}
      </span>
      <span style={{ flex: '1', minWidth: '0' }}>
        <Text variant="micro" tone="muted" style={{ display: 'block' }}>
          {entry?.date}
        </Text>
        <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 6px', marginTop: '2px' }}>
          <Text variant="itemTitle">{entry?.name}</Text>
          <KindTag inline kind={kindOf(entry)} />
          <ChevronRight color="var(--color-subtle)" strokeWidth={2.2} size={16} />
        </span>
        {entry?.note ? (
          <Text
            variant="caption"
            tone="muted"
            // One line; a longer note ends in "…", and reads in full on the entry.
            style={{ display: 'block', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {entry.note}
          </Text>
        ) : null}
      </span>
    </Card>
  );
}
