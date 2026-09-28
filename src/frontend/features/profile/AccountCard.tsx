import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { SignOut } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { DeleteAccount } from './DeleteAccount';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Profile: who is signed in, and signing out. */
export function AccountCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: '16px' }}>
      <Text variant="eyebrow" as="div" tone="slate">
        ACCOUNT
      </Text>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '12px' }}
      >
        <Text variant="body" as="p" tone="muted" style={{ flex: '1 1 180px', minWidth: '0', margin: '0' }}>
          {v.accountProvider ? 'Signed in with ' + v.accountProvider : 'Signed in'}
          {v.accountEmail ? (
            <>
              {' as '}
              <Text variant="body" tone="ink" weight="medium" style={{ overflowWrap: 'anywhere' }}>
                {v.accountEmail}
              </Text>
            </>
          ) : null}
        </Text>
        <Button type="danger" ghost size="sm" onClick={v.openSignOut} style={{ flex: 'none' }}>
          <SignOut size={16} />
          Sign out
        </Button>
      </div>
      <DeleteAccount />
    </Card>
  );
}
