/** A theme color as a small disc, with a ring in the surface color and a hairline round that: the ring keeps it
 * visible where it sits on its own color (the selected segment of a control), the hairline shows the ring on white. */
export const Dot = ({ color, size = 18 }: { color: string; size?: number }) => (
  <span
    aria-hidden
    style={{ width: size, height: size, flex: 'none', borderRadius: 'var(--radius-full)', background: color, boxShadow: '0 0 0 2px var(--color-surface), 0 0 0 3px var(--color-outline)' }}
  />
);
