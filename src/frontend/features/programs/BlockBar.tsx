import { Text } from '@moonshot/design-system/typography';

// A program's blocks are the theme color at rising strengths, so they read as one climb; each is outlined, so the
// lightest still shows on the page.
const FILLS = [
  'color-mix(in srgb, var(--color-pink) 25%, transparent)',
  'color-mix(in srgb, var(--color-pink) 55%, transparent)',
  'var(--color-pink)',
];
export const blockFill = (i: number, of: number) => FILLS[of <= 1 ? 2 : Math.round((i / (of - 1)) * 2)];

/** A program's blocks as one bar, each as long as its weeks, with a key. `at` (in weeks) marks where a run is. */
export function BlockBar({ blocks, at }: { blocks: { name: string; weeks: number }[]; at?: number | null }) {
  const total = blocks.reduce((s, b) => s + b.weeks, 0) || 1;
  return (
    <div>
      <div role="img" aria-label={blocks.map((b) => b.name + ', ' + b.weeks + (b.weeks === 1 ? ' week' : ' weeks')).join('; ')} style={{ display: 'flex', gap: '3px', height: '10px' }}>
        {blocks.map((b, i) => (
          <div
            key={i}
            style={{
              flex: b.weeks,
              borderRadius: '5px',
              background: blockFill(i, blocks.length),
              boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--color-pink) 45%, transparent)',
            }}
          />
        ))}
      </div>
      {at != null ? (
        <div aria-hidden="true" style={{ position: 'relative', height: '8px' }}>
          <div
            style={{
              position: 'absolute',
              left: `calc(${Math.min(100, (at / total) * 100)}% - 5px)`,
              top: '2px',
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: '6px solid var(--color-ink)',
            }}
          />
        </div>
      ) : null}
      {blocks.length > 1 ? (
        <div aria-hidden="true" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: at != null ? '2px' : '8px' }}>
          {blocks.map((b, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '5px', background: blockFill(i, blocks.length), boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--color-pink) 45%, transparent)' }} />
              <Text variant="body" tone="muted">
                {b.name} · {b.weeks} {b.weeks === 1 ? 'week' : 'weeks'}
              </Text>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
