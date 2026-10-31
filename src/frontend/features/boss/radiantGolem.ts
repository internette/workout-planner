// The Radiant Golem (rank 25): a stone block with a gem heart, eyes and heart cut through, and a sunburst crown of
// seven sharp rays fanned over its head, long and short in turn. In the 220 × 220 box the crescent uses.

/** The head, the chest and the two arms. Drawn with a soft rounded stroke, since stone has worn edges. */
export const RADIANT_GOLEM_BODY = [
  { x: 78, y: 50, width: 64, height: 52 },
  { x: 16, y: 112, width: 26, height: 64 },
  { x: 178, y: 112, width: 26, height: 64 },
] as const;
export const RADIANT_GOLEM_CHEST = 'M46 112 L174 112 L160 192 L60 192 Z';

/** Cut through the body: two square eyes, then the gem heart. */
export const RADIANT_GOLEM_EYES = [
  { x: 92, y: 68 },
  { x: 115, y: 68 },
] as const;
export const RADIANT_GOLEM_HEART = 'M110 132 L126 150 L110 168 L94 150 Z';

/** The crown's rays, kept off the soft stroke so their tips stay sharp. */
export const RADIANT_GOLEM_RAYS =
  'M65.4 64.9C59.7 55.4 50.1 49.2 42.9 44.7C51.0 47.4 61.9 50.7 72.8 49.0ZM74.8 46.4C74.3 39.0 70.3 32.9 67.2 28.4C71.3 32.0 77.0 36.6 84.3 37.9ZM85.6 37.0C88.1 26.2 85.6 15.1 83.5 6.9C87.4 14.4 93.0 24.3 102.0 30.7ZM103.6 30.4C108.2 24.6 109.3 17.4 110.0 12.0C110.7 17.4 111.8 24.6 116.4 30.4ZM118.0 30.7C127.0 24.3 132.6 14.4 136.5 6.9C134.4 15.1 131.9 26.2 134.4 37.0ZM135.7 37.9C143.0 36.6 148.7 32.0 152.8 28.4C149.7 32.9 145.7 39.0 145.2 46.4ZM147.2 49.0C158.1 50.7 169.0 47.4 177.1 44.7C169.9 49.2 160.3 55.4 154.6 64.9Z';
