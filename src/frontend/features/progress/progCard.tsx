import type { CSSProperties } from 'react';
import { ChevronRight } from '@moonshot/design-system/icons';

/** A Progress card that opens what it sums up: laid out as a card, not centred like a button, with room on the right
 * for its › (OpensChevron). */
export function progCard(flex: string): CSSProperties {
  return { flex, display: 'block', position: 'relative', paddingRight: '40px', textAlign: 'left', fontFamily: 'inherit', color: 'inherit' };
}

/** The › in a Progress card's top right corner: it opens something. */
export function OpensChevron() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', top: '18px', right: '16px', display: 'flex' }}>
      <ChevronRight color="var(--color-muted)" size={17} />
    </span>
  );
}
