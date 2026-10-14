'use client';

import { Button, IconButton } from '../../src/buttons';
import { Callout } from '../../src/callout';
import { Check, Close } from '../../src/icons';
import { DocPage, h2, note } from '../docs';

const panel: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12, padding: 20, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 14px var(--color-line)', maxWidth: 520 };

export default function CalloutPage() {
  return (
    <DocPage title="Callout">
      <p style={{ ...note, marginTop: 8 }}>
        A tinted strip with a message. Import <code>Callout</code> from <code>@moonshot/design-system/callout</code>. Use
        it for news after something happened elsewhere (a plan added to the calendar, a link copied) and for a failure
        the person has to act on. It isn&apos;t a dialog: it sits in the page, and the page goes on around it.
      </p>

      <h2 id="tones" style={h2}>Tones</h2>
      <p style={note}>
        <code>success</code> in the accent tint for something that went through; <code>danger</code> for something that
        didn&apos;t. An <code>icon</code> goes before the message, drawn in the tone&apos;s color.
      </p>
      <div style={panel}>
        <Callout tone="success" icon={<Check color="var(--color-pink-deep)" strokeWidth={2.4} size={16} />}>
          “Fall routine” begins: 18 sessions on your calendar from Oct 19.
        </Callout>
        <Callout tone="danger">Something went wrong saving that. Your plan is as it was.</Callout>
      </div>

      <h2 id="with-an-action" style={h2}>With an action</h2>
      <p style={note}>
        <code>action</code> puts a button after the message: Dismiss, or the way to what the news is about. On a narrow
        screen the message wraps and the action drops under it.
      </p>
      <div style={panel}>
        <Callout
          tone="success"
          icon={<Check color="var(--color-pink-deep)" strokeWidth={2.4} size={16} />}
          action={
            <IconButton label="Dismiss" size="md">
              <Close color="var(--color-muted)" strokeWidth={2.2} size={14} />
            </IconButton>
          }
        >
          Plan added to your calendar.
        </Callout>
        <Callout tone="danger" role="alert" action={<Button type="danger" ghost size="sm">Try again</Button>}>
          Couldn&apos;t reach the server.
        </Callout>
      </div>

      <h2 id="behaviour" style={h2}>Behaviour</h2>
      <ul style={{ ...note, paddingLeft: 20 }}>
        <li>
          It is a live region: <code>role=&quot;status&quot;</code> by default, so news is read out without interrupting;{' '}
          <code>role=&quot;alert&quot;</code> for a failure that needs reading now.
        </li>
        <li>The tones are the theme&apos;s: in another color theme the success tint follows it; danger stays red.</li>
      </ul>
    </DocPage>
  );
}
