// The session clock's heartbeat, off the page's main thread.
//
// A page in the background has its timers slowed to about once a minute; a worker's keep time. So the page asks this
// worker to tick while a session's clock is running, and redraws on each tick.

export type WorkerIn = { type: 'run'; on: boolean };
export type WorkerOut = { type: 'tick'; at: number };

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

ctx.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'run') {
    if (timer) clearTimeout(timer);
    timer = null;
    if (m.on) tick();
  }
};
