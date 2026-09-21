'use client';

import { useRef, useState } from 'react';
import { Lockup } from '@/components/brand/Lockup';
import { Button } from '@/components/ui/buttons';
import { Card } from '@/components/ui/card';
import { Book, Calendar, Check, ChevronRight, Gem, Sparkle } from '@/components/ui/icons';
import { colors } from '@/components/ui/colors';
import { Text } from '@/components/ui/typography';
import { RANKS, RANK_STEPS } from '@/components/planner/constants';
import { PROVIDER_NAME, type Provider } from '@/lib/auth';
import { ProviderButton } from './ProviderButton';
import styles from './landing.module.css';

// A trail of stars that tapers off and wanders up and down: rose, periwinkle, cyan, repeating. Each one twinkles on
// its own slower clock, so the trail never pulses in step.
const TRAIL_COLORS = [colors.pink, colors.periwinkle, colors.teal];
const TRAIL_WANDER = [-9, 3, -4, 7, -7, 1, -2, 5, -5]; // px
const TRAIL_SIZE = [11, 8, 9, 6, 7, 5, 6, 4, 3]; // px
function SparkleTrail({ count = 7 }: { count?: number }) {
  return (
    <span className={styles.sparkles} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={styles.sparkle} style={{ transform: `translateY(${TRAIL_WANDER[i]}px)` }}>
          <Sparkle
            size={TRAIL_SIZE[i]}
            color={TRAIL_COLORS[i % TRAIL_COLORS.length]}
            style={{ flex: 'none', animation: `twinkle ${3.4 + i * 0.4}s ease-in-out ${i * 0.25}s infinite` }}
          />
        </span>
      ))}
    </span>
  );
}

// ---- the auth card: two modes that differ only in wording, since both are the same OAuth call
function AuthCard({ cardRef, configured, returned }: { cardRef: React.RefObject<HTMLDivElement>; configured: boolean; returned?: string }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busy, setBusy] = useState<Provider | null>(null);
  // What the server reported when Auth0 sent the person back (see lib/auth0.ts), until they try again.
  const [error, setError] = useState<string | null>(
    returned === 'cancelled' ? 'Sign-in was cancelled. Try again when you are ready.' : returned ? 'Sign-in did not finish. Try again.' : null,
  );
  const signingUp = mode === 'signup';

  // The button is a link to the server's login route. Here we only add the pending state, or say plainly that
  // sign-in is not set up.
  const go = (provider: Provider) => (e: React.MouseEvent) => {
    if (!configured) {
      e.preventDefault();
      setError('Sign-in is not set up yet.');
      return;
    }
    setError(null);
    setBusy(provider);
  };

  return (
    <div ref={cardRef}>
      <Card pad="lg" elevation="overlay" className={styles.authCard} style={{ borderRadius: 24 }}>
        <Text variant="eyebrow" tone="accent" as="div">
          {signingUp ? 'FIRST TRANSFORMATION' : 'WELCOME BACK'}
        </Text>
        <Text variant="heading" as="h2" className={styles.authTitle} style={{ margin: '8px 0 0' }}>
          {signingUp ? 'Begin your ritual' : 'Step back through'}
        </Text>
        <Text variant="body" tone="muted" as="p" className={styles.authNote} style={{ margin: '8px 0 0' }}>
          {signingUp ? 'Two taps, and tomorrow already has a quest waiting on it.' : 'Your streak held the line while you were away.'}
        </Text>

        <div className={styles.providers}>
          {(['google', 'apple'] as const).map((p) => (
            <ProviderButton key={p} provider={p} onClick={go(p)} busy={busy === p} disabled={!!busy}>
              {busy === p ? `Opening ${PROVIDER_NAME[p]}…` : `Continue with ${PROVIDER_NAME[p]}`}
            </ProviderButton>
          ))}
        </div>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <Text variant="small" tone="subtle" as="p" className={styles.legal} style={{ lineHeight: 'var(--leading-snug)' }}>
          No password to lose. {signingUp ? 'Continuing accepts the terms and the privacy policy.' : 'We only ever read your name and email.'}
        </Text>

        <div className={styles.toggle}>
          <Text variant="body" tone="muted" as="span" style={{ lineHeight: 'inherit' }}>
            {signingUp ? 'Already sworn in?' : 'First time here?'}
          </Text>
          <button type="button" className={styles.toggleLink} onClick={() => setMode(signingUp ? 'signin' : 'signup')}>
            {signingUp ? 'Step back through' : 'Begin your ritual'}
          </button>
        </div>
      </Card>
    </div>
  );
}

const STEPS = [
  { icon: Calendar, title: 'Set the week', body: 'Plan lifts and rides against the calendar. Anything that works, repeat it weekly and stop deciding.' },
  { icon: Check, title: 'Clear the day', body: 'Tick each exercise as you finish it. The bar fills, the streak holds, the quest resolves in its own words.' },
  { icon: Book, title: 'Seal the chronicle', body: 'Log how it felt while it is still warm — a mood, an effort, a sentence. Read any of it back later.' },
];

// The first three rungs of the real ladder, with their real thresholds.
const LADDER = RANKS.slice(0, 3).map((r, i) => ({
  name: r.name,
  gem: r.gem,
  need: i === 0 ? 'Start' : RANK_STEPS[i - 1] * 100 + ' XP',
}));

const Section = ({ children, last }: { children: React.ReactNode; last?: boolean }) => (
  <section className={`${styles.band} ${styles.sectionGap}`} style={last ? { paddingBottom: 64 } : undefined}>
    <div className={styles.inner}>{children}</div>
  </section>
);

