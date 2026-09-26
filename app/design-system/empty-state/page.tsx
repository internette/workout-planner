import { Button } from '@/components/ui/buttons';
import { vars } from '@/components/ui/colors';
import { EmptyState } from '@/components/ui/empty-state';
import { Gem, Moon, Plus, Sparkle } from '@/components/ui/icons';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Empty state — Design system' };

const frame: React.CSSProperties = { background: 'var(--color-canvas)', borderRadius: 18, padding: '36px 16px 0', boxShadow: 'inset 0 0 0 1px var(--color-line)' };

export default function EmptyStatePage() {
  return (
    <DocPage title="Empty state">
      <p style={{ ...note, marginTop: 8 }}>
        Nothing here yet, and what to do about it. Import it from <code>@/components/ui/empty-state</code>. A medallion
        with an icon, a title, a sentence or two on what&apos;s missing, and the way forward. Say what the person can do
        next, in the app&apos;s own voice; don&apos;t apologise for the emptiness.
      </p>

      <h2 id="whole-screen" style={h2}>A whole screen</h2>
      <p style={note}>
        <code>size=&quot;lg&quot;</code> (the default), open on the page, for a screen with nothing on it: the first
        visit, a rest day. The medallion is 78px, white or (<code>medallion=&quot;gem&quot;</code>) the soft gem
        gradient; the title is a <code>title</code>. Put the main action first, as a primary button with its glow.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
        <div style={frame}>
          <EmptyState
            medallion="gem"
            icon={<Gem size={40} />}
            title="The call is coming"
            description="Put your first lift or ride on the calendar. That day gets a quest."
            actions={
              <>
                <Button type="primary" size="lg" glow>
                  <Plus color="var(--color-on-accent)" size={16} />
                  Plan your first workout
                </Button>
                <Button type="neutral" ghost size="md">
                  Browse the Spellbook
                </Button>
              </>
            }
          />
        </div>
        <div style={frame}>
          <EmptyState
            icon={
              <>
                <Moon color="var(--color-periwinkle)" size={40} />
                <span style={{ position: 'absolute', top: 21, right: 20, display: 'flex' }}>
                  <Sparkle size={9.5} outline color={vars.gold} strokeWidth={2.2} />
                </span>
              </>
            }
            title="The city is quiet"
            description="No quest today. Rest is how the power comes back."
            actions={
              <Button type="primary" size="lg" glow>
                <Plus color="var(--color-on-accent)" size={16} />
                Add workout
              </Button>
            }
          />
        </div>
      </div>

      <h2 id="in-a-section" style={h2}>In a section</h2>
      <p style={note}>
        <code>size=&quot;md&quot;</code> with <code>panel</code>, for an empty part of a screen that has other things
        on it, like a week with nothing planned: on the soft gem gradient, with a 66px medallion and a{' '}
        <code>subheading</code>. <code>decoration</code> takes twinkling sparkles, placed absolutely; they&apos;re
        hidden from screen readers.
      </p>
      <div style={{ maxWidth: 460 }}>
        <EmptyState
          size="md"
          panel
          titleAs="h3"
          icon={<Gem size={32} />}
          title="Your wand's still charging"
          description="No sessions scheduled this week. Add one and that day gets a quest."
          actions={
            <Button type="primary" size="lg">
              <Plus color="var(--color-on-accent)" size={16} />
              Add workout
            </Button>
          }
          decoration={
            <>
              <span style={{ position: 'absolute', left: '11%', top: 18, animation: 'twinkle 3.4s ease-in-out infinite' }}>
                <Sparkle size={13} color={vars.periwinkle} glow={0.5} />
              </span>
              <span style={{ position: 'absolute', right: '13%', top: 40, animation: 'twinkle 4.6s ease-in-out infinite' }}>
                <Sparkle size={10} color={vars.teal} glow={0.55} />
              </span>
            </>
          }
        />
      </div>
    </DocPage>
  );
}
