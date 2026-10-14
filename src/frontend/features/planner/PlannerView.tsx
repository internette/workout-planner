// The planner's frame: the dialogs, the sidebar and tab bar, the banners, and whichever screen is open. Each screen is
// its own component in its feature's folder; all of them read the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { AddToDayDialog } from '@/frontend/features/calendar/AddToDayDialog';
import { ConfirmDialog } from '@/frontend/features/planner/ConfirmDialog';
import { NoticeBanner } from '@/frontend/features/planner/NoticeBanner';
import { SaveErrorBanner } from '@/frontend/features/planner/SaveErrorBanner';
import { Sidebar } from '@/frontend/features/planner/Sidebar';
import { TabBar } from '@/frontend/features/planner/TabBar';
import { SignOutDialog } from '@/frontend/features/profile/SignOutDialog';
import { RanksDialog } from '@/frontend/features/progress/RanksDialog';
import { SaveScopeDialog } from '@/frontend/features/spellbook/SaveScopeDialog';

import { CalendarScreen } from '@/frontend/features/calendar/CalendarScreen';
import { SavedScreen } from '@/frontend/features/chronicle/SavedScreen';
import { ProfileScreen } from '@/frontend/features/profile/ProfileScreen';
import { SettingsScreen } from '@/frontend/features/profile/SettingsScreen';
import { ProgressScreen } from '@/frontend/features/progress/ProgressScreen';
import { SpellbookScreen } from '@/frontend/features/spellbook/SpellbookScreen';
import { ExerciseScreen } from '@/frontend/features/spellbook/ExerciseScreen';
import { NotInSpellbook } from '@/frontend/features/spellbook/NotInSpellbook';
import { TemplateScreen } from '@/frontend/features/spellbook/TemplateScreen';
import { ExerciseEditScreen } from '@/frontend/features/spellbook/ExerciseEditScreen';
import { ProgramScreen } from '@/frontend/features/programs/ProgramScreen';
import { ProgramEditScreen } from '@/frontend/features/programs/ProgramEditScreen';
import { ProgramScanScreen } from '@/frontend/features/programs/ProgramScanScreen';
import { ProgramRunsScreen } from '@/frontend/features/programs/ProgramRunsScreen';
import { ProgramRunScreen } from '@/frontend/features/programs/ProgramRunScreen';
import { NewEntryScreen } from '@/frontend/features/chronicle/NewEntryScreen';
import { ChronicleScreen } from '@/frontend/features/chronicle/ChronicleScreen';
import { SessionScreen } from '@/frontend/features/session/SessionScreen';
import { TypePickerScreen } from '@/frontend/features/editor/TypePickerScreen';
import { EditorScreen } from '@/frontend/features/editor/EditorScreen';
import { EntryScreen } from '@/frontend/features/chronicle/EntryScreen';

export function PlannerView({ v }: { v: PlannerVals }) {
  return (
    <>
      <span className="sr-only" role="status" aria-live="polite">
        {v.announce}
      </span>
      <RanksDialog v={v} />
      <SignOutDialog v={v} />
      <ConfirmDialog v={v} />
      <SaveScopeDialog v={v} />
      <AddToDayDialog v={v} />
      {/* The page never scrolls sideways: a 44px tap area reaching past a control at the screen edge stays an invisible
          extra instead of widening the page. (clip, unlike hidden, keeps sticky bands working.) */}
      <div style={{ minHeight: '100vh', overflowX: 'clip', paddingBottom: v.layout === 'narrow' ? 'calc(4 * var(--space-7))' : 'calc(2 * var(--space-7))' }}>
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            padding: 'var(--space-7) var(--space-7) 0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-7)',
            alignItems: 'flex-start',
          }}
        >
          <Sidebar v={v} />
          <main style={{ flex: '1 1 560px', minWidth: '0' }}>
            {v.saveError ? <SaveErrorBanner v={v} /> : null}
            {v.notice ? <NoticeBanner v={v} /> : null}
            {v.isCal ? <CalendarScreen v={v} /> : null}
            {v.isSaved ? <SavedScreen v={v} /> : null}
            {v.isProfile ? <ProfileScreen v={v} /> : null}
            {v.isSettings ? <SettingsScreen v={v} /> : null}
            {v.isSummary ? <ProgressScreen v={v} /> : null}
            {v.isArsenal ? <SpellbookScreen v={v} /> : null}
            {v.isExercise && v.exercise ? <ExerciseScreen v={v} /> : null}
            {(v.isTemplate && !v.template) || (v.isExercise && !v.exercise) ? <NotInSpellbook v={v} /> : null}
            {v.isTemplate && v.template ? <TemplateScreen v={v} /> : null}
            {v.isExerciseEdit && v.exerciseEdit ? <ExerciseEditScreen v={v} /> : null}
            {v.isProgram && v.program ? <ProgramScreen v={v} /> : null}
            {v.isProgramEdit && v.programEdit ? <ProgramEditScreen v={v} /> : null}
            {v.isProgramScan ? <ProgramScanScreen v={v} /> : null}
            {v.isProgramRuns ? <ProgramRunsScreen v={v} /> : null}
            {v.isProgramRun ? <ProgramRunScreen v={v} /> : null}
            {(v.isProgram && !v.program) || (v.isProgramEdit && !v.programEdit) ? <NotInSpellbook v={v} /> : null}
            {v.isNewEntry ? <NewEntryScreen v={v} /> : null}
            {v.isDiaryList ? <ChronicleScreen v={v} /> : null}
            {v.isDetail ? <SessionScreen v={v} /> : null}
            {v.needsType ? <TypePickerScreen v={v} /> : null}
            {v.isEdit ? <EditorScreen v={v} /> : null}
            {v.isDiary ? <EntryScreen v={v} /> : null}
          </main>
        </div>
        <TabBar v={v} />
      </div>
    </>
  );
}
