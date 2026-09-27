// Shared by the token layers that publish CSS variables: "dangerGhost" -> "--hover-danger-ghost".
const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

export type Token = { value: string; use: string };

/** Turns a group of tokens into CSS custom properties, `--<prefix>-<name>: <value>`. */
export const toVariables = (prefix: string, tokens: Record<string, Token>): Record<string, string> =>
  Object.fromEntries(Object.entries(tokens).map(([name, t]) => [`--${prefix}-${kebab(name)}`, t.value]));

/** A theme can be set on any element, not just <html>: the design system's Themes page shows each one in a panel.
 * A variable written with var() takes its value where it's declared, so one declared on :root (the gem gradient
 * from --color-accent, say) would carry the page's colours into a themed panel. This re-declares those on every
 * themed element, where they pick up its colours. :where() gives it no specificity, so a theme's own values win. */
export const themeScopeRule = (declarations: string[]) => {
  const derived = declarations.filter((d) => d.includes('var('));
  return derived.length ? ':where([data-theme],[data-accent]){' + derived.join(';') + '}' : '';
};
