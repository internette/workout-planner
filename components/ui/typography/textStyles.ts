// Named text styles: a family, size, weight, tracking and leading that go together.
// Colour is not part of a style; pick it with the `tone` prop on <Text>.

export const textStyles = {
  hero: {
    family: 'heading',
    size: 'display',
    weight: 'bold',
    tracking: 'tight',
    use: 'A marketing hero headline. Scales with the window',
  },
  headline: {
    family: 'heading',
    size: 'display-sm',
    weight: 'bold',
    tracking: 'tight',
    use: 'Section headlines on a marketing page. Scales with the window',
  },
  display: {
    family: 'heading',
    size: '5xl',
    weight: 'bold',
    tracking: 'tight',
    use: 'Big numbers and hero text',
  },
  title: { family: 'heading', size: '4xl', weight: 'bold', tracking: 'tight', use: 'Screen titles' },
  heading: { family: 'heading', size: '3xl', weight: 'bold', tracking: 'tight', use: 'Card headings' },
  subheading: {
    family: 'heading',
    size: '2xl',
    weight: 'bold',
    tracking: 'tight',
    use: 'Section headings, stat numbers',
  },
  cardTitle: {
    family: 'heading',
    size: 'xl',
    weight: 'bold',
    tracking: 'snug',
    use: 'Titles inside cards and dialogs',
  },
  itemTitle: {
    family: 'heading',
    size: 'lg',
    weight: 'bold',
    tracking: 'snug',
    use: 'List row and item titles',
  },
  body: { family: 'body', size: 'base', weight: 'regular', leading: 'relaxed', use: 'Paragraphs' },
  label: { family: 'body', size: 'base', weight: 'medium', use: 'Names and values in rows' },
  caption: { family: 'body', size: 'md', weight: 'regular', use: 'Secondary text under a title' },
  small: { family: 'body', size: 'sm', weight: 'regular', use: 'Helper text and fine print' },
  eyebrow: {
    family: 'body',
    size: 'xs',
    weight: 'bold',
    tracking: 'wide',
    use: 'Small labels above content',
  },
  micro: {
    family: 'body',
    size: '2xs',
    weight: 'bold',
    tracking: 'wide',
    use: 'The smallest labels, such as stat captions',
  },
} as const;

export type TextVariant = keyof typeof textStyles;

// Text colours, by role.
export const textTones = {
  ink: 'var(--color-ink)',
  slate: 'var(--color-slate)',
  muted: 'var(--color-muted)',
  subtle: 'var(--color-subtle)',
  accent: 'var(--color-pink-deep)',
  danger: 'var(--color-danger)',
  inverse: 'var(--color-on-accent)',
} as const;

export type TextTone = keyof typeof textTones;
