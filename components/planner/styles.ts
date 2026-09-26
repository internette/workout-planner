// Inline-style builders shared by the screens. Each takes whether the control is active.

export const optStyle = on => 'min-height:48px;border:none;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:'
  + (on ? 'var(--color-accent-tint)' : 'var(--color-canvas)') + (on ? ';box-shadow:0 0 0 2px var(--color-accent)' : '');

export const mTab = (on) => 'text-decoration:none;flex:1;min-width:0;min-height:56px;border:none;background:none;padding:8px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;border-radius:14px;'
  + (on ? 'background:var(--color-accent-tint)' : '');

// The size comes from the .mlabel class in planner.css (12 px, 11 px on the narrowest phones).
export const mLabel = on => 'white-space:nowrap;font-weight:'+(on?'var(--font-weight-bold)':'var(--font-weight-medium)')+';color:'+(on?'var(--color-accent-deep)':'var(--color-muted)');
