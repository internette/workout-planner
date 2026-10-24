import type { ComponentType } from 'react';
import { themed } from '@moonshot/design-system/colors';
import { Bike, Dumbbell, DumbbellSmall, DumbbellUpright, LotusFlower, Lunge, MoodFace, Runner, type IconProps } from '@moonshot/design-system/icons';
import { ICON_NAMES } from './constants';

// The glyphs a workout or exercise can be tagged with, by the key the database stores.
const WORKOUT_ICONS: Record<string, ComponentType<IconProps>> = {
  h: Dumbbell,
  v: DumbbellUpright,
  d: DumbbellSmall,
  bike: Bike,
  flower: LotusFlower,
  lunge: Lunge,
  run: Runner,
};

/** A workout's own icon when none was picked: the runner for a run or walk, the bike for a ride, else the dumbbell. */
export const typeIcon = (ride: { run?: boolean } | null | undefined | false) => (ride ? (ride.run ? 'run' : 'bike') : 'h');

/** Every workout icon's key, in the order they're offered. */
export const ICON_KEYS = Object.keys(WORKOUT_ICONS);

/** A workout's or exercise's icon, by its stored key; an unknown key is the dumbbell. */
export function WorkoutIcon({ name, size = 20, ...rest }: { name: string } & IconProps) {
  const Glyph = WORKOUT_ICONS[name] ?? Dumbbell;
  return <Glyph size={size} {...rest} />;
}

// Elements the screen builders hand to the view: a workout icon in a chosen color, and a mood face. A color from the
// palette (saved as hex) is drawn as its CSS variable, so it follows the theme.
export const iconSvg = (key: string, color?: string) => <WorkoutIcon name={key} color={themed(color) || 'var(--color-pink)'} />;

export const moodSvg = (mood: string) => <MoodFace mood={mood} size={26} />;

// The icons to pick from, for an IconChoiceGroup: every workout icon, in the workout's color when it has one.
export const iconOptions = (color?: string) =>
  ICON_KEYS.map((name) => ({ value: name, label: ICON_NAMES[name] + ' icon', icon: iconSvg(name, color) }));
