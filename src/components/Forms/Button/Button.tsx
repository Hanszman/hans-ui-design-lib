import React from 'react';
import type { HansButtonProps } from './Button.types';
import { HansLoading } from '../../Loading/Loading';

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
  const loadingSizeByButtonSize = {
    small: { width: '72px', height: '32px' },
    medium: { width: '88px', height: '40px' },
    large: { width: '104px', height: '48px' },
  } as const;

  if (loading) {
    const loadingSize = loadingSizeByButtonSize[buttonSize];
    return (
      <HansLoading
        id={buttonId}
        loadingType="skeleton"
        loadingSize={buttonSize}
        skeletonWidth={loadingSize.width}
        skeletonHeight={loadingSize.height}
        rounded={buttonShape === 'rounded'}
        customClasses={`hans-button-loading ${customClasses}`}
        ariaLabel="Loading button"
      />
    );
  }

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
        ${customClasses}
      `}
      {...rest}
    >
      <slot>{children ?? (label && <span>{label}</span>)}</slot>
    </button>
  );
});

HansButton.displayName = 'HansButton';
