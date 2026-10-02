import type { ReactNode } from 'react';
import { Mark } from '../../src/brand';
import { Card } from '../../src/card';
import { Text } from '../../src/typography';
import { DocPage, h2, note } from '../docs';
import { StatusExamples } from './StatusExamples';

export const metadata = { title: 'Loading animation — Design system' };

const stage = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'center',
  gap: '20px 40px',
  padding: '32px 20px',
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-canvas)',
} as const;

// The medallion the loading screen sets the mark on.
const medallion = {
  width: 112,
  height: 112,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-full)',
  background: 'var(--color-surface)',
  boxShadow: 'var(--elevation-raised)',
} as const;

function Sample({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {children}
      <Text variant="body" tone="muted" as="figcaption">
        {label}
      </Text>
    </figure>
  );
}

const TIMING = [
  ['Facets', 'Six, lit in order from rose to cyan, the way the moon’s colours run'],
  ['Each facet', 'Fades from 16% to full, holds from 30% to 70% of its cycle, then fades back'],
  ['Cycle', '2.4 s, ease-in-out, repeating for as long as it’s shown'],
  ['Stagger', '0.2 s between facets, so a wave of light runs round the crescent'],
  ['Reduced motion', 'No animation: the finished mark, every facet lit'],
];

export default function LoadingPage() {
  return (
    <DocPage title="Loading animation">
      <p style={{ ...note, marginTop: 8 }}>
        While something loads, the mark&apos;s facets light up one after another, rose to cyan, like the moon catching the
        light. It&apos;s the mark with <code>animate</code>, so it needs nothing else: the colours and timing come with it.
      </p>

      <h2 id="animation" style={h2}>The animation</h2>
      <p style={note}>
        On the loading screen it sits at 60px on a white medallion. It&apos;s decorative: whatever shows it says what&apos;s
        loading in words.
      </p>
      <Card>
        <div style={stage}>
          <Sample label="120">
            <Mark size={120} animate />
          </Sample>
          <Sample label="60, on the medallion">
            <span style={medallion}>
              <Mark size={60} animate />
            </span>
          </Sample>
          <Sample label="reduced motion">
            <Mark size={60} />
          </Sample>
        </div>
        <Text variant="body" tone="muted" as="p" style={{ margin: '12px 0 0' }}>
          <code>{"import { Mark } from '@moonshot/design-system/brand'"}</code> · <code>{'<Mark size={60} animate />'}</code>
        </Text>
      </Card>

      <h2 id="timing" style={h2}>How it moves</h2>
      <p style={note}>Every facet runs the same fade; only its start differs.</p>
      <Card pad="none" style={{ overflow: 'hidden' }}>
        {TIMING.map(([name, value], i) => (
          <div
            key={name}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', padding: '14px 20px', borderTop: i ? '1px solid var(--color-line)' : 'none' }}
          >
            <Text variant="subheading" tone="ink" style={{ flex: '0 0 140px' }}>
              {name}
            </Text>
            <Text variant="body" tone="slateDeep" style={{ flex: '1 1 260px' }}>
              {value}
            </Text>
          </div>
        ))}
      </Card>

      <h2 id="loading-screen" style={h2}>Loading screen</h2>
      <p style={note}>
        <code>StatusScreen</code> is what an app shows before it has its data: the animated mark while loading, a
        gentler &ldquo;still loading&rdquo; with Try again when it&apos;s slow (the planner switches after 8 seconds), and a
        moon with a warning when it fails, with Try again, Sign out and the server&apos;s own words behind Show details.
        The app passes the words. Import it from <code>@moonshot/design-system/status-screen</code>.
      </p>
      <StatusExamples />
    </DocPage>
  );
}
