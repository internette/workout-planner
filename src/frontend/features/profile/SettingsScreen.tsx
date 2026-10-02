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
