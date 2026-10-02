// Inline-style builders shared by the screens. Each takes whether the control is active.

export const mTab = (on) => 'text-decoration:none;flex:1;min-width:0;min-height:56px;border:none;background:none;padding:8px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;border-radius:var(--radius-md);'
  + (on ? 'background:var(--color-pink-tint)' : '');

// The size comes from the .mlabel class in planner.css (12 px).
export const mLabel = on => 'white-space:nowrap;font-weight:'+(on?'var(--font-weight-bold)':'var(--font-weight-medium)')+';color:'+(on?'var(--color-pink-deep)':'var(--color-muted)');

// A place in the sidebar. `extra` is what the layout adds (a tablet's row of them).
export const navItem = (on, extra = '') =>
  'display:flex;align-items:center;gap:12px;padding:12px;border:none;border-radius:var(--radius-md);font-size:var(--text-base);text-align:left;cursor:pointer;' +
  (on
    ? 'background:var(--color-pink-tint);color:var(--color-pink-deep);font-weight:var(--font-weight-semibold)'
    : 'background:none;color:var(--color-muted);font-weight:var(--font-weight-medium)') +
  extra;
