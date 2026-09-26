'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import type { Mood } from '@/components/ui/icons';
import { MoodRating, StarRating } from '@/components/ui/rating';
import { Text } from '@/components/ui/typography';
import { DocPage, h2, note } from '../docs';

const WORDS = ['Easy', 'Steady', 'Solid', 'Hard', 'All out'];

export default function RatingPage() {
  const [mood, setMood] = useState<Mood | ''>('');
  const [effort, setEffort] = useState(0);

  return (
    <DocPage title="Rating">
      <p style={{ ...note, marginTop: 8 }}>
        How a workout felt, as a mood and an effort. Import them from <code>@/components/ui/rating</code>. Both are
        radio groups, so give each a <code>label</code> that asks the question.
      </p>

      <h2 id="mood" style={h2}>Mood</h2>
      <p style={note}>
        <code>MoodRating</code>: four faces, Happy to Mad, each on its own colour with its name beneath. They sit four
        across at every width, the faces sized to the screen (48–60px). Once one is picked it takes a ring in its colour
        and the others fade back, their names still at full strength. The colours are the moods&apos; own
        (<code>MOOD_COLORS</code>), so Happy stays pink in every theme.
      </p>
      <Card style={{ maxWidth: 420 }}>
        <MoodRating label="How did it feel?" value={mood} onChange={setMood} />
      </Card>

      <h2 id="effort" style={h2}>Effort</h2>
      <p style={note}>
        <code>StarRating</code>: five stars, filled to the rating with the gem gradient. Each star is a 44px target
        around a 36px star. Pass <code>words</code> and each star says its word too (&ldquo;4 of 5, Hard&rdquo;); show
        the picked word beside the stars, as the entry form does.
      </p>
      <Card style={{ maxWidth: 420 }}>
        <Text variant="label" as="div" tone="slate">
          How hard did it feel?
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
          <StarRating label="How hard did it feel?" value={effort} onChange={setEffort} words={WORDS} style={{ marginLeft: -6 }} />
          {effort ? (
            <Text variant="cardTitle" as="span" tone="accent" style={{ marginLeft: 8 }}>
              {WORDS[effort - 1]}
            </Text>
          ) : null}
        </div>
      </Card>

      <h2 id="showing-a-rating" style={h2}>Showing a rating</h2>
      <p style={note}>
        <code>readOnly</code> just shows the stars, at 18px, for a saved entry. They&apos;re hidden from screen readers,
        so say the rating in text beside them.
      </p>
      <Card pad="sm" style={{ maxWidth: 260 }}>
        <Text variant="micro" as="div" tone="subtle">
          EFFORT
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
          <Text variant="cardTitle" tone="ink">
            Hard
          </Text>
          <StarRating readOnly value={4} />
        </div>
      </Card>

      <h2 id="behaviour" style={h2}>Behaviour</h2>
      <p style={note}>
        Tab reaches the picked option, or the first before anything is picked, and Tab again leaves the group. The arrow
        keys move the pick one option, wrapping round; Home and End go to the first and last. In forced-colour modes the
        faces keep their colours, and the stars fill with the text colour up to the rating and grey after it.
      </p>
    </DocPage>
  );
}
