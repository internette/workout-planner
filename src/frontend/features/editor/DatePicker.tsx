import { Fragment } from 'react';
import { Chip } from '@moonshot/design-system/chip';
import { Calendar, ChevronDown } from '@moonshot/design-system/icons';
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
            <Text variant="subheading" style={{ flex: '1', textAlign: 'center' }}>
              {v.pickMonthName}
            </Text>
            <StepButton dir="next" unit="month" onClick={v.pickNextMonth} />
          </span>
          <span
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
              gap: '2px',
              marginTop: '10px',
            }}
          >
            {(v.dowLabels ?? []).map((l, i) => (
              <span key={i}
                aria-hidden="true"
                style={{
                  textAlign: 'center',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-subtle)',
                  paddingBottom: '4px',
                }}
              >
                {l}
              </span>
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
        // The ▾ says it opens something, unlike the length beside it.
        trailing={<ChevronDown color="var(--color-muted)" strokeWidth={2.2} size={14} />}
        aria-expanded={!!v.dateOpen}
        aria-label={'Date: ' + v.eDateAria + '. Change date'}
      >
        {t(v.eDate)}
      </Chip>
    </Popover>
  );
}
