import React from 'react';
import type { HansInputProps } from './Input.types';

export const HansInput = React.memo((props: HansInputProps) => {
  const {
    label = '',
    labelColor = 'primary',
    placeholder = '',
    value = '',
    inputId = 'hans-input',
    inputColor = 'primary',
    inputSize = 'medium',
    inputType = 'text',
    message = '',
    messageColor = 'success',
    customClasses = '',
    disabled = false,
    children,
    ...rest
  } = props;

  return (
    <div className="hans-input-div">
      {children}
      <label
        htmlFor={inputId}
        className={`
          hans-input-label
          hans-input-label-${labelColor}
        `}
      >
        {label}
      </label>
      <input
        id={inputId}
        type={inputType}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        className={`
          hans-input
          hans-input-${inputSize}
          hans-input-${inputColor}
          ${customClasses}
        `}
        {...rest}
      />
      <p
        className={`
          hans-input-message
          hans-input-message-${messageColor}
        `}
      >
        {message}
      </p>
    </div>
  );
});

HansInput.displayName = 'HansInput';
