import type { Size, Variant, Color } from '../../../models/Common.types';

export type ButtonType = 'button' | 'submit' | 'reset';

export default interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  size?: Size;
  color?: Color;
  variant?: Variant;
  buttonType?: ButtonType;
  customClasses?: string;
}
