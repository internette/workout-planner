import { TagLabel } from './KindTag';

/** The program a session belongs to, as a small label above its name, drawn like KindTag's: "3-day band split" (and
 * where in it, when there's room: "· Build, week 2 of 3"). Nothing for a session no program put there. */
export function ProgramTag({ text }: { text?: string | null }) {
  return text ? <TagLabel>{text}</TagLabel> : null;
}
