import { IconButton } from '@moonshot/design-system/buttons';
import { ChevronLeft, ChevronRight } from '@moonshot/design-system/icons';

/** Stepping back or on by a year, month or week: an arrow button, named for what it does ("Previous week"). */
export function StepButton({ dir, unit, onClick }: { dir: 'prev' | 'next'; unit: 'year' | 'month' | 'week'; onClick: () => void }) {
  const Arrow = dir === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <IconButton label={(dir === 'prev' ? 'Previous ' : 'Next ') + unit} size="md" onClick={onClick}>
      <Arrow color="var(--color-slate)" strokeWidth={2.2} size={17} />
    </IconButton>
  );
}
