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
const PAD = 40;

// Moonshot's mark (the crescent), in its own colours, from its 64-unit drawing.
const MARK: [string, string][] = [
  ['M24.9 9.1 L22.1 18.1 L10.8 20.7 Z', '#D53181'],
  ['M10.8 20.7 L22.1 18.1 L23.3 27.5 L9.1 39 Z', '#BE5D99'],
  ['M9.1 39 L23.3 27.5 L28.4 35.6 L20.7 53.2 Z', '#A279B1'],
  ['M20.7 53.2 L28.4 35.6 L36.5 40.7 L39 54.9 Z', '#7C8FC9'],
  ['M39 54.9 L36.5 40.7 L45.9 41.9 L53.2 43.3 Z', '#6DA9CF'],
  ['M53.2 43.3 L45.9 41.9 L54.9 39.1 Z', '#5EC4D6'],
];
function mark(g: OffscreenCanvasRenderingContext2D, x: number, y: number, size: number) {
  g.save();
  g.translate(x, y);
  g.scale(size / 64, size / 64);
  MARK.forEach(([d, fill]) => {
    g.fillStyle = fill;
    g.fill(new Path2D(d));
  });
  g.restore();
}

// Stroke icons from the app's 24-unit set, drawn in one colour.
const ICON = {
  bike: ['M6 17m-3.4 0a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0 -6.8 0', 'M18 17m-3.4 0a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0 -6.8 0', 'M6 17l5-8h5l2 8', 'M10 9h4'],
  clock: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M12 7L12 12L15.5 14'],
};
function icon(g: OffscreenCanvasRenderingContext2D, paths: string[], x: number, y: number, size: number, color: string) {
  g.save();
  g.translate(x, y);
  g.scale(size / 24, size / 24);
  g.strokeStyle = color;
  g.lineWidth = 2.1;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  paths.forEach((d) => g.stroke(new Path2D(d)));
  g.restore();
}

function gemGradient(g: OffscreenCanvasRenderingContext2D, c: LiveLook, x0: number, x1: number) {
  const grad = g.createLinearGradient(x0, 0, x1, 0);
  grad.addColorStop(0, c.gem[0]);
  grad.addColorStop(0.55, c.gem[1]);
  grad.addColorStop(1, c.gem[2]);
  return grad;
}

// An eyebrow ("TODAY'S QUEST") over a name, with room kept on the left for an icon.
function heading(g: OffscreenCanvasRenderingContext2D, c: LiveLook, x: number, eyebrow: string, name: string, eyebrowColor = c.muted) {
  g.fillStyle = eyebrowColor;
  g.font = '600 22px ' + FONT;
  g.fillText(eyebrow, x, PAD + 30);
  g.fillStyle = c.ink;
  g.font = '700 40px ' + FONT;
  const lines = wrap(g, name, SIZE - PAD - x, 2);
  lines.forEach((line, i) => g.fillText(line, x, PAD + 76 + i * 46));
  return PAD + 76 + (lines.length - 1) * 46;
}

// A label over a value, as the ride's PLANNED and CLIMB.
function stat(g: OffscreenCanvasRenderingContext2D, c: LiveLook, label: string, value: string, x: number, y: number) {
  g.fillStyle = c.muted;
  g.font = '600 22px ' + FONT;
  g.fillText(label, x, y);
  g.fillStyle = c.ink;
  g.font = '700 40px ' + FONT;
  g.fillText(value, x, y + 48);
}

