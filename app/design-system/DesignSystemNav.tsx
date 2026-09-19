'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories, sections, type Category } from './registry';
import styles from './design-system.module.css';

// The sidebar: an overview link, then every section grouped by category.
export function DesignSystemNav() {
  const pathname = usePathname();
  const item = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      aria-current={pathname === href ? 'page' : undefined}
      className={[styles.link, pathname === href && styles.active].filter(Boolean).join(' ')}
    >
      {label}
    </Link>
  );
  return (
    <nav aria-label="Design system" className={styles.nav}>
      {item('/design-system', 'Overview')}
      {(Object.keys(categories) as Category[]).map((category) => (
        <div key={category} style={{ display: 'contents' }}>
          <div className={styles.group} style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--color-subtle)' }}>
            {categories[category].title}
          </div>
          {sections.filter((s) => s.category === category).map((s) => item(`/design-system/${s.slug}`, s.title))}
        </div>
      ))}
    </nav>
  );
}
