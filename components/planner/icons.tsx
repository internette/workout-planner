import { themed } from '@/components/ui/colors';
import { ExerciseIcon, MoodFace } from '@/components/ui/icons';

// Elements the screen builders hand to the view: an exercise icon in a chosen colour, and a mood face. A colour from the
// palette (saved as hex) is drawn as its CSS variable, so it follows the theme.
export const iconSvg = (key: string, color?: string) => (
  <ExerciseIcon name={key} color={themed(color) || 'var(--color-accent)'} />
);

export const moodSvg = (mood: string) => <MoodFace mood={mood} size={26} />;
