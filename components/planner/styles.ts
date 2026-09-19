// Inline-style builders shared by the screens. Each takes whether the control is active.

export const tab = on => 'padding:9px 15px;border:none;border-radius:11px;font-size:12.5px;font-weight:600;cursor:pointer;'
  + (on ? 'background:#232A45;color:#fff' : 'background:rgba(255,255,255,.75);color:#5C6684');

export const scopeStyle = on => 'flex:none;padding:9px 18px;border:none;border-radius:11px;font-size:12.5px;font-weight:600;cursor:pointer;'
  + (on ? 'background:#E1699C;color:#fff' : 'background:none;color:#746E88');

export const zoneStyle = on => 'padding:10px 16px;border:none;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;'
  + (on ? 'background:#E1699C;color:#fff' : 'background:#FBF1F3;color:#5C6684');

export const modeStyle = on => 'padding:9px 13px;border:none;border-radius:10px;font-size:12.5px;font-weight:600;cursor:pointer;'
  + (on ? 'background:#fff;color:#c4548a;box-shadow:0 1px 3px rgba(35,42,69,.06)' : 'background:none;color:#746E88');

export const optStyle = on => 'min-height:48px;border:none;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:'
  + (on ? '#FCE8F1' : '#FBF1F3') + (on ? ';box-shadow:0 0 0 2px #E1699C' : '');

export const mTab = (on) => 'flex:1;min-height:56px;border:none;background:none;padding:8px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;border-radius:14px;'
  + (on ? 'background:#FCE8F1' : '');

export const mLabel = on => 'font-size:10.5px;font-weight:'+(on?'700':'500')+';letter-spacing:.01em;color:'+(on?'#c4548a':'#746E88');
