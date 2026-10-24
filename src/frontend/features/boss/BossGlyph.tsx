/** A boss: a crescent with two eyes, in the color of the rank it guards. Felled, it's drawn faded and eyeless. */
export function BossGlyph({ fill, size = 44, faded = false }: { fill: string; size?: number; faded?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" aria-hidden="true" style={{ display: 'block', opacity: faded ? 0.45 : undefined }}>
      <path d="M150 40 A78 78 0 1 0 150 180 A62 62 0 1 1 150 40 Z" fill={fill} />
      {faded ? null : (
        <>
          <ellipse cx="80" cy="96" rx="9" ry="13" fill="var(--color-surface)" />
          <ellipse cx="80" cy="132" rx="9" ry="13" fill="var(--color-surface)" />
        </>
      )}
    </svg>
  );
}
