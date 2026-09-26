'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { colors, themed } from '@/components/ui/colors';
import { ACCENTS } from '@/components/ui/colors/themes';
import { Dumbbell, EXERCISE_ICON_NAMES, ExerciseIcon, type ExerciseIconName } from '@/components/ui/icons';
import { IconChoiceGroup } from '@/components/ui/icon-choice-group';
import { IconTile } from '@/components/ui/icon-tile';
import { Label } from '@/components/ui/text-field';
import { Text } from '@/components/ui/typography';
import { DocPage, h2, note } from '../docs';

const ICON_LABELS: Record<ExerciseIconName, string> = { h: 'Dumbbell', v: 'Upright dumbbell', d: 'Small dumbbell', bike: 'Bike' };
const SWATCHES = [
  { value: colors.pink, label: 'Pink' },
  { value: colors.periwinkle, label: 'Periwinkle' },
  { value: colors.teal, label: 'Teal' },
  { value: colors.slate, label: 'Slate' },
  { value: colors.coral, label: 'Coral' },
];
const icons = (color?: string) =>
  EXERCISE_ICON_NAMES.map((name) => ({
    value: name,
    label: ICON_LABELS[name] + ' icon',
    icon: <ExerciseIcon name={name} color={themed(color) || 'var(--color-accent)'} />,
  }));
const swatches = SWATCHES.map((s) => ({ ...s, color: themed(s.value) }));
// The theme colours, as fixed colours: this setting picks the theme, so its swatches don't follow it.
const ACCENT_SWATCHES = ACCENTS.map((a) => ({
  value: a.name,
  label: a.label,
  color: a.swatch,
  checkColor: a.name === 'slate' || a.name === 'pink' ? '#FFFFFF' : '#232A45',
}));

export default function IconChoiceGroupPage() {
  const [icon, setIcon] = useState<string>('h');
  const [workoutIcon, setWorkoutIcon] = useState<string>('h');
  const [colour, setColour] = useState<string>(colors.teal);
  const [accent, setAccent] = useState<string>('pink');

  return (
    <DocPage title="Icon choice group">
      <p style={{ ...note, marginTop: 8 }}>
        Pick one icon, or one colour, from a set shown as pictures. Import it from{' '}
        <code>@/components/ui/icon-choice-group</code>. Give every option a <code>label</code>: the buttons only show a
        picture, so the label is what a screen reader says.
      </p>

      <h2 id="icons" style={h2}>Icons</h2>
      <p style={note}>
        The default <code>kind=&quot;icon&quot;</code>: a grid of 48px tiles on the canvas colour, the chosen one on
        pink tint with a pink ring. Set <code>columns</code> to fit the space; a form uses five, or four on a narrow
        card. Put a visible <code>Label</code> above it, and name the group with <code>label</code>.
      </p>
      <Card style={{ maxWidth: 420 }}>
        <Label style={{ margin: '0 0 8px' }}>Icon</Label>
        <IconChoiceGroup label="Icon" columns={5} options={icons()} value={icon} onChange={setIcon} />
      </Card>

      <h2 id="colours" style={h2}>Colours</h2>
      <p style={note}>
        <code>kind=&quot;swatch&quot;</code>: a wrapping row of 34px squares (the default <code>shape</code>), each filled with its option&apos;s{' '}
        <code>color</code>. The chosen one takes a ring in its own colour, set off by a white gap. Pass the palette&apos;s
        CSS variables (<code>themed(hex)</code>), so the swatches follow the theme. In a workout&apos;s icon picker the
        colour recolours the icons above it.
      </p>
      <Card elevation="overlay" style={{ maxWidth: 320 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <IconTile>
            <ExerciseIcon name={workoutIcon} color={themed(colour)} />
          </IconTile>
          <Text variant="subheading" as="div">
            Upper Push
          </Text>
        </div>
        <Text variant="eyebrow" as="div" tone="slate" style={{ padding: '0 2px 10px' }}>
          ICON
        </Text>
        <IconChoiceGroup label="Workout icon" columns={5} options={icons(colour)} value={workoutIcon} onChange={setWorkoutIcon} />
        <Text variant="eyebrow" as="div" tone="slate" style={{ padding: '14px 2px 10px' }}>
          COLOR
        </Text>
        <IconChoiceGroup label="Icon colour" kind="swatch" options={swatches} value={colour} onChange={setColour} />
      </Card>

      <h2 id="round-swatches" style={h2}>Round swatches</h2>
      <p style={note}>
        <code>shape=&quot;round&quot;</code>, for a colour that is itself the setting rather than a tint for something
        else: the app&apos;s colour, on Profile. The chosen one shows a tick; give each option a{' '}
        <code>checkColor</code> that reads on its colour (white by default). A hairline keeps a pale colour off the card.
        Each swatch has a 44px touch target, so a row of them can sit 6px apart.
      </p>
      <Card style={{ maxWidth: 420 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <Text variant="label" as="div" tone="ink" id="ds-colour-label" style={{ flex: '1 1 120px' }}>
            Colour
          </Text>
          <IconChoiceGroup
            labelledBy="ds-colour-label"
            kind="swatch"
            shape="round"
            style={{ flexWrap: 'nowrap', gap: 6 }}
            options={ACCENT_SWATCHES}
            value={accent}
            onChange={setAccent}
          />
        </div>
      </Card>

      <h2 id="in-a-popover" style={h2}>In a popover</h2>
      <p style={note}>
        <code>onChange</code> gets a second argument, <code>via</code>: <code>&apos;click&apos;</code> for a click, Enter
        or Space, <code>&apos;arrow&apos;</code> for an arrow key. A picker in a popover closes on a click, so a pick
        looks done, but stays open while the arrow keys move through the options. The icons can be any element, like
        this dumbbell turned upright.
      </p>
      <Card elevation="overlay" style={{ maxWidth: 200, padding: 12 }}>
        <IconChoiceGroup
          label="Icon"
          columns={3}
          style={{ gap: 7 }}
          value={icon === 'bike' ? undefined : icon}
          onChange={setIcon}
          options={[
            { value: 'h', label: 'Dumbbell icon', icon: <Dumbbell color="var(--color-accent)" size={20} /> },
            { value: 'v', label: 'Upright dumbbell icon', icon: <Dumbbell color="var(--color-accent)" size={20} style={{ transform: 'rotate(90deg)' }} /> },
            { value: 'd', label: 'Small dumbbell icon', icon: <ExerciseIcon name="d" color="var(--color-accent)" /> },
          ]}
        />
      </Card>

      <h2 id="behaviour" style={h2}>Behaviour</h2>
      <p style={note}>
        A radio group. Tab reaches the chosen option (the first, when nothing is chosen) and Tab again leaves the group.
        The left and right arrow keys move the choice one option, wrapping round; in a grid, up and down move a row.
        Home and End go to the first and last. In forced-colour modes the chosen option gets a highlight outline, and a
        swatch keeps its colour, since the colour is the choice.
      </p>
    </DocPage>
  );
}
