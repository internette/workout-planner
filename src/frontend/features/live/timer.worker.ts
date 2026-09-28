// The session clock's heartbeat, and the lock-screen artwork, off the page's main thread.
//
// A page in the background has its timers slowed to about once a minute; a worker's keep time. So the page asks this
// worker to tick while a session's clock is running, and redraws (and updates the notification) on each tick.
// The artwork is drawn here too, on an OffscreenCanvas, so drawing it never holds up the page.
import type { LiveActivity } from './model';
import type { LiveLook } from './look';

export type WorkerIn =
  | { type: 'run'; on: boolean }
  | { type: 'art'; key: string; activity: LiveActivity; look: LiveLook; paused: boolean };
export type WorkerOut = { type: 'tick'; at: number } | { type: 'art'; key: string; blob: Blob | null };

// Typed loosely: this file is compiled with the page's DOM library, not the worker one.
const ctx = self as unknown as {
  postMessage(m: WorkerOut): void;
  onmessage: ((e: MessageEvent<WorkerIn>) => void) | null;
};

let timer: ReturnType<typeof setTimeout> | null = null;
// Each tick lands just after a whole second, so the readout changes in step with the clock rather than drifting.
const tick = () => {
  timer = setTimeout(() => {
    ctx.postMessage({ type: 'tick', at: Date.now() });
    tick();
  }, 1000 - (Date.now() % 1000) + 5);
};

const SIZE = 512;
const PAD = 44;

// Words onto lines no wider than the card, at most `max` of them, the last ending "…" if it had to stop short.
function wrap(g: OffscreenCanvasRenderingContext2D, text: string, width: number, max: number) {
  const lines: string[] = [];
  let line = '';
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    const next = line ? line + ' ' + words[i] : words[i];
    if (g.measureText(next).width <= width || !line) line = next;
    else {
      lines.push(line);
      line = words[i];
    }
  }
  if (line) lines.push(line);
  if (lines.length > max) {
    const kept = lines.slice(0, max);
    let last = kept[max - 1];
    while (last && g.measureText(last + '…').width > width) last = last.slice(0, -1);
    kept[max - 1] = last + '…';
    return kept;
  }
  return lines;
}

function roundRect(g: OffscreenCanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

// The lock-screen card, square, as the player's artwork: what's being done and how far along it is. The time itself
// isn't drawn: the player's own bar shows it, and keeps counting without a redraw.
async function draw(a: LiveActivity, c: LiveLook, paused: boolean): Promise<Blob | null> {
  if (typeof OffscreenCanvas === 'undefined') return null;
  const canvas = new OffscreenCanvas(SIZE, SIZE);
  const g = canvas.getContext('2d');
  if (!g) return null;
  const inner = SIZE - PAD * 2;
  g.fillStyle = c.card;
  g.fillRect(0, 0, SIZE, SIZE);

  let y = PAD + 26;
  g.textBaseline = 'alphabetic';
  g.fillStyle = paused ? c.muted : c.accent;
  g.font = '700 26px ' + FONT;
  const eyebrow = paused ? 'PAUSED' : a.kind === 'ride' ? 'RIDE' + (a.ride?.zone ? ' · ' + a.ride.zone.toUpperCase() : '') : "TODAY'S QUEST";
  g.fillText(eyebrow, PAD, y);

  g.fillStyle = c.ink;
  g.font = '800 58px ' + FONT;
  const nameLines = wrap(g, a.name, inner, 2);
  nameLines.forEach((line) => {
    y += 66;
    g.fillText(line, PAD, y);
  });

  if (a.kind === 'lift') {
    // The progress bar, in the rank gem's gradient, then how many are done and what's next.
    y += 56;
    roundRect(g, PAD, y, inner, 22, 11);
    g.fillStyle = c.track;
    g.fill();
    const pct = a.total ? a.done / a.total : 0;
    if (pct > 0) {
      const grad = g.createLinearGradient(PAD, 0, PAD + inner, 0);
      grad.addColorStop(0, c.gem[0]);
      grad.addColorStop(0.55, c.gem[1]);
      grad.addColorStop(1, c.gem[2]);
      roundRect(g, PAD, y, Math.max(22, inner * pct), 22, 11);
      g.fillStyle = grad;
      g.fill();
    }
    y += 70;
    g.fillStyle = c.ink;
    g.font = '700 34px ' + FONT;
    g.fillText(a.done + ' of ' + a.total + ' done', PAD, y);
    if (a.now) {
      g.fillStyle = c.muted;
      g.font = '500 30px ' + FONT;
      wrap(g, 'Now: ' + a.now.name + (a.now.line ? ' · ' + a.now.line : ''), inner, 2).forEach((line) => {
        y += 42;
        g.fillText(line, PAD, y);
      });
    }
  } else if (a.ride) {
    // The ride's plan, two stats side by side.
    y += 84;
    const stat = (label: string, value: string, x: number) => {
      g.fillStyle = c.muted;
      g.font = '700 24px ' + FONT;
      g.fillText(label, x, y);
      g.fillStyle = c.ink;
      g.font = '800 44px ' + FONT;
      g.fillText(value, x, y + 52);
    };
    stat('PLANNED', a.ride.dist ? a.ride.dist + ' mi' : a.ride.planned, PAD);
    if (a.ride.climb) stat('CLIMB', a.ride.climb + ' ft', PAD + inner / 2);
  }

  // The brand's mark along the bottom: a chip in the accent.
  g.font = '800 24px ' + FONT;
  const brand = 'MOONSHOT';
  const bw = g.measureText(brand).width + 36;
  roundRect(g, PAD, SIZE - PAD - 44, bw, 44, 22);
  g.fillStyle = c.second;
  g.fill();
  g.fillStyle = c.onSecond;
  g.fillText(brand, PAD + 18, SIZE - PAD - 13);

  return canvas.convertToBlob({ type: 'image/png' });
}

ctx.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'run') {
    if (timer) clearTimeout(timer);
    timer = null;
    if (m.on) tick();
  } else if (m.type === 'art') {
    draw(m.activity, m.look, m.paused)
      .catch(() => null)
      .then((blob) => ctx.postMessage({ type: 'art', key: m.key, blob }));
  }
};
