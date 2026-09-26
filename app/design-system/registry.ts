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
    anchors: [
      ...Object.keys(colorGroups).map((title) => ({ id: title.toLowerCase(), title })),
      { id: 'gradients-and-overlays', title: 'Gradients and overlays' },
    ],
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
      { id: 'display-sizes', title: 'Display sizes' },
      { id: 'weights', title: 'Weights' },
      { id: 'tracking', title: 'Tracking' },
      { id: 'leading', title: 'Leading' },
    ],
  },
  {
    slug: 'radii',
    title: 'Radii',
    category: 'foundations',
    description: 'The corner radii, named for what they round.',
    anchors: [{ id: 'scale', title: 'Scale' }],
  },
  {
    slug: 'spacing',
    title: 'Spacing',
    category: 'foundations',
    description: 'Padding and gaps, page measures and breakpoints.',
    anchors: [
      { id: 'scale', title: 'Scale' },
      { id: 'layout', title: 'Layout' },
      { id: 'breakpoints', title: 'Breakpoints' },
    ],
  },
  {
    slug: 'motion',
    title: 'Motion',
    category: 'foundations',
    description: 'How long things take, and how they ease.',
    anchors: [
      { id: 'durations', title: 'Durations' },
      { id: 'easings', title: 'Easings' },
    ],
  },
  {
    slug: 'interaction',
    title: 'Interaction',
    category: 'foundations',
    description: 'Hover washes, the one focus ring, tap targets and forced colours.',
    anchors: [
      { id: 'hover', title: 'Hover' },
      { id: 'focus', title: 'Focus' },
      { id: 'tap-targets', title: 'Tap targets' },
      { id: 'screen-readers', title: 'Screen readers' },
      { id: 'forced-colours', title: 'Forced colours' },
    ],
  },
  {
    slug: 'elevation',
    title: 'Elevation',
    category: 'foundations',
    description: 'The shadows the interface casts, and the one glow.',
    anchors: [
      { id: 'steps', title: 'Steps' },
      { id: 'glow', title: 'Glow' },
    ],
  },
  {
    slug: 'icons',
    title: 'Icons',
    category: 'foundations',
    description: 'Glyphs, sparkles, gems, mood faces and rating stars on a 24×24 canvas.',
    anchors: [
      { id: 'glyphs', title: 'Glyphs' },
      { id: 'exercise-icons', title: 'Exercise icons' },
      { id: 'decorative', title: 'Decorative' },
      { id: 'mood-faces', title: 'Mood faces' },
      { id: 'rating-stars', title: 'Rating stars' },
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
      { id: 'as-a-list', title: 'As a list' },
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
      { id: 'compact', title: 'Compact' },
      { id: 'quiet', title: 'Quiet' },
      { id: 'full-width', title: 'Full width' },
    ],
  },
  {
    slug: 'progress-bar',
    title: 'Progress bar',
    category: 'components',
    description: 'How far along something is, filling from the left.',
    anchors: [
      { id: 'tracks', title: 'Tracks' },
      { id: 'fills', title: 'Fills' },
      { id: 'filling', title: 'Filling' },
      { id: 'accessibility', title: 'Accessibility' },
    ],
  },
  {
    slug: 'stat',
    title: 'Stat',
    category: 'components',
    description: 'A labelled figure, with an optional unit and note.',
    anchors: [
      { id: 'sizes', title: 'Sizes' },
      { id: 'units-and-notes', title: 'Units and notes' },
    ],
  },
  {
    slug: 'icon-tile',
    title: 'Icon tile',
    category: 'components',
    description: 'A workout’s or exercise’s icon on its pale pink tile.',
    anchors: [
      { id: 'sizes', title: 'Sizes' },
      { id: 'as-a-button', title: 'As a button' },
    ],
  },
  {
    slug: 'badge',
    title: 'Badge',
    category: 'components',
    description: 'A small status pill: Done, Planned, Partly done.',
    anchors: [
      { id: 'tones', title: 'Tones' },
      { id: 'in-a-list', title: 'In a list' },
    ],
  },
  {
    slug: 'empty-state',
    title: 'Empty state',
    category: 'components',
    description: 'Nothing here yet, and what to do about it.',
    anchors: [
      { id: 'whole-screen', title: 'A whole screen' },
      { id: 'in-a-section', title: 'In a section' },
    ],
  },
  {
    slug: 'checkbox',
    title: 'Checkbox',
    category: 'components',
    description: 'A tick box with its label, as a checkbox or a switch.',
    anchors: [
      { id: 'checkbox', title: 'Checkbox' },
      { id: 'switch', title: 'As a switch' },
      { id: 'behaviour', title: 'Behaviour' },
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
    slug: 'icon-choice-group',
    title: 'Icon choice group',
    category: 'components',
    description: 'Pick one icon or colour from a set of pictures.',
    anchors: [
      { id: 'icons', title: 'Icons' },
      { id: 'colours', title: 'Colours' },
      { id: 'round-swatches', title: 'Round swatches' },
      { id: 'in-a-popover', title: 'In a popover' },
      { id: 'behaviour', title: 'Behaviour' },
    ],
  },
  {
    slug: 'rating',
    title: 'Rating',
    category: 'components',
    description: 'How a workout felt: a mood and an effort.',
    anchors: [
      { id: 'mood', title: 'Mood' },
      { id: 'effort', title: 'Effort' },
      { id: 'showing-a-rating', title: 'Showing a rating' },
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
  { title: 'Reorderable list', why: 'Drag-to-reorder, with its handle and arrow keys, lives only in the workout editor.' },
];

export const bySlug = (slug: string) => sections.find((s) => s.slug === slug);
