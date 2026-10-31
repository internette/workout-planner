import { useId } from 'react';
import { COMET_HOUND_BODY, COMET_HOUND_EYES, COMET_HOUND_VIEWBOX } from './cometHound';
import { ECLIPSE_MAW_PARTS, ECLIPSE_MAW_RING, ECLIPSE_MAW_VIEWBOX } from './eclipseMaw';
import { RADIANT_GOLEM_BODY, RADIANT_GOLEM_CHEST, RADIANT_GOLEM_EYES, RADIANT_GOLEM_HEART, RADIANT_GOLEM_RAYS } from './radiantGolem';

/** Indexes in BOSS_NAMES of the bosses with their own drawing. */
const COMET_HOUND = 2;
const ECLIPSE_MAW = 3;
const RADIANT_GOLEM = 4;

/**
 * A boss, in the color of the rank it guards. Felled, it's drawn faded and eyeless. The Comet Hound, the Eclipse Maw
 * and the Radiant Golem have their own drawings; every other boss is still the crescent with two eyes.
 */
export function BossGlyph({ k, fill, size = 44, faded = false }: { k: number; fill: string; size?: number; faded?: boolean }) {
  const style = { display: 'block', opacity: faded ? 0.45 : undefined };
  // useId's colons and guillemets aren't safe inside url(#…)
  const maskId = 'boss' + useId().replace(/[^\w-]/g, '');
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
  if (k === ECLIPSE_MAW) {
    // No eyes to drop: felled, it's just faded.
    return (
      <svg width={size} height={size} viewBox={ECLIPSE_MAW_VIEWBOX} aria-hidden="true" style={style} fill={fill}>
        <path fillRule="evenodd" d={ECLIPSE_MAW_RING} />
        {ECLIPSE_MAW_PARTS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    );
  }
  if (k === RADIANT_GOLEM) {
    // Eyes and heart are cut out with a mask; felled, it's whole.
    return (
      <svg width={size} height={size} viewBox="0 0 220 220" aria-hidden="true" style={style} fill={fill}>
        {faded ? null : (
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="220" height="220">
            <rect width="220" height="220" fill="#fff" />
            <g fill="#000" stroke="#000" strokeWidth="3" strokeLinejoin="round">
              {RADIANT_GOLEM_EYES.map((e, i) => (
                <rect key={i} x={e.x} y={e.y} width="13" height="13" rx="2" />
              ))}
              <path d={RADIANT_GOLEM_HEART} />
            </g>
          </mask>
        )}
        <g stroke={fill} strokeWidth="4" strokeLinejoin="round" mask={faded ? undefined : `url(#${maskId})`}>
          {RADIANT_GOLEM_BODY.map((r, i) => (
            <rect key={i} {...r} rx="10" />
          ))}
          <path d={RADIANT_GOLEM_CHEST} />
        </g>
        <path d={RADIANT_GOLEM_RAYS} />
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
