'use client';

import { Button } from '@/components/ui/buttons';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { colors } from '@/components/ui/colors';
import { Bike, Calendar, Check, Dumbbell, Sparkle } from '@/components/ui/icons';
import { SegmentedControl } from '@/components/ui/segmented-control';
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
