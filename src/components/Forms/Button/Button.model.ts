export type ButtonSize = 'small' | 'medium';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'transparent';
export type ButtonStatus =
  | 'default'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info';
export type IconPosition = 'Left' | 'Right';
export type ButtonType = 'button' | 'submit' | 'reset';

export default interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactNode | string;
  iconPosition?: IconPosition;
  size?: ButtonSize;
  variant?: ButtonVariant;
  status?: ButtonStatus;
  customClasses?: string;
  buttonType?: ButtonType;
}
