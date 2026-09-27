import { Button } from '@moonshot/design-system/buttons';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Popover } from '@moonshot/design-system/popover';
import { FilterButton } from '@/components/FilterButton';
import type { PlannerVals } from '@/features/planner/store/types';

/** The Spellbook’s target-area filter: its button and the areas to pick. */
export function AreaFilter({ v }: { v: PlannerVals }) {
  return (
    <Popover
      open={!!v.areaFilterOpen}
      onClose={v.closeAreaFilter}
      width="anchor"
      top={74}
      pad="sm"
      style={{ width: '100%' }}
      content={
        <>
          <div role="group" aria-label="Show exercises for these target areas" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(v.areaFilterOptions ?? []).map((o) => (
              <Checkbox key={o?.name} checked={!!o?.on} onChange={o?.set}>
                {o?.name}
              </Checkbox>
            ))}
          </div>
          {v.areaFilterActive ? (
            <Button
              type="neutral"
              ghost
              size="sm"
              onClick={v.clearAreaFilter}
              style={{ marginTop: '12px' }}
            >
              Clear filter
            </Button>
          ) : null}
        </>
      }
    >
      <FilterButton
        label="Target areas"
        value={v.areaFilterLabel}
        active={!!v.areaFilterActive}
        open={!!v.areaFilterOpen}
        onClick={v.toggleAreaFilter}
        aria-label={'Filter by target area: ' + v.areaFilterLabel}
      />
    </Popover>
  );
}
