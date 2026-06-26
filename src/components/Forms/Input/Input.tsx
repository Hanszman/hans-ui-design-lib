import React from 'react';
import { HansIcon } from '../../Icon/Icon';
import type { HansInputProps, InputValue } from './Input.types';
import { createInputValueEventHandlers } from './helpers/Input.helper';

export const HansInput = React.memo((props: HansInputProps) => {
  const {
    label = '',
    labelColor = 'base',
    placeholder = '',
    value,
    defaultValue,
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

  const isControlled = typeof value !== 'undefined';
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>(() =>
    resolveInitialInputValue(defaultValue),
  );

  const inputValue = isControlled
    ? normalizeInputValue(value)
    : uncontrolledValue;

  const { handleChange: dispatchChange, handleInput: dispatchInput } =
    createInputValueEventHandlers({
      onChange,
      onInput,
      onValueChange,
    });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!isControlled) {
      setUncontrolledValue(event.currentTarget.value);
    }

    dispatchChange(event);
  };

  const handleInput: React.FormEventHandler<HTMLInputElement> = (event) => {
    if (!isControlled) {
      setUncontrolledValue(event.currentTarget.value);
    }

    dispatchInput(event);
  };

  const inputClassName = [
    'hans-input',
    `hans-input-${inputSize}`,
    `hans-input-${inputColor}`,
    leftIcon ? 'hans-input-has-left-icon' : '',
    rightIcon ? 'hans-input-has-right-icon' : '',
    customClasses,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="hans-input-div">
      {children}
      {label ? (
        <label
          htmlFor={inputId}
          className={`hans-input-label hans-input-label-${labelColor}`}
        >
          {label}
        </label>
      ) : null}

      <div className="hans-input-field">
        {leftIcon ? (
          <span
            className={`hans-input-icon hans-input-icon-left hans-input-icon-${inputColor}`}
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
          className={inputClassName}
          value={inputValue}
          onChange={handleChange}
          onInput={handleInput}
          {...rest}
        />

        {rightIcon ? (
          <span
            className={`hans-input-icon hans-input-icon-right hans-input-icon-${inputColor}`}
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
        <p className={`hans-input-message hans-input-message-${messageColor}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
});

HansInput.displayName = 'HansInput';

const resolveInitialInputValue = (
  defaultValue: HansInputProps['defaultValue'],
): string => normalizeInputValue(defaultValue);

const normalizeInputValue = (value: InputValue | undefined): string => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    return value;
  }

  return '';
};
