// Inline-style builders shared by the screens. Each takes whether the control is active.

export const tab = on => 'padding:9px 15px;border:none;border-radius:11px;font-size:var(--text-md);font-weight:var(--font-weight-semibold);cursor:pointer;'
  + (on ? 'background:var(--color-ink);color:var(--color-white)' : 'background:rgba(255,255,255,.75);color:var(--color-slate)');

export const scopeStyle = on => 'flex:none;padding:9px 18px;border:none;border-radius:11px;font-size:var(--text-md);font-weight:var(--font-weight-semibold);cursor:pointer;'
  + (on ? 'background:var(--color-pink);color:var(--color-white)' : 'background:none;color:var(--color-muted)');

export const zoneStyle = on => 'padding:10px 16px;border:none;border-radius:999px;font-size:var(--text-md);font-weight:var(--font-weight-semibold);cursor:pointer;'
  + (on ? 'background:var(--color-pink);color:var(--color-white)' : 'background:var(--color-canvas);color:var(--color-slate)');

export const modeStyle = on => 'padding:9px 13px;border:none;border-radius:10px;font-size:var(--text-md);font-weight:var(--font-weight-semibold);cursor:pointer;'
  + (on ? 'background:var(--color-white);color:var(--color-pink-deep);box-shadow:0 1px 3px rgba(35,42,69,.06)' : 'background:none;color:var(--color-muted)');

export const optStyle = on => 'min-height:48px;border:none;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:'
  + (on ? 'var(--color-pink-tint)' : 'var(--color-canvas)') + (on ? ';box-shadow:0 0 0 2px var(--color-pink)' : '');

export const mTab = (on) => 'flex:1;min-height:56px;border:none;background:none;padding:8px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;border-radius:14px;'
  + (on ? 'background:var(--color-pink-tint)' : '');

export const mLabel = on => 'font-size:var(--text-xs);font-weight:'+(on?'var(--font-weight-bold)':'var(--font-weight-medium)')+';letter-spacing:var(--tracking-loose);color:'+(on?'var(--color-pink-deep)':'var(--color-muted)');
