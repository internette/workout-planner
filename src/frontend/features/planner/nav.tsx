import type { ComponentType } from 'react';
import { BarChart, Calendar, Quill, SpellCards, User } from '@moonshot/design-system/icons';
import type { NavId } from './navIds';

/** What the sidebar and the tab bar show for each place. */
export const NAV: Record<NavId, { label: string; href: string; Icon: ComponentType<{ color?: string; size?: number; strokeWidth?: number }> }> = {
  day: { label: 'Calendar', href: '/calendar', Icon: Calendar },
  diaryList: { label: 'Chronicle', href: '/chronicle', Icon: Quill },
  arsenal: { label: 'Spellbook', href: '/spellbook', Icon: SpellCards },
  summary: { label: 'Progress', href: '/progress', Icon: BarChart },
  profile: { label: 'Profile', href: '/profile', Icon: User },
};
