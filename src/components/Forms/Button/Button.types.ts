import type { Size, Variant, Color } from '../../../types/Common.types';

export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  size?: Size;
  color?: Color;
  variant?: Variant;
  buttonType?: ButtonType;
  customClasses?: string;
}
