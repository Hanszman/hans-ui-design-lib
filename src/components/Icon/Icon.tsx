import React from 'react';
import type IconProps from './Icon.types';

export const Icon: React.FC<IconProps> = (props: IconProps) => {
  const {
    icon: IconComp,
    size = 'medium',
    color = 'primary',
    customClasses = '',
    ...rest
  } = props;

  if (IconComp)
    return (
      <IconComp
        className={`hans-icon hans-icon-${size} hans-icon-${color} ${customClasses}`}
        {...(rest as React.SVGProps<SVGSVGElement>)}
      />
    );
  return null;
};

Icon.displayName = 'Icon';
