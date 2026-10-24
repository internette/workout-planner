/** An achievement's badge: a soft star in its tier's color on that color's tint. Earned ones are filled; the next
 * one to earn is drawn as an outline. */
export function AchievementBadge({ tint, deep, fill, size = 44, earned = true }: { tint: string; deep: string; fill: string; size?: number; earned?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size + 'px',
        height: size + 'px',
        flex: 'none',
        borderRadius: 'var(--radius-md)',
        background: earned ? tint : 'var(--color-mist)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
        <polygon
          points="12,3.2 14.6,8.9 20.8,9.6 16.2,13.8 17.5,19.9 12,16.8 6.5,19.9 7.8,13.8 3.2,9.6 9.4,8.9"
          fill={earned ? fill : 'none'}
          stroke={earned ? deep : 'var(--color-outline)'}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
