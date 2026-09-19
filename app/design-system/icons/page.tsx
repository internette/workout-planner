import * as glyphs from '@/components/ui/icons/glyphs';
import { ExerciseIcon, EXERCISE_ICON_NAMES, Gem, MoodFace, Sparkle } from '@/components/ui/icons';

export const metadata = { title: 'Icons — Design system' };

const card: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '18px 8px',
  background: '#fff', borderRadius: 16, boxShadow: '0 4px 14px rgba(35,42,69,.07)', color: '#232A45',
};
const label: React.CSSProperties = { fontSize: 12, color: '#746E88', textAlign: 'center' };
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 };

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
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px' }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Icons</h1>
      <p style={{ margin: '8px 0 32px', color: '#746E88', lineHeight: 1.6 }}>
        Everything is drawn on a 24×24 canvas and takes <code>size</code>, <code>color</code> and{' '}
        <code>strokeWidth</code>. Line icons default to the surrounding text colour.
      </p>

      <h2 style={{ fontSize: 18 }}>Glyphs</h2>
      <div style={grid}>
        {Object.entries(glyphs).map(([name, Glyph]) => (
          <Tile key={name} name={name}>
            <Glyph size={28} />
          </Tile>
        ))}
      </div>

      <h2 style={{ fontSize: 18, marginTop: 40 }}>Exercise icons</h2>
      <div style={grid}>
        {EXERCISE_ICON_NAMES.map((name) => (
          <Tile key={name} name={`ExerciseIcon “${name}”`}>
            <ExerciseIcon name={name} size={28} color="#E1699C" />
          </Tile>
        ))}
      </div>

      <h2 style={{ fontSize: 18, marginTop: 40 }}>Decorative</h2>
      <div style={grid}>
        <Tile name="Sparkle">
          <Sparkle size={28} color="#E1699C" />
        </Tile>
        <Tile name="Sparkle glow">
          <Sparkle size={28} color="#7C8FC9" glow={0.5} />
        </Tile>
        <Tile name="Sparkle outline">
          <Sparkle size={28} color="#E0A93A" outline strokeWidth={2.2} />
        </Tile>
        <Tile name="Gem">
          <Gem size={28} />
        </Tile>
      </div>

      <h2 style={{ fontSize: 18, marginTop: 40 }}>Mood faces</h2>
      <div style={grid}>
        {(['Happy', 'Neutral', 'Sad', 'Mad'] as const).map((mood, i) => (
          <Tile key={mood} name={mood}>
            <span
              style={{
                width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: ['#E1699C', '#5C6684', '#7C8FC9', '#B23A4C'][i],
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
