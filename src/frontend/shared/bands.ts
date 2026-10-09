// Resistance bands are set by how hard they pull, not by weight: a level, saved as band_level (1 to 4) and written
// "Medium band" everywhere else. An exercise done with a band and something else (dumbbells, say) has both.
export const BAND = 'Resistance band';
export const BAND_LEVELS = ['Light', 'Medium', 'Heavy', 'Extra heavy'] as const;
export type BandLevel = (typeof BAND_LEVELS)[number];

export const bandWeight = (level: BandLevel) => level + ' band';

/** "Medium band" → "Medium"; anything else → null. */
export function bandLevelOf(text: string | null | undefined): BandLevel | null {
  const t = (text || '').trim().toLowerCase();
  return BAND_LEVELS.find((l) => t === l.toLowerCase() + ' band') ?? null;
}

/** band_level as the app writes it: 2 → "Medium band", none → ''. */
export const bandOfLevel = (n: number | null | undefined) => (n != null && BAND_LEVELS[n - 1] ? bandWeight(BAND_LEVELS[n - 1]) : '');

/** "Medium band" → 2, none → null. */
export const levelOfBand = (text: string | null | undefined) => {
  const l = bandLevelOf(text);
  return l ? BAND_LEVELS.indexOf(l) + 1 : null;
};

type Kit = { equipment?: string[] | null; band?: string | null };

/** Whether it's done with a band, so it has a band level: one is ticked in its equipment, or it already has a level. */
export const usesBand = (e: Kit) => (e.equipment || []).includes(BAND) || bandLevelOf(e.band) != null;

/** Whether it takes a weight in pounds: anything done with equipment other than a band. Bodyweight (no equipment)
 * and a band on its own don't. One whose equipment isn't known (made before equipment was) still does. */
export const takesWeight = (e: Kit) => e.equipment == null || e.equipment.some((x) => x !== BAND);
