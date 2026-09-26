'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { DocPage, h2, note } from '../docs';

const panel: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 18, padding: 22, background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-raised)', maxWidth: 460 };

export default function CheckboxPage() {
  const [tick, setTick] = useState(true);
  const [remember, setRemember] = useState(false);
  const [follow, setFollow] = useState(true);

  return (
    <DocPage title="Checkbox">
      <p style={{ ...note, marginTop: 8 }}>
        A tick box with its label. Import it from <code>@/components/ui/checkbox</code>. The parent owns{' '}
        <code>checked</code>; the label is its children, written as a sentence that says what ticking it means.
      </p>

      <h2 id="checkbox" style={h2}>Checkbox</h2>
      <p style={note}>For an option in a form. Unchecked is a white box with a quiet outline; checked is pink with a white tick.</p>
      <div style={panel}>
        <Checkbox checked={tick} onChange={setTick}>Repeat this workout every week for 12 weeks.</Checkbox>
        <Checkbox checked={remember} onChange={setRemember}>Remember my choice on this device.</Checkbox>
        <Checkbox checked disabled onChange={() => undefined}>A ticked box that cannot be changed.</Checkbox>
      </div>

      <h2 id="switch" style={h2}>As a switch</h2>
      <p style={note}>
        Pass <code>switch</code> for a setting that takes effect, rather than a field that is submitted. It looks the
        same, but a screen reader announces it as &quot;on&quot; or &quot;off&quot;. Inside an{' '}
        <code>OptionCard</code> it needs no heading of its own, because its position under the selected option says
        what it belongs to.
      </p>
      <div style={panel}>
        <Checkbox switch checked={follow} onChange={setFollow}>
          Also update 2 upcoming sessions of “Upper Body Push”. Completed sessions never change.
        </Checkbox>
      </div>

      <h2 id="behaviour" style={h2}>Behaviour</h2>
      <ul style={{ ...note, paddingLeft: 20 }}>
        <li>It is a native checkbox underneath, so Space toggles it and it joins forms and label clicks as usual.</li>
        <li>A press anywhere on the box or the label toggles it. The whole row is the target, not only the 20 px box.</li>
        <li>Keyboard focus draws a 2 px pink ring around the box.</li>
        <li>The box uses the hairline outline colour. If that outline is later darkened for contrast, this component follows.</li>
      </ul>
    </DocPage>
  );
}
