'use client';

import { Card } from '../../src/card';
import { StatusScreen } from '../../src/status-screen';
import { Text } from '../../src/typography';

const noop = () => undefined;

// The three states of the loading screen, side by side, in the planner's words. Drawn inline, so they aren't live
// regions or landmarks on this page.
const STATES = [
  { kind: 'loading', label: 'loading', title: 'Loading your plan', note: 'Setting up your week, streak and chronicle.' },
  { kind: 'slow', label: 'slow, after 8 seconds', title: 'Still loading your plan', note: 'This is taking longer than usual. It may be your connection.' },
  { kind: 'error', label: 'error', title: 'Couldn’t reach your plan', note: 'Your plan is safe. Check your connection, then try again.' },
] as const;

export function StatusExamples() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 14 }}>
      {STATES.map((s) => (
        <figure key={s.kind} style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* A frame, so each reads as a whole screen against the page. */}
          <Card pad="none" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <StatusScreen
              inline
              kind={s.kind}
              title={s.title}
              note={s.note}
              onRetry={noop}
              onSignOut={s.kind === 'error' ? noop : undefined}
              detail={s.kind === 'error' ? 'Failed to fetch' : undefined}
            />
          </Card>
          <Text variant="body" tone="muted" as="figcaption" style={{ textAlign: 'center' }}>
            {s.label}
          </Text>
        </figure>
      ))}
    </div>
  );
}
