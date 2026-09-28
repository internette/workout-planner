import { ChevronDown } from '@moonshot/design-system/icons';

/** The chevron on a row that opens and closes: down while closed, up while open, turning between the two. */
export function DisclosureChevron({ open, size = 16 }: { open: boolean; size?: number }) {
  return (
    <ChevronDown
      color="var(--color-muted)"
      strokeWidth={2.2}
      size={size}
      style={{ flex: 'none', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}
    />
  );
}
