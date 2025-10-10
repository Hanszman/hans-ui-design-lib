import React from 'react';
import type IconProps from './Icon.model';

export const Icon: React.FC<IconProps> = ({
  icon: IconComp,
  className,
  ...rest
}) => {
  if (IconComp)
    return (
      <IconComp
        className={className}
        {...(rest as React.SVGProps<SVGSVGElement>)}
      />
    );
  return null;
};
