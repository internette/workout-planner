// The spacing the interface uses: seven steps on an even 4px grid. Step n is n × 4px, so `--space-5` is 20px. Write
// `padding: var(--space-6)`, not 24px. `layout` holds the measures of the page itself.
import { toVariables, type Token } from '../tokenVariables';

export const space = {
  '1': { value: '4px', use: 'The tightest gap: between segments in a tray' },
  '2': { value: '8px', use: 'Between a button’s icon and label, a chip’s icon and label, and stacked list rows' },
  '3': { value: '12px', use: 'Between a checkbox or radio dot and its text' },
  '4': { value: '16px', use: 'Card padding xs' },
  '5': { value: '20px', use: 'Card padding sm' },
  '6': { value: '24px', use: 'Card padding md' },
  '7': { value: '28px', use: 'Card padding lg, and the page gutter' },
} as const satisfies Record<string, Token>;

export const layout = {
  shellMax: { value: '1180px', use: 'Widest the app shell grows' },
  proseMax: { value: '620px', use: 'Widest a paragraph of body text runs' },
  sidebarW: { value: '208px', use: 'The sidebar on wide screens' },
} as const satisfies Record<string, Token>;

/** Where the layout changes, in px. A media query cannot read a CSS variable, so these are numbers, not tokens. */
export const breakpoints = {
  /** Below this the tab bar replaces the top rail. */
  mobile: 720,
  /** Below this the top rail replaces the sidebar. */
  rail: 1020,
  /** Below this the profile's stat grid goes from 4 columns to 2. */
  stats: 820,
} as const;

export const spacingVariables: Record<string, string> = {
  ...toVariables('space', space),
  ...toVariables('layout', layout),
};
