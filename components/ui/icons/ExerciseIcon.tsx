import { Bike, Dumbbell, DumbbellSmall, DumbbellUpright } from './glyphs';
import type { IconProps } from './Svg';

// The icons a workout or exercise can be tagged with. The keys are what the database stores.
const EXERCISE_ICONS = {
  h: Dumbbell,
  v: DumbbellUpright,
  d: DumbbellSmall,
  bike: Bike,
};

export type ExerciseIconName = keyof typeof EXERCISE_ICONS;
export const EXERCISE_ICON_NAMES = Object.keys(EXERCISE_ICONS) as ExerciseIconName[];

export function ExerciseIcon({ name, size = 20, ...rest }: { name: string } & IconProps) {
  const Glyph = EXERCISE_ICONS[name as ExerciseIconName] ?? Dumbbell;
  return <Glyph size={size} {...rest} />;
}
