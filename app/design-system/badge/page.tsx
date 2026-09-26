import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/typography';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Badge — Design system' };

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 };
const listRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14 };

export default function BadgePage() {
  return (
    <DocPage title="Badge">
      <p style={{ ...note, marginTop: 8 }}>
        A small status pill: what state something is in, like Done, Planned or Partly done. Import it from{' '}
        <code>@/components/ui/badge</code>. It isn&apos;t pressable; for a fact or a choice, use Chip.
      </p>

      <h2 id="tones" style={h2}>Tones</h2>
      <p style={note}>
        A badge takes a tone, not a status: the screen picks the tone for each status, since the same status reads
        differently on white and on a tinted row. <code>accent</code> and <code>soft</code> for done,{' '}
        <code>neutral</code> for in progress, partly done or missed, <code>quiet</code> for planned on a tinted
        surface.
      </p>
      <Card>
        <div style={row}>
          <Badge tone="accent">Done</Badge>
          <Badge tone="soft">Done</Badge>
          <Badge tone="neutral">Partly done</Badge>
          <Badge tone="quiet" style={{ boxShadow: 'inset 0 0 0 1px var(--color-divider)' }}>
            Planned
          </Badge>
        </div>
        <Text variant="caption" as="p" tone="muted" style={{ margin: '12px 0 0' }}>
          accent · soft · neutral · quiet (outlined here only so it shows on white)
        </Text>
      </Card>

      <h2 id="in-a-list" style={h2}>In a list</h2>
      <p style={note}>
        At the end of a row, after the name. On white, as in the Chronicle&apos;s session picker, done is{' '}
        <code>soft</code> and the rest <code>neutral</code>. On Profile&apos;s tinted week rows, done is{' '}
        <code>accent</code>, planned <code>quiet</code> and the rest <code>neutral</code>.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
        <Card pad="none" style={{ overflow: 'hidden' }}>
          {[
            ['Upper Push', 'neutral', 'In progress'],
            ['Leg Day', 'neutral', 'Partly done'],
            ['Evening Ride', 'soft', 'Done'],
          ].map(([name, tone, label], i) => (
            <div key={name} style={{ ...listRow, borderRadius: 0, padding: '14px 18px', borderTop: i ? '1px solid rgba(35,42,69,.07)' : 'none' }}>
              <Text variant="itemTitle" tone="ink" style={{ flex: 1 }}>
                {name}
              </Text>
              <Badge tone={tone as 'soft' | 'neutral'}>{label}</Badge>
            </div>
          ))}
        </Card>
        <Card pad="sm">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['Evening Ride', 'accent', 'Done'],
              ['Upper Push', 'neutral', 'In progress'],
              ['Leg Day', 'quiet', 'Planned'],
            ].map(([name, tone, label]) => (
              <div key={name} style={{ ...listRow, background: 'var(--color-canvas)' }}>
                <Text variant="label" tone="ink" weight="semibold" style={{ flex: 1 }}>
                  {name}
                </Text>
                <Badge tone={tone as 'accent' | 'neutral' | 'quiet'}>{label}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <p style={{ ...note, marginTop: 16 }}>
        The WARM-UP label above a workout&apos;s name isn&apos;t a badge: it&apos;s a line of text (micro, bold, accent)
        that names what the workout is, not a state it&apos;s in.
      </p>
    </DocPage>
  );
}
