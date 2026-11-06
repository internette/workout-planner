// The Storm Wyrm (rank 10): a dragon's head seen head-on, horns swept up, lightning fins at the cheeks, a bolt on its
// brow. In the 220 × 220 box the crescent uses. The left half is drawn once and mirrored across x = 110.

/** The head, down the middle. */
export const STORM_WYRM_HEAD = 'M110 64 C140 64 158 82 160 106 L154 138 C148 162 132 182 110 190 C88 182 72 162 66 138 L60 106 C62 82 80 64 110 64 Z';

/** One side's horn, small horn, lightning fin and fang. */
export const STORM_WYRM_SIDE = 'M86 74 Q62 36 24 22 Q52 48 70 92 Z M96 68 Q90 44 72 30 Q84 52 84 72 Z M64 108 L22 96 L44 116 L8 128 L48 132 L28 150 L70 140 Z M92 178 L96 204 L104 184 Z';

/** One side's whisker, drawn as a 4-wide round stroke. */
export const STORM_WYRM_WHISKER = 'M86 166 Q52 172 40 200';

/** Cut through the head: one side's eye and nostril. */
export const STORM_WYRM_FACE = 'M72 112 Q88 112 102 124 Q86 130 76 124 Z M100 158 A4 6 0 1 0 100 170 A4 6 0 1 0 100 158 Z';

/** Cut through the head: the bolt on its brow. */
export const STORM_WYRM_BOLT = 'M116 76 L102 100 L112 100 L104 120 L122 94 L112 94 Z';

/** Mirrors a side across the middle. */
export const STORM_WYRM_MIRROR = 'matrix(-1 0 0 1 220 0)';
