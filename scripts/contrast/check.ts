// Checks every colour pairing the app relies on, in all ten colour themes (five accents, light and dark): text 4.5:1
// or more, marks and controls 3:1 or more. Run with `npm run check:contrast`; it fails if any pairing falls short.
import { ACCENTS, paletteFor } from '../../packages/design-system/src/colors/themes';
import type { ColorName } from '../../packages/design-system/src/colors/tokens';

type Pair = [fg: ColorName, bg: ColorName, min: number, what: string];

const TEXT = 4.5;
const UI = 3;
const PAIRS: Pair[] = [
  ...(['ink', 'slate', 'muted', 'accentDeep', 'danger'] as ColorName[]).flatMap((c): Pair[] => [
    [c, 'surface', TEXT, 'text on a card'],
    [c, 'canvas', TEXT, 'text on the page'],
  ]),
  ['muted', 'mist', TEXT, 'muted text on a quiet chip or track'],
  ['accentDeep', 'accentTint', TEXT, 'accent text on the accent tint'],
  ['onAccent', 'accent', TEXT, 'a primary button’s label'],
  ['onAccent', 'accentHover', TEXT, 'a primary button’s label, hovered'],
  ['onStrong', 'ink', TEXT, 'text on a dark button'],
  ['onStrong', 'danger', TEXT, 'a delete button’s label'],
  ['slateDeep', 'mist', TEXT, 'a grey badge'],
  ['slateDeep', 'slateTint', TEXT, 'the slate rank badge'],
  ['pinkDeep', 'pinkTint', TEXT, 'the pink rank badge'],
  ['periwinkleDeep', 'periwinkleTint', TEXT, 'the periwinkle rank badge'],
  ['tealDeep', 'tealTint', TEXT, 'the teal rank badge'],
  ['outline', 'surface', UI, 'an unticked box on a card'],
  ['outline', 'canvas', UI, 'an unticked box on the page'],
  ['accent', 'surface', UI, 'a tick, bar or mark on a card'],
  ['accent', 'canvas', UI, 'a tick, bar or mark on the page'],
];

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

let failures = 0;
for (const theme of ['light', 'dark'] as const)
  for (const { name: accent } of ACCENTS) {
    const p = paletteFor(theme, accent);
    for (const [fg, bg, min, what] of PAIRS) {
      const r = ratio(p[fg], p[bg]);
      if (r < min) {
        failures++;
        console.log(`✗ ${accent} ${theme}: ${fg} on ${bg} is ${r.toFixed(2)}:1, under ${min}:1 (${what})`);
      }
    }
  }
console.log(failures ? `\n${failures} pairing(s) fall short.` : `✓ All ${PAIRS.length} pairings pass in all ${ACCENTS.length * 2} colour themes.`);
process.exit(failures ? 1 : 0);
