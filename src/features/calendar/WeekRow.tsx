import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { IconSquare } from '@/components/IconSquare';
import { WarmupTag } from '@/components/WarmupTag';
import { css } from '@/features/planner/viewHelpers';

/** A day in the Week view: its session, or a rest day. */
export function WeekRow({ row }: { row: any }) {
  return (
    <div>
      {row?.showLabel ? (
        <Text variant="eyebrow" as="div" tone={row?.labelTone} style={{ margin: '14px 0 9px' }}>
          {row?.label}
        </Text>
      ) : null}
      {row?.isRest ? (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '15px 20px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface-rest)',
            }}
          >
            <span
              style={{
                width: '14px',
                height: '2px',
                flex: 'none',
                borderRadius: '1px',
                background: 'var(--color-divider)',
              }}
            ></span>
            <Text variant="label" tone="muted">
              Rest day
            </Text>
          </div>
        </>
      ) : null}
      {row?.hasRow ? (
        <>
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
            <IconSquare size={36} decorative>{row?.icoSvg}</IconSquare>
            <div style={{ minWidth: '0', flex: '1' }}>
              {row?.warmup ? <WarmupTag /> : null}
              <Text variant="itemTitle" as="div">
                {row?.name}
              </Text>
              <Text
                variant="caption"
                as="div"
                tone="muted"
                style={{ marginTop: '3px' }}
              >
                {row?.meta}
              </Text>
            </div>
            <span style={css(row?.stateDot)}></span>
          </Card>
        </>
      ) : null}
    </div>
  );
}
