'use client';

import { useId, useLayoutEffect, useRef, type CSSProperties, type SyntheticEvent } from 'react';
import { Button } from '@/components/ui/buttons';
import { Sparkle } from '@/components/ui/icons';
import { colors, vars } from '@/components/ui/colors';
import styles from './rank-up.module.css';

export interface RankUpProps {
  open: boolean;
  /** The rank just reached, e.g. "Novice guardian". */
  name: string;
  /** e.g. "Rank 2 of 20". */
  step: string;
  /** The next rank's name, e.g. "Moonlit apprentice". */
  next: string;
  /** The rank's gem colour or gradient, as a CSS value. */
  gem: string;
  onClose: () => void;
}

const SPARKS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const SPARK_COLORS = [vars.pink, vars.periwinkle, vars.teal, colors.white];
// Small sparkles that keep twinkling around the gem once it has formed.
const TWINKLES: { left: string; top: string; size: number; delay: string }[] = [
  { left: 'calc(50% - 110px)', top: 'calc(42% - 70px)', size: 14, delay: '1.9s' },
  { left: 'calc(50% + 92px)', top: 'calc(42% - 40px)', size: 11, delay: '2.3s' },
  { left: 'calc(50% - 86px)', top: 'calc(42% + 38px)', size: 10, delay: '2.6s' },
  { left: 'calc(50% + 70px)', top: 'calc(42% + 60px)', size: 13, delay: '2.1s' },
];

/**
 * A transformation sequence for a new rank. Built on the native <dialog> element, like Dialog: the page behind is
 * inert, Escape closes it, and focus starts on Continue and goes back afterwards.
 */
export function RankUp(props: RankUpProps) {
  return props.open ? <RankUpPanel {...props} /> : null;
}

function RankUpPanel({ name, step, next, gem, onClose }: RankUpProps) {
  const titleId = useId();
  const subId = useId();
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    dialog.querySelector<HTMLElement>('button')?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  const onCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={ref}
      className={styles.overlay}
      aria-labelledby={titleId}
      aria-describedby={subId}
      onCancel={onCancel}
    >
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.night} />
        <div className={`${styles.ribbon} ${styles.r1}`} />
        <div className={`${styles.ribbon} ${styles.r2}`} />
        <div className={`${styles.ribbon} ${styles.r3}`} />
        {SPARKS.map((a, i) => (
          <span
            key={a}
            className={styles.spark}
            style={{ '--a': a + 'deg', animationDelay: 0.1 + (i % 4) * 0.08 + 's' } as CSSProperties}
          >
            <Sparkle size={18} color={SPARK_COLORS[i % SPARK_COLORS.length]} glow={0.8} glowBlur={6} />
          </span>
        ))}
        <div className={styles.gemWrap}>
          <div className={styles.halo} />
          <div className={styles.gem} style={{ background: gem }} />
        </div>
        <div className={styles.flash} />
        {TWINKLES.map((s, i) => (
          <span key={i} className={styles.twinkle} style={{ left: s.left, top: s.top, animationDelay: s.delay }}>
            <Sparkle size={s.size} color={colors.white} glow={0.7} />
          </span>
        ))}
      </div>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>NEW RANK</p>
        <h2 id={titleId} className={styles.name}>
          {name}
        </h2>
        <p id={subId} className={styles.sub}>
          {step} · On to {next}.
        </p>
        <div className={styles.action}>
          <Button type="primary" size="lg" glow onClick={onClose}>
            Continue
          </Button>
        </div>
      </div>
    </dialog>
  );
}
