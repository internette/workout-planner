// Moonwalk's Finds: one row each in moonwalk_finds (see the migration 20261108000000_moonwalk.sql).

import { supabase } from '../supabase';
import type { FoundRow } from './types';
import { ok } from './db';

export const toFound = (r: any): FoundRow => ({
  findId: Number(r.find_id),
  source: r.source,
  entryId: r.plan_entry_id || null,
  at: String(r.found_at),
  spent: !!r.spent_at,
});

/** Saves a finished session's pouch: one row per Find, by its place in the pouch. A pouch already saved is left as
 * it was, so saving it again (a retry, another device) never adds copies. */
export const savePouch = (entryId: string, findIds: number[]) =>
  findIds.length
    ? ok(
        supabase
          .from('moonwalk_finds')
          .upsert(
            findIds.map((find_id, slot) => ({ plan_entry_id: entryId, find_id, source: 'pouch', slot })),
            { onConflict: 'plan_entry_id,source,slot', ignoreDuplicates: true },
          ),
      )
    : Promise.resolve(null);
