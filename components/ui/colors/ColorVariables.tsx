import { colors, compositeVariables, cssVarName } from './tokens';

// Publishes every colour, gradient and overlay token as a CSS variable on :root. Render once in the root layout.
export function ColorVariables() {
  const css =
    ':root{' +
    [
      ...Object.entries(colors).map(([name, hex]) => `${cssVarName(name)}:${hex}`),
      ...Object.entries(compositeVariables).map(([name, value]) => `${name}:${value}`),
    ].join(';') +
    '}';
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
