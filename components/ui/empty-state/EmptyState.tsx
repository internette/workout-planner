import type { CSSProperties, ElementType, ReactNode } from 'react';
import { Text } from '@/components/ui/typography';

const sizes = {
  // A whole screen with nothing on it yet: the first visit, a rest day.
  lg: { medallion: 78, title: 'title', gap: 22, maxWidth: 340 },
  // A section with nothing in it, inside a screen that has other things: an empty week.
  md: { medallion: 66, title: 'subheading', gap: 20, maxWidth: 340 },
} as const;

export interface EmptyStateProps {
  /** The picture in the medallion: a Gem, a Moon, a Check. Drawn at about half the medallion's width. */
  icon: ReactNode;
  /** The medallion's fill: white (surface, the default), or the soft gem gradient. */
  medallion?: 'surface' | 'gem';
  title: ReactNode;
  /** The title's element: h2 by default. */
  titleAs?: ElementType;
  /** What's missing, and what to do about it. One or two sentences. */
  description?: ReactNode;
  /** The buttons under the description. */
  actions?: ReactNode;
  size?: keyof typeof sizes;
  /** On the soft gem gradient panel, for an empty section among others; otherwise open on the page. */
  panel?: boolean;
  /** Decoration placed over it, such as twinkling sparkles (position them absolutely). Hidden from screen readers. */
  decoration?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

/** Nothing here yet, and what to do about it: a medallion, a title, a line of explanation and the way forward. */
export function EmptyState({
  icon,
  medallion = 'surface',
  title,
  titleAs = 'h2',
  description,
  actions,
  size = 'lg',
  panel,
  decoration,
  style,
  className,
}: EmptyStateProps) {
  const s = sizes[size];
  const box: CSSProperties = panel
    ? { position: 'relative', padding: '34px 24px 30px', borderRadius: 'var(--radius-xl)', background: 'var(--gradient-gem-tint)', textAlign: 'center', overflow: 'hidden' }
    : { position: 'relative', padding: '0 20px 80px', textAlign: 'center' };
  return (
    <div className={className} style={{ ...box, ...style }}>
      {decoration ? <span aria-hidden="true">{decoration}</span> : null}
      <div
        style={{
          position: 'relative',
          width: s.medallion + 'px',
          height: s.medallion + 'px',
          margin: '0 auto',
          borderRadius: 'var(--radius-full)',
          background: medallion === 'gem' ? 'var(--gradient-gem-tint)' : 'var(--color-surface)',
          boxShadow: 'var(--elevation-raised)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <Text variant={s.title} as={titleAs} style={{ margin: s.gap + 'px 0 0' }}>
        {title}
      </Text>
      {description ? (
        size === 'lg' ? (
          <p
            style={{
              margin: '10px auto 0',
              maxWidth: s.maxWidth + 'px',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-medium)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-muted)',
              textWrap: 'pretty',
            }}
          >
            {description}
          </p>
        ) : (
          <Text variant="body" as="p" tone="slate" style={{ margin: '10px auto 0', maxWidth: s.maxWidth + 'px', textWrap: 'pretty' }}>
            {description}
          </Text>
        )
      ) : null}
      {actions ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: size === 'lg' ? '24px' : '22px' }}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}
