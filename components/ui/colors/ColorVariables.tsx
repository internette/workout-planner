import { colors, cssVarName } from './tokens';

// Publishes every colour token as a CSS variable on :root. Render once in the root layout.
export function ColorVariables() {
  const css = ':root{' + Object.entries(colors).map(([name, hex]) => `${cssVarName(name)}:${hex}`).join(';') + '}';
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
