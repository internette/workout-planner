import { COMET_HOUND_BODY, COMET_HOUND_EYES, COMET_HOUND_VIEWBOX } from './cometHound';

/** The Comet Hound's index in BOSS_NAMES. */
const COMET_HOUND = 2;

/**
 * A boss, in the color of the rank it guards. Felled, it's drawn faded and eyeless. The Comet Hound has its own
 * drawing; every other boss is still the crescent with two eyes.
 */
export function BossGlyph({ k, fill, size = 44, faded = false }: { k: number; fill: string; size?: number; faded?: boolean }) {
  const style = { display: 'block', opacity: faded ? 0.45 : undefined };
  if (k === COMET_HOUND) {
    return (
      <svg width={size} height={size} viewBox={COMET_HOUND_VIEWBOX} aria-hidden="true" style={style}>
        {COMET_HOUND_BODY.map(([d, x, y], i) => (
          <path key={i} d={d} transform={`translate(${x},${y})`} fill={fill} />
        ))}
        {faded
          ? null
          : COMET_HOUND_EYES.map(([d, x, y], i) => <path key={'e' + i} d={d} transform={`translate(${x},${y})`} fill="var(--color-surface)" />)}
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" aria-hidden="true" style={style}>
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
