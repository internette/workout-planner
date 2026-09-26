import * as glyphs from '@/components/ui/icons/glyphs';
import { ExerciseIcon, EXERCISE_ICON_NAMES, Gem, MoodFace, RatingStar, Sparkle, SparkleTrail } from '@/components/ui/icons';
import { Mark } from '@/components/brand/Mark';
import { colors } from '@/components/ui/colors';
import { DocPage } from '../docs';

export const metadata = { title: 'Icons — Design system' };

const card: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
  padding: '18px 8px',
  background: 'var(--color-white)',
  borderRadius: 16,
  boxShadow: '0 4px 14px rgba(35,42,69,.07)',
  color: 'var(--color-ink)',
};
const label: React.CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--color-muted)', textAlign: 'center' };
const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
  gap: 12,
};

function Tile({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      {children}
      <span style={label}>{name}</span>
    </div>
  );
}

export default function IconsPage() {
  return (
    <DocPage title="Icons">
      <p style={{ margin: '8px 0 32px', color: 'var(--color-muted)', lineHeight: 'var(--leading-relaxed)' }}>
        Everything is drawn on a 24×24 canvas and takes <code>size</code>, <code>color</code> and{' '}
        <code>strokeWidth</code>. Line icons default to the surrounding text colour.
      </p>

      <h2 id="glyphs" style={{ scrollMarginTop: 'var(--ds-anchor-offset)', fontSize: 'var(--text-2xl)' }}>
        Glyphs
      </h2>
      <div style={grid}>
        {Object.entries(glyphs).map(([name, Glyph]) => (
          <Tile key={name} name={name}>
            <Glyph size={28} />
          </Tile>
        ))}
      </div>

      <h2 id="exercise-icons" style={{ scrollMarginTop: 'var(--ds-anchor-offset)', fontSize: 'var(--text-2xl)', marginTop: 40 }}>
        Exercise icons
      </h2>
      <div style={grid}>
        {EXERCISE_ICON_NAMES.map((name) => (
          <Tile key={name} name={`ExerciseIcon “${name}”`}>
            <ExerciseIcon name={name} size={28} color="var(--color-pink)" />
          </Tile>
        ))}
      </div>

      <h2 id="decorative" style={{ scrollMarginTop: 'var(--ds-anchor-offset)', fontSize: 'var(--text-2xl)', marginTop: 40 }}>
        Decorative
      </h2>
      <div style={grid}>
        <Tile name="Sparkle">
          <Sparkle size={28} color={colors.pink} />
        </Tile>
        <Tile name="Sparkle glow">
          <Sparkle size={28} color={colors.periwinkle} glow={0.5} />
        </Tile>
        <Tile name="Sparkle outline">
          <Sparkle size={28} color={colors.gold} outline strokeWidth={2.2} />
        </Tile>
        <Tile name="Gem">
          <Gem size={28} />
        </Tile>
        <Tile name="Sparkle trail">
          <SparkleTrail />
        </Tile>
        <Tile name="Mark, animated">
          <Mark size={32} animate />
        </Tile>
      </div>

      <h2 id="mood-faces" style={{ scrollMarginTop: 'var(--ds-anchor-offset)', fontSize: 'var(--text-2xl)', marginTop: 40 }}>
        Mood faces
      </h2>
      <div style={grid}>
        {(['Happy', 'Neutral', 'Sad', 'Mad'] as const).map((mood, i) => (
          <Tile key={mood} name={mood}>
            <span
              className="fc-keep"
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: [
                  'var(--color-pink)',
                  'var(--color-slate)',
                  'var(--color-periwinkle)',
                  'var(--color-danger)',
                ][i],
              }}
            >
              <MoodFace mood={mood} size={26} />
            </span>
          </Tile>
        ))}
      </div>

      <h2 id="rating-stars" style={{ scrollMarginTop: 'var(--ds-anchor-offset)', fontSize: 'var(--text-2xl)', marginTop: 40 }}>
        Rating stars
      </h2>
      <p style={{ margin: '8px 0 16px', color: 'var(--color-muted)', lineHeight: 'var(--leading-relaxed)' }}>
        <code>RatingStar</code> takes <code>on</code> and <code>size</code>, not a colour: on, it fills with the pink →
        periwinkle → teal gradient; off, it&apos;s a pale pink. Round joins on a stroke of the same paint soften its
        points. For a row of them, to pick or show a rating, use <code>StarRating</code> (see Rating). In forced colours the
        gradient can&apos;t show, so a star inside <code>data-star</code> or <code>.fc-star</code> fills with the system
        text colour when it has <code>data-on</code>, and greyed text colour when it doesn&apos;t.
      </p>
      <div style={grid}>
        <Tile name="On">
          <span className="fc-star" data-on="" style={{ display: 'flex' }}>
            <RatingStar on size={36} />
          </span>
        </Tile>
        <Tile name="Off">
          <span className="fc-star" style={{ display: 'flex' }}>
            <RatingStar on={false} size={36} />
          </span>
        </Tile>
        <div style={{ ...card, gridColumn: 'span 2' }}>
          <span style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="fc-star" data-on={n <= 4 ? '' : undefined} style={{ display: 'flex' }}>
                <RatingStar on={n <= 4} size={28} />
              </span>
            ))}
          </span>
          <span style={label}>4 of 5, as rated</span>
        </div>
      </div>
    </DocPage>
  );
}
