// What a person said in "Customize your experience": one row each, in profiles.

import { supabase } from '../supabase';
import { EQUIPMENT } from '@/frontend/shared/constants';
import type { Profile } from './types';
import { ok } from './db';

const TRAINS: Profile['trains'] = ['lift', 'ride', 'run', 'stretch', 'yoga'];

export const toProfile = (r: any): Profile => ({
  name: typeof r.name === 'string' && r.name.trim() ? r.name.trim() : null,
  trains: TRAINS.filter((t) => (r.trains || []).includes(t)),
  equipment: Array.isArray(r.equipment) ? EQUIPMENT.filter((x) => r.equipment.includes(x)) : null,
  days: Array.from(new Set<number>((r.days || []).map(Number)))
    .filter((d) => d >= 0 && d <= 6)
    .sort((a, b) => a - b),
  minutes: r.minutes == null ? null : Number(r.minutes),
});

// Writes it whole: the first time a new row, after that the same one again.
export const saveProfile = (p: Profile) =>
  ok(
    supabase.from('profiles').upsert(
      { name: p.name?.trim().slice(0, 40) || null, trains: p.trains, equipment: p.equipment, days: p.days, minutes: p.minutes, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    ),
  );
