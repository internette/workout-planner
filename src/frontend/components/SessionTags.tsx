import { Eyebrow } from '@moonshot/design-system/typography';

/** Above a session's name, on the calendar: the program it's part of, quietly, then what kind of workout it is
 * ("Warm-up · Lifting"; see typeLabelOf). */
export function SessionTags({ program, type }: { program?: string | null; type: string }) {
  return (
    <>
      {program ? <Eyebrow tone="muted">{program}</Eyebrow> : null}
      <Eyebrow>{type}</Eyebrow>
    </>
  );
}
