import { Check } from '@moonshot/design-system/icons';

export interface DoneTickProps {
  done: boolean;
  onToggle: () => void;
  /** e.g. "Mark Bench Press done". The same either way: aria-pressed says whether it's done. */
  label: string;
}

/** Ticking an exercise off in a session: an outlined square, filled with the accent and a tick once it's done. It sits
 * at the end of the exercise's row. */
export function DoneTick({ done, onToggle, label }: DoneTickProps) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={done}
      aria-label={label}
      className="hit"
      style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '34px',
        height: '34px',
        flex: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        border: done ? 'none' : '1.5px solid var(--color-outline)',
        background: done ? 'var(--color-accent)' : 'none',
      }}
    >
      <Check color={done ? 'var(--color-on-strong)' : 'var(--color-outline)'} strokeWidth={2.6} size={15} />
    </button>
  );
}
