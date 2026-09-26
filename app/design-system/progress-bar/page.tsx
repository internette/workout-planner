'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/buttons';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Text } from '@/components/ui/typography';
import { DocPage, h2, note } from '../docs';

const stack: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 14 };
const labelRow: React.CSSProperties = { display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 };
const moods = [
  { name: 'Happy', color: 'var(--color-pink)', pct: 50 },
  { name: 'Neutral', color: 'var(--color-slate)', pct: 25 },
  { name: 'Sad', color: 'var(--color-periwinkle)', pct: 17 },
  { name: 'Mad', color: 'var(--color-danger)', pct: 8 },
];

export default function ProgressBarPage() {
  const [done, setDone] = useState(1);
  const total = 4;

  return (
    <DocPage title="Progress bar">
      <p style={{ ...note, marginTop: 8 }}>
        How far along something is, as a bar that fills from the left. Import it from{' '}
        <code>@/components/ui/progress-bar</code>. It takes a <code>value</code> from 0 to 100, and fills to it over{' '}
        <code>--dur-bar</code> when it changes.
      </p>

      <h2 id="tracks" style={h2}>Tracks</h2>
      <p style={note}>
        <code>track=&quot;tint&quot;</code>, pale pink, where the bar is the card&apos;s main point: a workout&apos;s
        progress. <code>track=&quot;mist&quot;</code> (the default) where it sits among other things: a rank, quests
        cleared, a ride&apos;s distance.
      </p>
      <Card pad="md">
        <div style={stack}>
          <div>
            <div style={labelRow}>
              <Text variant="eyebrow" tone="slate">PROGRESS</Text>
              <Text variant="itemTitle" tone="ink" style={{ marginLeft: 'auto' }}>
                3 of 4 done
              </Text>
            </div>
            <ProgressBar value={75} track="tint" />
          </div>
          <div>
            <div style={labelRow}>
              <Text variant="eyebrow" tone="slate">QUESTS CLEARED</Text>
              <Text variant="itemTitle" tone="ink" style={{ marginLeft: 'auto' }}>
                5 of 12
              </Text>
            </div>
            <ProgressBar value={42} />
          </div>
        </div>
      </Card>

      <h2 id="fills" style={h2}>Fills</h2>
      <p style={note}>
        The gem gradient by default. Give <code>fill</code> a colour when each bar stands for something with its own,
        like Progress&apos;s mood split.
      </p>
      <Card pad="md">
        <div style={{ ...stack, gap: 12 }}>
          {moods.map((m) => (
            <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Text variant="label" tone="ink" style={{ flex: 'none', width: 66 }}>
                {m.name}
              </Text>
              <ProgressBar value={m.pct} fill={m.color} style={{ flex: 1 }} />
              <Text variant="caption" tone="slate" style={{ flex: 'none', width: 36, textAlign: 'right' }}>
                {m.pct}%
              </Text>
            </div>
          ))}
        </div>
      </Card>

      <h2 id="filling" style={h2}>Filling</h2>
      <p style={note}>A change of value slides the fill to it. Values outside 0–100 are clamped.</p>
      <Card pad="md">
        <div style={labelRow}>
          <Text variant="eyebrow" tone="slate">PROGRESS</Text>
          <Text variant="itemTitle" tone="ink" style={{ marginLeft: 'auto' }}>
            {done} of {total} done
          </Text>
        </div>
        <ProgressBar value={(done / total) * 100} track="tint" label="Workout progress" valueText={`${done} of ${total} done`} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button type="neutral" size="sm" onClick={() => setDone((d) => Math.max(0, d - 1))} disabled={done === 0}>
            One less
          </Button>
          <Button type="secondary" size="sm" onClick={() => setDone((d) => Math.min(total, d + 1))} disabled={done === total}>
            One more
          </Button>
        </div>
      </Card>

      <h2 id="accessibility" style={h2}>Accessibility</h2>
      <p style={note}>
        When the number is written beside the bar, as it usually is, the bar is only a picture of it and screen readers
        skip it. Give it a <code>label</code> (and a <code>valueText</code> such as &ldquo;3 of 4 done&rdquo;) when it
        stands alone: it then reads as a progress bar with its value. In forced colours the track is outlined and the
        fill drawn in the system highlight colour, since backgrounds are dropped.
      </p>
    </DocPage>
  );
}
