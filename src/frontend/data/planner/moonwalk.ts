// Moonwalk's Finds: one row each in moonwalk_finds (see the migration 20261108000000_moonwalk.sql).

import { supabase } from '../supabase';
import type { CharmRow, FoundRow } from './types';
import { ok } from './db';

export const toFound = (r: any): FoundRow => ({
  id: String(r.id),
  slot: Number(r.slot) || 0,
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

/** Saves a glimmer walked up to on a session. Saved by its number, so one saved twice is only kept once. */
export const saveGlimmer = (entryId: string, findId: number, slot: number) =>
  ok(
    supabase
      .from('moonwalk_finds')
      .upsert([{ plan_entry_id: entryId, find_id: findId, source: 'glimmer', slot }], { onConflict: 'plan_entry_id,source,slot', ignoreDuplicates: true }),
  );

export const toCharm = (r: any): CharmRow => ({
  id: String(r.id),
  kind: r.kind === 'recipe' ? 'recipe' : 'charm',
  charm: String(r.charm),
  at: String(r.created_at),
  used: !!r.used_at,
  usedDay: r.used_day || null,
  usedEntry: r.used_entry || null,
  usedFor: r.used_for || null,
});

/** Crafts a charm: spends the satchel Finds and held charms it takes, then adds the charm. */
export async function craftCharm(charm: string, findRowIds: string[], charmRowIds: string[]) {
  const at = new Date().toISOString();
  if (findRowIds.length) await ok(supabase.from('moonwalk_finds').update({ spent_at: at }).in('id', findRowIds).is('spent_at', null));
  if (charmRowIds.length)
    await ok(supabase.from('moonwalk_charms').update({ used_at: at, used_for: 'craft' }).in('id', charmRowIds).is('used_at', null));
  return ok(supabase.from('moonwalk_charms').insert([{ kind: 'charm', charm }]));
}

/** Uses a held charm as today's. `usedFor` says what it covers (a Streak Ward's day). */
export const applyCharm = (id: string, day: string, usedFor: string | null = null) =>
  ok(supabase.from('moonwalk_charms').update({ used_at: new Date().toISOString(), used_day: day, used_for: usedFor }).eq('id', id).is('used_at', null));

/** Puts today's charm back, before it has started working. */
export const unapplyCharm = (id: string) =>
  ok(supabase.from('moonwalk_charms').update({ used_at: null, used_day: null, used_for: null, used_entry: null }).eq('id', id));

/** Picks a Legendary recipe, after finishing a set. */
export const pickRecipe = (charm: string) => ok(supabase.from('moonwalk_charms').insert([{ kind: 'recipe', charm }]));

/** Uses a charm that makes a Find (Mirror Shard, Alchemist Ring, Wish Star): today's charm, the Finds it spends, and
 * the one it makes. */
export async function applyMakingCharm(id: string, day: string, spendRowIds: string[], findId: number, source: 'craft' | 'wish') {
  await applyCharm(id, day);
  if (spendRowIds.length) await ok(supabase.from('moonwalk_finds').update({ spent_at: new Date().toISOString() }).in('id', spendRowIds).is('spent_at', null));
  return ok(supabase.from('moonwalk_finds').insert([{ find_id: findId, source, slot: 0 }]));
}

/** A boss beaten drops its Lunar (and a Rare with a Trophy Banner), saved on the session that won. */
export const saveBossLoot = (entryId: string, rows: { findId: number; slot: number }[]) =>
  rows.length
    ? ok(
        supabase
          .from('moonwalk_finds')
          .upsert(
            rows.map((r) => ({ plan_entry_id: entryId, find_id: r.findId, source: 'boss', slot: r.slot })),
            { onConflict: 'plan_entry_id,source,slot', ignoreDuplicates: true },
          ),
      )
    : Promise.resolve(null);
