// The cue when a rest or a timed set runs out: a soft two-note chime (where the person hasn't turned it off) and a
// short glow on the session card. iPhones don't let a page vibrate, so without these an iPhone gave no sign at all.
//
// The chime is Web Audio under Safari's "ambient" audio session (see setAudioSession), so it mixes with music from other
// apps, neither pausing nor lowering it, and the ring/silent switch mutes it. iOS only plays a page's sound after a tap
// on it, so the audio is unlocked on the first tap and plays only while the page is open.

const GLOW_MS = 3000;

let ctx: AudioContext | null = null;
let last: { at: number; kind: 'rest' | 'hold' } = { at: 0, kind: 'rest' };

function audio(): AudioContext | null {
  if (ctx) return ctx;
  const AC = typeof window !== 'undefined' ? window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext : undefined;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    ctx = null;
  }
  return ctx;
}

/** Lets the chime play later: iOS needs the audio started from a tap. Call from a tap or key press. */
export function unlockChime() {
  const c = audio();
  if (c && c.state === 'suspended') c.resume().catch(() => undefined);
}

/** Two short, soft sine notes (E6 then A6), about half a second in all. */
export function playChime() {
  const c = audio();
  if (!c) return;
  if (c.state === 'suspended') c.resume().catch(() => undefined);
  const note = (t: number, f: number) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.5);
  };
  const t = c.currentTime + 0.02;
  note(t, 1318.5);
  note(t + 0.16, 1760);
}

/** A rest or timed set just ran out (not skipped or ended early). */
export function markEnd(kind: 'rest' | 'hold') {
  last = { at: Date.now(), kind };
}

/** What the session card shows for a few seconds after a rest or timed set runs out, or null. */
export function endCue(): { label: string } | null {
  if (Date.now() - last.at >= GLOW_MS) return null;
  return { label: last.kind === 'rest' ? 'Rest’s over' : 'Time’s up, set done' };
}

export const CUE_MS = GLOW_MS;
