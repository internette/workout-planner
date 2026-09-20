import { colorGroups } from '@/components/ui/colors/tokens';

// The map of the design system: which sections exist and how they are grouped. The landing page and the
// sidebar both read this. A folder in components/ui that is not listed here still shows up on the
// landing page, under "Not yet organised", so nothing gets lost.

export type Category = 'foundations' | 'components';

export interface Section {
  /** The folder name in components/ui, which is also the URL segment. */
  slug: string;
  title: string;
  category: Category;
  description: string;
  /** Headings on the section's page that get their own link in the sidebar. `id` is the heading's id. */
  anchors?: { id: string; title: string }[];
}

export const categories: Record<Category, { title: string; description: string }> = {
  foundations: {
    title: 'Foundations',
    description: 'The tokens everything else is built from: colour, type and icons.',
  },
  components: {
    title: 'Components',
    description: 'Reusable building blocks, all made from the foundations.',
  },
};

export const sections: Section[] = [
  {
    slug: 'colors',
    title: 'Colors',
    category: 'foundations',
    description: 'The palette as CSS variables, grouped by role.',
    // One link per colour group; the page gives each group heading the same id.
    anchors: Object.keys(colorGroups).map((title) => ({ id: title.toLowerCase(), title })),
  },
  {
    slug: 'typography',
    title: 'Typography',
    category: 'foundations',
    description: 'Families, sizes and weights, and the named text styles built from them.',
    anchors: [
      { id: 'text-styles', title: 'Text styles' },
      { id: 'tones', title: 'Tones' },
      { id: 'families', title: 'Families' },
      { id: 'sizes', title: 'Sizes' },
      { id: 'weights', title: 'Weights' },
      { id: 'tracking', title: 'Tracking' },
      { id: 'leading', title: 'Leading' },
    ],
  },
  {
    slug: 'icons',
    title: 'Icons',
    category: 'foundations',
    description: 'Glyphs, sparkles, gems and mood faces on a 24×24 canvas.',
    anchors: [
      { id: 'glyphs', title: 'Glyphs' },
      { id: 'exercise-icons', title: 'Exercise icons' },
      { id: 'decorative', title: 'Decorative' },
      { id: 'mood-faces', title: 'Mood faces' },
    ],
  },
  {
    slug: 'buttons',
    title: 'Buttons',
    category: 'components',
    description: 'Button and IconButton: types, ghost, sizes and hover states.',
    anchors: [
      { id: 'hierarchy', title: 'Hierarchy' },
      { id: 'types', title: 'Types' },
      { id: 'with-an-icon', title: 'With an icon' },
      { id: 'glow-and-full-width', title: 'Glow and full width' },
      { id: 'disabled', title: 'Disabled' },
      { id: 'icon-buttons', title: 'Icon buttons' },
    ],
  },
  {
    slug: 'card',
    title: 'Card',
    category: 'components',
    description: 'White surfaces, raised or floating, with steps of padding.',
    anchors: [
      { id: 'padding', title: 'Padding' },
      { id: 'elevation', title: 'Elevation' },
      { id: 'clickable', title: 'Clickable' },
      { id: 'as-a-section', title: 'As a section' },
    ],
  },
  {
    slug: 'chip',
    title: 'Chip',
    category: 'components',
    description: 'Pills for a fact, a tag or a choice.',
    anchors: [
      { id: 'info', title: 'Info' },
      { id: 'accent', title: 'Accent' },
      { id: 'choice', title: 'Choice' },
      { id: 'sizes', title: 'Sizes' },
    ],
  },
  {
    slug: 'segmented-control',
    title: 'Segmented control',
    category: 'components',
    description: 'A tray of mutually exclusive options, with keyboard support.',
    anchors: [
      { id: 'brand-medium', title: 'Brand, medium' },
      { id: 'brand-small', title: 'Brand, small' },
      { id: 'quiet', title: 'Quiet' },
      { id: 'full-width', title: 'Full width' },
    ],
  },
  {
    slug: 'option-card',
    title: 'Option card',
    category: 'components',
    description: 'One answer to a question, with what it does.',
    anchors: [
      { id: 'single-choice', title: 'Single choice' },
      { id: 'states', title: 'States' },
      { id: 'with-extra-controls', title: 'With extra controls' },
      { id: 'behaviour', title: 'Behaviour' },
    ],
  },
  {
    slug: 'dialog',
    title: 'Dialog',
    category: 'components',
    description: 'A modal card over a dimmed page, with focus and Escape handled.',
    anchors: [
      { id: 'confirm', title: 'Confirm' },
      { id: 'with-content', title: 'With content' },
      { id: 'reference-panel', title: 'Reference panel' },
      { id: 'behaviour', title: 'Behaviour' },
    ],
  },
  {
    slug: 'popover',
    title: 'Popover',
    category: 'components',
    description: 'A small floating card anchored to a trigger.',
    anchors: [
      { id: 'anchored', title: 'Anchored' },
      { id: 'centered', title: 'Centred' },
      { id: 'padding', title: 'Padding' },
      { id: 'behaviour', title: 'Behaviour' },
    ],
  },
  {
    slug: 'text-field',
    title: 'Text field',
    category: 'components',
    description: 'Inputs, text areas and their labels, with hints and errors.',
    anchors: [
      { id: 'filled-with-a-label', title: 'Filled, with a label' },
      { id: 'suffix', title: 'Suffix' },
      { id: 'error-and-disabled', title: 'Error and disabled' },
      { id: 'title', title: 'Title' },
      { id: 'bare', title: 'Bare' },
      { id: 'text-area', title: 'Text area' },
    ],
  },
];

// Ideas for what to build next. These are proposals, not commitments.
export const planned: { title: string; why: string }[] = [
  { title: 'Progress bar', why: 'The same gradient track appears four times.' },
  { title: 'Badge', why: 'Status pills that Chip does not cover.' },
  { title: 'Empty state', why: 'Six near-identical gradient panels with sparkles.' },
  { title: 'Stat tile', why: 'An icon, a number and a label, repeated on three screens.' },
  { title: 'Switch', why: 'The "Repeat weekly" toggle is a hand-styled one-off.' },
  { title: 'Elevation and radius', why: 'Shadows and corner radii still need merging into a few steps.' },
  { title: 'Spacing scale', why: 'Twenty-six distinct gap, margin and padding values.' },
];

export const bySlug = (slug: string) => sections.find((s) => s.slug === slug);
