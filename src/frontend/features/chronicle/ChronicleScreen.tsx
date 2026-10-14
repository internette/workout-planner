// The Chronicle: every entry, filtered by when.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import { ChoiceChips } from '@moonshot/design-system/chip';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { TextField } from '@moonshot/design-system/text-field';
import { Button } from '@moonshot/design-system/buttons';
import { Calendar, Quill } from '@moonshot/design-system/icons';
import { EmptyState } from '@moonshot/design-system/empty-state';
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
        intro={v.diaryBlank ? undefined : 'Newest first.'}
      />
      {/* Nothing written yet: what it's for and where to start, in place of filters with nothing to filter. */}
      {v.diaryBlank ? (
        <EmptyState
          style={{ marginTop: '48px' }}
          medallion="gem"
          icon={<Quill color="var(--color-pink-deep)" size={34} />}
          title="Your story starts here"
          description="After a session, write how it went: how it felt, how hard it was, what to remember. Your moods gather on your Profile."
          actions={
            <Button type="primary" size="lg" glow onClick={v.openNewEntry}>
              Write your first entry
            </Button>
          }
        />
      ) : null}
      {v.diaryBlank ? null : <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
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
              padding: 'var(--space-1) var(--space-0h)',
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
                fontSize: 'var(--text-base)',
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
      </div>}
      {monthsOf(v.diaryList ?? []).map((g) => (
        <section key={g.label} aria-label={g.label.charAt(0) + g.label.slice(1).toLowerCase()}>
          <SectionLabel label={g.label} note={plural(g.entries.length, 'entry', 'entries')} style={{ margin: 'var(--space-5) 0 var(--space-2)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2h)' }}>
            {g.entries.map((e, i) => (
              <ChronicleRow key={i} entry={e} />
            ))}
          </div>
        </section>
      ))}
      {v.diaryEmpty && !v.diaryBlank ? (
        <Text variant="body" as="p" tone="muted" style={{ margin: 'var(--space-6) 0 0' }}>
          {v.diaryEmptyNote}
        </Text>
      ) : null}
    </div>
  );
}
