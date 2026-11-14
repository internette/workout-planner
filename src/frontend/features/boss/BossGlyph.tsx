import { useId } from 'react';
import { COMET_HOUND_BODY, COMET_HOUND_EYES, COMET_HOUND_VIEWBOX } from './cometHound';
import {
  ECLIPSE_MAW_ARCS,
  ECLIPSE_MAW_BACK,
  ECLIPSE_MAW_FACE,
  ECLIPSE_MAW_GAP,
  ECLIPSE_MAW_HEAD,
  ECLIPSE_MAW_RING,
  ECLIPSE_MAW_RING_TILT,
  ECLIPSE_MAW_TEETH,
  ECLIPSE_MAW_VIEWBOX,
} from './eclipseMaw';
import { CRESCENT_TYRANT_PATH, CRESCENT_TYRANT_VIEWBOX } from './crescentTyrant';
import { STORM_WYRM_BOLT, STORM_WYRM_FACE, STORM_WYRM_HEAD, STORM_WYRM_MIRROR, STORM_WYRM_SIDE, STORM_WYRM_WHISKER } from './stormWyrm';
import { RADIANT_GOLEM_BODY, RADIANT_GOLEM_CUTS } from './radiantGolem';

/** Indexes in BOSS_NAMES of the bosses with their own drawing. */
const STORM_WYRM = 1;
const COMET_HOUND = 2;
const ECLIPSE_MAW = 3;
const RADIANT_GOLEM = 4;
const CRESCENT_TYRANT = 5;

/**
 * A boss, in the color of the rank it guards. Felled, it's drawn faded and eyeless; one still ahead is eyeless but solid. The Storm Wyrm, the Comet Hound,
 * the Eclipse Maw, the Radiant Golem and the Crescent Tyrant have their own drawings; every other boss is still the crescent with two eyes.
 */
export function BossGlyph({ k, fill, size = 44, faded = false, solid = false }: { k: number; fill: string; size?: number; faded?: boolean; solid?: boolean }) {
  // `solid`: eyeless like a faded boss, but at full strength (a boss still ahead, on Profile).
  const style = { display: 'block', opacity: faded && !solid ? 0.45 : undefined };
  // useId's colons and guillemets aren't safe inside url(#…)
  const maskId = 'boss' + useId().replace(/[^\w-]/g, '');
  if (k === STORM_WYRM) {
    // Eyes, nostrils and the brow bolt are cut out with a mask; felled, it's whole.
    const side = (
      <>
        <path d={STORM_WYRM_SIDE} />
        <path d={STORM_WYRM_WHISKER} fill="none" stroke={fill} strokeWidth="4" strokeLinecap="round" />
      </>
    );
    return (
      <svg width={size} height={size} viewBox="0 0 220 220" aria-hidden="true" style={style} fill={fill}>
        {faded ? null : (
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="220" height="220">
            <rect width="220" height="220" fill="#fff" />
            <g fill="#000">
              <path d={STORM_WYRM_FACE} />
              <path d={STORM_WYRM_FACE} transform={STORM_WYRM_MIRROR} />
              <path d={STORM_WYRM_BOLT} />
            </g>
          </mask>
        )}
        <g mask={faded ? undefined : `url(#${maskId})`}>
          <path d={STORM_WYRM_HEAD} />
          {side}
          <g transform={STORM_WYRM_MIRROR}>{side}</g>
        </g>
      </svg>
    );
  }
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
    // Two masks part the layers: everything behind the ring stops short of the ring and the face, and the ring stops
    // short of the face. Felled, the face has no eyes, star or mouth.
    const gap = { fill: '#000', stroke: '#000', strokeWidth: ECLIPSE_MAW_GAP };
    return (
      <svg width={size} height={size} viewBox={ECLIPSE_MAW_VIEWBOX} aria-hidden="true" style={style} fill={fill}>
        <mask id={maskId + 'r'} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">
          <rect width="1024" height="1024" fill="#fff" />
          <path d={ECLIPSE_MAW_HEAD} {...gap} />
          <path d={ECLIPSE_MAW_RING} fillRule="evenodd" transform={ECLIPSE_MAW_RING_TILT} {...gap} />
        </mask>
        <mask id={maskId + 'f'} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">
          <rect width="1024" height="1024" fill="#fff" />
          <path d={ECLIPSE_MAW_HEAD} {...gap} />
        </mask>
        <g mask={`url(#${maskId}r)`}>
          {ECLIPSE_MAW_BACK.map((d, i) => (
            <path key={i} d={d} />
          ))}
          {ECLIPSE_MAW_ARCS.map((d, i) => (
            <path key={'a' + i} d={d} fillRule="evenodd" />
          ))}
        </g>
        <path d={ECLIPSE_MAW_RING} fillRule="evenodd" transform={ECLIPSE_MAW_RING_TILT} mask={`url(#${maskId}f)`} />
        <path d={faded ? ECLIPSE_MAW_HEAD : ECLIPSE_MAW_HEAD + ECLIPSE_MAW_FACE} fillRule="evenodd" />
        {faded ? null : <path d={ECLIPSE_MAW_TEETH} />}
      </svg>
    );
  }
  if (k === RADIANT_GOLEM) {
    // Eyes and the sun core are cut out with a mask; felled, it's whole.
    return (
      <svg width={size} height={size} viewBox="0 0 220 220" aria-hidden="true" style={style}>
        {faded ? null : (
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="220" height="220">
            <rect width="220" height="220" fill="#fff" />
            <path d={RADIANT_GOLEM_CUTS} fill="#000" />
          </mask>
        )}
        <path d={RADIANT_GOLEM_BODY} fill={fill} mask={faded ? undefined : `url(#${maskId})`} />
      </svg>
    );
  }
  if (k === CRESCENT_TYRANT) {
    // Its cutouts are part of the one path, so felled it's only faded.
    return (
      <svg width={size} height={size} viewBox={CRESCENT_TYRANT_VIEWBOX} aria-hidden="true" style={style}>
        <path d={CRESCENT_TYRANT_PATH} fill={fill} fillRule="evenodd" />
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
