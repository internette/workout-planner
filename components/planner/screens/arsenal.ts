import { MONTHS } from '../constants';
import { iconSvg } from '../icons';
import * as db from '@/lib/plannerData';
import type { Ctx } from '../types';

// Arsenal: the exercise library, its search and the add-exercise form.
export function arsenalVals(ctx: Ctx) {
  const { logic, st, EX, arsenalNames, firstEntry, nameOf } = ctx;
  return {
    arsenalAddOpen: !!st.arsenalAdd,
    openArsenalAdd: () => logic.s({ arsenalAdd: true }),
    closeArsenalAdd: () => logic.s({ arsenalAdd: false, dName: '', dSets: '', dWeight: '', dRest: '' }),
    commitArsenal: () => {
      const nm = (st.dName || '').trim();
      if (!nm) return;
      const item = {
        name: nm,
        sets: st.dSets || '3 × 10',
        weight: st.dWeight || '—',
        rest: st.dRest || '60 sec',
        i: st.dIcon || 'h',
      };
      logic.save(() => db.addLibraryExercise(item), {
        arsenalAdd: false,
        dName: '',
        dSets: '',
        dWeight: '',
        dRest: '',
        dIcon: 'h',
      });
    },
    movesCount: (() => {
      const s2 = {};
      Object.keys(EX).forEach((k) =>
        EX[k].forEach((e) => {
          s2[e.name] = 1;
        }),
      );
      Object.keys(st.extra || {}).forEach((k) =>
        (st.extra[k] || []).forEach((e) => {
          s2[e.name] = 1;
        }),
      );
      logic.model.library.forEach((e) => {
        s2[e.name] = 1;
      });
      return Object.keys(s2).length + ' exercises';
    })(),
    arsenalQuery: st.arsenalQ || '',
    noMatches:
      !!(st.arsenalQ || '').trim() &&
      !arsenalNames.some((n) => n.toLowerCase().indexOf((st.arsenalQ || '').trim().toLowerCase()) > -1),
    noMatchNote: 'No exercise matches “' + (st.arsenalQ || '').trim() + '”.',
    hasQuery: !!(st.arsenalQ || '').trim(),
    setArsenalQuery: (e) => logic.s({ arsenalQ: e.target.value }),
    clearArsenalQuery: () => logic.s({ arsenalQ: '' }),
    moveGroups: (() => {
      const q = (st.arsenalQ || '').trim().toLowerCase();
      const groups = [];
      const push = (label, items) => {
        const hit = items.filter((e) => !q || e.name.toLowerCase().indexOf(q) > -1);
        if (hit.length)
          groups.push({
            label: label.toUpperCase(),
            count: hit.length + (hit.length === 1 ? ' exercise' : ' exercises'),
            items: hit,
          });
      };
      const rowStyle = (clickable) =>
        'display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:16px 20px;background:#fff;border-radius:18px;box-shadow:0 4px 14px rgba(35,42,69,.07)' +
        (clickable ? ';cursor:pointer' : '');
      Object.keys(EX).forEach((w) => {
        const firstDay = firstEntry(w);
        push(
          w,
          (EX[w] || []).map((e) => ({
            name: e.name,
            svg: iconSvg(e.i),
            detail: e.sets + ' · ' + e.weight,
            open: firstDay
              ? () => logic.nav({ screen: 'detail', creating: false, month: MONTHS[firstDay.m], day: firstDay.d })
              : null,
            rowStyle: rowStyle(!!firstDay),
          })),
        );
      });
      push(
        'Unassigned',
        logic.model.library.map((e) => ({
          name: e.name,
          svg: iconSvg(e.i),
          detail: e.sets + ' · ' + e.weight,
          open: null,
          rowStyle: rowStyle(false),
        })),
      );
      return groups;
    })(),
    moveLibrary: (() => {
      const seen = {};
      Object.keys(EX).forEach((k) =>
        EX[k].forEach((e) => {
          if (!seen[e.name]) seen[e.name] = { name: e.name, i: e.i, sets: e.sets, weight: e.weight, used: [] };
          seen[e.name].used.push(k);
        }),
      );
      Object.keys(st.extra || {}).forEach((k) =>
        (st.extra[k] || []).forEach((e) => {
          if (!seen[e.name]) seen[e.name] = { name: e.name, i: e.i, sets: e.sets, weight: e.weight, used: [] };
          let label = 'Arsenal only';
          if (k === '__draft') label = 'New workout';
          else {
            const src = logic.model.entries.find((x) => x.av.id === k);
            label = src ? nameOf(src.av.name) : 'Arsenal only';
          }
          if (seen[e.name].used.indexOf(label) === -1) seen[e.name].used.push(label);
        }),
      );
      logic.model.library.forEach((e) => {
        if (!seen[e.name]) seen[e.name] = { name: e.name, i: e.i, sets: e.sets, weight: e.weight, used: [] };
      });
      const q = (st.arsenalQ || '').trim().toLowerCase();
      return Object.keys(seen)
        .filter((n) => !q || n.toLowerCase().indexOf(q) > -1)
        .map((n) => {
          const owners = seen[n].used;
          const firstDay = owners.length ? firstEntry(owners[0]) : null;
          return {
            name: n,
            svg: iconSvg(seen[n].i),
            detail: seen[n].sets + ' · ' + seen[n].weight,
            used: !owners.length ? 'Arsenal only' : owners.length === 1 ? owners[0] : owners.length + ' workouts',
            open: firstDay
              ? () => logic.nav({ screen: 'detail', creating: false, month: MONTHS[firstDay.m], day: firstDay.d })
              : null,
            rowStyle:
              'display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:16px 20px;background:#fff;border-radius:18px;box-shadow:0 4px 14px rgba(35,42,69,.07)' +
              (firstDay ? ';cursor:pointer' : ''),
          };
        });
    })(),
  };
}
