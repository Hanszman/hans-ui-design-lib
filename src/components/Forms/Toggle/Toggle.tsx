import React from 'react';
import type { HansToggleProps } from './Toggle.types';
import {
  getToggleColorClass,
  normalizeToggleColor,
} from './helpers/Toggle.helper';

export const HansToggle = React.memo((props: HansToggleProps) => {
  const {
    label = '',
    labelColor = 'base',
    checked,
    defaultChecked = false,
    disabled = false,
    toggleColor = 'primary',
    toggleSize = 'medium',
    customClasses = '',
    inputId = 'hans-toggle',
    onChange,
    ...rest
  } = props;

  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = typeof checked !== 'undefined';
  const isChecked = isControlled ? checked : internalChecked;
  const normalizedColor = normalizeToggleColor(toggleColor);
  const colorClass = getToggleColorClass(
    isChecked,
    disabled,
    normalizedColor,
  );

  const handleToggle = () => {
    const nextValue = !isChecked;
    if (!isControlled) setInternalChecked(nextValue);
    if (onChange) onChange(nextValue);
  };

  return (
    <div className={`hans-toggle-wrapper ${customClasses}`}>
      {label ? (
        <label
          htmlFor={inputId}
          className={`hans-toggle-label hans-toggle-label-${labelColor}`}
        >
          {label}
        </label>
      ) : null}
      <button
        id={inputId}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-disabled={disabled}
        disabled={disabled}
        className={`
          hans-toggle
          hans-toggle-${toggleSize}
          ${colorClass}
        `}
        onClick={handleToggle}
        {...rest}
      >
        <span className="hans-toggle-thumb" />
      </button>
    </div>
  );
});

HansToggle.displayName = 'HansToggle';
