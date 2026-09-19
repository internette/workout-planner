import { QUESTS, TOKENS } from './constants';

export const questFor = seed => QUESTS[Math.abs(Math.round(seed)) % QUESTS.length];
export const questSeed = (day, month) => questFor(day * 3 + month);
export const tokenFor = seed => TOKENS[Math.abs(Math.round(seed)) % TOKENS.length];
export const CAT = n => n.indexOf('Push')>-1 ? 'Push' : n.indexOf('Pull')>-1 ? 'Pull' : n.indexOf('Leg')>-1 ? 'Legs' : 'Core';
export const idOf = av => (av && av.id) || 'unknown';
export const isoOf = dt => dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');
