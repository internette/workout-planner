'use client';
// A shared program's public page: the program someone shared, read-only, for anyone with the link. Signed in, it can
// be copied into their own programs, to start from there. Nothing is copied until they choose to.
import { useEffect, useState } from 'react';
import { Button, Pressable } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Chip, ChipGroup } from '@moonshot/design-system/chip';
import { Dialog } from '@moonshot/design-system/dialog';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { Lockup } from '@moonshot/design-system/brand';
import { Text } from '@moonshot/design-system/typography';
import { Calendar, ChevronDown, Download, Repeat } from '@moonshot/design-system/icons';
import { savePdf } from '@/frontend/shared/programPdf';
import { ProviderButton } from '@/frontend/features/auth/ProviderButton';
import { BlockBar } from '@moonshot/design-system/block-bar';
import { PROVIDER_NAME, type Provider } from '@/shared/auth';
import { DOW3, DOWFULL } from '@/frontend/shared/constants';
import { exLine, minText, plural } from '@/frontend/shared/helpers';
import { iconSvg } from '@/frontend/shared/icons';
import { openProgram } from '@/frontend/shared/handoff';
import { kitChip } from '@/frontend/shared/equipment';
import { blockWorkouts, programEquipment, programWeeks, trainingDays, type SharedProgram, type SharedWorkout } from '@/frontend/shared/sharedProgram';

export interface ProgramPageProps {
  id: string;
  name: string | null;
  program: SharedProgram | null;
  signedIn: boolean;
  providers: Provider[];
}

const blockName = (b: { name: string }, i: number) => b.name || 'Block ' + (i + 1);

