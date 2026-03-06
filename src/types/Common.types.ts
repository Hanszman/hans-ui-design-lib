export type Size = 'small' | 'medium' | 'large';
export type Color =
  | 'base'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';
export type Variant =
  | 'strong'
  | 'default'
  | 'neutral'
  | 'outline'
  | 'transparent';

export type OptionItem = {
  id?: string;
  label: string;
  value: string;
  disabled?: boolean;
  iconName?: string;
  imageSrc?: string;
  imageAlt?: string;
  action?: (item: OptionItem) => void;
  children?: OptionItem[];
};
