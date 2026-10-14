import { colorValues, compositeVariables, cssColor, cssVarName } from '../colors/tokens';
import { accentThemeCss } from '../colors/themes';
import { typographyVariables } from '../typography/tokens';
import { elevationVariables } from '../elevation/tokens';
import { radiiVariables } from '../radii/tokens';
import { spacingVariables } from '../spacing/tokens';
import { motionVariables } from '../motion/tokens';
import { interactionVariables } from '../interaction/tokens';
import { darkOverrides } from './dark';
import { themeScopeRule } from './variables';

/** Every token as a CSS variable on :root, in one <style>: colors, type, shadows, radii, spacing, motion and
 * interaction; then what the dark theme changes under [data-theme="dark"] (on <html> in the app, or on a panel that
 * previews a theme), and each color theme. Render once in the root layout. */
export function DesignTokens() {
  const light = [
    ...Object.entries(colorValues).map(([name, value]) => `${cssVarName(name)}:${cssColor(value)}`),
    ...Object.entries({ ...compositeVariables, ...typographyVariables, ...elevationVariables, ...radiiVariables, ...spacingVariables, ...motionVariables, ...interactionVariables }).map(
      ([name, value]) => `${name}:${value}`,
    ),
  ];
  const dark = Object.entries(darkOverrides).map(([name, value]) => `${name}:${value}`);
  const css = ':root{' + light.join(';') + '}' + themeScopeRule(light) + '[data-theme="dark"]{' + dark.join(';') + '}' + accentThemeCss;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
