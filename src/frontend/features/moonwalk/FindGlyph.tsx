import type { Rarity } from './catalog';

// A Find's placeholder art until the real ones are designed: one shape per rarity, in its color, on its tint.
// A Find not found yet is a dashed ring with a question mark, never its shape, so new ones stay a surprise.
const SHAPES: Record<Rarity, string> = {
  common: 'M12 7c4.6 0 8 2.6 8 6s-3.4 6-8 6-8-2.6-8-6 3.4-6 8-6z',
  bright: 'M12 3l8 14H4z',
  rare: 'M7 4h10l4 6-9 11L3 10z',
  lunar: 'M15.5 3A9 9 0 1 0 21 16.5 7.5 7.5 0 0 1 15.5 3z',
};

export function FindGlyph({ rarity, found, tint, fill, size = 56 }: { rarity: Rarity; found: boolean; tint: string; fill: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: 'var(--radius-md)',
        background: found ? tint : 'var(--color-mist)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24">
        {found ? (
          <path d={SHAPES[rarity]} fill={fill} />
        ) : (
          <>
            <circle cx="12" cy="12" r="9" fill="none" stroke="var(--color-outline)" strokeWidth="1.6" strokeDasharray="3 3" />
            <text x="12" y="16.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-outline)" style={{ fontFamily: 'var(--font-heading)' }}>
              ?
            </text>
          </>
        )}
      </svg>
    </span>
  );
}
