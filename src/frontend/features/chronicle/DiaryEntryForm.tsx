import { Button } from '@moonshot/design-system/buttons';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { vars } from '@moonshot/design-system/colors';
import { Sparkle } from '@moonshot/design-system/icons';
import { MoodRating, StarRating } from '@moonshot/design-system/rating';
import { TextArea } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Writing or editing a Chronicle entry: mood, effort and notes. */
export function DiaryEntryForm({ v }: { v: PlannerVals }) {
  return (
    <>
      {/* Centred on a phone; beside the sidebar it sits in the page's column, like a saved entry. */}
      <div style={{ marginTop: '32px', textAlign: v.entryLeft ? 'left' : 'center' }}>
        {v.writeEyebrow ? (
          <Text variant="eyebrow" as="div" tone="slate" style={{ marginBottom: '8px' }}>
            {v.writeEyebrow}
          </Text>
        ) : null}
        <Text variant="title" as="h1" style={{ margin: '0' }}>
          {'How did that feel? '}
          <Sparkle
            size={17}
            color={vars.periwinkle}
            glow={0.5}
            style={{ display: 'inline-block', verticalAlign: 'middle' }}
          />
        </Text>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-muted)',
          }}
        >
          <span style={{ color: 'var(--color-ink)', fontWeight: 'var(--font-weight-semibold)' }}>{v.eName}</span>
          {' · '}
          {v.longDate}
        </p>
      </div>
      <MoodRating
        label="How did it feel?"
        value={v.mood}
        onChange={v.pickMood}
        style={{ margin: v.entryLeft ? '28px 0 0 -2px' : '34px auto 0' }}
      />
      <div style={{ maxWidth: '560px', margin: v.entryLeft ? '40px 0 0' : '40px auto 0' }}>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
        >
          <Text variant="label" weight="semibold" tone="slate" as="p" style={{ margin: '0' }}>
            How hard did it feel?
          </Text>
        </div>
        {/* The effort word right after the stars, as a saved entry shows it: "★★★★☆ Hard". */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: '8px' }}>
          <StarRating
            label="How hard did it feel?"
            value={v.rpe}
            onChange={v.pickRpe}
            words={v.rpeWords}
            style={{ marginLeft: '-8px' }}
          />
          {v.rpeLabel ? (
            <span
              style={{
                marginLeft: '8px',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-accent-deep)',
              }}
            >
              {v.rpeLabel}
            </span>
          ) : null}
        </div>
        <Text variant="label" weight="semibold" tone="slate" as="p" style={{ margin: '28px 0 8px' }}>
          Notes (optional)
        </Text>
        <TextArea
          aria-label="Notes"
          rows={5}
          value={v.entryNote ?? ''}
          onChange={v.setEntryNote}
          placeholder="Energy, soreness, what worked, what didn't…"
        />
        {v.showMarkDone ? (
          <div style={{ marginTop: '16px' }}>
            <Checkbox switch checked={!!v.markDoneOn} onChange={v.setMarkDone}>
              {v.markDoneLabel}
            </Checkbox>
          </div>
        ) : null}
        {v.saveEntryHint ? (
          <Text id="save-entry-hint" variant="caption" tone="muted" as="p" style={{ margin: '16px 0 0', textAlign: 'center' }}>
            {v.saveEntryHint}
          </Text>
        ) : null}
        <Button
          type="primary"
          size="lg"
          fullWidth
          glow
          onClick={v.saveEntry}
          aria-disabled={!v.canSaveEntry}
          aria-describedby={v.saveEntryHint ? 'save-entry-hint' : undefined}
          style={{ marginTop: v.saveEntryHint ? '10px' : '22px' }}
        >
          {v.saveEntryLabel}
        </Button>
      </div>
    </>
  );
}
