import type { ReactNode } from 'react';
import { BackLink } from './BackLink';

export interface BackBarProps {
  /** Where Back goes, e.g. "Spellbook". */
  label: string;
  onBack: () => void;
  /** Buttons at the right, e.g. Edit. On the narrowest phones they drop their icons, so Back keeps room. */
  children?: ReactNode;
}

/** The top of an inner page: Back, named for where it goes, and the page's own actions at the right. */
export function BackBar({ label, onBack, children }: BackBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', minHeight: '44px', gap: '10px' }}>
      <BackLink label={label} onClick={onBack} />
      {children ? (
        <span className="bar-actions" style={{ display: 'flex', gap: 'var(--space-2)', marginLeft: 'auto', flex: 'none' }}>
          {children}
        </span>
      ) : null}
    </div>
  );
}
