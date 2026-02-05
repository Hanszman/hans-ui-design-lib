import React from 'react';
import type { HansButtonProps } from './Button.types';

export const HansButton = React.memo((props: HansButtonProps) => {
  const {
    label = '',
    buttonId = 'hans-button',
    buttonSize = 'medium',
    buttonColor = 'primary',
    buttonVariant = 'default',
    buttonType = 'button',
    customClasses = '',
    disabled = false,
    children,
    ...rest
  } = props;

  return (
    <button
      id={buttonId}
      type={buttonType}
      disabled={disabled}
      className={`
        hans-button
        hans-button-${buttonSize}
        hans-button-${buttonColor}
        hans-button-${buttonVariant}
        ${customClasses}
      `}
      {...rest}
    >
      <slot>{children ?? (label && <span>{label}</span>)}</slot>
    </button>
  );
});

HansButton.displayName = 'HansButton';
