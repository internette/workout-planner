import {
  SectionLabel,
  Text,
  displaySizes,
  fontFamilies,
  fontSizes,
  fontWeights,
  leading,
  textStyles,
  textTones,
  tracking,
} from '../../src/typography';
import { DocPage, h2 } from '../docs';

export const metadata = { title: 'Typography — Design system' };

type Style = keyof typeof textStyles;

const row: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '150px 1fr',
  gap: 20,
  alignItems: 'baseline',
  padding: '14px 0',
  borderBottom: '1px solid var(--color-line)',
};
const note: React.CSSProperties = { margin: '0 0 8px', color: 'var(--color-muted)', fontSize: 'var(--text-base)' };
const meta: React.CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--color-muted)' };
const h3: React.CSSProperties = { margin: '28px 0 6px', fontSize: 'var(--text-lg)' };

// The styles, by what they're for, each with an example of the kind of text it carries.
const GROUPS: { id: string; title: string; about: string; styles: [Style, string][] }[] = [
  {
    id: 'headings',
    title: 'Headings',
    about: 'Largest to smallest: the one big number on a screen, a screen’s title, a card’s heading, a row’s title.',
    styles: [
      ['display', '12'],
      ['title', 'Progress'],
      ['heading', 'Upper Body Push'],
      ['subheading', 'Evening Ride'],
    ],
  },
  {
    id: 'text',
    title: 'Text',
    about: 'Body for sentences; with tone="muted" it’s the secondary line under a title. Strong for names and values in rows. Small for fine print.',
    styles: [
      ['body', 'No quest today. Rest is how the power comes back, or add a workout if you’re feeling it.'],
      ['strong', 'Back Squat'],
      ['small', 'Kept on this device.'],
    ],
  },
  {
    id: 'labels-and-numbers',
    title: 'Labels and numbers',
    about: 'Micro is small capitals: write the text in normal case and it is shown in capitals. Figure is a number beside text or a bar.',
    styles: [
      ['micro', 'Personal bests'],
      ['figure', '3 of 4'],
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing',
    about: 'For the landing page only. They follow the window’s width.',
    styles: [
      ['hero', 'Answer the call'],
      ['headline', 'How a day goes'],
    ],
  },
];

function StyleRow({ name, sample }: { name: Style; sample: string }) {
  const s = textStyles[name] as { family: string; size: string; weight: string; tracking?: string; leading?: string; use: string };
  return (
    <div style={row}>
      <div>
        <strong>{name}</strong>
        <div style={meta}>
          {s.family} · {s.size} · {s.weight}
          {s.tracking ? ` · ${s.tracking}` : ''}
          {s.leading ? ` · ${s.leading}` : ''}
        </div>
      </div>
      <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        <Text variant={name} tone="ink" as="div">
          {sample}
        </Text>
        <div style={meta}>{s.use}</div>
      </div>
    </div>
  );
}

function TokenRows<T extends Record<string, { use: string }>>({
  tokens,
  value,
  sample,
}: {
  tokens: T;
  value: (name: string, t: T[keyof T]) => string;
  sample: (name: string) => React.ReactNode;
}) {
  return (
    <>
      {Object.entries(tokens).map(([name, t]) => (
        <div key={name} style={row}>
          <div>
            <strong>{name}</strong>
            <div style={meta}>{value(name, t as T[keyof T])}</div>
          </div>
          <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
            {sample(name)}
            <div style={meta}>{(t as { use: string }).use}</div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function TypographyPage() {
  return (
    <DocPage title="Typography">
      <p style={{ ...note, marginTop: 8 }}>
        Set type with a text style: <code>{'<Text variant="title" as="h1" tone="ink">'}</code>. The app uses text styles
        only; the tokens at the bottom of this page are for building the design system&apos;s own components.
      </p>

      {GROUPS.map((g) => (
        <section key={g.id}>
          <h2 id={g.id} style={h2}>
            {g.title}
          </h2>
          <p style={note}>{g.about}</p>
          {g.styles.map(([name, sample]) => (
            <StyleRow key={name} name={name} sample={sample} />
          ))}
          {g.id === 'labels-and-numbers' ? (
            <>
              <h3 style={h3}>Section label</h3>
              <p style={note}>
                <code>SectionLabel</code> is a micro heading over a section or a group of rows: a <code>note</code>{' '}
                beside it (a count), and an <code>aside</code> note or a <code>value</code> at the right. It&apos;s an h2
                by default; pass <code>as</code> for another level, or a span inside a card&apos;s top line.{' '}
                <code>list</code> insets it a little and leaves room below, over a list of rows.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
                <SectionLabel list label="Your own exercises" note="4 exercises" />
                <SectionLabel as="span" label="Personal bests" aside="All time" />
                <SectionLabel as="span" label="Quests cleared" note="All time" value="12 of 20" />
              </div>
            </>
          ) : null}
        </section>
      ))}

      <h2 id="colour" style={h2}>Colour</h2>
      <p style={note}>
        Set with <code>tone</code>, by role; without it the text takes its parent&apos;s colour. slateDeep is for text
        on the tinted gradient cards and grey badges, where slate would fall short of 4.5:1. inverse is for text on the
        accent colour.
      </p>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 20, background: 'var(--color-white)', padding: 16, borderRadius: 'var(--radius-md)' }}
      >
        {(Object.keys(textTones) as (keyof typeof textTones)[]).map((tone) => (
          <span
            key={tone}
            style={tone === 'inverse' ? { background: 'var(--color-pink)', padding: '2px 10px', borderRadius: 'var(--radius-xs)' } : undefined}
          >
            <Text variant="strong" tone={tone}>
              {tone}
            </Text>
          </span>
        ))}
      </div>

      <h2 id="emphasis" style={h2}>Emphasis</h2>
      <p style={note}>
        <code>weight</code> overrides a style&apos;s weight, for emphasis only: a bold word in a sentence, a quieter
        note beside a label. If you&apos;d reach for it on every use, pick the style that already has that weight
        (body in medium is strong).
      </p>

      <h2 id="tokens" style={h2}>Tokens, for building components</h2>
      <p style={note}>
        The parts the styles are made of, as CSS variables, e.g. <code>var(--text-base)</code>. Use them inside the
        design system&apos;s own components (a button&apos;s label, a field&apos;s value); in the app, use a text style.
      </p>

      <h3 style={h3}>Families</h3>
      <TokenRows
        tokens={fontFamilies}
        value={(name) => `var(--font-${name})`}
        sample={(name) => (
          <div style={{ fontFamily: `var(--font-${name})`, fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
            The city is quiet
          </div>
        )}
      />

      <h3 style={h3}>Sizes</h3>
      <TokenRows
        tokens={fontSizes}
        value={(name, t) => `${(t as { px: number }).px}px · var(--text-${name})`}
        sample={(name) => <div style={{ fontSize: `var(--text-${name})` }}>Every session, one step closer</div>}
      />
      <TokenRows
        tokens={displaySizes}
        value={(name, t) => `${(t as { css: string }).css} · var(--text-${name})`}
        sample={(name) => (
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-bold)', fontSize: `var(--text-${name})`, lineHeight: 'var(--leading-tight)' }}>
            Answer the call
          </div>
        )}
      />

      <h3 style={h3}>Weights</h3>
      <TokenRows
        tokens={fontWeights}
        value={(name, t) => `${(t as { value: number }).value} · var(--font-weight-${name})`}
        sample={(name) => (
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: `var(--font-weight-${name})` }}>Rest is how the power comes back</div>
        )}
      />

      <h3 style={h3}>Letter spacing</h3>
      <TokenRows
        tokens={tracking}
        value={(name, t) => `${(t as { value: string }).value} · var(--tracking-${name})`}
        sample={(name) => (
          <div
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: `var(--tracking-${name})`,
              textTransform: name === 'loose' ? 'uppercase' : undefined,
            }}
          >
            Today&rsquo;s quest
          </div>
        )}
      />

      <h3 style={h3}>Line height</h3>
      <TokenRows
        tokens={leading}
        value={(name, t) => `${(t as { value: number }).value} · var(--leading-${name})`}
        sample={(name) => (
          <p style={{ margin: 0, maxWidth: 420, lineHeight: `var(--leading-${name})`, fontSize: 'var(--text-base)' }}>
            No quest today. Rest is how the power comes back, or add a workout if you&rsquo;re feeling it.
          </p>
        )}
      />
    </DocPage>
  );
}
