import type { CSSProperties, ReactNode, SVGProps } from 'react';

export interface IconProps {
  /** Width and height in px. */
  size?: number;
  /** Stroke colour (fill colour for solid icons). Defaults to the surrounding text colour. */
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
  className?: string;
}

interface SvgProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'style' | 'className'> {
  size?: number;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}

// The shared 24×24 canvas every icon is drawn on. Icons are decorative, so they are hidden from
// assistive tech; put a label on the control that contains them.
export function Svg({ size = 24, style, className, children, ...rest }: SvgProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      style={{ width: size, height: size, flex: 'none', ...style }}
      {...rest}
    >
      {children}
    </svg>
  );
}
