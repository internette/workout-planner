import type { CSSProperties, ReactNode } from 'react';

export interface CalloutProps {
  /** `success` for something that went through (a plan added, a workout scheduled); `danger` for something that didn't. */
  tone: 'success' | 'danger';
  /** A small icon before the message, drawn in the tone's colour. */
  icon?: ReactNode;
  /** A button after the message: Dismiss, View day. */
  action?: ReactNode;
  /** `alert` for a failure that needs reading now; `status` for news. */
  role?: 'alert' | 'status';
  style?: CSSProperties;
  children: ReactNode;
}

const TONES = {
  success: { background: 'var(--color-accent-tint)', color: 'var(--color-accent-deep)' },
  danger: { background: 'var(--color-danger-tint)', color: 'var(--color-danger)' },
};

/** A tinted strip with a message: news after something happened, or a failure to act on. */
export function Callout({ tone, icon, action, role = 'status', style, children }: CalloutProps) {
  return (
    <div
      role={role}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 'var(--space-2) var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--font-weight-medium)',
        lineHeight: 'var(--leading-snug)',
        ...TONES[tone],
        ...style,
      }}
    >
      {icon ? <span style={{ display: 'flex', flex: 'none' }}>{icon}</span> : null}
      <div style={{ flex: '1 1 180px', minWidth: 0 }}>{children}</div>
      {action}
    </div>
  );
}
