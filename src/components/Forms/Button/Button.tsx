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
  const loadingHeightBySize = {
    small: '12px',
    medium: '14px',
    large: '16px',
  } as const;

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
      <slot>
        {loading ? (
          <HansLoading
            loadingType="skeleton"
            loadingColor={buttonColor}
            skeletonWidth="72px"
            skeletonHeight={loadingHeightBySize[buttonSize]}
            ariaLabel="Loading button"
          />
        ) : (
          children ?? (label && <span>{label}</span>)
        )}
      </slot>
    </button>
  );
});

HansButton.displayName = 'HansButton';
