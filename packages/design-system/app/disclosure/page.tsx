'use client';

import { useState } from 'react';
import { Card } from '../../src/card';
import { DisclosureRow } from '../../src/disclosure';
import { Text } from '../../src/typography';
import { DocPage, h2, note } from '../docs';

export default function DisclosurePage() {
  const [outlined, setOutlined] = useState(false);
  const [divided, setDivided] = useState(true);
  return (
    <DocPage title="Disclosure">
      <p style={{ ...note, marginTop: 8 }}>
        A row that opens and closes what&apos;s under it. Import <code>DisclosureRow</code> (and{' '}
        <code>DisclosureChevron</code>, for a row of your own) from <code>@moonshot/design-system/disclosure</code>. The
        row is a button that says whether it&apos;s open; render what it opens yourself, with the id you pass as{' '}
        <code>controls</code>, and only while it&apos;s open.
      </p>

      <h2 id="outlined" style={h2}>Outlined</h2>
      <p style={note}>A box of its own, as a field in a form: the exercise editor&apos;s equipment.</p>
      <Card style={{ maxWidth: 460 }}>
        <DisclosureRow open={outlined} onToggle={() => setOutlined(!outlined)} controls="demo-outlined">
          <span style={{ flex: 1, minWidth: 0 }}>
            <Text variant="micro" as="span" tone="slate" style={{ display: 'block' }}>
              EQUIPMENT
            </Text>
            <Text variant="body" as="span" tone="ink" weight="semibold" style={{ display: 'block', marginTop: 2 }}>
              Dumbbells, Bench
            </Text>
          </span>
        </DisclosureRow>
        {outlined ? (
          <Text id="demo-outlined" variant="body" tone="muted" as="p" style={{ margin: '12px 2px 0' }}>
            What it opens goes here.
          </Text>
        ) : null}
      </Card>

      <h2 id="divided" style={h2}>Divided</h2>
      <p style={note}>A row in a list, with a line under it: the Spellbook filter&apos;s equipment groups.</p>
      <Card style={{ maxWidth: 460 }}>
        <DisclosureRow variant="divided" open={divided} onToggle={() => setDivided(!divided)} controls="demo-divided">
          <Text variant="strong" as="span" tone="ink" style={{ flex: 'none' }}>
            Free weights
          </Text>
          <Text variant="body" as="span" tone="accent" weight="semibold" style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
            Dumbbells
          </Text>
        </DisclosureRow>
        {divided ? (
          <Text id="demo-divided" variant="body" tone="muted" as="p" style={{ margin: '12px 2px 0' }}>
            What it opens goes here.
          </Text>
        ) : null}
      </Card>
    </DocPage>
  );
}
