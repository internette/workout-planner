import { darkColors, darkOverlays, darkTranslucents } from './dark';
import { accentThemeCss } from './themes';
import { colors, compositeVariables, cssVarName } from './tokens';
import { themeScopeRule } from '../tokenVariables';

// Publishes every colour, gradient and overlay token as a CSS variable on :root, and the dark theme's values under
// [data-theme="dark"] (on <html> in the app, or on a panel that previews a theme). Render once in the root layout.
export function ColorVariables() {
  const light = [
    ...Object.entries(colors).map(([name, hex]) => `${cssVarName(name)}:${hex}`),
    ...Object.entries(compositeVariables).map(([name, value]) => `${name}:${value}`),
  ];
  const dark = [
    ...Object.entries(darkColors).map(([name, hex]) => `${cssVarName(name)}:${hex}`),
    ...Object.entries(darkTranslucents).map(([name, value]) => `${cssVarName(name)}:${value}`),
    ...Object.entries(darkOverlays).map(([name, value]) => `--${name}:${value}`),
    'color-scheme:dark',
  ];
  const css =
    ':root{' + light.join(';') + '}' + themeScopeRule(light) + '[data-theme="dark"]{' + dark.join(';') + '}' + accentThemeCss;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
