// A charm's mark until the charms have art of their own: a crescent around a star, in the charm's color on its tint.
export function CharmGlyph({ tint, fill, size = 44, known = true }: { tint: string; fill: string; size?: number; known?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, flex: 'none', borderRadius: 'var(--radius-full)', background: known ? tint : 'var(--color-mist)', display: 'grid', placeItems: 'center' }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
        {known ? (
          <>
            <path d="M14 3a9 9 0 1 0 7 14.6A7.5 7.5 0 0 1 14 3z" fill={fill} />
            <path d="M16.5 7l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" fill={fill} />
          </>
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
