/** One dot a set, filled once done. Hidden from screen readers: the words beside it say the same. */
export function SetPips({ pips }: { pips: boolean[] }) {
  return (
    <span aria-hidden="true" style={{ display: 'flex', gap: '5px', flex: 'none' }}>
      {pips.map((on, i) => (
        <span
          key={i}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: 'var(--radius-full)',
            background: on ? 'var(--color-pink)' : 'none',
            boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--color-outline)',
          }}
        />
      ))}
    </span>
  );
}
