import { colorGroups, cssVarName, gradients, translucents } from '../../src/colors';
import { DocPage } from '../docs';

export const metadata = { title: 'Colors — Design system' };

/** A group's heading id: "Lines and controls" -> "lines-and-controls". */
const groupId = (title: string) => title.toLowerCase().replace(/\s+/g, '-');

// A line under a group's heading, where the group needs more than each swatch's own note.
const groupNotes: Record<string, string> = {
  Accent: 'The theme’s color, which changes with Profile → Settings → Color: pink by default. Use it for anything that means “the app’s color”; for pink that must stay pink, use Brand. Text and icons on it are onStrong, as on any strong fill.',
  Brand: 'Colors that stay themselves in every theme: the moods, the rank tiers, the gem and the sparkles. Each has a tint for a badge and a deep shade for text on it.',
};

const code: React.CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--color-muted)', wordBreak: 'break-word' };
const sectionTitle: React.CSSProperties = { fontSize: 'var(--text-xl)', scrollMarginTop: 'var(--ds-anchor-offset)' };
const intro: React.CSSProperties = { margin: '0 0 16px', maxWidth: 640, color: 'var(--color-muted)', lineHeight: 'var(--leading-base)' };

/** The swatch behind a see-through color: the color over the page. */
const overCanvas = (variable: string) => `linear-gradient(0deg, var(${variable}), var(${variable})), var(--color-canvas)`;

/** An on-color swatch: a block of the color on the fill it goes on, so its strength shows. */
const onFill = (variable: string, fill: string) =>
  `linear-gradient(0deg, var(${variable}), var(${variable})) center / 40% 36% no-repeat, var(${fill})`;
const swatchFor = (name: string) => (name === 'onStrong' ? onFill(cssVarName(name), '--color-accent') : `var(${cssVarName(name)})`);

function Swatch({ name, swatch, lines, use }: { name: string; swatch: string; lines: string[]; use: string }) {
  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--elevation-raised)' }}>
      <div style={{ height: 64, background: swatch, borderBottom: '1px solid var(--color-line)' }} />
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <strong style={{ fontSize: 'var(--text-base)' }}>{name}</strong>
        {lines.map((l) => (
          <code key={l} style={code}>
            {l}
          </code>
        ))}
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-slate)', lineHeight: 'var(--leading-base)' }}>{use}</span>
      </div>
    </div>
  );
}

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {Object.entries(swatches).map(([name, c]) => (
              <Swatch
                key={name}
                name={name}
                swatch={swatchFor(name)}
                lines={['ref' in c ? `Same as ${c.ref} · default theme` : `${c.hex} · default theme`, `var(${cssVarName(name)})`]}
                use={c.use}
              />
            ))}
          </div>
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
