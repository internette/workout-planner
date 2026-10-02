// One saved workout: its exercises or ride plan, notes, and putting it on the calendar.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import { IconTile } from '@moonshot/design-system/icon-tile';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { Chip, ChipGroup } from '@moonshot/design-system/chip';
import { Button } from '@moonshot/design-system/buttons';
import { Calendar, Check, Clock, Copy, Pencil } from '@moonshot/design-system/icons';
import { BackBar } from '@/frontend/components/BackBar';
import { DeleteSection } from '@/frontend/components/DeleteSection';
import { Callout } from '@/frontend/components/Callout';
import { StatRow } from '@/frontend/components/StatRow';
import { NeedsLine } from '@/frontend/components/NeedsLine';
import { NotesCard } from '@/frontend/components/NotesCard';
import { PageTitle } from '@/frontend/components/PageTitle';
import { ScheduleDialog } from '@/frontend/features/spellbook/ScheduleDialog';

export function TemplateScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack}>
        {v.template.builtin ? (
          <Button
            type="secondary"
            size="sm"
            onClick={v.template.copy}
            style={{ whiteSpace: 'nowrap' }}
          >
            <Copy color="var(--color-accent-deep)" size={16} />
            {v.template.copyLabel}
          </Button>
        ) : (
          <Button
            type="secondary"
            size="sm"
            onClick={v.template.edit}
            style={{ whiteSpace: 'nowrap' }}
          >
            <Pencil color="var(--color-accent-deep)" size={16} />
            Edit
          </Button>
        )}
      </BackBar>
      <PageTitle icon={v.template.svg} eyebrow={v.template.eyebrow} title={v.template.name} />
      <ChipGroup style={{ marginTop: '18px' }}>
        <Chip icon={<Clock color="var(--color-muted)" size={15} />}>{v.template.time}</Chip>
        {(v.template.areas ?? []).map((a, i) => (
          <Chip key={i}>{a}</Chip>
        ))}
      </ChipGroup>
      <NeedsLine text={v.template.needs} />
      {v.template.notes ? (
        <NotesCard style={{ marginTop: '12px' }}>{v.template.notes}</NotesCard>
      ) : null}
      <Button type="primary" size="lg" fullWidth onClick={v.template.schedule} style={{ marginTop: '18px' }}>
        <Calendar color="var(--color-on-accent)" size={17} />
        Add to calendar
      </Button>
      {v.scheduleCalendar?.done ? (
        <Callout
          tone="success"
          icon={<Check color="var(--color-accent-deep)" strokeWidth={2.4} size={16} />}
          action={
            <Button type="neutral" ghost size="sm" onClick={v.scheduleCalendar.viewDay}>
              View day
            </Button>
          }
          style={{ marginTop: '12px' }}
        >
          {v.scheduleCalendar.done}
        </Callout>
      ) : null}
      <ScheduleDialog v={v} />
      {v.template.isRide ? (
        <Card style={{ marginTop: '18px' }}>
          <StatRow size="lg" stats={v.template.rideStats ?? []} />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '18px' }}>
          {(v.template.exercises ?? []).map((e, i) => (
            <Card key={i} pad="sm" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <IconTile as="span" size="xs" variant="flat">{e?.svg}</IconTile>
              <span style={{ flex: '1', minWidth: '0' }}>
                <Text variant="subheading" tone="ink" style={{ display: 'block' }}>
                  {e?.name}
                </Text>
                <Text
                  variant="body"
                  tone="muted"
                  style={{ display: 'block', marginTop: '3px' }}
                >
                  {e?.detail}
                </Text>
              </span>
            </Card>
          ))}
          {(v.template.exercises ?? []).length === 0 ? (
            <Text variant="body" as="p" tone="muted" style={{ margin: '4px 0 0' }}>
              No exercises in this workout yet.
            </Text>
          ) : null}
        </div>
      )}
      {v.template.builtin ? (
        <Text variant="body" as="p" tone="slate" style={{ margin: '28px 0 0', maxWidth: '520px' }}>
          {v.template.builtinNote}
        </Text>
      ) : (
        <DeleteSection label="Delete workout" onClick={v.template.remove} />
      )}
    </div>
  );
}
