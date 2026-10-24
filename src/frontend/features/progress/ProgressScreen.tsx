// Progress: the streak, this week, sessions per week, quests, personal bests and counts.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { PageHeader } from '@/frontend/components/PageHeader';
import { AllTimeCard } from '@/frontend/features/progress/AllTimeCard';
import { CountCard } from '@/frontend/features/progress/CountCard';
import { NextUpCard } from '@/frontend/features/progress/NextUpCard';
import { StreakBanner } from '@/frontend/features/progress/StreakBanner';
import { ThisWeekCard } from '@/frontend/features/progress/ThisWeekCard';
import { WeekQuestsCard } from '@/frontend/features/progress/WeekQuestsCard';
import { ChallengeWeeksCard } from '@/frontend/features/challenges/ChallengeWeeksCard';
import { PersonalBestsCard } from '@/frontend/features/progress/PersonalBestsCard';
import { SessionsPerWeekCard } from '@/frontend/features/progress/SessionsPerWeekCard';

export function ProgressScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      <PageHeader title="Progress" intro={v.summarySub} />
      <StreakBanner v={v} />
      <div style={{ display: 'flex', marginTop: 'var(--space-7)' }}>
        <ThisWeekCard v={v} />
      </div>
      <SessionsPerWeekCard v={v} />
      <AllTimeCard v={v} />
      <div style={{ display: 'flex', marginTop: 'var(--space-4)' }}>
        <NextUpCard v={v} />
      </div>
      <ChallengeWeeksCard v={v} />
      <WeekQuestsCard v={v} />
      <PersonalBestsCard v={v} style={{ marginTop: 'var(--space-4)' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        <CountCard label="Chronicle" count={v.loggedCount} unit={v.loggedUnit} onClick={v.openChronicle} />
        <CountCard label={v.monthLabel} count={v.monthDone} unit={v.monthDoneUnit} onClick={v.openMonth} />
      </div>
    </div>
  );
}