/** Explains what Moonshot is, and lets a returning person in within one screen height. */
export function LandingPage({ configured, returned }: { configured: boolean; returned?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const focusCard = () => cardRef.current?.querySelector<HTMLElement>('a')?.focus();
  // No provider is chosen yet, so the closing button takes the person back to the card rather than signing in.
  const toCard = () => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    focusCard();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <Lockup height={28} />
          <Button type="neutral" ghost size="sm" onClick={focusCard} className={styles.signIn}>
            Sign in
          </Button>
        </div>
      </header>

      <main>
        <section className={`${styles.band} ${styles.hero}`}>
          <div className={styles.inner}>
            <div className={styles.heroText}>
              <span className={styles.eyebrowRow}>
                <Text variant="eyebrow" tone="accent">
                  THE WORK IS THE TRANSFORMATION
                </Text>
                <SparkleTrail />
              </span>
              <Text variant="hero" as="h1" style={{ margin: '14px 0 0', letterSpacing: '-0.03em', lineHeight: 1.04, textWrap: 'balance' }}>
                Answer the call.
                <br />
                Then do the sets.
              </Text>
              <Text variant="body" tone="muted" as="p" className={styles.subhead} style={{ fontSize: 'var(--text-lg)' }}>
                Moonshot gives every training day a quest, every finished session a crystal, and every honest reflection somewhere to live.
              </Text>
            </div>
            <div className={styles.authWrap}>
              <AuthCard cardRef={cardRef} configured={configured} returned={returned} />
            </div>
          </div>
        </section>

        <Section>
          <Text variant="eyebrow" tone="slate" as="div">
            HOW A DAY GOES
          </Text>
          <div className={styles.steps}>
            {STEPS.map(({ icon: Icon, title, body }) => (
              <Card key={title} pad="lg" className={styles.step} style={{ borderRadius: 22, padding: 24 }}>
                <span className={styles.stepIcon}>
                  <Icon size={21} color="var(--color-pink)" />
                </span>
                <Text variant="cardTitle" as="h3" className={styles.stepTitle}>
                  {title}
                </Text>
                <Text variant="body" tone="muted" as="p" className={styles.stepBody}>
                  {body}
                </Text>
              </Card>
            ))}
          </div>
        </Section>

        <Section>
          <div className={styles.quest}>
            <div className={styles.col}>
              <Text variant="eyebrow" tone="accent" as="div">
                A QUEST A DAY
              </Text>
              <Text variant="headline" as="h2" className={styles.headline}>
                Not a badge bolted on afterwards
              </Text>
              <Text variant="body" tone="slate" as="p" className={styles.questBody}>
                Each quest is drawn from the session you already planned, and it resolves in its own words once the day is clear. On a rest day it says so and leaves you alone.
              </Text>
            </div>
            <Card pad="md" className={styles.col} style={{ padding: 22 }}>
              <div className={styles.cleared}>
                <Gem size={22} />
                <div style={{ minWidth: 0 }}>
                  <Text variant="eyebrow" tone="accent" as="div">
                    QUEST CLEARED
                  </Text>
                  <Text variant="cardTitle" as="div" style={{ marginTop: 4 }}>
                    Break the illusion
                  </Text>
                  <Text variant="caption" tone="muted" as="div" style={{ marginTop: 3 }}>
                    The illusion broke on the fourth set.
                  </Text>
                </div>
              </div>
              <div className={styles.track} aria-hidden="true">
                <div className={styles.fill} />
              </div>
              <div className={styles.progressRow}>
                <Text variant="caption" tone="accent" weight="semibold">
                  5 of 5 done
                </Text>
                <Text variant="caption" tone="muted">
                  Upper Body Push
                </Text>
              </div>
            </Card>
          </div>
        </Section>

        <Section>
          <div className={styles.ranks}>
            <div className={styles.ranksLeft}>
              <Text variant="eyebrow" tone="slate" as="div">
                {RANKS.length === 20 ? 'TWENTY RANKS' : `${RANKS.length} RANKS`}
              </Text>
              <Text variant="headline" as="h2" className={styles.headline}>
                Earned in experience, not in weeks
              </Text>
              <Text variant="body" tone="muted" as="p" className={styles.ranksBody}>
                Every exercise you clear is worth something, every finished session more. Rank names carry it from {RANKS[0].name} to {RANKS[RANKS.length - 1].name}.
              </Text>
            </div>
            <div className={styles.ranksRight}>
              {LADDER.map((r) => (
                <div key={r.name} className={styles.rank}>
                  <span className={styles.gem} style={{ background: r.gem }} aria-hidden="true" />
                  <Text variant="label" className={styles.rankName}>
                    {r.name}
                  </Text>
                  <Text variant="caption" weight="bold" tone="muted" style={{ fontFamily: 'var(--font-heading)' }}>
                    {r.need}
                  </Text>
                </div>
              ))}
              <Text variant="caption" tone="subtle" className={styles.more}>
                …and {RANKS.length - LADDER.length} more above these.
              </Text>
            </div>
          </div>
        </Section>

        <Section last>
          <Card pad="lg" className={styles.closing} style={{ borderRadius: 24, padding: '44px 24px' }}>
            <Text variant="headline" as="h2" style={{ margin: 0, lineHeight: 1.1, textWrap: 'balance' }}>
              The city is quiet. That never lasts.
            </Text>
            <Text variant="body" tone="muted" as="p" className={styles.closingBody}>
              Sign in and tomorrow has a quest on it.
            </Text>
            <div className={styles.closingCta}>
              <Button type="primary" size="lg" glow onClick={toCard}>
                Step through
                <ChevronRight color="var(--color-white)" strokeWidth={2.4} size={17} />
              </Button>
            </div>
          </Card>
        </Section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerRow}>
          <Lockup height={24} />
          <Text variant="caption" tone="subtle">
            A training plan with a transformation sequence.
          </Text>
        </div>
      </footer>
    </div>
  );
}
