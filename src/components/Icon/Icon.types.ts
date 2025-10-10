import type { IconType } from 'react-icons';
import type { Size, Color } from '../../models/Common.types';

export default interface IconProps {
  icon?: IconType;
  size?: Size;
  color?: Color;
  customClasses?: string;
  [key: string]: any;
}
