import type { CSSProperties, ReactNode } from 'react';

export interface FormActionsProps {
  children: ReactNode;
  /** Tighter spacing, for a form inside a card. */
  compact?: boolean;
  style?: CSSProperties;
}

/** A form's buttons: below a divider, to the right, wrapping on a narrow screen. Put the main action last. */
export function FormActions({ children, compact = false, style }: FormActionsProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '10px',
        marginTop: compact ? '20px' : '22px',
        paddingTop: compact ? '18px' : '20px',
        borderTop: '1px solid var(--color-line)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
