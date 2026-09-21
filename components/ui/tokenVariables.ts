// Shared by the token layers that publish CSS variables: "dangerGhost" -> "--hover-danger-ghost".
const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

export type Token = { value: string; use: string };

/** Turns a group of tokens into CSS custom properties, `--<prefix>-<name>: <value>`. */
export const toVariables = (prefix: string, tokens: Record<string, Token>): Record<string, string> =>
  Object.fromEntries(Object.entries(tokens).map(([name, t]) => [`--${prefix}-${kebab(name)}`, t.value]));