// The lock-screen card from the Live Activity designs, square, as the player's artwork: lifting, rest or ride, in
// this browser's colour and light or dark. The designs' buttons aren't drawn (a picture can't be pressed; the player's
// own buttons do those jobs), nor a running clock: the player's bar keeps time without a redraw.
async function draw(a: LiveActivity, c: LiveLook, paused: boolean): Promise<Blob | null> {
  if (typeof OffscreenCanvas === 'undefined') return null;
  const canvas = new OffscreenCanvas(SIZE, SIZE);
  const g = canvas.getContext('2d');
  if (!g) return null;
  const inner = SIZE - PAD * 2;
  g.fillStyle = c.card;
  g.fillRect(0, 0, SIZE, SIZE);
  g.textBaseline = 'alphabetic';

  if (a.rest) {
    // Rest: the ring, when it ends, and what's up next.
    const r = 70;
    const cx = PAD + r;
    const cy = PAD + r + 6;
    g.lineWidth = 16;
    g.lineCap = 'round';
    g.strokeStyle = c.track;
    g.beginPath();
    g.arc(cx, cy, r - 8, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = c.accent;
    g.beginPath();
    g.arc(cx, cy, r - 8, -Math.PI / 2, Math.PI * 1.1);
    g.stroke();
    icon(g, ICON.clock, cx - 26, cy - 26, 52, c.ink);
    const x = PAD + r * 2 + 28;
    g.fillStyle = c.muted;
    g.font = '600 22px ' + FONT;
    g.fillText('REST', x, cy - 26);
    g.fillStyle = c.ink;
    g.font = '700 30px ' + FONT;
    g.fillText('until', x, cy + 12);
    g.font = '700 50px ' + FONT;
    g.fillText(new Date(a.rest.endsAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), x, cy + 64);
    // What's up next, along the bottom.
    if (a.rest.next) {
      let y = SIZE - PAD;
      if (a.rest.next.line) {
        g.fillStyle = c.soft;
        g.font = '500 30px ' + FONT;
        g.fillText(a.rest.next.line, PAD, y);
        y -= 50;
      }
      g.fillStyle = c.ink;
      g.font = '700 44px ' + FONT;
      g.fillText(wrap(g, a.rest.next.name, inner, 1)[0], PAD, y);
      g.fillStyle = c.muted;
      g.font = '600 22px ' + FONT;
      g.fillText('UP NEXT', PAD, y - 54);
    }
  } else if (a.kind === 'ride' && a.ride) {
    // Ride: the bike on its tile, the plan's distance and climb.
    roundRect(g, PAD, PAD + 4, 76, 76, 20);
    g.fillStyle = c.second;
    g.fill();
    icon(g, ICON.bike, PAD + 16, PAD + 20, 44, c.iconInk);
    const eyebrow = paused ? 'PAUSED' : 'RIDE' + (a.ride.zone ? ' · ' + a.ride.zone.toUpperCase() : '');
    heading(g, c, PAD + 96, eyebrow, a.name);
    // The plan along the bottom.
    const sy = SIZE - PAD - 52;
    stat(g, c, 'PLANNED', a.ride.dist ? a.ride.dist + ' mi' : a.ride.planned, PAD, sy);
    if (a.ride.climb) stat(g, c, 'CLIMB', a.ride.climb + ' ft', PAD + inner / 2, sy);
  } else {
    // Lifting: the mark and the quest at the top; along the bottom a segment an exercise (done ones in the gem, the
    // current one outlined), how many are done, and what's now with its set.
    mark(g, PAD - 4, PAD + 4, 64);
    heading(g, c, PAD + 80, paused ? 'PAUSED' : 'TODAY’S QUEST', a.name);
    let y = SIZE - PAD;
    if (a.now) {
      if (a.now.line) {
        g.fillStyle = c.soft;
        g.font = '500 30px ' + FONT;
        g.fillText(a.now.line, PAD, y);
        y -= 44;
      }
      g.fillStyle = c.ink;
      g.font = '600 32px ' + FONT;
      g.fillText(wrap(g, 'Now: ' + a.now.name, inner, 1)[0], PAD, y);
      y -= 54;
    }
    g.fillStyle = c.ink;
    g.font = '700 36px ' + FONT;
    g.fillText(a.done + ' of ' + a.total + ' done', PAD, y);
    y -= 60;
    const n = Math.max(1, a.total);
    const gap = 8;
    const w = (inner - gap * (n - 1)) / n;
    const grad = gemGradient(g, c, PAD, PAD + inner);
    for (let i = 0; i < n; i++) {
      const x = PAD + i * (w + gap);
      roundRect(g, x, y, w, 12, 6);
      g.fillStyle = i < a.done ? grad : c.track;
      g.fill();
      if (i === a.done && a.now) {
        g.strokeStyle = c.accent;
        g.lineWidth = 3;
        roundRect(g, x + 1.5, y + 1.5, w - 3, 9, 4.5);
        g.stroke();
      }
    }
  }
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
