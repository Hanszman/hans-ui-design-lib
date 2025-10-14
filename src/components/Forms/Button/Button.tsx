import React from 'react';
import type { ButtonProps } from './Button.types';

export const Button = React.memo((props: ButtonProps) => {
  const {
    label = '',
    size = 'medium',
    color = 'primary',
    variant = 'default',
    buttonType = 'button',
    customClasses = '',
    disabled = false,
    children,
    ...rest
  } = props;

  return (
    <button
      type={buttonType}
      disabled={disabled}
      className={`hans-button hans-button-${size} hans-button-${color} hans-button-${variant} ${customClasses}`}
      {...rest}
    >
      {children ?? (label && <span>{label}</span>)}
    </button>
  );
});

Button.displayName = 'Button';
