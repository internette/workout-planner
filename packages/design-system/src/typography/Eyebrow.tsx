import type { ReactNode } from 'react';
import { Text } from './Text';
import type { TextTone } from './textStyles';

export interface EyebrowProps {
  /** Beside the words before it instead of above them, where a row has no room above. */
  inline?: boolean;
  /** accent for what something is (a warm-up, a stretch); muted for where it belongs (its program). */
  tone?: TextTone;
  children: ReactNode;
}

/** A small capitals label above a name (or, inline, beside it): what kind of thing it is, or where it belongs. */
export function Eyebrow({ inline, tone = 'accent', children }: EyebrowProps) {
  return (
    <>
      {/* A real space, so it isn't read run together with the words before it. */}
      {inline ? ' ' : null}
      <Text
        variant="micro"
        as="span"
        tone={tone}
        style={inline ? { display: 'inline-block', marginLeft: 'var(--space-1)', verticalAlign: 'middle' } : { display: 'block', marginBottom: 'var(--space-1)' }}
      >
        {children}
      </Text>
    </>
  );
}
