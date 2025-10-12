import type { Size, Color } from '../../models/Common.types';

export default interface IconProps {
  name?: string;
  size?: Size;
  color?: Color;
  customClasses?: string;
}
