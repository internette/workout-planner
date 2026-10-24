'use client';
// "Customize your experience", over the whole app: five questions, a step at a time, then a send-off. Its values and
// handlers come from setup/model.
import { useEffect, useRef, type ReactNode } from 'react';
import { ACCENTS, paletteFor } from '@moonshot/design-system/colors';
import { Button, Pressable } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Dialog } from '@moonshot/design-system/dialog';
import { Chip, ChipGroup, ChoiceChips } from '@moonshot/design-system/chip';
import { IconChoiceGroup } from '@moonshot/design-system/icon-choice-group';
import { Bike, Check, ChevronLeft, Dumbbell, Gem, LotusFlower, Lunge, Runner, Sparkle } from '@moonshot/design-system/icons';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { CheckCard, CheckGroup } from '@moonshot/design-system/option-card';
import { TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import { WeekStrip } from '@moonshot/design-system/week-strip';
import { Twinkles } from '@/frontend/components/Twinkles';
import { WeekdayToggles } from '@/frontend/components/WeekdayToggles';
import { RankGem } from '@/frontend/components/RankGem';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

type S = NonNullable<PlannerVals['setup']>;

const TRAIN_ICON = { lift: Dumbbell, ride: Bike, run: Runner, stretch: Lunge, yoga: LotusFlower };

function Medallion({ size }: { size: number }) {
  return (
    <div style={{ position: 'relative', width: size + 40, height: size + 40, margin: '0 auto', display: 'grid', placeItems: 'center' }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-full)', background: 'var(--gradient-gem-tint)' }} />
      <span style={{ position: 'relative', width: size, height: size, borderRadius: 'var(--radius-full)', background: 'var(--color-surface)', boxShadow: 'var(--elevation-raised)', display: 'grid', placeItems: 'center' }}>
        <Gem size={size * 0.46} />
      </span>
    </div>
  );
}

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <Text variant="micro" tone="accent" as="div">
    {children}
  </Text>
);
const Lead = ({ children }: { children: ReactNode }) => (
  <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
    {children}
  </Text>
);
const Label = ({ children, id }: { children: ReactNode; id?: string }) => (
  <Text variant="micro" tone="slate" as="div" id={id} style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>
    {children}
  </Text>
);

