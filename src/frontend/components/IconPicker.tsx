import type { ReactNode } from 'react';
import { IconChoiceGroup, type IconChoiceOption } from '@moonshot/design-system/icon-choice-group';
import { IconTileButton } from '@moonshot/design-system/icon-tile';
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
  /** A workout's colour swatches, under the icons. */
  colors?: Choice;
  /** sm beside a row's title, md beside the page's. */
  size?: 'sm' | 'md';
}

/** An icon on its tile that opens a picker of icons (and for a workout, its colour). */
export function IconPicker({ open, onToggle, onClose, current, label, iconsLabel = 'Icon', icons, colors, size = 'md' }: IconPickerProps) {
  return (
    <Popover
      open={open}
      onClose={onClose}
      width={238}
      top={size === 'sm' ? 48 : 52}
      content={
        <>
          <Text variant="eyebrow" as="div" tone="slate" style={{ padding: '0 2px 8px' }}>
            ICON
          </Text>
          <IconChoiceGroup label={iconsLabel} columns={4} {...icons} />
          {colors ? (
            <>
              <Text variant="eyebrow" as="div" tone="slate" style={{ padding: '16px 2px 8px' }}>
                COLOR
              </Text>
              <IconChoiceGroup label="Icon colour" kind="swatch" {...colors} />
            </>
          ) : null}
        </>
      }
    >
      <IconTileButton size={size} onClick={onToggle} className={size === 'sm' ? 'hit' : undefined} aria-label={label} aria-expanded={open}>
        {current}
      </IconTileButton>
    </Popover>
  );
}
