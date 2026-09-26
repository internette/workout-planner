import { themed } from '@/components/ui/colors';
import { EXERCISE_ICON_NAMES, ExerciseIcon, MoodFace } from '@/components/ui/icons';
import { ICON_NAMES } from './constants';

// Elements the screen builders hand to the view: an exercise icon in a chosen colour, and a mood face. A colour from the
// palette (saved as hex) is drawn as its CSS variable, so it follows the theme.
export const iconSvg = (key: string, color?: string) => (
  <ExerciseIcon name={key} color={themed(color) || 'var(--color-accent)'} />
);

export const moodSvg = (mood: string) => <MoodFace mood={mood} size={26} />;

// The icons to pick from, for an IconChoiceGroup: every exercise icon, in the workout's colour when it has one.
export const iconOptions = (color?: string) =>
  EXERCISE_ICON_NAMES.map((name) => ({ value: name, label: ICON_NAMES[name] + ' icon', icon: iconSvg(name, color) }));
