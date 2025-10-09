import React from 'react';
import type ButtonProps from './Button.model';
import { Icon } from '../../Icon/Icon';

export const Button = React.memo((props: ButtonProps) => {
  const {
    label = '',
    icon,
    iconPosition = 'Left',
    size = 'medium',
    variant = 'primary',
    status = 'default',
    customClasses = '',
    buttonType = 'button',
    disabled = false,
    ...rest
  } = props;

  const renderIcon = icon ? (
    typeof icon === 'string' ? (
      <Icon name={icon} />
    ) : React.isValidElement(icon) ? (
      icon
    ) : null
  ) : null;

  return (
    <button
      type={buttonType}
      disabled={disabled}
      className={`stw-button block stw-${variant} stw-${status} stw-${size} ${customClasses}`}
      {...rest}
    >
      {iconPosition === 'Left' && renderIcon}
      {label && <span>{label}</span>}
      {iconPosition === 'Right' && renderIcon}
    </button>
  );
});

Button.displayName = 'Button';
