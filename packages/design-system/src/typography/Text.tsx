import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import { textStyles, textTones, type TextTone, type TextVariant } from './textStyles';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant: TextVariant;
  /** The element to render: a span by default, or p, div, h1, h2, h3 and so on. */
  as?: ElementType;
  /** Text color by role. Leave it out to inherit from the parent. */
  tone?: TextTone;
  /** Overrides the weight of the variant, for emphasis. */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

export function Text({ variant, as: Tag = 'span', tone, weight, style, ...rest }: TextProps) {
  const spec = textStyles[variant] as {
    family: string;
    size: string;
    weight: string;
    tracking?: string;
    leading?: string;
    upper?: boolean;
  };
  const css: CSSProperties = {
    fontFamily: `var(--font-${spec.family})`,
    fontSize: `var(--text-${spec.size})`,
    fontWeight: `var(--font-weight-${weight ?? spec.weight})`,
    ...(spec.tracking ? { letterSpacing: `var(--tracking-${spec.tracking})` } : {}),
    ...(spec.leading ? { lineHeight: `var(--leading-${spec.leading})` } : {}),
    ...(tone ? { color: textTones[tone] } : {}),
    // Micro is small capitals: written in normal case, shown in capitals.
    ...(spec.upper ? { textTransform: 'uppercase' as const } : {}),
    ...style,
  };
  return <Tag style={css} {...rest} />;
}
