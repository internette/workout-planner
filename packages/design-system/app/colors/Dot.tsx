/** A theme color as a small disc. A ring in the surface color keeps it visible where it sits on its own color: the
 * selected segment of a control. */
export const Dot = ({ color, size = 18 }: { color: string; size?: number }) => (
  <span
    aria-hidden
    style={{ width: size, height: size, flex: 'none', borderRadius: 'var(--radius-full)', background: color, boxShadow: '0 0 0 2px var(--color-surface), inset 0 0 0 1px var(--color-line)' }}
  />
);
