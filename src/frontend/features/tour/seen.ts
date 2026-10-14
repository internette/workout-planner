// Whether the app's tour has been seen (or skipped) in this browser. A new account gets it once, the first time it opens
// the app; Settings has it again any time.
const KEY = 'moonshot.tour.seen';

export function tourSeen(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    // Storage blocked: count it as seen, so it doesn't come back on every visit.
    return true;
  }
}

export function markTourSeen() {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    // Storage blocked: nothing to remember it in.
  }
}
