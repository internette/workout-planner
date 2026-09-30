import { Button } from '@moonshot/design-system/buttons';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Chip } from '@moonshot/design-system/chip';
import { Dialog } from '@moonshot/design-system/dialog';
import { Close, Sliders } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { ChipRow } from '@/frontend/components/ChipRow';
import { ChoiceChips } from '@/frontend/components/ChoiceChips';
import { DisclosureChevron } from '@/frontend/components/DisclosureChevron';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** The Spellbook's Filter button, beside the search: how many filters are on, and a sheet to change them. */
export function FilterButton({ v }: { v: PlannerVals }) {
  const n = v.activeFilters?.length ?? 0;
  return (
    <>
      <button
        type="button"
        onClick={v.openFilter}
        aria-haspopup="dialog"
        aria-label={n ? 'Filter, ' + n + ' on' : 'Filter'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 'none',
          padding: '0 16px',
          background: 'var(--color-surface)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--elevation-hairline)',
          fontFamily: 'inherit',
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-ink)',
          cursor: 'pointer',
        }}
      >
        <Sliders color="var(--color-muted)" size={18} />
        {/* The word goes on the narrowest phones, to leave the search room; the button's name still says it. */}
        <span className="filter-word">Filter</span>
        {n ? (
          <span
            aria-hidden="true"
            style={{
              minWidth: '20px',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-accent)',
              color: 'var(--color-on-accent)',
              fontSize: 'var(--text-xs)',
              textAlign: 'center',
            }}
          >
            {n}
          </span>
        ) : null}
      </button>
      <FilterSheet v={v} />
    </>
  );
}

/** What's filtered, under the search: a chip for each, ✕ to take it off, and Clear for all of them. Nothing when
 * nothing is. */
export function ActiveFilters({ v }: { v: PlannerVals }) {
  const list = v.activeFilters ?? [];
  if (!list.length) return null;
  return (
    <div role="group" aria-label="Filters on" style={{ marginTop: '10px' }}>
      <ChipRow>
        {list.map((f) => (
          <Chip
            key={f.label}
            size="md"
            onClick={f.remove}
            aria-label={'Remove filter: ' + f.label}
            trailing={<Close color="var(--color-muted)" strokeWidth={2.2} size={13} />}
          >
            {f.label}
          </Chip>
        ))}
        {list.length > 1 ? (
          <Button type="neutral" ghost size="sm" onClick={v.clearFilters}>
            Clear
          </Button>
        ) : null}
      </ChipRow>
    </div>
  );
}

const section = { marginTop: '20px' };
const heading = { marginBottom: '10px' };

/** The filters themselves: the kind (workouts only), target areas, and the equipment you have. A sheet on a phone. */
function FilterSheet({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.filterOpen}
      onClose={v.closeFilter}
      title={v.filterTitle ?? 'Filter'}
      sheet
      actions={
        <>
          {v.activeFilters?.length ? (
            <Button type="neutral" ghost size="md" onClick={v.clearFilters}>
              Clear all
            </Button>
          ) : null}
          <Button type="primary" size="md" onClick={v.closeFilter}>
            {v.filterShowLabel}
          </Button>
        </>
      }
    >
      {v.showKindInFilter ? (
        <div style={section}>
          <Text variant="eyebrow" as="div" tone="slate" aria-hidden="true" style={heading}>
            KIND
          </Text>
          <ChoiceChips label="Kind" options={v.workoutKindOptions ?? []} value={v.workoutKind} onChange={v.setWorkoutKind} />
        </div>
      ) : null}
      <div style={section}>
        <Text variant="eyebrow" as="div" tone="slate" aria-hidden="true" style={heading}>
          TARGET AREAS
        </Text>
        <div role="group" aria-label="Target areas">
          <ChipRow>
            {(v.areaFilterOptions ?? []).map((o) => (
              <Chip key={o.name} tone="choice" size="md" selected={o.on} onClick={() => o.set(!o.on)}>
                {o.name}
              </Chip>
            ))}
          </ChipRow>
        </div>
      </div>
      {v.equipFilterShown ? (
        <div style={section}>
          <Text variant="eyebrow" as="div" tone="slate" aria-hidden="true" style={{ marginBottom: '2px' }}>
            EQUIPMENT YOU HAVE
          </Text>
          <Text variant="caption" tone="muted" as="p" style={{ margin: '0 0 4px' }}>
            Shows what you can do with what you tick. Bodyweight exercises always show. Kept on this device.
          </Text>
          <EquipmentGroups v={v} />
        </div>
      ) : null}
    </Dialog>
  );
}

/** The equipment to tick, by group. Each group opens on its own; its ticks show on its row while it's closed. */
function EquipmentGroups({ v }: { v: PlannerVals }) {
  return (
    <>
      {(v.equipFilterGroups ?? []).map((g, gi) => (
        <div key={g.label}>
          <button
            type="button"
            aria-expanded={g.open}
            aria-controls={'equip-filter-' + gi}
            onClick={g.toggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              minHeight: '44px',
              padding: '0 2px',
              border: 'none',
              borderBottom: '1px solid var(--color-line)',
              background: 'none',
              fontFamily: 'inherit',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <Text variant="label" as="span" tone="ink" style={{ flex: 'none' }}>
              {g.label}
            </Text>
            <Text
              variant="caption"
              as="span"
              tone="accent"
              weight="semibold"
              style={{ flex: '1', minWidth: '0', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {g.picked}
            </Text>
            <DisclosureChevron open={!!g.open} />
          </button>
          {g.open ? (
            <div
              id={'equip-filter-' + gi}
              role="group"
              aria-label={g.label}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '10px 12px', padding: '12px 0 8px' }}
            >
              {g.items.map((o) => (
                <Checkbox key={o.name} checked={o.on} onChange={o.set}>
                  {o.name}
                </Checkbox>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
}
