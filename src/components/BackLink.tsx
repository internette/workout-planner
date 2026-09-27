import { Button } from '@moonshot/design-system/buttons';
import { ChevronLeft } from '@moonshot/design-system/icons';

// Back, named for where it goes ("‹ Calendar", "‹ Spellbook", "‹ Upper Push"). Every inner screen starts with one.
export function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      type="neutral"
      ghost
      size="xs"
      onClick={onClick}
      className="hit"
      data-back
      aria-label={'Back to ' + label}
      style={{ marginLeft: '-10px', minWidth: 0, maxWidth: '60%', flex: '0 1 auto' }}
    >
      <ChevronLeft color="var(--color-slate)" strokeWidth={2.2} size={17} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </Button>
  );
}
