import type React from 'react';
import type { Color } from '../../../../types/Common.types';
import type { InputIcon } from '../Input.types';

export type InputActionIconSide = 'left' | 'right';

export interface HansInputActionIconProps {
  readonly icon: InputIcon;
  readonly side: InputActionIconSide;
  readonly inputColor: Color;
  readonly disabled: boolean;
  readonly ariaLabel?: string;
  readonly onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
