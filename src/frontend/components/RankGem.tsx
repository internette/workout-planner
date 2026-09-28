/** The faceted gem that marks a rank (and, in the quest stats, a kind of quest), in the rank's colour. */
export function RankGem({ fill, faded = false }: { fill: string; faded?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        width: 10,
        height: 14,
        flex: 'none',
        clipPath: 'polygon(50% 0,100% 35%,50% 100%,0 35%)',
        background: fill,
        opacity: faded ? 0.45 : undefined,
      }}
    />
  );
}
