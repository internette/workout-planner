'use client';
// The app's tour: a welcome that offers it (or customizing first, or neither), seven stops lit up on the calendar and
// the nav, and a send-off. Each stop dims the page but the thing it's about, rings that in the accent, and explains it
// in a bubble beside it. Tapping what's lit up uses it (and ends the tour); a stop whose thing isn't on screen (a
// calendar that already has workouts has no "Plan your first workout") is passed over.
import { useEffect, useState, type CSSProperties } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import { Calendar, Gem, Sliders, Sparkle } from '@moonshot/design-system/icons';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { LinkRow } from '@/frontend/components/LinkRow';
import { Text } from '@moonshot/design-system/typography';
import { Twinkles } from '@/frontend/components/Twinkles';
import { RankGem } from '@/frontend/components/RankGem';

type Stop = { find: () => Element | null; eyebrow: string; title: string; body: string };

const buttonWith = (text: RegExp) => Array.from(document.querySelectorAll('button')).find((b) => text.test(b.textContent?.trim() || '')) || null;
// The nav's link to a place: the tab bar's on a phone, the sidebar's on a wide screen (whichever is showing).
const tab = (href: string) =>
  Array.from(document.querySelectorAll('nav[aria-label="Main"] a[href="' + href + '"]')).find((a) => a.getBoundingClientRect().width > 0) || null;

export const STOPS: Stop[] = [
  {
    find: () => buttonWith(/^Week$/)?.parentElement ?? null,
    eyebrow: 'Your calendar',
    title: 'Day, week or month',
    body: 'See one day up close, your week, or the whole month. Every day you train gets a quest.',
  },
  {
    find: () => buttonWith(/^\+?\s*(Plan your first workout|Add workout)$/),
    eyebrow: 'Plan',
    title: 'Put a workout on a day',
    body: 'A lift or a ride, once or every week. That day gets a quest.',
  },
  {
    find: () => buttonWith(/^Start a program$/),
    eyebrow: 'Or follow an arc',
    title: 'Start a program',
    body: 'Ready-made programs fill weeks of your calendar at once.',
  },
  { find: () => tab('/chronicle'), eyebrow: 'Chronicle', title: 'Write how it felt', body: 'After a session: a mood, an effort, a sentence. Read it all back later.' },
  { find: () => tab('/spellbook'), eyebrow: 'Spellbook', title: 'Your workouts and exercises', body: 'Yours and the built-in ones, and programs to follow.' },
  { find: () => tab('/progress'), eyebrow: 'Progress', title: 'How far you’ve come', body: 'Your streak, this week, and your personal bests.' },
  { find: () => tab('/profile'), eyebrow: 'Profile', title: 'Your rank', body: 'Every exercise you clear moves it on. Settings are behind the gear.' },
];

const SCRIM = 'color-mix(in srgb, var(--color-ink) var(--alpha-5), transparent)';
const CARD: CSSProperties = {
  position: 'relative',
  padding: 'var(--space-4) var(--space-4) var(--space-4)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--color-surface)',
  boxShadow: 'var(--elevation-overlay)',
  overflow: 'hidden',
};

export interface TourProps {
  /** 0 is the welcome, 1 to 7 the stops, 8 the send-off; null is closed. Settings starts it at 1. */
  step: number | null;
  /** What to call them in the welcome, or '' for none. */
  name: string;
  onStep: (step: number) => void;
  /** Ends it, whichever way: skipped, finished, or by tapping what was lit up. */
  onEnd: () => void;
  /** The welcome's first choice: "Customize your experience". */
  onCustomize: () => void;
  /** Nothing on their calendar yet: the send-off offers to plan their first workout. */
  fresh: boolean;
  /** The send-off's button, when `fresh`. */
  onPlan: () => void;
}

