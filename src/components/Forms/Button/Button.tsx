import React from 'react';
import type { HansButtonProps } from './Button.types';

export const HansButton = React.memo((props: HansButtonProps) => {
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

HansButton.displayName = 'HansButton';
