import { IconChoiceGroup } from '@moonshot/design-system/icon-choice-group';
import { IconTileButton } from '@moonshot/design-system/icon-tile';
import { Popover } from '@moonshot/design-system/popover';
import { TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/features/planner/store/types';

/** The editor’s top: the workout’s icon and colour picker, and its name. */
export function EditorHeader({ v }: { v: PlannerVals }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 12px', marginTop: '18px' }}>
      <Popover
        open={!!v.iconsOpen}
        onClose={v.closeIcons}
        width={238}
        top={52}
        content={
          <>
            <Text variant="eyebrow" as="div" tone="slate" style={{ padding: '0 2px 10px' }}>
              ICON
            </Text>
            <IconChoiceGroup label="Workout icon" columns={5} {...v.workoutIconGrid} />
            <Text
              variant="eyebrow"
              as="div"
              tone="slate"
              style={{ padding: '14px 2px 10px' }}
            >
              COLOR
            </Text>
            <IconChoiceGroup label="Icon colour" kind="swatch" {...v.iconColors} />
          </>
        }
      >
        <IconTileButton onClick={v.toggleIcons} aria-label="Choose workout icon" aria-expanded={v.iconsOpen}>
          {v.workoutIcoSvg}
        </IconTileButton>
      </Popover>
      <div style={{ flex: '1 1 220px', minWidth: '0' }}>
        <Text variant="eyebrow" as="h1" tone="slate" style={{ margin: 0 }}>
          {v.eEyebrow}
        </Text>
        {v.eNamePlaceholder ? (
          <>
            <TextField
              variant="title"
              aria-label="Workout name"
              value={v.eName ?? ''}
              onChange={v.setNewName}
              onKeyDown={v.commitOnEnter}
              placeholder="Name this workout"
              error={v.nameError || undefined}
            />
          </>
        ) : null}
        {v.eNameStatic ? (
          <>
            <TextField
              variant="title"
              aria-label="Workout name"
              value={v.eName ?? ''}
              onChange={v.setEditName}
              onKeyDown={v.commitOnEnter}
              placeholder="Name this workout"
              error={v.nameError || undefined}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
