import React from 'react';
import type ButtonProps from './Button.model';
import './button.scss';

export const Button = React.memo((props: ButtonProps) => {
  const {
    label = '',
    size = 'medium',
    variant = 'primary',
    status = 'default',
    customClasses = '',
    buttonType = 'button',
    disabled = false,
    ...rest
  } = props;

  return (
    <button
      type={buttonType}
      disabled={disabled}
      className={`hans-button block hans-${variant} hans-${status} hans-${size} ${customClasses}`}
      {...rest}
    >
      {label && <span>{label}</span>}
    </button>
  );
});

Button.displayName = 'Button';
