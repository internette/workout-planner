import { elevationVariables } from './tokens';

// Publishes every shadow token as a CSS variable on :root. Render once in the root layout.
export function ElevationVariables() {
  const css =
    ':root{' +
    Object.entries(elevationVariables)
      .map(([name, value]) => `${name}:${value}`)
      .join(';') +
    '}';
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
