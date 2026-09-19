import { typographyVariables } from './tokens';

// Publishes every type token as a CSS variable on :root. Render once in the root layout.
export function TypographyVariables() {
  const css = ':root{' + Object.entries(typographyVariables).map(([name, value]) => `${name}:${value}`).join(';') + '}';
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
