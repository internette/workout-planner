// Resistance bands are set by how hard they pull, not by weight: a level, saved as the weight with the unit "band"
// (weight_value 1 to 4) and written "Medium band" everywhere else.
export const BAND = 'Resistance band';
export const BAND_LEVELS = ['Light', 'Medium', 'Heavy', 'Extra heavy'] as const;
export type BandLevel = (typeof BAND_LEVELS)[number];

export const bandWeight = (level: BandLevel) => level + ' band';

/** "Medium band" → "Medium"; anything else → null. */
export function bandLevelOf(weight: string | null | undefined): BandLevel | null {
  const t = (weight || '').trim().toLowerCase();
  return BAND_LEVELS.find((l) => t === l.toLowerCase() + ' band') ?? null;
}

/** Whether an exercise's resistance is a band: it's done with one, or already has a band level. */
export const usesBand = (e: { equipment?: string[] | null; weight?: string | null }) =>
  (e.equipment || []).includes(BAND) || bandLevelOf(e.weight) != null;
