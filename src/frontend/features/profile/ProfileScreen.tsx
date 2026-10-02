// The profile: who you are and your stats. Settings are a page of their own, opened from the gear by the title.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Card } from '@moonshot/design-system/card';
import { Stat } from '@moonshot/design-system/stat';
import { IconTileButton } from '@moonshot/design-system/icon-tile';
import { Gear } from '@moonshot/design-system/icons';
import { PageHeader } from '@/frontend/components/PageHeader';
import { MoodSplitCard } from '@/frontend/features/profile/MoodSplitCard';
import { ProfileHeaderCard } from '@/frontend/features/profile/ProfileHeaderCard';
import { QuestsClearedCard } from '@/frontend/features/profile/QuestsClearedCard';

export function ProfileScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      {/* Settings is a page of its own: the gear at the end of the title opens it. */}
      <PageHeader
        title="Profile"
        action={
          <IconTileButton size="sm" aria-label="Settings" onClick={v.goSettings}>
            <Gear color="var(--color-accent)" size={20} />
          </IconTileButton>
        }
        style={{ marginBottom: '14px' }}
      />
      <ProfileHeaderCard v={v} />
      <div id="profileStats" style={{ display: 'grid', gap: '12px', marginTop: '14px' }}>
        {(v.profileStats ?? []).map((s, i) => (
          <Card key={i} pad="sm">
            <Stat size="xl" labelTone="muted" label={s?.label} value={s?.value} unit={s?.unit ?? ''} note={s?.span} />
          </Card>
        ))}
      </div>
      <QuestsClearedCard v={v} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: '12px',
          marginTop: '14px',
        }}
      >
        <MoodSplitCard v={v} />
      </div>
    </div>
  );
}
