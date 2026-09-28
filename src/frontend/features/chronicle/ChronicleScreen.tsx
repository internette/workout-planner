// The Chronicle: every entry, filtered by when.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Fragment } from 'react';
import { Text } from '@moonshot/design-system/typography';
import { TextField } from '@moonshot/design-system/text-field';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { Button } from '@moonshot/design-system/buttons';
import { Calendar } from '@moonshot/design-system/icons';
import { PageHeader } from '@/frontend/components/PageHeader';
import { ChronicleRow } from '@/frontend/features/chronicle/ChronicleRow';

export function ChronicleScreen({ v }: { v: PlannerVals }) {
  return (
    <>
      <div>
        <PageHeader
          title="Chronicle"
          count={v.diaryCount}
          action={
            <Button type="primary" size="sm" onClick={v.openNewEntry}>
              New entry
            </Button>
          }
          intro={<>Every session you&apos;ve written about, newest first. Open one to read or edit it.</>}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          <span className="sr-only" role="status">
            {v.diaryResults}
          </span>
          <SegmentedControl
            label="Show entries from"
            size="sm"
            compact
            wrap
            options={[
              { value: 'all', label: 'All' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: '30 days' },
              { value: 'range', label: 'Range' },
            ]}
            value={v.diaryScope}
            onChange={v.setDiaryScope}
            style={{ alignSelf: 'flex-start' }}
          />
          {v.rangeShown ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  width: '100%',
                  padding: '4px 2px',
                  borderBottom: '1.5px dashed color-mix(in srgb, var(--color-ink) 22%, transparent)',
                }}
              >
                <Calendar color="var(--color-subtle)" size={16} />
                <TextField
                  variant="bare"
                  size="sm"
                  aria-label="From date"
                  style={{ minHeight: '44px' }}
                  value={v.rangeFrom ?? ''}
                  onChange={v.setRangeFrom}
                  type="date"
                />
                <span
                  style={{
                    flex: 'none',
                    fontSize: 'var(--text-md)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-hairline)',
                  }}
                >
                  →
                </span>
                <TextField
                  variant="bare"
                  size="sm"
                  aria-label="To date"
                  style={{ minHeight: '44px' }}
                  value={v.rangeTo ?? ''}
                  onChange={v.setRangeTo}
                  type="date"
                  min={v.rangeMin}
                />
              </div>
            </>
          ) : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {(v.diaryList ?? []).map((e, i) => (
            <Fragment key={i}>
              <ChronicleRow entry={e} />
            </Fragment>
          ))}
        </div>
        {v.diaryEmpty ? (
          <>
            <Text variant="body" as="p" tone="muted" style={{ margin: '24px 0 0' }}>
              {v.diaryEmptyNote}
            </Text>
          </>
        ) : null}
      </div>
    </>
  );
}
