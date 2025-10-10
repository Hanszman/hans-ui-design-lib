import type { Size, Variant, Color } from '../../../models/Common.types';

export type ButtonType = 'button' | 'submit' | 'reset';

export default interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  size?: Size;
  variant?: Variant;
  color?: Color;
  buttonType?: ButtonType;
  customClasses?: string;
}
