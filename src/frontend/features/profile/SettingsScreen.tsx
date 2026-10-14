// Settings: a page of Profile's, at /profile/settings. How the app looks on this device, what shows during a workout,
// installing it, and the account, with deleting it last.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { BackBar } from '@/frontend/components/BackBar';
import { PageHeader } from '@/frontend/components/PageHeader';
import { AccountCard } from '@/frontend/features/profile/AccountCard';
import { AppearanceSetting } from '@/frontend/features/profile/AppearanceSetting';
import { DeleteAccount } from '@/frontend/features/profile/DeleteAccount';
import { InstallSetting } from '@/frontend/features/profile/InstallSetting';
import { LiveSetting } from '@/frontend/features/profile/LiveSetting';
import { SettingsCard } from '@/frontend/features/profile/SettingsCard';
import { Button } from '@moonshot/design-system/buttons';
import { Text } from '@moonshot/design-system/typography';

export function SettingsScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack} />
      <PageHeader title="Settings" style={{ marginTop: '8px' }} />
      <SettingsCard title="Appearance" note="on this device">
        <AppearanceSetting />
      </SettingsCard>
      <LiveSetting />
      <InstallSetting />
      <SettingsCard title="Getting started">
        <Text variant="body" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
          Your name, color, what you train and when, and a program to begin with. Or a minute around the app.
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          <Button type="secondary" size="md" onClick={v.startSetup}>
            Customize your experience
          </Button>
          <Button type="secondary" size="md" onClick={v.startTour}>
            Take the tour
          </Button>
        </div>
      </SettingsCard>
      {v.canSignOut ? (
        <>
          <AccountCard v={v} />
          <SettingsCard title="Delete account" danger>
            <DeleteAccount />
          </SettingsCard>
        </>
      ) : null}
    </div>
  );
}
