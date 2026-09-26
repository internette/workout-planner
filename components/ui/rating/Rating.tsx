'use client';

import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { MOOD_COLORS, MOODS, MoodFace, RatingStar, type Mood } from '../icons';
import styles from './rating.module.css';

// Both ratings are radio groups: one Tab stop (the picked option, or the first before anything is picked), and the
// arrow keys, Home and End move the pick and the focus.
function useRadioKeys(count: number, current: number, pick: (index: number) => void) {
  const group = useRef<HTMLDivElement>(null);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
    const from = Math.max(0, current);
    const to = step ? (from + step + count) % count : e.key === 'Home' ? 0 : e.key === 'End' ? count - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    pick(to);
    (group.current?.children[to] as HTMLElement | undefined)?.focus();
  };
  return { group, onKeyDown };
}

export interface StarRatingProps {
  /** Names the group for screen readers, for example "How hard did it feel?". Not needed when `readOnly`. */
  label?: string;
  /** 1 to 5, or 0 for not rated yet. */
  value: number;
  onChange?: (value: number) => void;
  /** A word for each star, said with it: "4 of 5, Hard". */
  words?: string[];
  /** Just show the stars, for a saved rating. Say the rating in text beside them: they're hidden from screen readers. */
  readOnly?: boolean;
  /** The star's size in px: 36 to pick (each star is a 44px target whatever its size), 18 to show. */
  size?: number;
  style?: CSSProperties;
  className?: string;
}

/** Five stars, filled up to the rating with the gem gradient. */
export function StarRating({ label, value, onChange, words, readOnly, size = readOnly ? 18 : 36, style, className }: StarRatingProps) {
  const { group, onKeyDown } = useRadioKeys(5, value - 1, (i) => onChange?.(i + 1));
  const stars = [1, 2, 3, 4, 5];
  if (readOnly)
    return (
      <span className={[styles.shown, className].filter(Boolean).join(' ')} style={style}>
        {stars.map((n) => (
          <span key={n} className="fc-star" data-on={n <= value ? '' : undefined} style={{ display: 'inline-flex' }}>
            <RatingStar on={n <= value} size={size} />
          </span>
        ))}
      </span>
    );
  return (
    <div
      ref={group}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={[styles.stars, className].filter(Boolean).join(' ')}
      style={style}
    >
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={n === value}
          aria-label={n + ' of 5' + (words?.[n - 1] ? ', ' + words[n - 1] : '')}
          tabIndex={n === (value || 1) ? 0 : -1}
          data-star={n - 1}
          data-on={n <= value ? '' : undefined}
          onClick={() => onChange?.(n)}
          className={styles.star}
        >
          <RatingStar on={n <= value} size={size} />
        </button>
      ))}
    </div>
  );
}

export interface MoodRatingProps {
  /** Names the group for screen readers, for example "How did it feel?". */
  label: string;
  value: Mood | '' | null | undefined;
  onChange: (mood: Mood) => void;
  style?: CSSProperties;
  className?: string;
}

/** Four faces, Happy to Mad, each on its colour with its name beneath. Once one is picked, the others step back. */
export function MoodRating({ label, value, onChange, style, className }: MoodRatingProps) {
  const current = MOODS.indexOf(value as Mood);
  const { group, onKeyDown } = useRadioKeys(MOODS.length, current, (i) => onChange(MOODS[i]));
  return (
    <div
      ref={group}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={[styles.moods, className].filter(Boolean).join(' ')}
      style={style}
    >
      {MOODS.map((mood, i) => {
        const on = i === current;
        return (
          <button
            key={mood}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on || (current < 0 && i === 0) ? 0 : -1}
            data-mood={i}
            onClick={() => onChange(mood)}
            className={[styles.mood, on && styles.picked, current >= 0 && !on && styles.passed].filter(Boolean).join(' ')}
            style={{ '--mood': MOOD_COLORS[mood] } as CSSProperties}
          >
            <span className={['fc-keep', styles.face].join(' ')}>
              <MoodFace mood={mood} size={34} />
            </span>
            <span className={styles.name}>{mood}</span>
          </button>
        );
      })}
    </div>
  );
}
