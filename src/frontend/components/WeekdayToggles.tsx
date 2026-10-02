import { DOW1, DOWFULL } from '@/frontend/shared/constants';

export interface WeekdayTogglesProps {
  /** Names the group for screen readers. */
  label: string;
  /** The weekdays turned on (0 = Sunday). */
  days: number[];
  onToggle: (day: number) => void;
}

/** A week's days, Sunday first, each a round button that turns on or off: the days a workout goes on. */
export function WeekdayToggles({ label, days, onToggle }: WeekdayTogglesProps) {
  return (
    <div
      role="group"
      aria-label={label}
      // Seven across at any width: each shrinks on a narrow card rather than wrapping the week onto two lines.
      style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 40px))', gap: '6px' }}
    >
      {DOW1.map((letter, day) => {
        const on = days.includes(day);
        return (
          <button
            key={day}
            type="button"
            aria-pressed={on}
            aria-label={DOWFULL[day]}
            onClick={() => onToggle(day)}
            style={{
              width: '100%',
              aspectRatio: '1',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              background: on ? 'var(--color-accent)' : 'var(--color-canvas)',
              color: on ? 'var(--color-on-strong)' : 'var(--color-muted)',
              font: 'inherit',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-bold)',
              cursor: 'pointer',
              padding: 0,
              transition: 'background-color var(--dur-state) var(--ease-standard), color var(--dur-state) var(--ease-standard)',
            }}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
