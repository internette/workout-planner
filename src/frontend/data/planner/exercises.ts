// Exercises saved on their own in the Spellbook.

import { supabase } from '../supabase';
import type { Exercise } from './types';
import { exerciseRow, nameKey, freeName } from './convert';
import { ok, patchExercise } from './db';

// An exercise saved on its own. Workouts hold their own copies of exercises, so nothing else changes.
export async function deleteLibraryExercise(id: string) {
  await ok(supabase.from('library_exercises').delete().eq('id', id));
}

// A new exercise saved on its own ("New exercise", "Save as a new exercise", or a copy of a built-in): always a new
// row, never an overwrite. A name already in the Spellbook (the person's own or a built-in, ignoring case) becomes
// "<name> (copy)", "(copy 2)", ... Returns the new row's id and the name it ended up with, so the screen can open it.
export async function createLibraryExercise(e: Exercise): Promise<{ id: string; name: string }> {
  const [own, builtin]: any[][] = await Promise.all([
    ok(supabase.from('library_exercises').select('name')),
    ok(supabase.from('builtin_exercises').select('name')),
  ]);
  const name = freeName(e.name, new Set([...own, ...builtin].map((r) => nameKey(r.name))), 'copy');
  const [row]: any[] = await ok(supabase.from('library_exercises').insert(exerciseRow({ ...e, name })).select('id'));
  return { id: row.id, name };
}

// Edits an exercise saved on its own in the Spellbook.
export async function updateLibraryExercise(id: string, patch: Partial<Exercise>) {
  await patchExercise('library_exercises', id, patch);
}
