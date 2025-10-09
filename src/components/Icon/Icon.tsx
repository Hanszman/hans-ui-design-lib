import type { IconType } from 'react-icons';
import React from 'react';

export interface IconProps {
  name?: string;
  icon?: IconType;
  className?: string;
  [key: string]: any;
}

export const Icon: React.FC<IconProps> = ({
  name,
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
  if (name) return <i className={`${name} ${className}`} {...rest} />;
  return null;
};
