'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/buttons';
import { Card } from '@/components/ui/card';
import { Book, Calendar, Check, ChevronRight, Gem, Sparkle } from '@/components/ui/icons';
import { colors } from '@/components/ui/colors';
import { Text } from '@/components/ui/typography';
import { RANKS, RANK_STEPS } from '@/components/planner/constants';
import type { Provider } from '@/lib/auth';
import { useAuth } from './AuthProvider';
import { ProviderButton } from './ProviderButton';
import styles from './landing.module.css';

const PROVIDER_NAME: Record<Provider, string> = { google: 'Google', apple: 'Apple' };

function Wordmark({ size = 20 }: { size?: number }) {
  return (
    <span className={styles.wordmark}>
      <Gem size={size} />
      <span className={styles.wordmarkText} style={{ fontSize: size - 2 }}>
        Ritual
      </span>
    </span>
  );
}

const SPARKLE_COLORS = [colors.pink, colors.periwinkle, colors.teal, colors.pink];
function SparkleTrail() {
  return (
    <span className={styles.sparkles} aria-hidden="true">
      {SPARKLE_COLORS.map((color, i) => (
        <span key={i} className={styles.sparkle} style={{ animationDelay: `${i * 0.5}s` }}>
          <Sparkle size={10 - i} color={color} glow={0.4} />
        </span>
      ))}
    </span>
  );
}

// ---- the auth card: two modes that differ only in wording, since both are the same OAuth call
function AuthCard({ cardRef }: { cardRef: React.RefObject<HTMLDivElement> }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busy, setBusy] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { signIn, returnedError } = useAuth();
  const signingUp = mode === 'signup';

  // A provider that sends the person back with an error, such as cancelling.
  useEffect(() => {
    if (returnedError) {
      setError(returnedError.cancelled ? 'Sign-in was cancelled. Try again when you are ready.' : 'Sign-in did not finish. Try again.');
    }
  }, [returnedError]);

  const go = async (provider: Provider) => {
    setBusy(provider);
    setError(null);
    const result = await signIn(provider);
    // The page leaves on success, so this only runs when the provider could not be reached.
    if (result) {
      setError(result.error === 'not-configured' ? 'Sign-in is not set up yet.' : `${PROVIDER_NAME[provider]} did not sign you in. Try again.`);
      setBusy(null);
    }
  };

  return (
    <div ref={cardRef}>
      <Card pad="lg" elevation="overlay" className={styles.authCard} style={{ borderRadius: 24 }}>
        <Text variant="eyebrow" tone="accent" as="div">
          {signingUp ? 'FIRST TRANSFORMATION' : 'WELCOME BACK'}
        </Text>
        <Text variant="heading" as="h2" className={styles.authTitle} style={{ margin: '8px 0 0' }}>
          {signingUp ? 'Answer the call' : 'Step back through'}
        </Text>
        <Text variant="body" tone="muted" as="p" className={styles.authNote} style={{ margin: '8px 0 0' }}>
          {signingUp ? 'Two taps, and tomorrow already has a quest waiting on it.' : 'Your streak held the line while you were away.'}
        </Text>

        <div className={styles.providers}>
          {(['google', 'apple'] as const).map((p) => (
            <ProviderButton key={p} provider={p} onClick={() => go(p)} busy={busy === p} disabled={!!busy}>
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
            {signingUp ? 'Step back through' : 'Answer the call'}
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

/** Explains what Ritual is, and lets a returning person in within one screen height. */
export function LandingPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const focusCard = () => cardRef.current?.querySelector('button')?.focus();
  // No provider is chosen yet, so the closing button takes the person back to the card rather than signing in.
  const toCard = () => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    focusCard();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <Wordmark />
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
                Ritual gives every training day a quest, every finished session a crystal, and every honest reflection somewhere to live.
              </Text>
            </div>
            <div className={styles.authWrap}>
              <AuthCard cardRef={cardRef} />
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
          <Wordmark size={17} />
          <Text variant="caption" tone="subtle">
            A training plan with a transformation sequence.
          </Text>
        </div>
      </footer>
    </div>
  );
}
