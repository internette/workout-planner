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
  { slug: 'colors', title: 'Colors', category: 'foundations', description: 'The palette as CSS variables, grouped by role.',
    // One link per colour group; the page gives each group heading the same id.
    anchors: Object.keys(colorGroups).map((title) => ({ id: title.toLowerCase(), title })) },
  { slug: 'typography', title: 'Typography', category: 'foundations', description: 'Families, sizes and weights, and the named text styles built from them.',
    anchors: [
      { id: 'text-styles', title: 'Text styles' },
      { id: 'tones', title: 'Tones' },
      { id: 'families', title: 'Families' },
      { id: 'sizes', title: 'Sizes' },
      { id: 'weights', title: 'Weights' },
      { id: 'tracking', title: 'Tracking' },
      { id: 'leading', title: 'Leading' },
    ] },
  { slug: 'icons', title: 'Icons', category: 'foundations', description: 'Glyphs, sparkles, gems and mood faces on a 24×24 canvas.' },
  { slug: 'buttons', title: 'Buttons', category: 'components', description: 'Button and IconButton: types, ghost, sizes and hover states.' },
  { slug: 'card', title: 'Card', category: 'components', description: 'White surfaces, raised or floating, with steps of padding.' },
  { slug: 'chip', title: 'Chip', category: 'components', description: 'Pills for a fact, a tag or a choice.' },
  { slug: 'segmented-control', title: 'Segmented control', category: 'components', description: 'A tray of mutually exclusive options, with keyboard support.' },
  { slug: 'text-field', title: 'Text field', category: 'components', description: 'Inputs, text areas and their labels, with hints and errors.' },
];

// Ideas for what to build next. These are proposals, not commitments.
export const planned: { title: string; why: string }[] = [
  { title: 'Dialog', why: 'Five hand-built dialogs share the same scrim, focus and Escape handling.' },
  { title: 'Progress bar', why: 'The same gradient track appears four times.' },
  { title: 'Badge', why: 'Status pills that Chip does not cover.' },
  { title: 'Empty state', why: 'Six near-identical gradient panels with sparkles.' },
  { title: 'Stat tile', why: 'An icon, a number and a label, repeated on three screens.' },
  { title: 'Switch', why: 'The "Repeat weekly" toggle is a hand-styled one-off.' },
  { title: 'Elevation and radius', why: 'Shadows and corner radii still need merging into a few steps.' },
  { title: 'Spacing scale', why: 'Twenty-six distinct gap, margin and padding values.' },
];

export const bySlug = (slug: string) => sections.find((s) => s.slug === slug);
