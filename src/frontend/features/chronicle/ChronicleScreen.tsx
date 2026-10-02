// The Chronicle: every entry, filtered by when.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import { ChoiceChips } from '@moonshot/design-system/chip';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { TextField } from '@moonshot/design-system/text-field';
import { Button } from '@moonshot/design-system/buttons';
import { Calendar } from '@moonshot/design-system/icons';
import { PageHeader } from '@/frontend/components/PageHeader';
import { ChronicleRow } from '@/frontend/features/chronicle/ChronicleRow';
import { plural } from '@/frontend/shared/helpers';

type Scope = 'all' | 'week' | 'month' | 'range';
const SCOPES: { value: Scope; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: '30 days' },
  { value: 'range', label: 'Range' },
];

// The entries (newest first) under their months, each month once.
const monthsOf = (list: any[]) =>
  list.reduce<{ label: string; entries: any[] }[]>((groups, e) => {
    const last = groups[groups.length - 1];
    if (last && last.label === e.month) last.entries.push(e);
    else groups.push({ label: e.month, entries: [e] });
    return groups;
  }, []);

export function ChronicleScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      <PageHeader
        title="Chronicle"
        count={v.diaryCount}
        action={
          <Button type="primary" size="sm" onClick={v.openNewEntry}>
            New entry
          </Button>
        }
        intro="Newest first."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        <span className="sr-only" role="status">
          {v.diaryResults}
        </span>
        {/* On the page, not a card; small and compact, so all four fit on a narrow phone. */}
        <ChoiceChips
          label="Show entries from"
          size="sm"
          surface="page"
          compact
          options={SCOPES}
          value={(v.diaryScope ?? 'all') as Scope}
          onChange={v.setDiaryScope}
        />
        {v.rangeShown ? (
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
            <Calendar color="var(--color-muted)" size={16} />
            <TextField
              variant="bare"
              size="sm"
              aria-label="From date"
              style={{ minHeight: '44px' }}
              value={v.rangeFrom ?? ''}
              onChange={v.setRangeFrom}
              type="date"
            />
            {/* Only to look at: the fields are named From and To. */}
            <span
              aria-hidden="true"
              style={{
                flex: 'none',
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-muted)',
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
        ) : null}
      </div>
      {monthsOf(v.diaryList ?? []).map((g) => (
        <section key={g.label} aria-label={g.label.charAt(0) + g.label.slice(1).toLowerCase()}>
          <SectionLabel label={g.label} note={plural(g.entries.length, 'entry', 'entries')} style={{ margin: '20px 0 8px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {g.entries.map((e, i) => (
              <ChronicleRow key={i} entry={e} />
            ))}
          </div>
        </section>
      ))}
      {v.diaryEmpty ? (
        <Text variant="body" as="p" tone="muted" style={{ margin: '24px 0 0' }}>
          {v.diaryEmptyNote}
        </Text>
      ) : null}
    </div>
  );
}
