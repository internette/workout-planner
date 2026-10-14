'use client';
// Sharing a program behind a link. One link per program: sharing again updates what it shows, and stopping turns it
// off. It keeps its own state (loading the link, creating it, copying it) rather than the planner's, as nothing else
// needs it.
import { useEffect, useState } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Dialog } from '@moonshot/design-system/dialog';
import { TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import { Check, Copy, Download, Info } from '@moonshot/design-system/icons';
import { savePdf } from '@/frontend/shared/programPdf';
import { Callout } from '@/frontend/components/Callout';
import { MON3 } from '@/frontend/shared/constants';
import { plural } from '@/frontend/shared/helpers';
import * as db from '@/frontend/data/plannerData';
import { programWeeks } from '@/frontend/shared/sharedProgram';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

type Share = NonNullable<PlannerVals['programShare']>;
type Mode = 'loading' | 'form' | 'link';

const linkOf = (id: string) => (typeof window === 'undefined' ? '' : window.location.origin) + '/p/' + id;
const sharedOn = (iso: string) => {
  const d = new Date(iso);
  return MON3[d.getMonth()] + ' ' + d.getDate();
};

export function ShareProgramDialog({ s }: { s: Share }) {
  const [mode, setMode] = useState<Mode>('loading');
  const [share, setShare] = useState<db.MyShare | null>(null);
  const [justMade, setJustMade] = useState(false);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState(true);
  const [showName, setShowName] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [stopped, setStopped] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const program = s.snapshot({ notes, showName });

  // Each time it opens: the link already shared, if any, else the form for a new one.
  useEffect(() => {
    if (!s.open) return;
    let live = true;
    setMode('loading');
    setJustMade(false);
    setCopied(false);
    setError('');
    setStopped(false);
    db.myShare(s.target)
      .then((found) => {
        if (!live) return;
        setShare(found);
        setName(found ? found.name : s.name);
        setMode(found ? 'link' : 'form');
      })
      .catch((e) => live && (setError(String(e?.message || e)), setMode('form')));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.open]);

  // Opened, the PDF maker loads in the background, so making one is quick enough to hand to the share sheet.
  useEffect(() => {
    if (s.open) import('pdf-lib').catch(() => undefined);
  }, [s.open]);

  const fallbackName = s.name;
  const makePdf = async () => {
    setPdfBusy(true);
    setError('');
    try {
      await savePdf(name.trim() || fallbackName, program);
    } catch (e: any) {
      setError('Couldn’t make the PDF: ' + String(e?.message || e));
    } finally {
      setPdfBusy(false);
    }
  };
  const pdfButton = (
    <Button type="secondary" size="md" onClick={makePdf} disabled={pdfBusy || !program.workouts.length} style={{ flex: '1 1 140px', whiteSpace: 'nowrap' }}>
      <Download color="var(--color-pink-deep)" size={16} />
      {pdfBusy ? 'Making PDF…' : 'Save as PDF'}
    </Button>
  );
  const create = async () => {
    setBusy(true);
    setError('');
    try {
      const made = await db.shareProgram(s.target, name.trim() || fallbackName, program, share?.id ?? null);
      setShare(made);
      setName(made.name);
      setJustMade(true);
      setMode('link');
    } catch (e: any) {
      setError('Couldn’t share it: ' + String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };
  const stop = async () => {
    if (!share) return;
    setBusy(true);
    setError('');
    try {
      await db.stopSharing(share.id);
      setShare(null);
      setStopped(true);
      setMode('form');
    } catch (e: any) {
      setError('Couldn’t stop sharing: ' + String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };
  const copy = async () => {
    if (!share) return;
    try {
      await navigator.clipboard.writeText(linkOf(share.id));
      setCopied(true);
    } catch {
      // No clipboard (an older browser, or permission refused): the link is there to copy by hand.
      document.querySelector<HTMLInputElement>('[data-share-link]')?.select();
    }
  };
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const nativeShare = () => {
    if (!share) return;
    navigator.share({ title: share.name, text: share.name + ' on Moonshot', url: linkOf(share.id) }).catch(() => undefined);
  };

  const actions =
    mode === 'form' ? (
      <>
        <Button type="neutral" ghost size="md" onClick={share ? () => setMode('link') : s.close}>
          {share ? 'Back' : 'Cancel'}
        </Button>
        <Button type="primary" size="md" onClick={create} disabled={busy || !program.workouts.length}>
          {share ? 'Update link' : 'Create link'}
        </Button>
      </>
    ) : mode === 'link' ? (
      <Button type="primary" size="md" onClick={s.close}>
        Done
      </Button>
    ) : null;

  return (
    <Dialog open={s.open} onClose={s.close} title={'Share ' + s.name} variant="sheet" actions={actions}>
      {mode === 'loading' ? (
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-4) 0 0' }}>
          Loading…
        </Text>
      ) : null}
      {mode === 'form' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          {stopped ? (
            <Callout tone="success" icon={<Check color="var(--color-pink-deep)" strokeWidth={2.4} size={16} />}>
              Sharing stopped. That link doesn’t open anything now.
            </Callout>
          ) : null}
          <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
            {share
              ? 'The link will show the program as it is now.'
              : 'Its ' +
                (program.blocks.length > 1 ? program.blocks.length + ' blocks, ' : '') +
                programWeeks(program) +
                ' weeks and their workouts, ' + (s.asRan ? 'as you ran them' : 'as they are now') + '. Your history, diary and moods stay private.'}
          </Text>
          <TextField label="Name on the link" value={name} onChange={(e) => setName(e.target.value)} placeholder={fallbackName} maxLength={80} />
          {!program.workouts.length ? (
            <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
              It has no workouts yet. Add some first.
            </Text>
          ) : null}
          <Checkbox switch checked={notes} onChange={setNotes} description="Your notes on each workout, as you wrote them.">
            Include workout notes
          </Checkbox>
          {s.canShowName ? (
            <Checkbox switch checked={showName} onChange={setShowName} description="Off, it says “Shared from Moonshot”.">
              Show my name
            </Checkbox>
          ) : null}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2) var(--space-3)', paddingTop: '14px', borderTop: '1px solid var(--color-line)' }}>
            <Text variant="body" tone="muted" as="p" style={{ margin: 0, flex: '1 1 100%' }}>
              Or as a file, to print or send: every block and workout, with the name and notes above.
            </Text>
            {pdfButton}
          </div>
          {error ? (
            <Text variant="body" tone="danger" as="p" role="alert" style={{ margin: 0 }}>
              {error}
            </Text>
          ) : null}
        </div>
      ) : null}
      {mode === 'link' && share ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: 'var(--space-4)' }}>
          {justMade ? (
            <Callout tone="success" icon={<Check color="var(--color-pink-deep)" strokeWidth={2.4} size={16} />}>
              Link ready. Anyone with it can see “{share.name}”.
            </Callout>
          ) : null}
          <TextField label="Link" value={linkOf(share.id)} readOnly data-share-link onFocus={(e) => e.currentTarget.select()} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {canNativeShare ? (
              <Button type="primary" size="md" onClick={nativeShare} style={{ flex: '1 1 140px' }}>
                Share…
              </Button>
            ) : null}
            <Button type="secondary" size="md" onClick={copy} style={{ flex: '1 1 140px', whiteSpace: 'nowrap' }}>
              {copied ? <Check color="var(--color-pink-deep)" strokeWidth={2.4} size={16} /> : <Copy color="var(--color-pink-deep)" size={16} />}
              {copied ? 'Copied' : 'Copy link'}
            </Button>
            {pdfButton}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Info color="var(--color-muted)" size={16} />
            <Text variant="body" tone="muted" style={{ flex: 1 }}>
              {'“' + share.name + '”, shared ' + sharedOn(share.updatedAt) + ' · opened ' + plural(share.opens, 'time')}
            </Text>
          </div>
          <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
            It shows the program as it was when you shared it. Changing it doesn’t change the link until you update it.
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <Button type="neutral" ghost size="sm" onClick={() => setMode('form')} disabled={busy}>
              Update the link
            </Button>
            <Button type="danger" ghost size="sm" onClick={stop} disabled={busy} style={{ marginLeft: 'auto' }}>
              Stop sharing
            </Button>
          </div>
          {error ? (
            <Text variant="body" tone="danger" as="p" role="alert" style={{ margin: 0 }}>
              {error}
            </Text>
          ) : null}
        </div>
      ) : null}
    </Dialog>
  );
}
