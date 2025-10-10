export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'transparent';
export type ButtonStatus =
  | 'default'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info';
export type ButtonType = 'button' | 'submit' | 'reset';

export default interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  status?: ButtonStatus;
  buttonType?: ButtonType;
  customClasses?: string;
}
