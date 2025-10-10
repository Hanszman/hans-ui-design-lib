import React from 'react';
import type ButtonProps from './Button.types';

export const Button = React.memo((props: ButtonProps) => {
  const {
    label = '',
    size = 'medium',
    variant = 'default',
    color = 'primary',
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
      className={`hans-button block hans-${variant} hans-${color} hans-${size} ${customClasses}`}
      {...rest}
    >
      {children ?? (label && <span>{label}</span>)}
    </button>
  );
});

Button.displayName = 'Button';
