// The corner radii the interface uses: five sizes on an even 4px step, and one for anything round. Write
// `border-radius: var(--radius-lg)`, not 20px. A smaller control takes a smaller radius, so a control's corners stay in
// proportion to its size. Everything uses these; the only other corners are on marks a few px across, like chart bars.
import { toVariables, type Token } from '../tokenVariables';

export const radii = {
  xs: { value: '8px', use: 'The smallest controls: Button xs, IconButton xs and the Checkbox box' },
  sm: { value: '12px', use: 'IconButton sm to lg, TextField, SegmentedControl segments, IconTile sm, colour swatches, the drag grip, and the focus ring on plain elements' },
  md: { value: '16px', use: 'Button sm to lg, the SegmentedControl tray, OptionCard, IconTile md, icon picker tiles, rating stars and the tab bar’s tabs' },
  lg: { value: '20px', use: 'Card, TextArea, the sidebar and the quest cards' },
  xl: { value: '24px', use: 'Card overlay: dialogs, menus and popovers' },
  full: { value: '999px', use: 'Anything round: Chip, avatars, radio dots and round buttons. On a square it is a circle, on a wide shape a pill: progress bars too.' },
} as const satisfies Record<string, Token>;

export type RadiusName = keyof typeof radii;

export const radiiVariables = toVariables('radius', radii);
