'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ExerciseIcon } from '@/components/ui/icons';
import { IconTile } from '@/components/ui/icon-tile';
import { ReorderableList } from '@/components/ui/reorderable-list';
import { Text } from '@/components/ui/typography';
import { DocPage, h2, note } from '../docs';

const START = [
  { name: 'Bench Press', sets: '4 × 8', icon: 'h' },
  { name: 'Overhead Press', sets: '3 × 10', icon: 'v' },
  { name: 'Tricep Dip', sets: '3 × 12', icon: 'd' },
  { name: 'Push-up', sets: '3 × 15', icon: 'h' },
];

export default function ReorderableListPage() {
  const [rows, setRows] = useState(START);
  const [said, setSaid] = useState('');
  const move = (from: number, to: number) => {
    const next = rows.slice();
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    setRows(next);
    setSaid(row.name + ' moved to ' + (to + 1) + ' of ' + next.length + '.');
  };

  return (
    <DocPage title="Reorderable list">
      <p style={{ ...note, marginTop: 8 }}>
        Rows that can be put in a new order. Import it from <code>@/components/ui/reorderable-list</code>. The workout
        editor uses it for a workout&apos;s exercises.
      </p>

      <h2 id="example" style={h2}>Example</h2>
      <p style={note}>
        Drag a row by its grip. It lifts and follows the pointer, the others slide aside to show where it will land, and
        it moves there when you let go. Near the top or bottom of the window the page scrolls, so a row can be carried
        past what&apos;s in view. Try the arrow keys on a grip too.
      </p>
      <div style={{ maxWidth: 420 }}>
        <ReorderableList
          items={rows}
          getKey={(r) => r.name}
          handleLabel={(r, i) => 'Move ' + r.name + ', ' + (i + 1) + ' of ' + rows.length}
          onMove={move}
          renderItem={(r, _, handle) => (
            <Card pad="sm">
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                {handle}
                <IconTile size="sm">
                  <ExerciseIcon name={r.icon} color="var(--color-accent)" />
                </IconTile>
                <div style={{ minWidth: 0 }}>
                  <Text variant="itemTitle" as="div">
                    {r.name}
                  </Text>
                  <Text variant="caption" tone="muted" as="div">
                    {r.sets}
                  </Text>
                </div>
              </div>
            </Card>
          )}
        />
        <p role="status" className="sr-only">
          {said}
        </p>
      </div>

      <h2 id="using-it" style={h2}>Using it</h2>
      <p style={note}>
        Give it the <code>items</code>, a stable <code>getKey</code> for each (so a moved row keeps its focus and
        whatever it has open), and <code>renderItem</code>, which gets the item, its place and the <code>handle</code>{' '}
        to put in the row, usually first. There&apos;s no handle when there&apos;s only one row. <code>onMove(from,
        to)</code> is where you put the items in their new order. <code>gap</code> sets the space between rows (14px by
        default).
      </p>

      <h2 id="behaviour" style={h2}>Behaviour</h2>
      <p style={note}>
        The grip is a button, 28px wide and 44px tall, with a larger touch target; a finger on it drags the row instead
        of scrolling the page. Its name, from <code>handleLabel</code>, says what moves and where it is (&ldquo;Move
        Bench Press, 2 of 4&rdquo;), and a hint read after it says how to use it. Up and down move the row one place,
        Home and End to the top and bottom, and focus stays on the grip. After a move, announce where it went in an{' '}
        <code>aria-live</code> region, as the planner does and this page does.
      </p>
    </DocPage>
  );
}
