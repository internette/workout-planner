import { BlockBar } from '../../src/block-bar';
import { Card } from '../../src/card';
import { Text } from '../../src/typography';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Block bar — Design system' };

const split = [
  { name: 'Build', weeks: 3 },
  { name: 'Deload', weeks: 1 },
  { name: 'Peak', weeks: 4 },
];

export default function BlockBarPage() {
  return (
    <DocPage title="Block bar">
      <p style={{ ...note, marginTop: 8 }}>
        A program&apos;s blocks as one bar, each as long as its weeks, so its shape reads at a glance. Import it from{' '}
        <code>@moonshot/design-system/block-bar</code> and give it <code>blocks</code>: each a <code>name</code> and{' '}
        <code>weeks</code>.
      </p>

      <h2 id="blocks" style={h2}>Blocks</h2>
      <p style={note}>
        The blocks are the theme color at rising strength, so they read as one climb: the first{' '}
        <code>--color-block-faint</code>, any between <code>--color-block-half</code>, the last the theme color itself.
        Each has a thin outline in <code>--color-block-half</code> too, so the faintest still shows on the page. With more than one
        block a key names them under the bar; a program of one block is a single bar with no key.
      </p>
      <Card pad="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <BlockBar blocks={split} />
          <BlockBar blocks={[{ name: 'Base', weeks: 3 }, { name: 'Build', weeks: 3 }]} />
          <BlockBar blocks={[{ name: 'Block 1', weeks: 4 }]} />
        </div>
      </Card>

      <h2 id="running" style={h2}>Running</h2>
      <p style={note}>
        Give <code>at</code>, in weeks from the start, to mark where a run of the program is: the Spellbook&apos;s Running
        list does, beside &ldquo;Build · week 2 of 3&rdquo;.
      </p>
      <Card pad="md">
        <Text variant="micro" tone="accent" as="div">Build · week 2 of 3</Text>
        <Text variant="subheading" as="div" style={{ marginBottom: 12 }}>3-day band split</Text>
        <BlockBar blocks={split} at={1.5} />
      </Card>

      <h2 id="accessibility" style={h2}>Accessibility</h2>
      <p style={note}>
        The bar is one image to a screen reader, named for its blocks (&ldquo;Build, 3 weeks; Deload, 1 week; Peak, 4
        weeks&rdquo;); the key and the marker are hidden from it, since the page says where a run is in words. In forced
        colors the blocks are drawn in the system highlight color with an outline.
      </p>
    </DocPage>
  );
}
