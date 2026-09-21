'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/buttons';
import { Dialog } from '@/components/ui/dialog';
import { DocPage, h2, note } from '../docs';

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: '18px 20px', background: 'var(--color-canvas)', borderRadius: 18, boxShadow: 'inset 0 0 0 1px rgba(35,42,69,.07)' };

type Which = null | 'confirm' | 'question' | 'info';

export default function DialogPage() {
  const [open, setOpen] = useState<Which>(null);
  const close = () => setOpen(null);

  return (
    <DocPage title="Dialog">
      <p style={{ ...note, marginTop: 8 }}>
        A modal card centred over a dimmed page. Import it from <code>@/components/ui/dialog</code>. The parent owns{' '}
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
          It is labelled by its title. Pressing the dimmed area around it does the same as Escape: <code>onClose</code> is
          called. This is always on, so a dialog has to be safe to walk away from: closing it must never do the
          destructive thing.
        </li>
      </ul>
    </DocPage>
  );
}
