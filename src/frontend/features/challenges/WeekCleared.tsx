'use client';

import { useId, useLayoutEffect, useRef, type SyntheticEvent } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import styles from '@/frontend/features/boss/boss.module.css';

/** All three of a week's challenges cleared: full screen, like a boss's win, with what each one brought. */
export function WeekCleared({ v, open, onClose }: { v: PlannerVals | null; open: boolean; onClose: () => void }) {
  if (!v || !open || !v.challengeFull) return null;
  return <Panel w={v.challengeFull} onClose={onClose} />;
}

function Panel({ w, onClose }: { w: NonNullable<PlannerVals['challengeFull']>; onClose: () => void }) {
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
  const row = { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'color-mix(in srgb, white 8%, transparent)' };
  return (
    <dialog ref={ref} className={styles.overlay} aria-labelledby={titleId} onCancel={onCancel}>
      <div className={styles.night} aria-hidden="true" />
      <div className={styles.panel}>
        <p className={styles.eyebrow}>{w.eyebrow}</p>
        <svg width="160" height="96" viewBox="0 0 160 96" aria-hidden="true" className={styles.glyph}>
          <path d="M30 40l6 12 13 2-9.5 9 2.3 13L30 70l-11.8 6 2.3-13L11 54l13-2z" fill="var(--color-peach)" />
          <path d="M80 8l8 16.5 18 2.6-13 12.7 3 18L80 49.3l-16 8.5 3-18-13-12.7 18-2.6z" fill="var(--color-peach)" />
          <path d="M130 40l6 12 13 2-9.5 9 2.3 13L130 70l-11.8 6 2.3-13L111 54l13-2z" fill="var(--color-peach)" />
        </svg>
        <h2 id={titleId} className={styles.name}>
          Week cleared
        </h2>
        <p className={styles.sub}>{w.line}</p>
        <ul className={styles.stats} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {w.rows.map((r) => (
            <li key={r.key} style={{ ...row, textAlign: 'left' }}>
              <span>{r.name}</span>
              <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{r.xp}</span>
            </li>
          ))}
          <li style={{ ...row, background: 'color-mix(in srgb, white 14%, transparent)' }}>
            <span style={{ color: 'var(--color-peach)', fontWeight: 'var(--font-weight-semibold)' }}>All three bonus</span>
            <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{w.bonus}</span>
          </li>
        </ul>
        <p className={styles.sub} style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-semibold)', color: 'white' }}>
          {w.total}
        </p>
        <div className={styles.action}>
          <Button type="primary" size="lg" glow fullWidth onClick={onClose}>
            Nice
          </Button>
        </div>
        <p className={styles.sub} style={{ fontSize: 'var(--text-sm)' }}>
          New challenges arrive Sunday.
        </p>
      </div>
    </dialog>
  );
}
