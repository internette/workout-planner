'use client';
// "Share week": the week on screen as a program behind a link. One link per person: sharing again replaces what it
// shows, and stopping turns it off. It keeps its own state (loading the link, creating it, copying it) rather than the
// planner's, as nothing else needs it.
import { useEffect, useState } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Dialog } from '@moonshot/design-system/dialog';
import { TextField } from '@moonshot/design-system/text-field';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { Check, Copy, Info } from '@moonshot/design-system/icons';
import { Callout } from '@/frontend/components/Callout';
import { DOW1, DOWFULL, MON3 } from '@/frontend/shared/constants';
import { iconSvg } from '@/frontend/shared/icons';
import { plural } from '@/frontend/shared/helpers';
import * as db from '@/frontend/data/plannerData';
import { trainingDays } from '@/frontend/shared/sharedProgram';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

type Share = NonNullable<PlannerVals['shareWeek']>;
type Mode = 'loading' | 'form' | 'link';

const linkOf = (id: string) => (typeof window === 'undefined' ? '' : window.location.origin) + '/p/' + id;
const sharedOn = (iso: string) => {
  const d = new Date(iso);
  return MON3[d.getMonth()] + ' ' + d.getDate();
};

export function ShareWeekDialog({ s }: { s: Share }) {
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

  const program = s.program({ notes, showName });
  const days = trainingDays(program);

  // Each time it opens: the link already shared, if any, else the form for a new one.
  useEffect(() => {
    if (!s.open) return;
    let live = true;
    setMode('loading');
    setJustMade(false);
    setCopied(false);
    setError('');
    setStopped(false);
    db.myShare()
      .then((found) => {
        if (!live) return;
        setShare(found);
        setName(found ? found.name : '');
        setMode(found ? 'link' : 'form');
      })
      .catch((e) => live && (setError(String(e?.message || e)), setMode('form')));
    return () => {
      live = false;
    };
  }, [s.open]);

  const fallbackName = days ? days + '-day week' : 'My week';
  const create = async () => {
    setBusy(true);
    setError('');
    try {
      const made = await db.shareProgram(name.trim() || fallbackName, program, share?.id ?? null);
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
    <Dialog open={s.open} onClose={s.close} title="Share your week" sheet actions={actions}>
      {mode === 'loading' ? (
        <Text variant="body" tone="muted" as="p" style={{ margin: '16px 0 0' }}>
          Loading…
        </Text>
      ) : null}
      {mode === 'form' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          {stopped ? (
            <Callout tone="success" icon={<Check color="var(--color-pink-deep)" strokeWidth={2.4} size={16} />}>
              Sharing stopped. That link doesn’t open anything now.
            </Callout>
          ) : null}
          <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
            {share
              ? 'The link will show the week of ' + s.weekLabel + ' instead.'
              : 'The workouts in the week of ' + s.weekLabel + ', by weekday. Your history, diary and moods stay private.'}
          </Text>
          <TextField label="Program name" value={name} onChange={(e) => setName(e.target.value)} placeholder={fallbackName} maxLength={80} />
          <div>
            <SectionLabel label="What’s in it" note={program.workouts.length ? plural(days, 'day') + ' a week' : undefined} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '6px', marginTop: '8px' }}>
              {program.days.map((list, d) => {
                const w = program.workouts[list[0]];
                return (
                  <div key={d} style={{ textAlign: 'center' }} aria-label={DOWFULL[d] + ': ' + (list.length ? list.map((ix) => program.workouts[ix].name).join(', ') : 'rest')}>
                    <Text variant="micro" tone="slate" as="div" aria-hidden="true">
                      {DOW1[d]}
                    </Text>
                    <div
                      aria-hidden="true"
                      style={{
                        marginTop: '6px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        display: 'grid',
                        placeItems: 'center',
                        background: w ? 'var(--color-pink-tint)' : 'color-mix(in srgb, var(--color-ink) 5%, transparent)',
                      }}
                    >
                      {w ? iconSvg(w.icon, w.iconColor || undefined) : null}
                    </div>
                  </div>
                );
              })}
            </div>
            {!program.workouts.length ? (
              <Text variant="body" tone="muted" as="p" style={{ margin: '10px 0 0' }}>
                Nothing on this week yet. Pick a week with workouts in it.
              </Text>
            ) : null}
          </div>
          <Checkbox switch checked={notes} onChange={setNotes} description="Your notes on each workout, as you wrote them.">
            Include workout notes
          </Checkbox>
          {s.canShowName ? (
            <Checkbox switch checked={showName} onChange={setShowName} description="Off, it says “Shared from Moonshot”.">
              Show my name
            </Checkbox>
          ) : null}
          {error ? (
            <Text variant="body" tone="danger" as="p" role="alert" style={{ margin: 0 }}>
              {error}
            </Text>
          ) : null}
        </div>
      ) : null}
      {mode === 'link' && share ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
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
            <Button type="secondary" size="md" onClick={copy} style={{ flex: '1 1 140px' }}>
              {copied ? <Check color="var(--color-pink-deep)" strokeWidth={2.4} size={16} /> : <Copy color="var(--color-pink-deep)" size={16} />}
              {copied ? 'Copied' : 'Copy link'}
            </Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info color="var(--color-muted)" size={16} />
            <Text variant="body" tone="muted" style={{ flex: 1 }}>
              {'“' + share.name + '”, shared ' + sharedOn(share.updatedAt) + ' · opened ' + plural(share.opens, 'time')}
            </Text>
          </div>
          <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
            It shows the week as it was when you shared it. Changing your workouts doesn’t change it.
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <Button type="neutral" ghost size="sm" onClick={() => setMode('form')} disabled={busy}>
              Update to this week
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
