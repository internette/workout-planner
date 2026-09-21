import { radiiVariables } from './radii';
import { spacingVariables } from './spacing';
import { motionVariables } from './motion';
import { interactionVariables } from './interaction';

// Publishes the radii, spacing, motion and interaction tokens as CSS variables on :root, in one <style>. Render once in
// the root layout, beside the colour, type and elevation variables.
export function StructureVariables() {
  const css =
    ':root{' +
    Object.entries({ ...radiiVariables, ...spacingVariables, ...motionVariables, ...interactionVariables })
      .map(([name, value]) => `${name}:${value}`)
      .join(';') +
    '}';
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
