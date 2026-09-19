import * as glyphs from '@/components/ui/icons/glyphs';
import { ExerciseIcon, EXERCISE_ICON_NAMES, Gem, MoodFace, Sparkle } from '@/components/ui/icons';
import { colors } from '@/components/ui/colors';

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
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '12px 0 80px' }}>
      <h1 style={{ margin: 0, fontSize: 'var(--text-5xl)' }}>Icons</h1>
      <p style={{ margin: '8px 0 32px', color: 'var(--color-muted)', lineHeight: 'var(--leading-relaxed)' }}>
        Everything is drawn on a 24×24 canvas and takes <code>size</code>, <code>color</code> and{' '}
        <code>strokeWidth</code>. Line icons default to the surrounding text colour.
      </p>

      <h2 id="glyphs" style={{ scrollMarginTop: 16, fontSize: 'var(--text-2xl)' }}>
        Glyphs
      </h2>
      <div style={grid}>
        {Object.entries(glyphs).map(([name, Glyph]) => (
          <Tile key={name} name={name}>
            <Glyph size={28} />
          </Tile>
        ))}
      </div>

      <h2 id="exercise-icons" style={{ scrollMarginTop: 16, fontSize: 'var(--text-2xl)', marginTop: 40 }}>
        Exercise icons
      </h2>
      <div style={grid}>
        {EXERCISE_ICON_NAMES.map((name) => (
          <Tile key={name} name={`ExerciseIcon “${name}”`}>
            <ExerciseIcon name={name} size={28} color="var(--color-pink)" />
          </Tile>
        ))}
      </div>

      <h2 id="decorative" style={{ scrollMarginTop: 16, fontSize: 'var(--text-2xl)', marginTop: 40 }}>
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
      </div>

      <h2 id="mood-faces" style={{ scrollMarginTop: 16, fontSize: 'var(--text-2xl)', marginTop: 40 }}>
        Mood faces
      </h2>
      <div style={grid}>
        {(['Happy', 'Neutral', 'Sad', 'Mad'] as const).map((mood, i) => (
          <Tile key={mood} name={mood}>
            <span
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
    </main>
  );
}
