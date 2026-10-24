// The profile: who you are and your stats. Settings are a page of their own, opened from the gear by the title.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { IconTileButton } from '@moonshot/design-system/icon-tile';
import { Gear } from '@moonshot/design-system/icons';
import { PageHeader } from '@/frontend/components/PageHeader';
import { MoodSplitCard } from '@/frontend/features/profile/MoodSplitCard';
import { ProfileHeaderCard } from '@/frontend/features/profile/ProfileHeaderCard';
import { ProgramCard } from '@/frontend/features/profile/ProgramCard';
import { QuestsClearedCard } from '@/frontend/features/profile/QuestsClearedCard';
import { BossesCard } from '@/frontend/features/boss/BossesCard';
import { AchievementsCard } from '@/frontend/features/achievements/AchievementsCard';

export function ProfileScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      {/* Settings is a page of its own: the gear at the end of the title opens it. */}
      <PageHeader
        title="Profile"
        action={
          <IconTileButton size="sm" aria-label="Settings" onClick={v.goSettings}>
            <Gear color="var(--color-pink)" size={20} />
          </IconTileButton>
        }
        style={{ marginBottom: 'var(--space-4)' }}
      />
      <ProfileHeaderCard v={v} />
      <ProgramCard v={v} />
      <BossesCard v={v} />
      <AchievementsCard v={v} />
      <QuestsClearedCard v={v} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-4)',
        }}
      >
        <MoodSplitCard v={v} />
      </div>
    </div>
  );
}