export function Setup({ s }: { s: S | null }) {
  const top = useRef<HTMLDivElement>(null);
  const step = s?.step;
  // Each step starts at its top, with its question read out.
  useEffect(() => {
    if (step == null) return;
    top.current?.parentElement?.scrollTo(0, 0);
    document.getElementById('setup-title')?.focus();
  }, [step]);
  if (!s) return null;

  const page = (body: ReactNode, foot: ReactNode) => (
    <Dialog open variant="fullscreen" closeButton={false} labelledBy="setup-title" onClose={s.step < s.steps ? s.useDefaults : s.toCalendar}>
      <div ref={top} style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: 'var(--space-5) var(--space-5) var(--space-7)', maxWidth: 'var(--layout-form-max)', margin: '0 auto' }}>
        {body}
        {foot}
      </div>
    </Dialog>
  );
  const heading = (text: string) => (
    <Text variant="title" as="h1" id="setup-title" tabIndex={-1} style={{ margin: 'var(--space-2) 0 0', outline: 'none' }}>
      {text}
    </Text>
  );
  // A question: Back, where they are (a gem a step), "Use defaults", the question, and Next.
  const question = (body: ReactNode, canNext: boolean, foot?: ReactNode) =>
    page(
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
          {s.back ? (
            <Button type="neutral" ghost size="sm" onClick={s.back} style={{ marginLeft: -10 }}>
              <ChevronLeft color="var(--color-muted)" size={16} />
              Back
            </Button>
          ) : (
            <span style={{ width: 64 }} />
          )}
          <span role="img" aria-label={'Step ' + (s.step + 1) + ' of ' + s.steps} style={{ display: 'flex', gap: 'var(--space-1)' }}>
            {Array.from({ length: s.steps }, (_, i) => (
              <RankGem key={i} fill={i <= s.step ? 'var(--gradient-gem)' : 'var(--color-line)'} />
            ))}
          </span>
          <Button type="neutral" ghost size="sm" onClick={s.useDefaults} disabled={s.busy} style={{ marginRight: -10 }}>
            Use defaults
          </Button>
        </div>
        <div style={{ flex: 1, marginTop: 'var(--space-5)' }}>{body}</div>
      </>,
      foot ?? (
        <Button type="primary" size="lg" fullWidth glow onClick={s.next} disabled={!canNext} style={{ marginTop: 'var(--space-6)' }}>
          Next
        </Button>
      ),
    );

  if (s.step === 0)
    return question(
      <>
        <Eyebrow>First transformation</Eyebrow>
        {heading('Who answers the call?')}
        <Lead>Your name goes on your rank and your Chronicle. Your color is the one your magic shows in.</Lead>
        <div style={{ position: 'relative', marginTop: 'var(--space-6)', padding: 'var(--space-5) var(--space-4)', borderRadius: 'var(--radius-xl)', background: 'var(--color-surface)', boxShadow: 'var(--elevation-raised)', textAlign: 'center', overflow: 'hidden' }}>
          <Twinkles />
          <Medallion size={76} />
          <Text variant="heading" as="div" style={{ marginTop: 'var(--space-2)' }}>
            {s.name.trim() || 'You'}
          </Text>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-2)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)', background: 'var(--color-pink-tint)' }}>
            <RankGem fill="var(--color-pink)" />
            <Text variant="strong" tone="accent">
              {s.rankName}
            </Text>
          </span>
        </div>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <TextField label="Your name" value={s.name} onChange={s.setName} maxLength={40} autoComplete="given-name" />
        </div>
        <Label id="setup-color">Your color</Label>
        <IconChoiceGroup
          labelledBy="setup-color"
          kind="swatch"
          shape="round"
          style={{ gap: 'var(--space-2)' }}
          options={ACCENTS.map((a) => ({ value: a.name, label: a.label, color: a.swatch, checkColor: paletteFor('light', a.name).surface }))}
          value={s.accent}
          onChange={s.setAccent}
        />
      </>,
      s.canNameNext,
    );

  if (s.step === 1)
    return question(
      <>
        <Eyebrow>Your magic</Eyebrow>
        {heading('What will you train?')}
        <Lead>Pick all that fit. You can do any of them later too.</Lead>
        <CheckGroup label="What you train">
          {s.trains.map((t) => {
            const Icon = TRAIN_ICON[t.value];
            return (
              <CheckCard
                key={t.value}
                surface="page"
                checked={t.on}
                onChange={t.toggle}
                icon={<IconTile as="span" size="md"><Icon color="var(--color-pink-deep)" size={22} /></IconTile>}
                title={t.title}
                description={t.line}
              />
            );
          })}
        </CheckGroup>
      </>,
      s.canTrainsNext,
    );

  if (s.step === 2)
    return question(
      <>
        <Eyebrow>Your tools</Eyebrow>
        {heading('What do you have to hand?')}
        <Lead>So the program Moonshot suggests is one you can actually do.</Lead>
        <ChipGroup label="What you have" style={{ marginTop: 'var(--space-5)' }}>
          {s.kit.map((k) => (
            <Chip key={k.label} tone="choice" size="md" surface="page" selected={k.on} aria-pressed={k.on} onClick={k.toggle} icon={k.on ? <Check strokeWidth={3} size={13} /> : undefined}>
              {k.label}
            </Chip>
          ))}
        </ChipGroup>
      </>,
      s.canKitNext,
    );

  if (s.step === 3)
    return question(
      <>
        <Eyebrow>Your rhythm</Eyebrow>
        {heading('When does training fit?')}
        <Lead>So your first program fits your week.</Lead>
        <Label>Days</Label>
        <WeekdayToggles label="Training days" days={s.days} onToggle={s.toggleDay} />
        <Label>About how long</Label>
        <ChoiceChips label="About how long" surface="page" options={s.minuteOptions} value={s.minutes} onChange={s.setMinutes} />
        <Card pad="sm" style={{ marginTop: 'var(--space-6)', background: 'var(--gradient-gem-tint)', boxShadow: 'none' }}>
          <Text variant="body" tone="slate" as="p" style={{ margin: 0 }}>
            {s.rhythm}
          </Text>
        </Card>
      </>,
      s.canDaysNext,
    );

  if (s.step === 4) {
    const g = s.suggestion;
    return question(
      g ? (
        <>
          <Eyebrow>Your first arc</Eyebrow>
          {heading('Here’s where to begin')}
          <Lead>Picked for what you have and your week. It goes on your calendar from the day you choose.</Lead>
          <Card style={{ marginTop: 'var(--space-5)' }}>
            <Text variant="micro" tone="slate" as="div">
              Built-in program
            </Text>
            <Text variant="heading" as="div" style={{ marginTop: 'var(--space-1)' }}>
              {g.name}
            </Text>
            <Text variant="body" tone="muted" as="div" style={{ marginTop: 'var(--space-1)' }}>
              {g.meta}
            </Text>
            {g.kit ? (
              <Text variant="body" tone="muted" as="div" style={{ marginTop: 'var(--space-1)' }}>
                {g.kit}
              </Text>
            ) : null}
            <WeekStrip
              style={{ marginTop: 'var(--space-4)' }}
              days={g.strip.map((d) => ({ letter: d.letter, label: d.label, icon: d.svg || undefined }))}
            />
            <div style={{ marginTop: 'var(--space-4)' }}>
              <TextField label="Starting" type="date" value={g.start} min={g.min} onChange={g.setStart} />
            </div>
          </Card>
        </>
      ) : (
        <>
          <Eyebrow>Your first quest</Eyebrow>
          {heading('Start with one workout')}
          <Lead>{s.noSuggestion}</Lead>
        </>
      ),
      true,
      <div style={{ marginTop: 'var(--space-6)' }}>
        <Button type="primary" size="lg" fullWidth glow onClick={g ? s.startProgram : s.planOne} disabled={s.busy}>
          {g ? 'Start this arc' : 'Plan your first workout'}
        </Button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-2)' }}>
          {g ? (
            <Button type="secondary" link size="sm" onClick={s.planOne} disabled={s.busy} style={{ minHeight: 44 }}>
              Plan one workout instead
            </Button>
          ) : null}
          <Button type="neutral" link size="sm" onClick={s.later} disabled={s.busy} style={{ minHeight: 44 }}>
            I’ll look around first
          </Button>
        </div>
      </div>,
    );
  }

  // The send-off.
  return page(
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', overflow: 'hidden' }}>
      <Twinkles />
      <span style={{ position: 'absolute', right: '20%', top: '18%', animation: 'twinkle 3s ease-in-out infinite' }}>
        <Sparkle size={14} color="var(--color-pink)" glow={5} />
      </span>
      <Medallion size={104} />
      <div style={{ marginTop: 'var(--space-2)' }}>
        <Eyebrow>Transformation begins</Eyebrow>
      </div>
      {heading(s.finaleName)}
      <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) auto 0', maxWidth: 320 }}>
        {s.finaleLine}
      </Text>
      {s.firstQuest ? (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginTop: 'var(--space-6)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-gem-tint)', textAlign: 'left' }}>
          <span style={{ width: 32, height: 32, flex: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)', boxShadow: 'var(--elevation-hairline)', display: 'grid', placeItems: 'center' }}>
            <Sparkle size={16} color="var(--color-pink)" />
          </span>
          <span>
            <Text variant="micro" tone="accent" as="div">
              {s.firstQuest.when}
            </Text>
            <Text variant="subheading" as="div" style={{ marginTop: 'var(--space-1)' }}>
              {s.firstQuest.title}
            </Text>
            <Text variant="body" tone="slate" as="div" style={{ marginTop: 'var(--space-1)' }}>
              {s.firstQuest.line}
            </Text>
          </span>
        </div>
      ) : null}
    </div>,
    <>
      <Button type="primary" size="lg" fullWidth glow onClick={s.takeTour} style={{ marginTop: 'var(--space-6)' }}>
        Take the tour
      </Button>
      <Button type="neutral" link size="sm" onClick={s.toCalendar} style={{ display: 'flex', margin: 'var(--space-2) auto 0', minHeight: 44 }}>
        Go to my calendar
      </Button>
    </>,
  );
}
