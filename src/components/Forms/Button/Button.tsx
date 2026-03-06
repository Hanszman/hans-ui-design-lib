import React from 'react';
import type { HansButtonProps } from './Button.types';

export const HansButton = React.memo((props: HansButtonProps) => {
  const {
    label = '',
    buttonId = 'hans-button',
    buttonSize = 'medium',
    buttonColor = 'primary',
    buttonVariant = 'default',
    buttonShape = 'rounded',
    buttonType = 'button',
    customClasses = '',
    disabled = false,
    loading = false,
    children,
    ...rest
  } = props;
  const isDisabled = disabled || loading;

  return (
    <button
      id={buttonId}
      type={buttonType}
      disabled={isDisabled}
      className={`
        hans-button
        hans-button-${buttonSize}
        hans-button-${buttonColor}
        hans-button-${buttonVariant}
        hans-button-${buttonShape}
        ${loading ? 'hans-button-loading' : ''}
        ${customClasses}
      `}
      {...rest}
    >
      <slot>{loading ? null : children ?? (label && <span>{label}</span>)}</slot>
    </button>
  );
});

HansButton.displayName = 'HansButton';
