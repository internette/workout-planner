'use client';

import { useState } from 'react';
import { Button } from '../../src/buttons';
import { Dialog } from '../../src/dialog';
import { Mark } from '../../src/brand';
import { Text } from '../../src/typography';
import { DocPage, h2, note } from '../docs';

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: '18px 20px', background: 'var(--color-canvas)', borderRadius: 'var(--radius-lg)', boxShadow: 'inset 0 0 0 1px var(--color-line)' };

type Which = null | 'confirm' | 'question' | 'info' | 'sheet' | 'fullscreen' | 'plain';

export default function DialogPage() {
  const [open, setOpen] = useState<Which>(null);
  const close = () => setOpen(null);

  return (
    <DocPage title="Dialog">
      <p style={{ ...note, marginTop: 8 }}>
        A modal card centred over a dimmed page. Import it from <code>@moonshot/design-system/dialog</code>. The parent owns{' '}
        <code>open</code> and passes <code>onClose</code>; the dialog handles the rest.
      </p>

      <h2 id="confirm" style={h2}>Confirm</h2>
      <p style={note}>
        A title, a sentence and the buttons. Put the safe choice first as a ghost button and the action last. Use the{' '}
        <code>danger</code> button type when it can&apos;t be undone.
      </p>
      <div style={row}>
        <Button type="neutral" size="md" onClick={() => setOpen('confirm')}>
          Delete workout…
        </Button>
      </div>
      <Dialog
        open={open === 'confirm'}
        onClose={close}
        title="Delete this workout?"
        description={'“Upper Body Push” on Sep 17 will be removed from your plan. This can’t be undone.'}
        actions={
          <>
            <Button type="neutral" ghost size="md" onClick={close}>
              Keep it
            </Button>
            <Button type="danger" size="md" onClick={close}>
              Delete workout
            </Button>
          </>
        }
      />

      <h2 id="with-content" style={h2}>With content</h2>
      <p style={note}>
        Anything can sit between the description and the buttons: a list, a checkbox, a form. <code>size=&quot;md&quot;</code>{' '}
        is 440px wide instead of 400px.
      </p>
      <div style={row}>
        <Button type="neutral" size="md" onClick={() => setOpen('question')}>
          Save changes…
        </Button>
      </div>
      <Dialog
        open={open === 'question'}
        onClose={close}
        size="md"
        title="Save changes to this workout?"
        description="2 upcoming sessions use “Upper Body Push”."
        actions={
          <>
            <Button type="neutral" ghost size="md" onClick={close}>
              Cancel
            </Button>
            <Button type="primary" size="md" onClick={close}>
              Update
            </Button>
          </>
        }
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked style={{ width: 18, height: 18, margin: 0, accentColor: 'var(--color-pink)' }} />
          Update upcoming sessions
        </label>
      </Dialog>

      <h2 id="reference-panel" style={h2}>Reference panel</h2>
      <p style={note}>
        Every dialog has an X in the top right corner that does the same as Escape, so a reference panel with nothing to
        decide needs no buttons at all. <code>aside</code> adds small muted text beside the title. Tall content
        scrolls inside the card. Pass <code>closeButton={'{false}'}</code> to leave the X out.
      </p>
      <div style={row}>
        <Button type="neutral" size="md" onClick={() => setOpen('info')}>
          Open ranks…
        </Button>
      </div>
      <Dialog
        open={open === 'info'}
        onClose={close}
        size="md"
        title="Ranks"
        aside="Rank 1 of 20"
        description="Earned with experience — 10 XP per exercise completed, 50 XP per workout finished."
      />

      <h2 id="variants" style={h2}>Sheet and full screen</h2>
      <p style={note}>
        <code>variant=&quot;sheet&quot;</code> puts it along the bottom of a phone&apos;s screen, rising from the edge
        with a handle, its buttons stretched across it: choices to pick from while the page stays in view above. Wider
        screens show it in the middle. <code>icon</code> puts something before the title, such as the app&apos;s mark.{' '}
        <code>variant=&quot;fullscreen&quot;</code> takes the whole screen on the page color, for a flow of its own
        (customizing, say); the content lays itself out and scrolls inside.
      </p>
      <div style={row}>
        <Button type="neutral" size="md" onClick={() => setOpen('sheet')}>
          Install…
        </Button>
        <Button type="neutral" size="md" onClick={() => setOpen('fullscreen')}>
          Full screen…
        </Button>
      </div>
      <Dialog
        open={open === 'sheet'}
        onClose={close}
        variant="sheet"
        closeButton={false}
        icon={<Mark size={36} />}
        title="Install Moonshot"
        description="Open it like an app: full screen, no browser bar, one tap away."
        actions={
          <>
            <Button type="neutral" ghost size="md" onClick={close}>
              Not now
            </Button>
            <Button type="primary" size="md" onClick={close}>
              Install
            </Button>
          </>
        }
      />
      <Dialog open={open === 'fullscreen'} onClose={close} variant="fullscreen" closeButton={false} labelledBy="ds-fullscreen-title">
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: '20px 20px 28px', maxWidth: 520, margin: '0 auto' }}>
          <Text variant="micro" tone="accent" as="div">
            A flow of its own
          </Text>
          <Text variant="title" as="h1" id="ds-fullscreen-title" style={{ margin: '6px 0 0' }}>
            Who answers the call?
          </Text>
          <Text variant="body" tone="muted" as="p" style={{ margin: '8px 0 0', flex: 1 }}>
            The content draws its own heading, named with <code>labelledBy</code>, so no header is drawn. Escape calls{' '}
            <code>onClose</code>, as always.
          </Text>
          <Button type="primary" size="lg" fullWidth glow onClick={close}>
            Done
          </Button>
        </div>
      </Dialog>

      <h2 id="no-title" style={h2}>Without a title</h2>
      <p style={note}>
        A card whose content is its own heading (a welcome, a send-off) leaves <code>title</code> out and names the
        heading with <code>labelledBy</code>: no header is drawn, and the content fills the card.
      </p>
      <div style={row}>
        <Button type="neutral" size="md" onClick={() => setOpen('plain')}>
          Welcome…
        </Button>
      </div>
      <Dialog open={open === 'plain'} onClose={close} closeButton={false} labelledBy="ds-plain-title">
        <div style={{ textAlign: 'center' }}>
          <Text variant="micro" tone="accent" as="div">
            Welcome
          </Text>
          <Text variant="heading" as="h2" id="ds-plain-title" style={{ margin: '6px 0 0' }}>
            How would you like to begin?
          </Text>
          <Button type="primary" size="lg" fullWidth glow onClick={close} style={{ marginTop: 18 }}>
            Show me around
          </Button>
        </div>
      </Dialog>

      <h2 id="behaviour" style={h2}>Behaviour</h2>
      <ul style={{ ...note, paddingLeft: 20 }}>
        <li>
          It is a native <code>&lt;dialog&gt;</code>, opened with <code>showModal()</code>. The browser puts it above
          everything, makes the page behind it inert, and keeps Tab and Shift+Tab inside it.
        </li>
        <li>
          Escape asks it to close: <code>onClose</code> is called, and it is up to the parent to set{' '}
          <code>open</code> to false. If dialogs are stacked, the top one closes first.
        </li>
        <li>
          Focus moves to the first action button when it opens (or to the X if there are none) and returns to whatever
          opened it once it closes.
        </li>
        <li>
          It is labelled by its title, or by <code>labelledBy</code> when it has none. Pressing the dimmed area around it does the same as Escape: <code>onClose</code> is
          called. This is always on, so a dialog has to be safe to walk away from: closing it must never do the
          destructive thing.
        </li>
      </ul>
    </DocPage>
  );
}
