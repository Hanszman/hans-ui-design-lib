import React from 'react';
import type { HansInputProps } from './Input.types';

export const HansInput = React.memo((props: HansInputProps) => {
  const {
    label = '',
    placeholder = '',
    value = '',
    color = 'primary',
    inputSize = 'medium',
    inputType = 'text',
    customClasses = '',
    disabled = false,
    children,
    ...rest
  } = props;

  return (
    <>
      {children}
      {label}
      <input
        type={inputType}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        className={`hans-input hans-input-${inputSize} hans-input-${color} ${customClasses}`}
        {...rest}
      />
    </>
  );
});

HansInput.displayName = 'HansInput';
