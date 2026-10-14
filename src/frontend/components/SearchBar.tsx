import type { ChangeEventHandler, ReactNode } from 'react';
import { IconButton } from '@moonshot/design-system/buttons';
import { Close, Search } from '@moonshot/design-system/icons';
import { TextField } from '@moonshot/design-system/text-field';

export interface SearchBarProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  /** Names the field. Defaults to the placeholder. */
  label?: string;
  /** Shown as a Clear button while there's a query. */
  onClear: () => void;
  /** Read out as results change, e.g. "4 exercises". Not shown. */
  status?: ReactNode;
  /** Inside a card: sunk into it, like the other fields. Otherwise it sits on the page, raised. */
  inset?: boolean;
}

/** A search field: the magnifier, the query, and Clear once there's something to clear. */
export function SearchBar({ value, onChange, placeholder, label, onClear, status, inset = false }: SearchBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        width: '100%',
        ...(inset
          ? { padding: '0 var(--space-3)', background: 'var(--color-canvas)', border: '1px solid var(--color-outline)', borderRadius: 'var(--radius-md)' }
          : { padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--elevation-hairline)' }),
      }}
    >
      <Search color="var(--color-muted)" size={inset ? 16 : 17} />
      <TextField variant="bare" aria-label={label ?? placeholder} value={value} onChange={onChange} placeholder={placeholder} />
      {status != null ? (
        <span className="sr-only" role="status">
          {status}
        </span>
      ) : null}
      {value ? (
        <IconButton label="Clear search" size="xs" onClick={onClear}>
          <Close color="var(--color-muted)" strokeWidth={2.2} size={14} />
        </IconButton>
      ) : null}
    </div>
  );
}
