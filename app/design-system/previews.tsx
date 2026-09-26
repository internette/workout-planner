'use client';

import { Button } from '@/components/ui/buttons';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Chip } from '@/components/ui/chip';
import { colors } from '@/components/ui/colors';
import { Bike, Calendar, Check, Dumbbell, ExerciseIcon, Sparkle } from '@/components/ui/icons';
import { IconTile } from '@/components/ui/icon-tile';
import { OptionCard, OptionGroup } from '@/components/ui/option-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Stat } from '@/components/ui/stat';
import { TextField } from '@/components/ui/text-field';
import { Text } from '@/components/ui/typography';

const noop = () => undefined;

// A small live sample of each section, shown on the overview page.
export function Preview({ slug }: { slug: string }) {
  switch (slug) {
    case 'colors':
      return (
        <>
          {(['pink', 'periwinkle', 'teal', 'coral', 'slate'] as const).map((name) => (
            <span
              key={name}
              style={{ width: 24, height: 24, borderRadius: '50%', background: colors[name], boxShadow: '0 0 0 2px var(--color-white)' }}
            />
          ))}
        </>
      );
    case 'typography':
      return (
        <>
          <Text variant="display" tone="ink">
            Aa
          </Text>
          <Text variant="body" tone="muted">
            The city is quiet
          </Text>
        </>
      );
    case 'icons':
      return (
        <>
          <Calendar size={24} color="var(--color-muted)" />
          <Dumbbell size={24} color="var(--color-pink)" />
          <Bike size={24} color="var(--color-periwinkle)" />
          <Check size={24} color="var(--color-ink)" strokeWidth={2.4} />
          <Sparkle size={22} color={colors.teal} glow={0.5} />
        </>
      );
    case 'buttons':
      return (
        <>
          <Button type="primary" size="sm">
            Save
          </Button>
          <Button type="neutral" ghost size="sm">
            Cancel
          </Button>
        </>
      );
    case 'card':
      return (
        <Card pad="sm" style={{ width: 180 }}>
          <Text variant="itemTitle" tone="ink" as="div">
            Upper Body Push
          </Text>
          <Text variant="caption" tone="muted" as="div">
            3 exercises · ~50 min
          </Text>
        </Card>
      );
    case 'chip':
      return (
        <>
          <Chip>Legs</Chip>
          <Chip tone="choice" selected>
            Tempo
          </Chip>
          <Chip tone="choice">Core</Chip>
        </>
      );
    case 'segmented-control':
      return (
        <SegmentedControl
          label="Example"
          size="sm"
          options={[
            { value: 'Day', label: 'Day' },
            { value: 'Week', label: 'Week' },
            { value: 'Month', label: 'Month' },
          ]}
          value="Week"
          onChange={noop}
        />
      );
    case 'elevation':
      return (
        <>
          {(['hairline', 'raised', 'overlay'] as const).map((name) => (
            <span key={name} style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-white)', boxShadow: `var(--elevation-${name})` }} />
          ))}
        </>
      );
    case 'radii':
      return (
        <>
          {(['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((name) => (
            <span
              key={name}
              style={{ width: 32, height: 32, background: 'var(--color-pink-tint)', boxShadow: 'inset 0 0 0 2px var(--color-pink)', borderRadius: `var(--radius-${name})` }}
            />
          ))}
        </>
      );
    case 'spacing':
      return (
        <span style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <span key={step} style={{ width: `var(--space-${step})`, height: `var(--space-${step})`, borderRadius: 'var(--radius-xs)', background: 'var(--color-periwinkle)' }} />
          ))}
        </span>
      );
    case 'motion':
      return (
        <>
          <Button type="neutral" ghost size="sm">
            0.15s
          </Button>
          <Button type="primary" size="sm">
            ease
          </Button>
        </>
      );
    case 'interaction':
      return (
        <>
          <span style={{ width: 40, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--hover-neutral)', boxShadow: 'inset 0 0 0 1px var(--color-divider)' }} />
          <span style={{ width: 40, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--color-white)', outline: 'var(--focus-ring)', outlineOffset: 'var(--focus-offset)' }} />
        </>
      );
    case 'progress-bar':
      return (
        <div style={{ width: 190, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ProgressBar value={75} track="tint" />
          <ProgressBar value={40} />
        </div>
      );
    case 'stat':
      return (
        <div style={{ display: 'flex', gap: 22 }}>
          <Stat size="lg" label="SETS × REPS" value="4 × 8" />
          <Stat size="lg" label="WEIGHT" value="95 lb" />
        </div>
      );
    case 'icon-tile':
      return (
        <>
          <IconTile>
            <ExerciseIcon name="h" size={22} color="var(--color-pink)" />
          </IconTile>
          <IconTile size="sm">
            <Bike size={20} color="var(--color-pink)" />
          </IconTile>
        </>
      );
    case 'checkbox':
      return (
        <div style={{ width: 200 }}>
          <Checkbox checked onChange={noop}>
            Repeat weekly
          </Checkbox>
        </div>
      );
    case 'option-card':
      return (
        <div style={{ width: 210 }}>
          <OptionGroup label="Example">
            <OptionCard name="preview" value="a" checked onChange={noop} title="Update this workout" />
            <OptionCard name="preview" value="b" checked={false} onChange={noop} title="Save as a new workout" />
          </OptionGroup>
        </div>
      );
    case 'dialog':
      return (
        <Card pad="sm" elevation="overlay" style={{ width: 190 }}>
          <Text variant="itemTitle" tone="ink" as="div">
            Delete this workout?
          </Text>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10 }}>
            <Button type="neutral" ghost size="sm">
              Keep it
            </Button>
            <Button type="danger" size="sm">
              Delete
            </Button>
          </div>
        </Card>
      );
    case 'popover':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
          <Chip icon={<Calendar color="var(--color-muted)" size={15} />}>Thu, Sep 17</Chip>
          <Card pad="xs" elevation="overlay" style={{ width: 150 }}>
            <Text variant="caption" tone="muted">
              Floats under it
            </Text>
          </Card>
        </div>
      );
    case 'text-field':
      return (
        <Card pad="xs" style={{ width: 190 }}>
          <TextField aria-label="Weight" placeholder="45 lb" readOnly />
        </Card>
      );
    default:
      return null;
  }
}
