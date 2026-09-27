import { darkElevations, elevationVariables } from './tokens';
import { themeScopeRule } from '../tokenVariables';

// Publishes every shadow token as a CSS variable on :root. Render once in the root layout.
export function ElevationVariables() {
  const light = Object.entries(elevationVariables).map(([name, value]) => `${name}:${value}`);
  const css =
    ':root{' +
    light.join(';') +
    '}' +
    themeScopeRule(light) +
    '[data-theme="dark"]{' +
    Object.entries(darkElevations)
      .map(([name, value]) => `${name}:${value}`)
      .join(';') +
    '}';
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
