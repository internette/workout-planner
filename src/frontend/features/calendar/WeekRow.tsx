import { IconTile } from '@moonshot/design-system/icon-tile';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { StatusDot } from '@/frontend/components/StatusDot';
import { SessionTags } from '@/frontend/components/SessionTags';

/** A day in the Week view: its session, or a rest day. */
export function WeekRow({ row }: { row: any }) {
  return (
    <div>
      {row?.isRest ? (
        // A rest day is one quiet line, its date and "Rest": the week's sessions get the room.
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '10px 0 2px', minHeight: '28px' }}>
          <Text variant="micro" tone={row?.labelTone} style={{ flex: 'none' }}>
            {row?.label}
          </Text>
          <span aria-hidden="true" style={{ flex: '1', height: '1px', background: 'var(--color-line)' }} />
          <Text variant="small" tone="muted" style={{ flex: 'none' }}>
            {row?.days > 1 ? 'Rest days' : 'Rest day'}
          </Text>
        </div>
      ) : null}
      {row?.showLabel && !row?.isRest ? (
        <Text variant="micro" as="div" tone={row?.labelTone} style={{ margin: '14px 0 9px' }}>
          {row?.label}
        </Text>
      ) : null}
      {row?.hasRow ? (
        <Card
          as="button"
          pad="sm"
          interactive
          onClick={row?.open}
          aria-label={row?.aria}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '13px',
          }}
        >
          <IconTile as="span" size="xs" variant="flat" aria-hidden>{row?.icoSvg}</IconTile>
          <div style={{ minWidth: '0', flex: '1' }}>
            <SessionTags program={row?.program} type={row?.typeLabel} />
            <Text variant="subheading" as="div">
              {row?.name}
            </Text>
            <Text
              variant="body"
              as="div"
              tone="muted"
              style={{ marginTop: '3px' }}
            >
              {row?.meta}
            </Text>
          </div>
          <span style={{ marginLeft: 'auto' }}>
            <StatusDot status={row?.dot} size="md" />
          </span>
        </Card>
      ) : null}
    </div>
  );
}
