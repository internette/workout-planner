'use client';
// A shared program's public page: the week someone shared, read-only, for anyone with the link. Signed in, it can be
// copied: into the Spellbook, and on the calendar too if they choose. Nothing is copied until they do.
import { useState } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Chip, ChipGroup } from '@moonshot/design-system/chip';
import { Dialog } from '@moonshot/design-system/dialog';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { Lockup } from '@moonshot/design-system/brand';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import { ChevronDown, Clock, Repeat } from '@moonshot/design-system/icons';
import { ProviderButton } from '@/frontend/features/auth/ProviderButton';
import { PROVIDER_NAME, type Provider } from '@/shared/auth';
import { DOW3, DOWFULL, MON3 } from '@/frontend/shared/constants';
import { exLine, isoOf, minText, plural } from '@/frontend/shared/helpers';
import { iconSvg } from '@/frontend/shared/icons';
import { REPEAT_WEEKS } from '@/frontend/shared/schedule';
import { openPlanner } from '@/frontend/shared/handoff';
import { programEquipment, trainingDays, weekMinutes, type SharedProgram, type SharedWorkout } from '@/frontend/shared/sharedProgram';

export interface ProgramPageProps {
  id: string;
  name: string | null;
  program: SharedProgram | null;
  signedIn: boolean;
  providers: Provider[];
}

const WEEK_OPTIONS = [...REPEAT_WEEKS].reverse().map((w) => ({ value: String(w), label: w + ' weeks' }));

// The next Sunday after today: a week starts on Sunday here, as on the calendar.
const nextWeekStart = (today: Date) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()));
const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

