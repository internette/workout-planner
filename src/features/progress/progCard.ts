import type { CSSProperties } from 'react';

/** A Progress card that opens what it sums up: laid out as a card, not centred like a button. */
export function progCard(flex: string): CSSProperties {
  return { flex, display: 'block', textAlign: 'left', fontFamily: 'inherit', color: 'inherit' };
}
