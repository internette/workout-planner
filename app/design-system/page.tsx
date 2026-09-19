import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/typography';
import { Preview } from './previews';
import { categories, planned, sections, type Category } from './registry';
import styles from './design-system.module.css';

export const metadata = { title: 'Design system' };

// Folders in components/ui that the registry doesn't know about yet.
function unlistedFolders(): string[] {
  const known = new Set(sections.map((s) => s.slug));
  const uiDir = path.join(process.cwd(), 'components', 'ui');
  return fs
    .readdirSync(uiDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !known.has(e.name))
    .map((e) => e.name)
    .sort();
}

export default function DesignSystemPage() {
  const unlisted = unlistedFolders();
  const counts = (c: Category) => sections.filter((s) => s.category === c).length;

  return (
    <main style={{ paddingTop: 12 }}>
      <Text variant="eyebrow" tone="subtle" as="div" uppercase>
        Ritual
      </Text>
      <Text variant="display" tone="ink" as="h1" style={{ margin: '4px 0 0' }}>
        Design system
      </Text>
      <Text variant="body" tone="muted" as="p" style={{ margin: '10px 0 0', maxWidth: 560 }}>
        The colours, type and components the planner is built from. Start with the foundations, then the components
        that use them. Each section has live examples and the props it takes.
      </Text>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        <Chip>{counts('foundations')} foundations</Chip>
        <Chip>{counts('components')} components</Chip>
        <Chip>{planned.length} planned</Chip>
      </div>

      {(Object.keys(categories) as Category[]).map((category) => (
        <section key={category} id={category} className={styles.section}>
          <Text variant="heading" tone="ink" as="h2" style={{ margin: 0 }}>
            {categories[category].title}
          </Text>
          <Text variant="caption" tone="muted" as="p" style={{ margin: '4px 0 16px' }}>
            {categories[category].description}
          </Text>
          <div className={styles.grid}>
            {sections
              .filter((s) => s.category === category)
              .map((s) => (
                <Link key={s.slug} href={`/design-system/${s.slug}`} className={styles.tile}>
                  <Card interactive pad="sm">
                    <div className={styles.preview}>
                      <Preview slug={s.slug} />
                    </div>
                    <Text variant="itemTitle" tone="ink" as="h3" style={{ margin: 0 }}>
                      {s.title}
                    </Text>
                    <Text variant="caption" tone="muted" as="p" style={{ margin: '4px 0 0' }}>
                      {s.description}
                    </Text>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      ))}

      {unlisted.length ? (
        <section className={styles.section}>
          <Text variant="heading" tone="ink" as="h2" style={{ margin: 0 }}>
            Not yet organised
          </Text>
          <Text variant="caption" tone="muted" as="p" style={{ margin: '4px 0 12px' }}>
            These folders in <code>components/ui</code> are not in <code>app/design-system/registry.ts</code> yet.
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {unlisted.map((name) => (
              <Chip key={name}>{name}</Chip>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <Text variant="heading" tone="ink" as="h2" style={{ margin: '0 0 16px' }}>
          Using the design system
        </Text>
        <div className={styles.grid}>
          <Card pad="sm">
            <Text variant="itemTitle" tone="ink" as="h3" style={{ margin: 0 }}>
              Import a component
            </Text>
            <Text variant="caption" tone="muted" as="p" style={{ margin: '6px 0 0' }}>
              Everything lives in <code>components/ui</code>, one folder per section:{' '}
              <code>{"import { Button } from '@/components/ui/buttons'"}</code>.
            </Text>
          </Card>
          <Card pad="sm">
            <Text variant="itemTitle" tone="ink" as="h3" style={{ margin: 0 }}>
              Use the tokens
            </Text>
            <Text variant="caption" tone="muted" as="p" style={{ margin: '6px 0 0' }}>
              Colours and type are CSS variables on <code>:root</code>, such as <code>var(--color-pink)</code> and{' '}
              <code>var(--text-md)</code>. Avoid raw hex values and pixel sizes.
            </Text>
          </Card>
          <Card pad="sm">
            <Text variant="itemTitle" tone="ink" as="h3" style={{ margin: 0 }}>
              Add a section
            </Text>
            <Text variant="caption" tone="muted" as="p" style={{ margin: '6px 0 0' }}>
              Create a folder in <code>components/ui</code>, add a page at <code>app/design-system/&lt;name&gt;</code>,
              then list it in <code>registry.ts</code> so it appears here and in the sidebar.
            </Text>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <Text variant="heading" tone="ink" as="h2" style={{ margin: 0 }}>
          Planned
        </Text>
        <Text variant="caption" tone="muted" as="p" style={{ margin: '4px 0 16px' }}>
          Candidates for what to build next, based on what the planner still repeats by hand.
        </Text>
        <div className={styles.grid}>
          {planned.map((p) => (
            <Card key={p.title} pad="sm">
              <Text variant="itemTitle" tone="ink" as="h3" style={{ margin: 0 }}>
                {p.title}
              </Text>
              <Text variant="caption" tone="muted" as="p" style={{ margin: '4px 0 0' }}>
                {p.why}
              </Text>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
