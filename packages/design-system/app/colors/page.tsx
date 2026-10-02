import { colorGroups, colors, cssVarName, gradients, translucents, type ColorName } from '../../src/colors';
import { DocPage } from '../docs';
import { Swatch } from './Swatch';
import { ThemeColors } from './ThemeColors';

export const metadata = { title: 'Colors — Design system' };

/** A group's heading id: "Lines and controls" -> "lines-and-controls". */
const groupId = (title: string) => title.toLowerCase().replace(/\s+/g, '-');

// A line under a group's heading, where the group needs more than each swatch's own note.
const groupNotes: Record<string, string> = {
  'Theme color': 'The colors a theme sets: pink by default, and teal, periwinkle, slate or coral with Profile → Settings → Color. They are written as pink’s variables, so everything in pink follows the theme: buttons, selection, ticks, the Happy mood, the first rank tiers and the gem. Pick a theme to see its values, light on the left of each swatch and dark on the right.',
  Brand: 'Colors that stay themselves in every theme: the other moods, the later rank tiers and the sparkles. Each has a tint for a badge and a deep shade for text on it.',
};

const sectionTitle: React.CSSProperties = { fontSize: 'var(--text-xl)', scrollMarginTop: 'var(--ds-anchor-offset)' };
const intro: React.CSSProperties = { margin: '0 0 16px', maxWidth: 640, color: 'var(--color-muted)', lineHeight: 'var(--leading-base)' };

/** The swatch behind a see-through color: the color over the page. */
const overCanvas = (variable: string) => `linear-gradient(0deg, var(${variable}), var(${variable})), var(--color-canvas)`;

export default function ColorsPage() {
  const effects = [
    ...Object.entries(translucents).map(([name, { value, use }]) => ({ name, variable: cssVarName(name), value, use, swatch: overCanvas(cssVarName(name)) })),
    ...Object.entries(gradients).map(([name, { value, use }]) => ({ name, variable: `--gradient-${name}`, value, use, swatch: `var(--gradient-${name})` })),
  ];
  return (
    <DocPage title="Colors">
      <p style={{ margin: '8px 0 32px', color: 'var(--color-muted)', lineHeight: 'var(--leading-base)' }}>
        Every color is a CSS variable on <code>:root</code>, for example <code>var(--color-pink)</code>. Import{' '}
        <code>colors</code> from <code>@moonshot/design-system/colors</code> only where a real hex string is needed. The
        hex values below are the default theme&apos;s (light, pink); the swatches show the theme you&apos;re viewing.
        Each hex is written once: a color that matches another is set as that one, so changing it changes both.
      </p>
      {Object.entries(colorGroups).map(([group, swatches]) => (
        <section key={group} style={{ marginBottom: 36 }}>
          <h2 id={groupId(group)} style={sectionTitle}>{group}</h2>
          {groupNotes[group] ? <p style={intro}>{groupNotes[group]}</p> : null}
          {group === 'Theme color' ? (
            <ThemeColors />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {Object.entries(swatches).map(([name, c]) => (
                <Swatch
                  key={name}
                  name={name}
                  swatch={`var(${cssVarName(name)})`}
                  lines={[`${colors[name as ColorName]} · default theme`, `var(${cssVarName(name)})`]}
                  use={c.use}
                />
              ))}
            </div>
          )}
        </section>
      ))}
      <section style={{ marginBottom: 36 }}>
        <h2 id="effects" style={sectionTitle}>Effects</h2>
        <p style={intro}>
          See-through colors and gradients, built from the palette and also CSS variables. Most are a color at a set
          strength, so they follow the theme. Write <code>var(--gradient-gem)</code>, not the gradient itself.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {effects.map(({ name, variable, value, use, swatch }) => (
            <Swatch key={name} name={name} swatch={swatch} lines={[`var(${variable})`, value]} use={use} />
          ))}
        </div>
      </section>
    </DocPage>
  );
}
