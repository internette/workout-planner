'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useWindowEvent } from '@/components/ui/useWindowEvent';
import { Popover } from '@/components/ui/popover';
import { ChevronDown } from '@/components/ui/icons';
import { Lockup } from '@/components/brand/Lockup';
import { Mark } from '@/components/brand/Mark';
import { categories, sections, type Category, type Section } from './registry';
import styles from './design-system.module.css';

// The sidebar: overview and brand links, then every section grouped by category. The section you are on
// expands to show links to its headings, and the heading currently in view is highlighted.
// On narrow screens a single sticky row (the lockup, and a button naming the page you are on) opens a compact
// version: the page's headings as chips first, then every section in two columns.
export function DesignSystemNav() {
  const pathname = usePathname();
  const current = sections.find((s) => pathname === `/design-system/${s.slug}`);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  // The link you last clicked stays highlighted until you scroll yourself, since a heading near the
  // bottom of a short page can't always scroll to the top of the screen.
  const pinned = useRef<string | null>(null);

  const headings = useRef<HTMLElement[]>([]);

  // The active heading is the last one that has scrolled past the top third of the screen.
  const update = () => {
    const found = headings.current;
    if (!found.length) return;
    if (pinned.current) return setActiveId(pinned.current);
    const line = window.innerHeight * 0.33;
    let id = found[0].id;
    for (const h of found) if (h.getBoundingClientRect().top <= line) id = h.id;
    if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 8)
      id = found[found.length - 1].id;
    setActiveId(id);
  };
  const release = () => {
    pinned.current = null;
  };

  // A new page: find its headings, and start on the one the address names, if any.
  useEffect(() => {
    setActiveId(null);
    const anchors = current?.anchors ?? [];
    headings.current = anchors.map((a) => document.getElementById(a.id)).filter((el): el is HTMLElement => !!el);
    const hash = window.location.hash.slice(1);
    pinned.current = anchors.some((a) => a.id === hash) ? hash : null;
    update();
  }, [current]);

  useWindowEvent('scroll', update, { passive: true });
  useWindowEvent('resize', update);
  useWindowEvent('wheel', release, { passive: true });
  useWindowEvent('touchmove', release, { passive: true });
  useWindowEvent('keydown', release, { passive: true });

  const link = (href: string, label: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      onClick={closeMenu}
      aria-current={active ? 'page' : undefined}
      className={[styles.link, active && styles.active].filter(Boolean).join(' ')}
    >
      {label}
    </Link>
  );

  const sublinks = (section: Section) => (
    <div key={section.slug + '-anchors'} className={styles.sublinks}>
      {section.anchors!.map((a) => (
        <a
          key={a.id}
          href={`#${a.id}`}
          onClick={() => {
            pinned.current = a.id;
            setActiveId(a.id);
            closeMenu();
          }}
          aria-current={activeId === a.id ? 'location' : undefined}
          className={[styles.sublink, activeId === a.id && styles.subactive].filter(Boolean).join(' ')}
        >
          {a.title}
        </a>
      ))}
    </div>
  );

  const links = (
    <>
      {link('/design-system', 'Overview', pathname === '/design-system')}
      {link('/design-system#brand', 'Brand', false)}
      {(Object.keys(categories) as Category[]).map((category) => (
        <div key={category} style={{ display: 'contents' }}>
          <div className={styles.group}>{categories[category].title}</div>
          {sections
            .filter((s) => s.category === category)
            .map((s) => (
              <div key={s.slug} style={{ display: 'contents' }}>
                {link(`/design-system/${s.slug}`, s.title, current?.slug === s.slug)}
                {current?.slug === s.slug && s.anchors?.length ? sublinks(s) : null}
              </div>
            ))}
        </div>
      ))}
    </>
  );

  const headingChips = current?.anchors?.length ? (
    <>
      <div className={styles.mGroup}>On this page</div>
      <div className={styles.mChips}>
        {current.anchors.map((a) => (
          <a
            key={a.id}
            href={`#${a.id}`}
            onClick={() => {
              pinned.current = a.id;
              setActiveId(a.id);
              closeMenu();
            }}
            aria-current={activeId === a.id ? 'location' : undefined}
            className={[styles.mChip, activeId === a.id && styles.mChipActive].filter(Boolean).join(' ')}
          >
            {a.title}
          </a>
        ))}
      </div>
    </>
  ) : null;

  const mobileLink = (href: string, label: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      onClick={closeMenu}
      aria-current={active ? 'page' : undefined}
      className={[styles.mLink, active && styles.mActive].filter(Boolean).join(' ')}
    >
      {label}
    </Link>
  );

  const mobileMenu = (
    <nav aria-label="Design system" className={styles.menu}>
      {headingChips}
      <div className={styles.mGrid}>
        {mobileLink('/design-system', 'Overview', pathname === '/design-system')}
        {mobileLink('/design-system#brand', 'Brand', false)}
      </div>
      {(Object.keys(categories) as Category[]).map((category) => (
        <div key={category}>
          <div className={styles.mGroup}>{categories[category].title}</div>
          <div className={styles.mGrid}>
            {sections
              .filter((s) => s.category === category)
              .map((s) => mobileLink(`/design-system/${s.slug}`, s.title, current?.slug === s.slug))}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className={styles.navWrap}>
      <nav aria-label="Design system" className={styles.nav}>
        {links}
      </nav>
      <div className={styles.mobileBar}>
        <Popover
          open={menuOpen}
          onClose={closeMenu}
          width="anchor"
          top={50}
          pad="xs"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          content={mobileMenu}
        >
          <Link href="/" className={styles.mHome} aria-label="Moonshot home">
            <span className={styles.mHomeFull}>
              <Lockup height={22} />
            </span>
            <span className={styles.mHomeMark}>
              <Mark size={26} />
            </span>
          </Link>
          <button type="button" className={styles.menuButton} aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            <span className={styles.menuTitle}>{current ? current.title : 'Overview'}</span>
            <span className={[styles.menuCaret, menuOpen && styles.menuCaretOpen].filter(Boolean).join(' ')}>
              <ChevronDown color="var(--color-muted)" size={18} />
            </span>
          </button>
        </Popover>
      </div>
    </div>
  );
}
