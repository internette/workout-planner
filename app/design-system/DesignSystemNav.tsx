'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { categories, sections, type Category, type Section } from './registry';
import styles from './design-system.module.css';

// The sidebar: an overview link, then every section grouped by category. The section you are on
// expands to show links to its headings, and the heading currently in view is highlighted.
export function DesignSystemNav() {
  const pathname = usePathname();
  const current = sections.find((s) => pathname === `/design-system/${s.slug}`);
  const [activeId, setActiveId] = useState<string | null>(null);
  // The link you last clicked stays highlighted until you scroll yourself, since a heading near the
  // bottom of a short page can't always scroll to the top of the screen.
  const pinned = useRef<string | null>(null);

  useEffect(() => {
    setActiveId(null);
    const anchors = current?.anchors;
    if (!anchors?.length) return;
    const headings = anchors.map((a) => document.getElementById(a.id)).filter((el): el is HTMLElement => !!el);
    // The active heading is the last one that has scrolled past the top third of the screen.
    const update = () => {
      if (pinned.current) return setActiveId(pinned.current);
      const line = window.innerHeight * 0.33;
      let id = headings[0]?.id ?? null;
      for (const h of headings) if (h.getBoundingClientRect().top <= line) id = h.id;
      if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 8)
        id = headings[headings.length - 1]?.id ?? id;
      setActiveId(id);
    };
    const release = () => {
      pinned.current = null;
    };
    const hash = window.location.hash.slice(1);
    pinned.current = anchors.some((a) => a.id === hash) ? hash : null;
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    for (const e of ['wheel', 'touchmove', 'keydown']) window.addEventListener(e, release, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      for (const e of ['wheel', 'touchmove', 'keydown']) window.removeEventListener(e, release);
    };
  }, [current]);

  const link = (href: string, label: string, active: boolean) => (
    <Link
      key={href}
      href={href}
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
          }}
          aria-current={activeId === a.id ? 'location' : undefined}
          className={[styles.sublink, activeId === a.id && styles.subactive].filter(Boolean).join(' ')}
        >
          {a.title}
        </a>
      ))}
    </div>
  );

  return (
    <nav aria-label="Design system" className={styles.nav}>
      {link('/design-system', 'Overview', pathname === '/design-system')}
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
    </nav>
  );
}
