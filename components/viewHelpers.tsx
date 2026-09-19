import { Fragment, isValidElement, type CSSProperties, type ReactNode } from 'react';

const kebabToCamel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// Turns a CSS declaration string ("a:b;c:d") into a React style object.
export function css(value: string | CSSProperties | null | undefined): CSSProperties | undefined {
  if (value == null) return undefined;
  if (typeof value !== 'string') return value;
  const out: Record<string, string> = {};
  for (const decl of value.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    out[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim();
  }
  return out;
}

// Renders an interpolated template value: elements/arrays pass through, null/booleans vanish,
// everything else becomes text in a span.
export function t(value: unknown): ReactNode {
  if (value === undefined || value === null || typeof value === 'boolean') return null;
  if (isValidElement(value) || Array.isArray(value)) return <Fragment>{value}</Fragment>;
  return <span>{String(value)}</span>;
}
