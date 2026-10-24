import { RANKS } from '@/frontend/shared/constants';
import { plural } from '@/frontend/shared/helpers';
import type { Ctx } from '../planner/store/types';
import { BOSS_COUNT, BOSS_DAYS, BOSS_XP, bossName, bossRank } from './bosses';

// Boss battles on screen: the fight's card (Day view and the session), the ceremonies when one appears and when it
// falls, and the trophies on Profile.
export function bossVals(ctx: Ctx) {
  const { bossFight: f, bossWins, bossBlocks, bossTodayPlan, derivedRank, st, mi, selDay, TODAY_M, TODAY_D } = ctx;
  const gemOf = (k: number) => (bossRank(k) === RANKS.length - 1 ? 'var(--color-gold)' : RANKS[bossRank(k)].gem);
  // A trophy is drawn in the deep shade its rank's pill uses for text, on that rank's tint: most bright gems are under
  // 3:1 on a light tile, and the deep shade is 4.7:1 or more.
  const trophyLookOf = (k: number) =>
    bossRank(k) === RANKS.length - 1
      ? { tint: 'var(--color-gold-tint)', deep: 'var(--color-gold-deep)' }
      : { tint: RANKS[bossRank(k)].pill.background, deep: RANKS[bossRank(k)].pill.color };
  const unlocks = (k: number) => RANKS[bossRank(k) + 1]?.name ?? '';
  const onToday = mi === TODAY_M && selDay === TODAY_D;
  const card = f
    ? {
        name: bossName(f.k),
        gem: gemOf(f.k),
        eyebrow: f.escapes && f.dealt === 0 ? 'Rematch' : 'Boss battle',
        hpLeft: f.hp - f.dealt,
        hp: f.hp,
        hpLabel: (f.hp - f.dealt).toLocaleString('en-US') + ' / ' + f.hp.toLocaleString('en-US') + ' HP',
        pct: Math.round(((f.hp - f.dealt) / f.hp) * 100),
        daysLabel: f.daysLeft === 1 ? 'Last day' : f.daysLeft + ' days left',
        // A boss that got away says so until the rematch has been hit.
        note:
          f.escapes && f.dealt === 0
            ? 'It got away with ' + f.lastLeft + ' HP left, and it’s back at full strength.'
            : bossTodayPlan > 0
              ? 'Today’s plan deals about ' + bossTodayPlan + '.'
              : 'Every set you tick hits it for 10.',
        // Held back: the XP for the next rank is already there.
        blocked: bossBlocks ? 'Beat it to reach ' + unlocks(f.k) + '.' : unlocks(f.k) ? 'Beat it to unlock ' + unlocks(f.k) + '.' : 'The last boss.',
      }
    : null;
  const lastWin = bossWins.length ? bossWins[bossWins.length - 1] : null;
  const nextK = bossWins.length;
  return {
    bossCard: card,
    bossOnDay: !!card && (st.screen === 'day' || st.screen === 'rest') && onToday,
    bossOnSession: !!card && st.screen === 'detail' && onToday,
    // For the ceremonies (BossBattle, in Planner.tsx), each played once.
    bossAppearKey: f ? f.k : null,
    bossAppear: f
      ? {
          name: bossName(f.k),
          gem: gemOf(f.k),
          eyebrow: 'Boss battle · Rank ' + (bossRank(f.k) + 1),
          line: unlocks(f.k)
            ? 'stands between you and ' + unlocks(f.k) + '. Every set you tick strikes it.'
            : 'guards the top of the ladder. Every set you tick strikes it.',
          hp: f.hp,
          days: plural(BOSS_DAYS, 'day'),
          reward: unlocks(f.k) ? 'Rank ' + (bossRank(f.k) + 2) : '+' + BOSS_XP + ' XP',
          rewardLabel: unlocks(f.k) ? 'Unlocks' : 'Reward',
        }
      : null,
    bossWinKey: lastWin ? lastWin.k : null,
    bossWon: lastWin
      ? {
          name: bossName(lastWin.k),
          line:
            'Felled in ' +
            plural(lastWin.days, 'day') +
            (lastWin.escapes ? ', after it got away ' + (lastWin.escapes === 1 ? 'once' : lastWin.escapes + ' times') : '') +
            '.',
          bonus: '+' + BOSS_XP + ' XP',
          count: bossWins.length + ' of ' + BOSS_COUNT,
          next:
            nextK < BOSS_COUNT
              ? 'You’re now ' + RANKS[derivedRank].name + '. The next boss waits at Rank ' + (bossRank(nextK) + 1) + '.'
              : 'Every boss is beaten.',
        }
      : null,
    bossesLabel: bossWins.length + ' of ' + BOSS_COUNT + ' beaten',
    bossTrophies: Array.from({ length: BOSS_COUNT }, (_, k) => {
      const won = bossWins.some((w) => w.k === k);
      return { k, won, fighting: !!f && f.k === k, label: won ? bossName(k).replace(/^The /, '') : 'Rank ' + (bossRank(k) + 1), ...trophyLookOf(k) };
    }).slice(0, Math.min(BOSS_COUNT, Math.max(8, Math.ceil((nextK + 2) / 4) * 4))),
    bossNext: f
      ? { label: 'Fighting now', value: bossName(f.k), aside: card?.daysLabel ?? '' }
      : nextK < BOSS_COUNT
        ? {
            label: 'Next boss',
            value: 'Rank ' + (bossRank(nextK) + 1) + ' · ' + RANKS[bossRank(nextK)].name,
            aside: plural(bossRank(nextK) - derivedRank, 'rank') + ' away',
          }
        : null,
  };
}
