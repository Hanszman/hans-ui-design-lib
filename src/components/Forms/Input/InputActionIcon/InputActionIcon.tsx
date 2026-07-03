import React from 'react';
import { HansIcon } from '../../../Icon/Icon';
import type { HansInputActionIconProps } from './InputActionIcon.types';

export const HansInputActionIcon = React.memo(
  ({
    icon,
    side,
    inputColor,
    disabled,
    ariaLabel,
    onClick,
  }: HansInputActionIconProps) => {
    const content =
      typeof icon === 'string' ? <HansIcon name={icon} iconSize="small" /> : icon;

    const className =
      `hans-input-icon hans-input-icon-${side} hans-input-icon-${inputColor}` +
      (onClick ? ' hans-input-icon-action' : '');

    if (!onClick) {
      return <span className={className}>{content}</span>;
    }

    return (
      <button
        type="button"
        className={className}
        aria-label={ariaLabel}
        onClick={onClick}
        disabled={disabled}
      >
        {content}
      </button>
    );
  },
);

HansInputActionIcon.displayName = 'HansInputActionIcon';
