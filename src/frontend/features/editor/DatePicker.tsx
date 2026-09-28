import { Fragment } from 'react';
import { Chip } from '@moonshot/design-system/chip';
import { Calendar } from '@moonshot/design-system/icons';
import { Popover } from '@moonshot/design-system/popover';
import { Text } from '@moonshot/design-system/typography';
import { css, t } from '@/frontend/features/planner/viewHelpers';
import { StepButton } from '@/frontend/components/StepButton';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** The editor’s date chip, which opens a month to pick the day from. */
export function DatePicker({ v }: { v: PlannerVals }) {
  return (
    <Popover
      open={!!v.dateOpen}
      onClose={v.closeDate}
      width={280}
      top={44}
      as="span"
      content={
        <>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StepButton dir="prev" unit="month" onClick={v.pickPrevMonth} />
            <Text variant="itemTitle" style={{ flex: '1', textAlign: 'center' }}>
              {v.pickMonthName}
            </Text>
            <StepButton dir="next" unit="month" onClick={v.pickNextMonth} />
          </span>
          <span
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
              gap: '2px',
              marginTop: '8px',
            }}
          >
            {(v.dowLabels ?? []).map((l, i) => (
              <Fragment key={i}>
                <span
                  aria-hidden="true"
                  style={{
                    textAlign: 'center',
                    fontSize: 'var(--text-2xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-subtle)',
                    paddingBottom: '4px',
                  }}
                >
                  {l}
                </span>
              </Fragment>
            ))}
            {(v.pickerCells ?? []).map((p, i) => (
              <Fragment key={i}>
                {p?.blank ? (
                  <span aria-hidden="true" style={css(p?.style)} />
                ) : (
                  <button
                    onClick={p?.pick}
                    onKeyDown={p?.keys}
                    tabIndex={p?.tab}
                    data-pick-day={p?.day}
                    aria-label={p?.aria}
                    aria-current={p?.today}
                    aria-pressed={!!p?.selected}
                    style={css(p?.style)}
                  >
                    {p?.label}
                  </button>
                )}
              </Fragment>
            ))}
          </span>
        </>
      }
    >
      <Chip
        icon={<Calendar color="var(--color-muted)" size={15} />}
        onClick={v.toggleDate}
        aria-expanded={!!v.dateOpen}
        aria-label={'Date: ' + v.eDateAria + '. Change date'}
      >
        {t(v.eDate)}
      </Chip>
    </Popover>
  );
}
