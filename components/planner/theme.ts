// The app's appearance: light (the default) or dark, chosen in Profile → Settings and remembered in this browser.
// The choice is applied as <html data-theme="dark">, which switches the colour, shadow and hover tokens.
export type Theme = 'light' | 'dark';

export const THEME_KEY = 'moonshot.theme';
// The browser chrome (address bar, status bar) takes the page colour of each theme.
const PAGE = { light: '#FBF1F3', dark: '#1B1320' };

export function savedTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/** Applies a theme to the page now, without saving it. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.dataset.theme = 'dark';
  else delete root.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', PAGE[theme]);
}

/** Saves the choice for this browser and applies it. */
export function setTheme(theme: Theme) {
  try {
    if (theme === 'dark') localStorage.setItem(THEME_KEY, 'dark');
    else localStorage.removeItem(THEME_KEY);
  } catch {
    // Storage blocked: it still applies for this visit.
  }
  applyTheme(theme);
}

// Runs in <head> before the page draws, so a dark page never flashes light first. The design system site stays
// light. Kept as a string: it's inlined into the root layout.
export const themeScript = `(function(){try{if(localStorage.getItem('${THEME_KEY}')==='dark'&&location.pathname.indexOf('/design-system')!==0){document.documentElement.dataset.theme='dark';document.addEventListener('DOMContentLoaded',function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','${PAGE.dark}')})}}catch(e){}})()`;
