import { TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import { IconPicker } from '@/frontend/components/IconPicker';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** The editor’s top: the workout’s icon and colour picker, and its name. */
export function EditorHeader({ v }: { v: PlannerVals }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 12px', marginTop: '18px' }}>
      <IconPicker
        open={!!v.iconsOpen}
        onToggle={v.toggleIcons}
        onClose={v.closeIcons}
        current={v.workoutIcoSvg}
        label="Choose workout icon"
        iconsLabel="Workout icon"
        icons={v.workoutIconGrid}
        colors={v.iconColors}
      />
      <div style={{ flex: '1 1 220px', minWidth: '0' }}>
        <Text variant="eyebrow" as="h1" tone="slate" style={{ margin: 0 }}>
          {v.eEyebrow}
        </Text>
        {v.eNamePlaceholder ? (
          <TextField
            variant="title"
            aria-label="Workout name"
            value={v.eName ?? ''}
            onChange={v.setNewName}
            onKeyDown={v.commitOnEnter}
            placeholder="Name this workout"
            error={v.nameError || undefined}
          />
        ) : null}
        {v.eNameStatic ? (
          <TextField
            variant="title"
            aria-label="Workout name"
            value={v.eName ?? ''}
            onChange={v.setEditName}
            onKeyDown={v.commitOnEnter}
            placeholder="Name this workout"
            error={v.nameError || undefined}
          />
        ) : null}
      </div>
    </div>
  );
}
