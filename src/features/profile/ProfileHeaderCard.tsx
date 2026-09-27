import { IconButton } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { vars } from '@moonshot/design-system/colors';
import { ChevronRight, Info, Sparkle } from '@moonshot/design-system/icons';
import { Popover } from '@moonshot/design-system/popover';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import { css, t } from '@/features/planner/viewHelpers';
import type { PlannerVals } from '@/features/planner/store/types';

/** Profile: the avatar and name, the rank and the XP to the next one. */
export function ProfileHeaderCard({ v }: { v: PlannerVals }) {
  return (
    <Card
      pad="lg"
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '18px' }}
    >
      {/* The gem ring: the brand gradient, a white gap, then the photo (or the initial). The badge
          carries the gem of the current rank. */}
      <div
        style={{
          position: 'relative',
          width: '86px',
          height: '86px',
          flex: 'none',
          borderRadius: 'var(--radius-full)',
          background: 'var(--gradient-gem)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            inset: '3px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-surface)',
          }}
        ></span>
        <div
          style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--gradient-gem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text variant="display" tone="inverse">
            {v.profileInitial}
          </Text>
          {v.profilePicture ? (
            // Covers the initial. If the photo will not load it hides itself and the initial shows.
            // No referrer, because Google's image host refuses some. A plain <img>, since next/image would
            // need this address listed in the config and cannot hide itself on error.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={v.profilePicture}
              alt=""
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              style={{
                position: 'absolute',
                inset: '0',
                width: '100%',
                height: '100%',
                borderRadius: 'var(--radius-full)',
                objectFit: 'cover',
              }}
            />
          ) : null}
        </div>
        <span style={{ position: 'absolute', top: '0', right: '-3px' }}>
          <Sparkle size={16} color={vars.goldLight} glow={0.6} />
        </span>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-3px',
            bottom: '-3px',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-surface)',
            boxShadow: 'var(--elevation-raised)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              width: '10px',
              height: '14px',
              clipPath: 'polygon(50% 0,100% 35%,50% 100%,0 35%)',
              background: v.avatarGem,
            }}
          ></span>
        </span>
      </div>
      <div style={{ minWidth: '0', flex: '1 1 200px' }}>
        <Text variant="title" as="h1" style={{ margin: '0' }}>
          {v.profileName}
        </Text>
        {v.profileSince ? (
          <Text variant="body" as="p" tone="muted" style={{ margin: '5px 0 0' }}>
            {v.profileSince}
          </Text>
        ) : null}
        <button
          onClick={v.openRanks}
          title="See all 20 ranks"
          aria-label={v.rankName + ' — see all 20 ranks'}
          aria-haspopup="dialog"
          style={css(v.rankPillBtn)}
          className="hv6 hit"
        >
          <span style={css(v.rankGem)}></span>
          {t(v.rankName)}
          <ChevronRight strokeWidth={2.4} size={12} style={{ opacity: '.7' }} />
        </button>
        <Popover
          open={!!v.xpInfoOpen}
          onClose={v.closeXp}
          width={280}
          top={34}
          pad="sm"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '14px' }}
          content={
            <>
              <Text variant="eyebrow" tone="slate" style={{ display: 'block' }}>
                HOW PROGRESS WORKS
              </Text>
              <Text
                variant="body"
                tone="ink"
                style={{ display: 'block', marginTop: '9px', textWrap: 'pretty' }}
              >
                Each exercise you complete earns 10 XP, and finishing a whole workout earns 50
                XP on top. Ranks unlock at fixed XP totals.
              </Text>
              <Text variant="figure" tone="accent" style={{ display: 'block', marginTop: '12px' }}>
                {v.xpLine}
              </Text>
            </>
          }
        >
          <ProgressBar value={v.rankBarPct ?? 0} track="mist" style={{ flex: '1 1 180px', maxWidth: '260px' }} />
          <span
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-slate)',
            }}
          >
            {v.rankProgress}
          </span>
          <IconButton
            label="How XP works"
            size="md"
            circle
            aria-expanded={!!v.xpInfoOpen}
            onClick={v.toggleXpInfo}
            title="How XP works"
            style={{ margin: '-6px' }}
          >
            <Info color="var(--color-muted)" size={16} />
          </IconButton>
        </Popover>
      </div>
    </Card>
  );
}
