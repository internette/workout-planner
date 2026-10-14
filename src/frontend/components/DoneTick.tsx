import { Pressable } from '@moonshot/design-system/buttons';
import { Tick } from '@moonshot/design-system/checkbox';

export interface DoneTickProps {
  done: boolean;
  onToggle: () => void;
  /** What ticking it does, for screen readers: "Mark Bench Press done". */
  label: string;
}

/** Ticking an exercise off in a session: the design system's tick, large, as a button at the end of the exercise's
 * row. */
export function DoneTick({ done, onToggle, label }: DoneTickProps) {
  return (
    <Pressable onClick={onToggle} aria-pressed={done} aria-label={label} hit style={{ marginLeft: 'auto', display: 'flex', flex: 'none', borderRadius: 'var(--radius-sm)' }}>
      <Tick on={done} size="lg" />
    </Pressable>
  );
}
