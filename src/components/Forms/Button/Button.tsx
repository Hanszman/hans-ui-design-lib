import React from 'react';
import type ButtonProps from './Button.model';

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

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      // Font Awesome ou classes customizadas
      return (
        <i className={`${icon} ${iconPosition === 'Left' ? 'mr-2' : 'ml-2'}`} />
      );
    }

    // ReactNode (ex: <FaHome />)
    return (
      <span className={iconPosition === 'Left' ? 'mr-2' : 'ml-2'}>{icon}</span>
    );
  };

  return (
    <button
      type={buttonType}
      disabled={disabled}
      className={`stw-button block stw-${variant} stw-${status} stw-${size} ${customClasses}`}
      {...rest}
    >
      {iconPosition === 'Left' && renderIcon()}
      {label && <span>{label}</span>}
      {iconPosition === 'Right' && renderIcon()}
    </button>
  );
});

Button.displayName = 'Button';
