// The profile: who you are, your stats, and settings.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Fragment } from 'react';
import { Card } from '@moonshot/design-system/card';
import { Stat } from '@moonshot/design-system/stat';
import { AppearanceSetting } from '@/frontend/features/profile/AppearanceSetting';
import { LiveSetting } from '@/frontend/features/profile/LiveSetting';
import { InstallSetting } from '@/frontend/features/profile/InstallSetting';
import { Text } from '@moonshot/design-system/typography';
import { AccountCard } from '@/frontend/features/profile/AccountCard';
import { MoodSplitCard } from '@/frontend/features/profile/MoodSplitCard';
import { ProfileHeaderCard } from '@/frontend/features/profile/ProfileHeaderCard';
import { QuestsClearedCard } from '@/frontend/features/profile/QuestsClearedCard';

export function ProfileScreen({ v }: { v: PlannerVals }) {
  return (
    <>
      <div>
        <ProfileHeaderCard v={v} />
        <div id="profileStats" style={{ display: 'grid', gap: '12px', marginTop: '14px' }}>
          {(v.profileStats ?? []).map((s, i) => (
            <Fragment key={i}>
              <Card pad="sm">
                <Stat size="xl" labelTone="muted" label={s?.label} value={s?.value} unit={s?.unit ?? ''} note={s?.span} />
              </Card>
            </Fragment>
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
        <Card style={{ marginTop: '14px' }}>
          <Text variant="eyebrow" as="h2" tone="slate" style={{ margin: 0 }}>
            SETTINGS
          </Text>
          <AppearanceSetting />
          <LiveSetting />
          <InstallSetting />
        </Card>
        {v.canSignOut ? <AccountCard v={v} /> : null}
      </div>
    </>
  );
}
