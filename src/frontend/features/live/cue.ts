// The cue when a rest or a timed set runs out: a chime (a soft two notes for a rest, a clearer three for a timed set) (where the person hasn't turned it off) and a
// short glow on the session card. iPhones don't let a page vibrate, so without these an iPhone gave no sign at all.
//
// The chime is Web Audio under Safari's "ambient" audio session (see setAudioSession), so it mixes with music from other
// apps, neither pausing nor lowering it, and the ring/silent switch mutes it. iOS only plays a page's sound after a tap
// on it, so the audio is unlocked on the first tap and plays only while the page is open.

const GLOW_MS = 3000;

let ctx: AudioContext | null = null;
let last: { at: number; kind: 'rest' | 'hold' } = { at: 0, kind: 'rest' };

function audio(): AudioContext | null {
  // A context the browser closed can't play again, so a new one takes its place.
  if (ctx && ctx.state !== 'closed') return ctx;
  const AC = typeof window !== 'undefined' ? window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext : undefined;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    ctx = null;
  }
  return ctx;
}

/** Wakes the audio if it isn't playing: "suspended" before a tap, and on iPhone "interrupted" after a call, Siri, the
 * screen locking or another app taking the audio. Only "suspended" was tried before, so after an interruption the
 * chime stayed silent until the page was reloaded. */
function wake(c: AudioContext) {
  if (c.state !== 'running') c.resume().catch(() => undefined);
}

/** Lets the chime play later: iOS needs the audio started from a tap. Call from a tap or key press. A silent blip is
 * played from the tap too, which is what iOS needs to count the audio as started. */
export function unlockChime() {
  const c = audio();
  if (!c) return;
  wake(c);
  try {
    const src = c.createBufferSource();
    src.buffer = c.createBuffer(1, 1, 22050);
    src.connect(c.destination);
    src.start(0);
  } catch {
    // Nothing to unlock with; the chime may still play.
  }
}

/** A note that rings and fades: `f` Hz from `t`, at `peak` loudness, lasting `len` seconds. A triangle wave carries
 * better than a pure sine on a phone's small speaker. */
function ring(c: AudioContext, t: number, f: number, peak: number, len: number, type: OscillatorType = 'sine') {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = f;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, t + len);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + len + 0.05);
}

/** The sound when a rest or timed set runs out. A rest: two short, soft notes (E6 then A6), about half a second. A
 * timed set: a clearer, louder three-note rise (C6, E6, G6, the last held), about a second, so it's heard from a
 * plank or a hang over music. */
export function playChime(kind: 'rest' | 'hold' = 'rest') {
  const c = audio();
  if (!c) return;
  wake(c);
  const t = c.currentTime + 0.02;
  if (kind === 'hold') {
    ring(c, t, 1046.5, 0.32, 0.35, 'triangle');
    ring(c, t + 0.14, 1318.5, 0.32, 0.35, 'triangle');
    ring(c, t + 0.28, 1568, 0.36, 0.8, 'triangle');
    return;
  }
  ring(c, t, 1318.5, 0.18, 0.45);
  ring(c, t + 0.16, 1760, 0.18, 0.45);
}

/** One short, quiet sine note (A5), for each of a timed set's last three seconds. */
export function playTick() {
  const c = audio();
  if (!c) return;
  wake(c);
  const t = c.currentTime + 0.02;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sine';
  o.frequency.value = 880;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.1, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.15);
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
