import { ExerciseIcon, MoodFace } from '@/components/ui/icons';

// Elements the screen builders hand to the view: an exercise icon in a chosen colour, and a mood face.
export const iconSvg = (key: string, color?: string) => (
  <ExerciseIcon name={key} color={color || 'var(--color-pink)'} />
);

export const moodSvg = (mood: string) => <MoodFace mood={mood} size={26} />;
