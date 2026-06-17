import React from 'react';
import { HansIcon } from '../../Icon/Icon';
import type { HansInputProps } from './Input.types';
import { createInputValueEventHandlers } from './helpers/Input.helper';

export const HansInput = React.memo((props: HansInputProps) => {
  const {
    label = '',
    labelColor = 'base',
    placeholder = '',
    value,
    inputId = 'hans-input',
    inputColor = 'base',
    inputSize = 'medium',
    inputType = 'text',
    message = '',
    messageColor = 'base',
    customClasses = '',
    disabled = false,
    leftIcon,
    rightIcon,
    children,
    onChange,
    onInput,
    onValueChange,
    ...rest
  } = props;

  const valueProps = typeof value === 'undefined' ? {} : { value };
  const { handleChange, handleInput } = createInputValueEventHandlers({
    onChange,
    onInput,
    onValueChange,
  });

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
          <span
            className={`
              hans-input-icon
              hans-input-icon-left
              hans-input-icon-${inputColor}
            `}
          >
            {typeof leftIcon === 'string' ? (
              <HansIcon name={leftIcon} iconSize="small" />
            ) : (
              leftIcon
            )}
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
          onChange={handleChange}
          onInput={handleInput}
          {...rest}
        />
        {rightIcon ? (
          <span
            className={`
              hans-input-icon
              hans-input-icon-right
              hans-input-icon-${inputColor}
            `}
          >
            {typeof rightIcon === 'string' ? (
              <HansIcon name={rightIcon} iconSize="small" />
            ) : (
              rightIcon
            )}
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
