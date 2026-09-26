// The app's look: light (the default) or dark, in pink (the default) or one of four other colours. Chosen in Profile →
// Settings and remembered in this browser. Applied as <html data-theme="dark"> and <html data-accent="teal">, which
// switch the colour, shadow and hover tokens.
import { ACCENTS, type Accent } from '@/components/ui/colors/themes';

export type Theme = 'light' | 'dark';
export type { Accent };

export const THEME_KEY = 'moonshot.theme';
export const ACCENT_KEY = 'moonshot.accent';
// The browser chrome (address bar, status bar) takes the page colour of each theme.
const PAGE: Record<Accent, Record<Theme, string>> = {
  pink: { light: '#FBF1F3', dark: '#1B1320' },
  teal: { light: '#F1F9FA', dark: '#10191C' },
  periwinkle: { light: '#F4F5FB', dark: '#14162A' },
  slate: { light: '#F5F5F8', dark: '#15171C' },
  coral: { light: '#FDF5F1', dark: '#1D1614' },
};

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string | null) => {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // Storage blocked: it still applies for this visit.
  }
};

export function savedTheme(): Theme {
  return read(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

export function savedAccent(): Accent {
  const a = read(ACCENT_KEY);
  return ACCENTS.some((x) => x.name === a) ? (a as Accent) : 'pink';
}

/** Applies a look to the page now, without saving it. */
export function applyLook(theme: Theme, accent: Accent) {
  const root = document.documentElement;
  if (theme === 'dark') root.dataset.theme = 'dark';
  else delete root.dataset.theme;
  if (accent !== 'pink') root.dataset.accent = accent;
  else delete root.dataset.accent;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', PAGE[accent][theme]);
}

/** Saves light or dark for this browser and applies it. */
export function setTheme(theme: Theme) {
  write(THEME_KEY, theme === 'dark' ? 'dark' : null);
  applyLook(theme, savedAccent());
}

/** Saves the colour for this browser and applies it. */
export function setAccent(accent: Accent) {
  write(ACCENT_KEY, accent === 'pink' ? null : accent);
  applyLook(savedTheme(), accent);
}

// Runs in <head> before the page draws, so the saved look never flashes the default first. The design system site
// stays light and pink. Kept as a string: it's inlined into the root layout.
export const themeScript = `(function(){try{if(location.pathname.indexOf('/design-system')===0)return;var P=${JSON.stringify(PAGE)};var t=localStorage.getItem('${THEME_KEY}')==='dark'?'dark':'light';var a=localStorage.getItem('${ACCENT_KEY}');if(!P[a])a='pink';var r=document.documentElement;if(t==='dark')r.dataset.theme='dark';if(a!=='pink')r.dataset.accent=a;if(t!=='light'||a!=='pink')document.addEventListener('DOMContentLoaded',function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',P[a][t])})}catch(e){}})()`;