export function Tour({ step, name, onStep, onEnd, onCustomize, fresh, onPlan }: TourProps) {
  const total = STOPS.length;
  const stop = step != null && step >= 1 && step <= total ? STOPS[step - 1] : null;
  const [rect, setRect] = useState<DOMRect | null>(null);
  // Where the stop's thing is, followed as the page settles or scrolls; tapping it ends the tour.
  useEffect(() => {
    if (!stop) return setRect(null);
    const el = stop.find();
    if (el && 'scrollIntoView' in el) el.scrollIntoView({ block: 'nearest' });
    const tick = () => setRect(stop.find()?.getBoundingClientRect() ?? null);
    tick();
    const id = setInterval(tick, 250);
    const tapped = () => onEnd();
    el?.addEventListener('click', tapped);
    return () => {
      clearInterval(id);
      el?.removeEventListener('click', tapped);
    };
  }, [stop, onEnd]);
  // Escape leaves it.
  useEffect(() => {
    if (step == null) return;
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onEnd();
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [step, onEnd]);
  if (step == null) return null;

  // To the next stop that's on screen, either way; past the last, the send-off, and before the first, the welcome.
  const go = (from: number, dir: 1 | -1) => {
    let n = from + dir;
    while (n >= 1 && n <= total && !STOPS[n - 1].find()) n += dir;
    onStep(Math.max(0, Math.min(total + 1, n)));
  };

  if (step === 0)
    return (
      <Dialog open size="md" closeButton={false} labelledBy="tour-title" onClose={onEnd}>
          <Twinkles />
          <div style={{ textAlign: 'center' }}>
            <span style={{ width: 72, height: 72, margin: '0 auto', borderRadius: 'var(--radius-full)', background: 'var(--gradient-gem-tint)', display: 'grid', placeItems: 'center' }}>
              <Gem size={34} />
            </span>
            <Text variant="micro" tone="accent" as="div" style={{ marginTop: 'var(--space-4)' }}>
              {name ? 'Welcome, ' + name : 'Welcome'}
            </Text>
            <Text variant="heading" as="h2" id="tour-title" style={{ margin: 'var(--space-2) 0 0' }}>
              How would you like to begin?
            </Text>
          </div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
            <LinkRow
              leading={<IconTile as="span" size="sm"><Sliders color="var(--color-pink-deep)" size={18} /></IconTile>}
              title="Customize your experience"
              detail="Your name, color, what you train and when."
              onClick={onCustomize}
            />
            <LinkRow
              leading={<IconTile as="span" size="sm"><Sparkle color="var(--color-pink-deep)" size={18} /></IconTile>}
              title="Take the tour"
              detail="Seven stops, about a minute."
              onClick={() => go(0, 1)}
            />
            <LinkRow
              leading={<IconTile as="span" size="sm"><Calendar color="var(--color-pink-deep)" size={18} /></IconTile>}
              title="Go straight to the app"
              detail="Start on the defaults."
              onClick={onEnd}
            />
          </div>
          <Text variant="small" tone="muted" as="p" style={{ position: 'relative', margin: 'var(--space-3) 0 0', textAlign: 'center' }}>
            Both of these are in Settings later.
          </Text>
      </Dialog>
    );

  // The send-off.
  if (step > total)
    return (
      <Dialog open closeButton={false} labelledBy="tour-title" onClose={onEnd}>
        <div style={{ textAlign: 'center' }}>
          <Twinkles />
          <span style={{ width: 72, height: 72, margin: '0 auto', borderRadius: 'var(--radius-full)', background: 'var(--gradient-gem-tint)', display: 'grid', placeItems: 'center' }}>
            <Gem size={34} />
          </span>
          <Text variant="micro" tone="accent" as="div" style={{ marginTop: 'var(--space-4)' }}>
            You’re ready
          </Text>
          <Text variant="heading" as="h2" id="tour-title" style={{ margin: 'var(--space-2) 0 0' }}>
            The call is yours to answer
          </Text>
          <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
            {fresh ? 'Plan your first workout and that day gets a quest. ' : ''}You can take this tour again from Settings.
          </Text>
          {fresh ? (
            <>
              <Button type="primary" size="lg" fullWidth glow onClick={onPlan} style={{ marginTop: 'var(--space-5)' }}>
                Plan your first workout
              </Button>
              <Button type="neutral" link size="sm" onClick={onEnd} style={{ display: 'flex', margin: 'var(--space-2) auto 0', minHeight: 44 }}>
                Done
              </Button>
            </>
          ) : (
            <Button type="primary" size="lg" fullWidth glow onClick={onEnd} style={{ marginTop: 'var(--space-5)' }}>
              Done
            </Button>
          )}
        </div>
      </Dialog>
    );

  // A stop: the bubble goes below its thing in the top half of the screen, above it in the bottom half.
  const pad = 6;
  const below = rect ? rect.top + rect.height / 2 < window.innerHeight / 2 : true;
  // Across a phone, the bubble spans the screen; wider, it's 420 px, under its thing as near as fits. Its arrow points
  // at the middle of the thing, kept off the bubble's rounded corners.
  const width = Math.min(420, window.innerWidth - 32);
  const left = rect ? Math.min(Math.max(rect.left + rect.width / 2 - width / 2, 16), window.innerWidth - 16 - width) : (window.innerWidth - width) / 2;
  const arrowX = rect ? Math.min(Math.max(rect.left + rect.width / 2 - left, 28), width - 28) : 0;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, pointerEvents: 'none' }}>
      {rect ? (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: rect.left - pad,
            top: rect.top - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 0 0 3px var(--color-pink), 0 0 24px 4px color-mix(in srgb, var(--color-pink) var(--alpha-4), transparent), 0 0 0 100vmax ' + SCRIM,
            transition: 'left 260ms var(--ease-standard), top 260ms var(--ease-standard), width 260ms var(--ease-standard), height 260ms var(--ease-standard)',
          }}
        />
      ) : (
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, background: SCRIM }} />
      )}
      <div
        style={{
          position: 'fixed',
          left,
          width,
          top: rect && below ? rect.bottom + pad + 14 : undefined,
          bottom: rect && !below ? window.innerHeight - rect.top + pad + 14 : rect ? undefined : 24,
          pointerEvents: 'auto',
        }}
      >
        {rect ? (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: arrowX - 8,
              [below ? 'top' : 'bottom']: -8,
              width: 16,
              height: 16,
              background: 'var(--color-surface)',
              transform: 'rotate(45deg)',
            }}
          />
        ) : null}
        <div role="dialog" aria-labelledby="tour-stop" aria-describedby="tour-body" style={CARD}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="micro" tone="accent">
              {stop!.eyebrow}
            </Text>
            <span role="img" aria-label={'Stop ' + step + ' of ' + total} style={{ display: 'flex', gap: 'var(--space-1)' }}>
              {STOPS.map((_, i) => (
                <RankGem key={i} fill={i < step ? 'var(--gradient-gem)' : 'var(--color-line)'} />
              ))}
            </span>
          </div>
          <Text variant="subheading" as="h2" id="tour-stop" style={{ margin: 'var(--space-2) 0 0' }}>
            {stop!.title}
          </Text>
          <Text variant="body" tone="slate" as="p" id="tour-body" style={{ margin: 'var(--space-1) 0 0' }}>
            {stop!.body}
          </Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            <Button type="neutral" link size="sm" onClick={onEnd} style={{ marginRight: 'auto', minHeight: 44 }}>
              Skip tour
            </Button>
            {step > 1 ? (
              <Button type="secondary" size="sm" onClick={() => go(step, -1)}>
                Back
              </Button>
            ) : null}
            <Button type="primary" size="sm" onClick={() => go(step, 1)}>
              {step === total ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
