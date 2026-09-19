import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import { textStyles, textTones, type TextTone, type TextVariant } from './textStyles';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant: TextVariant;
  /** The element to render: a span by default, or p, div, h1, h2, h3 and so on. */
  as?: ElementType;
  /** Text colour by role. Leave it out to inherit from the parent. */
  tone?: TextTone;
  /** Overrides the weight of the variant. */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  uppercase?: boolean;
}

export function Text({ variant, as: Tag = 'span', tone, weight, uppercase, style, ...rest }: TextProps) {
  const spec = textStyles[variant] as {
    family: string;
    size: string;
    weight: string;
    tracking?: string;
    leading?: string;
  };
  const css: CSSProperties = {
    fontFamily: `var(--font-${spec.family})`,
    fontSize: `var(--text-${spec.size})`,
    fontWeight: `var(--font-weight-${weight ?? spec.weight})`,
    ...(spec.tracking ? { letterSpacing: `var(--tracking-${spec.tracking})` } : {}),
    ...(spec.leading ? { lineHeight: `var(--leading-${spec.leading})` } : {}),
    ...(tone ? { color: textTones[tone] } : {}),
    ...(uppercase ? { textTransform: 'uppercase' as const } : {}),
    ...style,
  };
  return <Tag style={css} {...rest} />;
}
