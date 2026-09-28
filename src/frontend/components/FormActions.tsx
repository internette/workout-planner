import type { ReactNode } from 'react';

export interface FormActionsProps {
  children: ReactNode;
  /** Tighter spacing, for a form inside a card. */
  compact?: boolean;
}

/** A form's buttons: below a divider, to the right, wrapping on a narrow screen. Put the main action last. */
export function FormActions({ children, compact = false }: FormActionsProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '10px',
        marginTop: compact ? 'var(--space-5)' : 'var(--space-6)',
        paddingTop: compact ? 'var(--space-4)' : 'var(--space-5)',
        borderTop: '1px solid var(--color-line)',
      }}
    >
      {children}
    </div>
  );
}
