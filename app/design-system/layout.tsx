import Link from 'next/link';

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header style={{ maxWidth: 960, margin: '0 auto', padding: '20px 24px 0', display: 'flex', gap: 16, fontSize: 'var(--text-base)' }}>
        <Link href="/">← Planner</Link>
        <Link href="/design-system">Design system</Link>
      </header>
      {children}
    </>
  );
}
