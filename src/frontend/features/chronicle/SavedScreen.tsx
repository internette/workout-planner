// After a Chronicle entry is saved: what was written, and what comes next.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Text } from '@moonshot/design-system/typography';
import { Button } from '@moonshot/design-system/buttons';
import { Check } from '@moonshot/design-system/icons';
import { LinkRow } from '@/frontend/components/LinkRow';
import { Twinkles } from '@/frontend/components/Twinkles';

export function SavedScreen({ v }: { v: PlannerVals }) {
  return (
    <div
      style={{
        position: 'relative',
        maxWidth: '520px',
        margin: '0 auto',
        padding: '44px 20px 60px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <Twinkles />
      <div
        style={{
          width: '96px',
          height: '96px',
          margin: '0 auto',
          borderRadius: 'var(--radius-full)',
          background:
            'var(--gradient-gem-tint)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pop .5s cubic-bezier(.2,1.5,.4,1) both',
        }}
      >
        <div
          style={{
            width: '66px',
            height: '66px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-surface)',
            boxShadow: 'var(--elevation-raised)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Check
            color="var(--color-accent)"
            strokeWidth={2.4}
            size={30}
            style={{ strokeDasharray: '30', animation: 'draw .5s .2s ease-out both' }}
          />
        </div>
      </div>
      <Text variant="title" as="h1" style={{ margin: '22px 0 0' }}>
        Written into your Chronicle
      </Text>
      <Text
        variant="body"
        as="p"
        tone="muted"
        style={{ margin: '10px auto 0', maxWidth: '340px', textWrap: 'pretty' }}
      >
        {v.savedLine}
      </Text>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '30px',
          textAlign: 'left',
        }}
      >
        <LinkRow title="Read this entry" detail="Change it any time" onClick={v.readSavedEntry} />
        <LinkRow title="Read your Chronicle" detail={v.savedCount} onClick={v.goDiaryList} />
        <LinkRow title={v.savedNextTitle} detail={v.savedNextMeta} onClick={v.goNextUp} />
        <LinkRow title="See your progress" detail="Streak, week and month totals" onClick={v.goSummary} />
      </div>
      <Button type="neutral" ghost size="md" onClick={v.backToCalendar} style={{ marginTop: '20px' }}>
        Back to calendar
      </Button>
    </div>
  );
}
