// Progress: the streak, this week, quests and counts.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import { PageHeader } from '@/frontend/components/PageHeader';
import { CountCard } from '@/frontend/features/progress/CountCard';
import { NextUpCard } from '@/frontend/features/progress/NextUpCard';
import { StreakBanner } from '@/frontend/features/progress/StreakBanner';
import { ThisWeekCard } from '@/frontend/features/progress/ThisWeekCard';
import { WeekQuestsCard } from '@/frontend/features/progress/WeekQuestsCard';

export function ProgressScreen({ v }: { v: any }) {
  return (
    <>
      <div>
        <PageHeader title="Progress" intro={v.summarySub} />
        <StreakBanner v={v} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '26px' }}>
          <ThisWeekCard v={v} />
          <NextUpCard v={v} />
        </div>
        <WeekQuestsCard v={v} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '14px' }}>
          <CountCard label="CHRONICLE" count={v.loggedCount} unit={v.loggedUnit} onClick={v.openChronicle} />
          <CountCard label={v.monthLabel} count={v.monthDone} unit={v.monthDoneUnit} onClick={v.openMonth} />
        </div>
      </div>
    </>
  );
}
