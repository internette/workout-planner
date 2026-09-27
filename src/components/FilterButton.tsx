import { ChevronDown } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';

export interface FilterButtonProps {
  /** What it filters by, e.g. "Target areas". Shown small, above. */
  label: string;
  /** What's picked now, e.g. "All areas" or "Legs, Core". */
  value: string;
  /** A filter is on: the value is shown bolder. */
  active?: boolean;
  /** Its panel is open. */
  open: boolean;
  onClick: () => void;
  /** Names the button in full, e.g. "Filter by target area: Legs, Core". */
  'aria-label': string;
}

/** A filter's summary, as a full-width button that opens its choices (in a Popover around it). */
export function FilterButton({ label, value, active, open, onClick, 'aria-label': ariaLabel }: FilterButtonProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={ariaLabel}
      onClick={onClick}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: '10px',
        rowGap: '4px',
        width: '100%',
        padding: '12px 16px',
        background: 'var(--color-surface)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--elevation-hairline)',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-medium)',
        color: 'var(--color-ink)',
      }}
    >
      <Text variant="eyebrow" as="span" tone="slate" style={{ flex: '1 1 100%' }}>
        {label.toUpperCase()}
      </Text>
      <span
        style={{
          flex: '1',
          minWidth: '0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontWeight: active ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
        }}
      >
        {value}
      </span>
      <ChevronDown
        color="var(--color-muted)"
        strokeWidth={2.2}
        size={16}
        style={{ flex: 'none', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}
      />
    </button>
  );
}
