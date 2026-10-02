import type { ReactNode } from 'react';
import { IconChoiceGroup, type IconChoiceOption } from '@moonshot/design-system/icon-choice-group';
import { IconTileButton } from '@moonshot/design-system/icon-tile';
import { Pencil } from '@moonshot/design-system/icons';
import { Popover } from '@moonshot/design-system/popover';
import { Text } from '@moonshot/design-system/typography';

type Choice = { value: string; onChange: (value: string, via: 'click' | 'arrow') => void; options: IconChoiceOption<string>[] };

export interface IconPickerProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  /** The icon now, drawn on the tile. */
  current: ReactNode;
  /** Names the tile, e.g. "Choose icon for Bench Press". */
  label: string;
  /** Names the icon choices, e.g. "Workout icon". */
  iconsLabel?: string;
  icons: Choice;
  /** A workout's color swatches, under the icons. */
  colors?: Choice;
  /** sm beside a row's title, md beside the page's. */
  size?: 'sm' | 'md';
}

/** An icon on its tile that opens a picker of icons (and for a workout, its color). */
export function IconPicker({ open, onToggle, onClose, current, label, iconsLabel = 'Icon', icons, colors, size = 'md' }: IconPickerProps) {
  return (
    <Popover
      open={open}
      onClose={onClose}
      width={238}
      top={size === 'sm' ? 48 : 52}
      content={
        <>
          <Text variant="micro" as="div" tone="slate" style={{ padding: '0 2px 10px' }}>
            Icon
          </Text>
          <IconChoiceGroup label={iconsLabel} columns={4} {...icons} />
          {colors ? (
            <>
              <Text variant="micro" as="div" tone="slate" style={{ padding: '14px 2px 10px' }}>
                Color
              </Text>
              <IconChoiceGroup label="Icon color" kind="swatch" {...colors} />
            </>
          ) : null}
        </>
      }
    >
      {/* A pencil on its corner says the icon can be changed: the same tile elsewhere is only a picture. */}
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <IconTileButton size={size} onClick={onToggle} aria-label={label} aria-expanded={open}>
          {current}
        </IconTileButton>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: size === 'sm' ? '-4px' : '-5px',
            bottom: size === 'sm' ? '-4px' : '-5px',
            width: size === 'sm' ? '16px' : '20px',
            height: size === 'sm' ? '16px' : '20px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-accent)',
            boxShadow: '0 0 0 2px var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Pencil color="var(--color-on-accent)" size={size === 'sm' ? 9 : 11} strokeWidth={2.6} />
        </span>
      </span>
    </Popover>
  );
}