function WorkoutCard({ w, open, onToggle }: { w: SharedWorkout; open: boolean; onToggle: () => void }) {
  const detail = w.kind === 'ride'
    ? [w.ride?.dist ? w.ride.dist + ' mi' : '', minText(w.minutes), w.ride?.zone || ''].filter(Boolean).join(' · ')
    : plural(w.exercises.length, 'exercise') + ' · ~' + minText(w.minutes);
  return (
    <Card pad="sm">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', minHeight: '44px', padding: 0, border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
      >
        <IconTile as="span" size="xs" variant="flat">{iconSvg(w.icon, w.iconColor || undefined)}</IconTile>
        <span style={{ flex: 1, minWidth: 0 }}>
          <Text variant="body" weight="semibold" as="span" style={{ display: 'block' }}>{w.name}</Text>
          <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>{detail}</Text>
        </span>
        <ChevronDown color="var(--color-muted)" size={16} style={{ flex: 'none', transform: open ? 'rotate(180deg)' : undefined }} />
      </button>
      {open ? (
        <div style={{ margin: '10px 0 4px 50px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {w.exercises.map((e, i) => (
            <div key={i}>
              <Text variant="body" as="div">{e.name}</Text>
              <Text variant="body" tone="muted" as="div">{exLine(e, true)}</Text>
            </div>
          ))}
          {w.notes ? (
            <Text variant="body" tone="slate" as="p" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{w.notes}</Text>
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
  const [names, setNames] = useState<string[] | null>(null);
  const [onCalendar, setOnCalendar] = useState(true);
  const [start, setStart] = useState(() => isoOf(nextWeekStart(new Date())));
  const [weeks, setWeeks] = useState('8');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!program || !name) {
    return (
      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 16px 48px' }}>
        <Lockup />
        <Text variant="title" as="h1" style={{ margin: '32px 0 0' }}>This link doesn’t open anything</Text>
        <Text variant="body" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
          Whoever shared it may have stopped sharing, or the link may be missing a letter. Ask them for it again.
        </Text>
        <Button type="secondary" size="md" onClick={() => window.location.assign('/calendar')} style={{ marginTop: '20px' }}>
          Open Moonshot
        </Button>
      </main>
    );
  }

  const today = new Date();
  const todayIso = isoOf(today);
  const kit = programEquipment(program);
  const count = program.workouts.length;

  // The data layer loads only once copying is asked for: someone who just looks never loads it.
  const startCopy = async () => {
    setCopyOpen(true);
    setError('');
    try {
      const db = await import('@/frontend/data/plannerData');
      setNames(await db.copyNames(program));
    } catch {
      setNames(null);
    }
  };
  const copy = async () => {
    setBusy(true);
    setError('');
    try {
      const db = await import('@/frontend/data/plannerData');
      const from = fromIso(start < todayIso ? todayIso : start);
      const calendar = onCalendar ? { start: from, weeks: Number(weeks) } : null;
      const { first } = await db.copyProgram(program, calendar, new Date(today.getFullYear(), today.getMonth(), today.getDate()));
      const what = '“' + name + '”: ' + plural(count, 'workout') + ' in your Spellbook';
      if (calendar && first) {
        const at = fromIso(first);
        openPlanner(at, 'Copied ' + what + ', on your calendar for ' + weeks + ' weeks from ' + MON3[from.getMonth()] + ' ' + from.getDate() + '.');
      } else openPlanner(null, 'Copied ' + what + '.');
    } catch (e: any) {
      setError('Couldn’t copy it: ' + String(e?.message || e));
      setBusy(false);
    }
  };

  const renamed = names ? program.workouts.map((w, i) => [w.name, names[i]]).filter(([a, b]) => a !== b) : [];

  return (
    <main style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 16px 160px' }}>
      <a href={signedIn ? '/calendar' : '/welcome'} aria-label="Moonshot" style={{ display: 'inline-flex', textDecoration: 'none' }}>
        <Lockup />
      </a>
      <div style={{ marginTop: '24px' }}>
        <Text variant="micro" tone="slate" as="div">
          {program.by ? 'Shared by ' + program.by : 'Shared program'}
        </Text>
        <Text variant="title" as="h1" style={{ margin: '4px 0 0' }}>{name}</Text>
      </div>
      <ChipGroup style={{ marginTop: '14px' }}>
        <Chip icon={<Repeat color="var(--color-muted)" size={15} />}>{plural(trainingDays(program), 'day')} a week</Chip>
        <Chip icon={<Clock color="var(--color-muted)" size={15} />}>{'~' + minText(weekMinutes(program)) + ' a week'}</Chip>
        {kit.length ? <Chip>{kit.length <= 2 ? kit.join(', ') : kit.length + ' pieces of equipment'}</Chip> : <Chip>No equipment</Chip>}
      </ChipGroup>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
        {program.days.map((list, d) => (
          <section key={d} aria-label={DOWFULL[d]} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {list.length ? (
              <>
                <Text variant="micro" tone="slate" as="h2" style={{ margin: '8px 0 0' }}>{DOWFULL[d]}</Text>
                {list.map((ix) => {
                  const key = d + ':' + ix;
                  return (
                    <WorkoutCard key={key} w={program.workouts[ix]} open={!!open[key]} onToggle={() => setOpen({ ...open, [key]: !open[key] })} />
                  );
                })}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', padding: '4px 0' }}>
                <Text variant="micro" tone="muted" as="h2" style={{ margin: 0, width: '40px' }}>{DOW3[d]}</Text>
                <Text variant="body" tone="muted">Rest</Text>
              </div>
            )}
          </section>
        ))}
      </div>

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
            <Button type="primary" size="lg" fullWidth onClick={startCopy}>Copy to my Spellbook</Button>
          ) : (
            <>
              <Button type="primary" size="lg" fullWidth onClick={() => setSignIn(true)}>Sign in to copy it</Button>
              <Text variant="body" tone="muted" as="p" style={{ margin: '8px 0 0', textAlign: 'center' }}>
                New to Moonshot? Signing in makes your account.
              </Text>
            </>
          )}
        </div>
      </div>

      <Dialog open={signIn} onClose={() => setSignIn(false)} title="Sign in to copy it" sheet>
        <Text variant="body" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
          You’ll come back here, and nothing is copied until you choose to.
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
          {providers.length ? (
            providers.map((p) => (
              <ProviderButton key={p} provider={p} returnTo={'/p/' + id} onClick={() => setBusyProvider(p)} busy={busyProvider === p} disabled={!!busyProvider}>
                {busyProvider === p ? `Opening ${PROVIDER_NAME[p]}…` : `Continue with ${PROVIDER_NAME[p]}`}
              </ProviderButton>
            ))
          ) : (
            <Text variant="body" as="p" style={{ margin: 0 }}>Sign-in is not set up yet.</Text>
          )}
        </div>
      </Dialog>

      <Dialog
        open={copyOpen}
        onClose={() => !busy && setCopyOpen(false)}
        title={'Copy ' + name}
        sheet
        actions={
          <>
            <Button type="neutral" ghost size="md" onClick={() => setCopyOpen(false)} disabled={busy}>Cancel</Button>
            <Button type="primary" size="md" onClick={copy} disabled={busy}>{busy ? 'Copying…' : 'Copy'}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
          <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
            Adds its {plural(count, 'workout')} to your Spellbook, as your own to change.
          </Text>
          {renamed.map(([from, to]) => (
            <Text key={from} variant="body" tone="muted" as="p" style={{ margin: 0 }}>
              You already have “{from}”, so the copy is called “{to}”.
            </Text>
          ))}
          <Checkbox switch checked={onCalendar} onChange={setOnCalendar}>Also put it on my calendar</Checkbox>
          {onCalendar ? (
            <>
              <TextField label="Starting" type="date" value={start} min={todayIso} onChange={(e) => setStart(e.target.value)} />
              <div>
                <Text variant="micro" tone="slate" as="div" aria-hidden="true" style={{ marginBottom: '8px' }}>For</Text>
                <SegmentedControl label="For how long" options={WEEK_OPTIONS} value={weeks} onChange={setWeeks} fullWidth equalWidth />
              </div>
            </>
          ) : null}
          {error ? (
            <Text variant="body" tone="danger" as="p" role="alert" style={{ margin: 0 }}>{error}</Text>
          ) : null}
        </div>
      </Dialog>
    </main>
  );
}
