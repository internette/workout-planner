import { Fragment, isValidElement, type ReactNode } from 'react';

// Renders an interpolated template value: elements/arrays pass through, null/booleans vanish,
// everything else becomes text in a span.
export function t(value: unknown): ReactNode {
  if (value === undefined || value === null || typeof value === 'boolean') return null;
  if (isValidElement(value) || Array.isArray(value)) return <Fragment>{value}</Fragment>;
  return <span>{String(value)}</span>;
}
