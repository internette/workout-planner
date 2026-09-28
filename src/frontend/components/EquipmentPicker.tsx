import { Chip } from '@moonshot/design-system/chip';
import { ChevronDown } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';

export interface EquipmentPickerProps {
  id: string;
  open: boolean;
  onToggle: () => void;
  summary: string;
  groups: { label: string; items: { name: string; on: boolean; toggle: () => void }[] }[];
}

/** An exercise's equipment, as one row showing what's picked ("Barbell, Bench", or "Bodyweight") that opens to the
 * picker's groups of chips. Used by the exercise editor and both "New exercise" forms. */
export function EquipmentPicker({ id, open, onToggle, summary, groups }: EquipmentPickerProps) {
  return (
    <div style={{ marginTop: '16px' }}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          minHeight: '52px',
          padding: '10px 14px',
          border: '1px solid var(--color-outline)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-canvas)',
          fontFamily: 'inherit',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span style={{ flex: '1', minWidth: '0' }}>
          <Text variant="eyebrow" as="span" tone="slate" style={{ display: 'block' }}>
            EQUIPMENT
          </Text>
          <Text variant="body" as="span" tone="ink" weight="semibold" style={{ display: 'block', marginTop: '2px' }}>
            {summary}
          </Text>
        </span>
        <ChevronDown
          color="var(--color-muted)"
          strokeWidth={2.2}
          size={18}
          style={{ flex: 'none', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      {open ? (
        <div id={id} role="group" aria-label="Equipment" style={{ padding: '4px 2px 0' }}>
          <Text variant="caption" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
            Leave it empty for a bodyweight exercise.
          </Text>
          {groups.map((g) => (
            <div key={g.label} role="group" aria-label={g.label}>
              <Text variant="eyebrow" as="div" tone="muted" style={{ margin: '10px 0 6px' }}>
                {g.label.toUpperCase()}
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {g.items.map((a) => (
                  <Chip key={a.name} tone="choice" size="md" selected={a.on} onClick={a.toggle}>
                    {a.name}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
