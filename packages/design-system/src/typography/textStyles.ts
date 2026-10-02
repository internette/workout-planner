// Named text styles: a family, size, weight, tracking and leading that go together.
// Colour is not part of a style; pick it with the `tone` prop on <Text>.

export const textStyles = {
  hero: {
    family: 'heading',
    size: 'display',
    weight: 'bold',
    leading: 'tight',
    use: 'A marketing hero headline. Scales with the window',
  },
  headline: {
    family: 'heading',
    size: 'display-sm',
    weight: 'bold',
    leading: 'tight',
    use: 'Section headlines on a marketing page. Scales with the window',
  },
  display: {
    family: 'heading',
    size: '3xl',
    weight: 'bold',
    leading: 'tight',
    use: 'The one big number or letter on a screen: the streak count, a profile initial',
  },
  title: { family: 'heading', size: '2xl', weight: 'bold', leading: 'tight', use: 'Screen titles' },
  heading: {
    family: 'heading',
    size: 'xl',
    weight: 'bold',
    leading: 'tight',
    use: 'Card and dialog headings, stat numbers',
  },
  subheading: {
    family: 'heading',
    size: 'lg',
    weight: 'bold',
    leading: 'tight',
    use: 'Titles of rows, items and small cards',
  },
  figure: {
    family: 'heading',
    size: 'base',
    weight: 'bold',
    use: 'A small number beside a bar or a label: 1 of 4, 72%',
  },
  body: { family: 'body', size: 'base', weight: 'regular', use: 'Paragraphs, and with tone="muted" secondary text under a title' },
  strong: { family: 'body', size: 'base', weight: 'medium', use: 'Names and values in rows; body text that stands out' },
  small: { family: 'body', size: 'sm', weight: 'regular', use: 'Helper text and fine print' },
  micro: {
    family: 'body',
    size: 'sm',
    weight: 'bold',
    tracking: 'loose',
    upper: true,
    use: 'Small capitals: labels above content, section headings, stat captions',
  },
} as const;

export type TextVariant = keyof typeof textStyles;

// Text colours, by role.
export const textTones = {
  ink: 'var(--color-ink)',
  slate: 'var(--color-slate)',
  slateDeep: 'var(--color-slate-deep)',
  muted: 'var(--color-muted)',
  accent: 'var(--color-accent-deep)',
  danger: 'var(--color-danger)',
  inverse: 'var(--color-on-accent)',
} as const;

export type TextTone = keyof typeof textTones;
