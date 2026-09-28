// One Chronicle entry: writing it, or reading it back.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import { Button } from '@moonshot/design-system/buttons';
import { Pencil } from '@moonshot/design-system/icons';
import { BackBar } from '@/frontend/components/BackBar';
import { DiaryEntryForm } from '@/frontend/features/chronicle/DiaryEntryForm';
import { EntryReadView } from '@/frontend/features/chronicle/EntryReadView';

export function EntryScreen({ v }: { v: any }) {
  return (
    <>
      <div>
        <BackBar label={v.diaryBackLabel || v.backLabel} onBack={v.diaryBack}>
          {v.diaryReading ? (
            <Button type="secondary" size="sm" onClick={v.editEntry} style={{ whiteSpace: 'nowrap' }}>
              <Pencil color="var(--color-accent-deep)" size={16} />
              Edit
            </Button>
          ) : null}
        </BackBar>
        {v.diaryReading ? <EntryReadView v={v} /> : null}
        {v.diaryEditing ? <DiaryEntryForm v={v} /> : null}
      </div>
    </>
  );
}
