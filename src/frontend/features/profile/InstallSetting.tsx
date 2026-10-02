'use client';

import { useEffect, useState } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import { Text } from '@moonshot/design-system/typography';
import { SettingsCard } from './SettingsCard';
import { openInstallDialog, useInstallOffer } from '@/frontend/features/install/installOffer';
import { wasInstalled } from '@/frontend/features/install/useInstallPrompt';

/**
 * Profile → Settings: install the app, whenever the browser says it can be (so not once it's installed, nor where the
 * browser can't, such as iPhone Safari). It doesn't depend on what was answered to the install sheet, so it's the way
 * back for someone who said "Don't ask me again".
 */
export function InstallSetting() {
  const offer = useInstallOffer();
  const [removed, setRemoved] = useState(false);
  // Read after mounting: the server doesn't know what this browser remembers.
  useEffect(() => setRemoved(wasInstalled()), [offer]);
  if (!offer) return null;
  return (
    <SettingsCard title="THIS DEVICE">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
        <div style={{ flex: '1 1 180px', minWidth: 0 }}>
          <Text variant="label" as="div" tone="ink">
            Moonshot app
          </Text>
          <Text variant="body" as="p" tone="muted" style={{ margin: '4px 0 0', textWrap: 'pretty' }}>
            {removed
              ? 'It was removed from this device. Add it back to open it like an app, one tap away.'
              : 'Install it to open it like an app: full screen, no browser bar, one tap away.'}
          </Text>
        </div>
        <Button type="secondary" size="sm" onClick={() => void openInstallDialog()}>
          {removed ? 'Add it back' : 'Install'}
        </Button>
      </div>
    </SettingsCard>
  );
}
