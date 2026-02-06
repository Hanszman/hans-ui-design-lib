import React from 'react';
import type { HansInputProps } from './Input.types';

export const HansInput = React.memo((props: HansInputProps) => {
  const {
    label = '',
    labelColor = 'primary',
    placeholder = '',
    value,
    inputId = 'hans-input',
    inputColor = 'primary',
    inputSize = 'medium',
    inputType = 'text',
    message = '',
    messageColor = 'success',
    customClasses = '',
    disabled = false,
    leftIcon,
    rightIcon,
    children,
    ...rest
  } = props;

  const valueProps =
    typeof value === 'undefined' ? {} : { value: value ?? '' };

  return (
    <div className="hans-input-div">
      {children}
      {label ? (
        <label
          htmlFor={inputId}
          className={`
            hans-input-label
            hans-input-label-${labelColor}
          `}
        >
          {label}
        </label>
      ) : null}
      <div className="hans-input-field">
        {leftIcon ? (
          <span className="hans-input-icon hans-input-icon-left">
            {leftIcon}
          </span>
        ) : null}
        <input
          id={inputId}
          type={inputType}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            hans-input
            hans-input-${inputSize}
            hans-input-${inputColor}
            ${leftIcon ? 'hans-input-has-left-icon' : ''}
            ${rightIcon ? 'hans-input-has-right-icon' : ''}
            ${customClasses}
          `}
          {...valueProps}
          {...rest}
        />
        {rightIcon ? (
          <span className="hans-input-icon hans-input-icon-right">
            {rightIcon}
          </span>
        ) : null}
      </div>
      {message ? (
        <p
          className={`
            hans-input-message
            hans-input-message-${messageColor}
          `}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
});

HansInput.displayName = 'HansInput';
