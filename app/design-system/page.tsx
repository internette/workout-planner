import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata = { title: 'Design system' };

const ROOT = process.cwd();

// One card per folder in components/ui. A folder links to /design-system/<name> once that page exists.
function listSections() {
  const uiDir = path.join(ROOT, 'components', 'ui');
  return fs
    .readdirSync(uiDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => {
      const files = fs.readdirSync(path.join(uiDir, entry.name)).filter((f) => /\.tsx?$/.test(f) && f !== 'index.ts');
      const hasPage = fs.existsSync(path.join(ROOT, 'app', 'design-system', entry.name, 'page.tsx'));
      return { name: entry.name, files: files.length, hasPage };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

const card: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 6, padding: '20px 22px', background: '#fff', borderRadius: 18,
  boxShadow: '0 4px 14px rgba(35,42,69,.07)', color: '#232A45', textDecoration: 'none',
};

export default function DesignSystemPage() {
  const sections = listSections();
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px 24px 80px' }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Design system</h1>
      <p style={{ margin: '8px 0 32px', color: '#746E88', lineHeight: 1.6 }}>
        Each section below is a folder in <code>components/ui</code>.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {sections.map(({ name, files, hasPage }) => {
          const body = (
            <>
              <span style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 18, fontWeight: 700, textTransform: 'capitalize' }}>
                {name}
              </span>
              <span style={{ fontSize: 13, color: '#746E88' }}>
                {files} {files === 1 ? 'file' : 'files'} · {hasPage ? `/design-system/${name}` : 'no page yet'}
              </span>
            </>
          );
          return hasPage ? (
            <Link key={name} href={`/design-system/${name}`} style={card}>
              {body}
            </Link>
          ) : (
            <div key={name} style={{ ...card, opacity: 0.6 }}>
              {body}
            </div>
          );
        })}
      </div>
      {sections.length === 0 ? <p style={{ color: '#746E88' }}>components/ui has no folders yet.</p> : null}
    </main>
  );
}
