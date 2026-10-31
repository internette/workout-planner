'use client';

import { useId, useLayoutEffect, useRef, type SyntheticEvent } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { BossGlyph } from './BossGlyph';
import styles from './boss.module.css';

/**
 * The boss battle's two ceremonies, full screen like the rank-up: a boss appearing at its rank, and a boss beaten.
 * Built on the native <dialog>, so the page behind is inert, Escape closes it and focus starts on its button.
 */
export function BossBattle({ v, show, onClose }: { v: PlannerVals | null; show: 'appear' | 'won' | null; onClose: () => void }) {
  if (!v || !show) return null;
  if (show === 'appear' && !v.bossAppear) return null;
  if (show === 'won' && !v.bossWon) return null;
  return <BossPanel v={v} show={show} onClose={onClose} />;
}

function BossPanel({ v, show, onClose }: { v: PlannerVals; show: 'appear' | 'won'; onClose: () => void }) {
  const titleId = useId();
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
  const a = v.bossAppear;
  const w = v.bossWon;
  return (
    <dialog ref={ref} className={styles.overlay} aria-labelledby={titleId} onCancel={onCancel}>
      <div className={styles.night} aria-hidden="true" />
      {show === 'appear' && a ? (
        <div className={styles.panel}>
          <p className={styles.eyebrow}>{a.eyebrow}</p>
          <span className={styles.glyph}>
            <BossGlyph k={a.k} fill={a.gem} size={180} />
          </span>
          <h2 id={titleId} className={styles.name}>
            {a.name}
          </h2>
          <p className={styles.sub}>{a.line}</p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>HP</span>
              <span className={styles.statValue}>{a.hp.toLocaleString('en-US')}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Time to win</span>
              <span className={styles.statValue}>{a.days}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{a.rewardLabel}</span>
              <span className={styles.statValue}>{a.reward}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Each set</span>
              <span className={styles.statValue}>10 damage</span>
            </div>
          </div>
          <div className={styles.action}>
            <Button type="primary" size="lg" glow fullWidth onClick={onClose}>
              Begin the battle
            </Button>
          </div>
        </div>
      ) : null}
      {show === 'won' && w ? (
        <div className={styles.panel}>
          <p className={styles.eyebrow}>Victory</p>
          <span className={styles.felled}>
            <BossGlyph k={w.k} fill="var(--color-gold)" size={180} faded />
          </span>
          <h2 id={titleId} className={styles.name}>
            {w.name} is defeated
          </h2>
          <p className={styles.sub}>{w.line}</p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Bonus</span>
              <span className={styles.statValue}>{w.bonus}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Bosses beaten</span>
              <span className={styles.statValue}>{w.count}</span>
            </div>
          </div>
          <p className={styles.sub}>{w.next}</p>
          <div className={styles.action}>
            <Button type="primary" size="lg" glow fullWidth onClick={onClose}>
              Continue
            </Button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
