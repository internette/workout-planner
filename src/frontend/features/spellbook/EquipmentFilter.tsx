import { Button } from '@moonshot/design-system/buttons';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Popover } from '@moonshot/design-system/popover';
import { Text } from '@moonshot/design-system/typography';
import { FilterButton } from '@/frontend/components/FilterButton';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { DisclosureChevron } from '@/frontend/components/DisclosureChevron';

/** The Spellbook’s equipment filter: its button and the equipment to tick, by group. */
export function EquipmentFilter({ v }: { v: PlannerVals }) {
  return (
    <Popover
      open={!!v.equipFilterOpen}
      onClose={v.closeEquipFilter}
      width={typeof window === 'undefined' ? 340 : Math.min(340, window.innerWidth - 32)}
      top={74}
      pad="sm"
      style={{ width: '100%' }}
      content={
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Text variant="caption" tone="slate" as="p" style={{ margin: '0 0 4px' }}>
            Show what you can do with the equipment you tick. Bodyweight exercises always show.
          </Text>
          {(v.equipFilterGroups ?? []).map((g, gi) => (
            <div key={g.label}>
              {/* Each group opens on its own; its ticks show on its row while it's closed. */}
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
                <Text variant="eyebrow" as="span" tone="muted" style={{ flex: 'none' }}>
                  {g.label.toUpperCase()}
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
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '8px 12px', padding: '12px 0 8px' }}
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
          {v.equipFilterActive ? (
            <Button type="neutral" ghost size="sm" onClick={v.clearEquipFilter} style={{ marginTop: '12px' }}>
              Clear filter
            </Button>
          ) : null}
        </div>
      }
    >
      <FilterButton
        label="Equipment"
        value={v.equipFilterLabel}
        active={!!v.equipFilterActive}
        open={!!v.equipFilterOpen}
        onClick={v.toggleEquipFilter}
        aria-label={v.equipFilterName}
      />
    </Popover>
  );
}