function WorkoutCard({ w, open, onToggle }: { w: SharedWorkout; open: boolean; onToggle: () => void }) {
  const detail =
    w.kind === 'ride'
      ? [w.ride?.dist ? w.ride.dist + ' mi' : '', minText(w.minutes), w.ride?.zone || ''].filter(Boolean).join(' · ')
      : plural(w.exercises.length, 'exercise') + ' · ~' + minText(w.minutes);
  return (
    <Card pad="sm">
      <Pressable
        aria-expanded={open}
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%', minHeight: '44px'}}
      >
        <IconTile as="span" size="xs" variant="flat">
          {iconSvg(w.icon, w.iconColor || undefined)}
        </IconTile>
        <span style={{ flex: 1, minWidth: 0 }}>
          <Text variant="body" weight="semibold" as="span" style={{ display: 'block' }}>
            {w.name}
          </Text>
          <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
            {detail}
          </Text>
        </span>
        <ChevronDown color="var(--color-muted)" size={16} style={{ flex: 'none', transform: open ? 'rotate(180deg)' : undefined }} />
      </Pressable>
      {open ? (
        <div style={{ margin: '10px 0 4px 50px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {w.exercises.map((e, i) => (
            <div key={i}>
              <Text variant="body" as="div">
                {e.name}
              </Text>
              <Text variant="body" tone="muted" as="div">
                {exLine(e, true)}
              </Text>
            </div>
          ))}
          {w.notes ? (
            <Text variant="body" tone="slate" as="p" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {w.notes}
            </Text>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

export function ProgramPage({ id, name, program, signedIn, providers }: ProgramPageProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [signIn, setSignIn] = useState(false);
  const [busyProvider, setBusyProvider] = useState<Provider | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState('');
  // The PDF maker loads in the background, so making one is quick enough to hand to the share sheet.
  useEffect(() => {
    if (program) import('pdf-lib').catch(() => undefined);
  }, [program]);

  if (!program || !name) {
    return (
      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 16px 48px' }}>
        <Lockup />
        <Text variant="title" as="h1" style={{ margin: '32px 0 0' }}>
          This link doesn’t open anything
        </Text>
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
          Whoever shared it may have stopped sharing, or the link may be missing a letter. Ask them for it again.
        </Text>
        <Button type="secondary" size="md" onClick={() => window.location.assign('/calendar')} style={{ marginTop: 'var(--space-5)' }}>
          Open Moonshot
        </Button>
      </main>
    );
  }

  const kit = programEquipment(program);
  const weeks = programWeeks(program);
  const several = program.blocks.length > 1;

  // The data layer loads only once copying is asked for: someone who just looks never loads it.
  const copy = async () => {
    setBusy(true);
    setError('');
    try {
      const db = await import('@/frontend/data/plannerData');
      const programId = await db.copySharedProgram(name, program);
      openProgram(programId, 'Copied “' + name + '” to your programs. Start it to put it on your calendar.');
    } catch (e: any) {
      setError('Couldn’t copy it: ' + String(e?.message || e));
      setBusy(false);
    }
  };

  return (
    <main style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 16px 160px' }}>
      <a href={signedIn ? '/calendar' : '/welcome'} aria-label="Moonshot" style={{ display: 'inline-flex', textDecoration: 'none' }}>
        <Lockup />
      </a>
      <div style={{ marginTop: 'var(--space-6)' }}>
        <Text variant="micro" tone="slate" as="div">
          {program.by ? 'Shared by ' + program.by : 'Shared program'}
        </Text>
        <Text variant="title" as="h1" style={{ margin: 'var(--space-1) 0 0' }}>
          {name}
        </Text>
      </div>
      <ChipGroup style={{ marginTop: '14px' }}>
        <Chip icon={<Calendar color="var(--color-muted)" size={15} />}>{plural(weeks, 'week')}</Chip>
        <Chip icon={<Repeat color="var(--color-muted)" size={15} />}>{plural(trainingDays(program), 'day')} a week</Chip>
        {kitChip(kit) ? <Chip>{kitChip(kit)}</Chip> : null}
      </ChipGroup>
      <Button
        type="secondary"
        size="sm"
        disabled={pdfBusy}
        onClick={async () => {
          setPdfBusy(true);
          setPdfError('');
          try {
            await savePdf(name, program);
          } catch (e: any) {
            setPdfError('Couldn’t make the PDF: ' + String(e?.message || e));
          } finally {
            setPdfBusy(false);
          }
        }}
        style={{ marginTop: '14px', whiteSpace: 'nowrap' }}
      >
        <Download color="var(--color-pink-deep)" size={16} />
        {pdfBusy ? 'Making PDF…' : 'Save as PDF'}
      </Button>
      {pdfError ? (
        <Text variant="body" tone="danger" as="p" role="alert" style={{ margin: 'var(--space-2) 0 0' }}>
          {pdfError}
        </Text>
      ) : null}
      {several ? (
        <div style={{ marginTop: '18px' }}>
          <BlockBar blocks={program.blocks.map((b, i) => ({ name: blockName(b, i), weeks: b.weeks }))} />
        </div>
      ) : null}
      {program.blocks.map((b, bi) => {
        const before = program.blocks.slice(0, bi).reduce((s, x) => s + x.weeks, 0);
        return (
          <section key={bi} aria-label={several ? blockName(b, bi) : 'The week'} style={{ marginTop: '22px' }}>
            {several || b.weeks > 1 ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: '6px' }}>
                <Text variant="subheading" as="h2" style={{ margin: 0, flex: 1 }}>
                  {several ? blockName(b, bi) : 'Every week'}
                </Text>
                <Text variant="body" tone="muted">
                  {b.weeks === 1 ? 'Week ' + (before + 1) : 'Weeks ' + (before + 1) + '–' + (before + b.weeks)}
                </Text>
              </div>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {b.days.map((list, d) =>
                list.length ? (
                  <div key={d} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <Text variant="micro" tone="slate" as="h3" style={{ margin: 'var(--space-2) 0 0' }}>
                      {DOWFULL[d]}
                    </Text>
                    {list.map((ix) => {
                      const key = bi + ':' + d + ':' + ix;
                      return <WorkoutCard key={key} w={program.workouts[ix]} open={!!open[key]} onToggle={() => setOpen({ ...open, [key]: !open[key] })} />;
                    })}
                  </div>
                ) : (
                  <div key={d} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', padding: 'var(--space-1) 0' }}>
                    <Text variant="micro" tone="muted" as="h3" style={{ margin: 0, width: '40px' }}>
                      {DOW3[d]}
                    </Text>
                    <Text variant="body" tone="muted">
                      Rest
                    </Text>
                  </div>
                ),
              )}
            </div>
          </section>
        );
      })}

      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '14px 16px calc(16px + env(safe-area-inset-bottom))',
          background: 'var(--color-surface)',
          boxShadow: '0 -1px 0 color-mix(in srgb, var(--color-ink) 10%, transparent)',
        }}
      >
        <div style={{ maxWidth: '528px', margin: '0 auto' }}>
          {signedIn ? (
            <Button type="primary" size="lg" fullWidth onClick={() => setCopyOpen(true)}>
              Copy to my programs
            </Button>
          ) : (
            <>
              <Button type="primary" size="lg" fullWidth onClick={() => setSignIn(true)}>
                Sign in to copy it
              </Button>
              <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0', textAlign: 'center' }}>
                New to Moonshot? Signing in makes your account.
              </Text>
            </>
          )}
        </div>
      </div>

      <Dialog open={signIn} onClose={() => setSignIn(false)} title="Sign in to copy it" variant="sheet">
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
          You’ll come back here, and nothing is copied until you choose to.
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'var(--space-4)' }}>
          {providers.length ? (
            providers.map((p) => (
              <ProviderButton key={p} provider={p} returnTo={'/p/' + id} onClick={() => setBusyProvider(p)} busy={busyProvider === p} disabled={!!busyProvider}>
                {busyProvider === p ? `Opening ${PROVIDER_NAME[p]}…` : `Continue with ${PROVIDER_NAME[p]}`}
              </ProviderButton>
            ))
          ) : (
            <Text variant="body" as="p" style={{ margin: 0 }}>
              Sign-in is not set up yet.
            </Text>
          )}
        </div>
      </Dialog>

      <Dialog
        open={copyOpen}
        onClose={() => !busy && setCopyOpen(false)}
        title={'Copy ' + name}
        variant="sheet"
        actions={
          <>
            <Button type="neutral" ghost size="md" onClick={() => setCopyOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="primary" size="md" onClick={copy} disabled={busy}>
              {busy ? 'Copying…' : 'Copy'}
            </Button>
          </>
        }
      >
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-3) 0 0' }}>
          Adds it to your programs ({plural(weeks, 'week')}
          {several ? ', ' + plural(program.blocks.length, 'block') : ''}, {plural(new Set(program.blocks.flatMap((b) => blockWorkouts(b))).size, 'workout')}), as yours to change. Start it from there to put it on your calendar.
        </Text>
        {error ? (
          <Text variant="body" tone="danger" as="p" role="alert" style={{ margin: 'var(--space-3) 0 0' }}>
            {error}
          </Text>
        ) : null}
      </Dialog>
    </main>
  );
}
