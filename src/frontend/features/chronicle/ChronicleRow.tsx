import { Card } from '@moonshot/design-system/card';
import { ChevronRight, MoodFace } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
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
        gap: 'var(--space-3)',
        padding: 'var(--space-3h) var(--space-4)',
        textAlign: 'left',
      }}
    >
      <span className="fc-keep" style={{ width: '40px', height: '40px', flex: 'none', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: entry?.faceBg }}>
        {entry?.mood ? <MoodFace mood={entry.mood} size={24} /> : null}
      </span>
      <span style={{ flex: '1', minWidth: '0' }}>
        <Text variant="micro" tone="muted" style={{ display: 'block' }}>
          {entry?.date}
        </Text>
        <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-1) var(--space-1h)', marginTop: 'var(--space-0h)' }}>
          <Text variant="subheading">{entry?.name}</Text>
          <KindTag inline kind={kindOf(entry)} />
          <ChevronRight color="var(--color-muted)" strokeWidth={2.2} size={16} />
        </span>
        {entry?.note ? (
          <Text
            variant="body"
            tone="muted"
            // One line; a longer note ends in "…", and reads in full on the entry.
            style={{ display: 'block', marginTop: 'var(--space-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {entry.note}
          </Text>
        ) : null}
      </span>
    </Card>
  );
}
