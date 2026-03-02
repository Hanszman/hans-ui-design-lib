import React from 'react';
import type { HansToggleProps } from './Toggle.types';
import {
  buildToggleStyle,
  getContentLength,
  getSwitchWidth,
  getToggleColorClass,
  handleOptionSelect,
  handleSwitchToggle,
  normalizeToggleColor,
} from './helpers/Toggle.helper';

export const HansToggle = React.memo((props: HansToggleProps) => {
  const {
    toggleMode = 'switch',
    label = '',
    labelColor = 'base',
    leftLabel = '',
    rightLabel = '',
    checked,
    defaultChecked = false,
    disabled = false,
    toggleColor = 'primary',
    toggleSize = 'medium',
    onContent,
    offContent,
    thumbContent,
    value,
    defaultValue = '',
    options = [],
    customClasses = '',
    inputId = 'hans-toggle',
    onChange,
    onValueChange,
    ...rest
  } = props;

  const normalizedColor = normalizeToggleColor(toggleColor);

  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isSwitchControlled = typeof checked !== 'undefined';
  const isChecked = isSwitchControlled ? checked : internalChecked;
  const switchColorClass = getToggleColorClass(isChecked, disabled, normalizedColor);

  const [internalValue, setInternalValue] = React.useState(
    defaultValue || options[0]?.value || '',
  );
  const isSegmentedControlled = typeof value !== 'undefined';
  const selectedValue = isSegmentedControlled ? value : internalValue;

  const maxTrackContentLength = Math.max(getContentLength(onContent), getContentLength(offContent));
  const shouldExpandSwitch = maxTrackContentLength > 0;
  const computedWidth = getSwitchWidth(toggleSize, onContent, offContent);
  const computedStyle = buildToggleStyle(
    rest.style as React.CSSProperties | undefined,
    computedWidth,
  );

  if (toggleMode === 'segmented') {
    return (
      <div className={`hans-toggle-wrapper ${customClasses}`}>
        {label ? (
          <span className={`hans-toggle-label hans-toggle-label-${labelColor}`}>
            {label}
          </span>
        ) : null}
        <div
          role="tablist"
          aria-disabled={disabled}
          className={`
            hans-toggle-segmented
            hans-toggle-segmented-${toggleSize}
            hans-toggle-segmented-${normalizedColor}
            ${disabled ? 'hans-toggle-segmented-disabled' : ''}
          `}
        >
          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <button
                key={`${inputId}-${option.value}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                disabled={disabled || option.disabled}
                className={`
                  hans-toggle-segment
                  ${isSelected ? 'hans-toggle-segment-selected' : ''}
                `}
                onClick={() =>
                  handleOptionSelect({
                    disabled,
                    optionDisabled: option.disabled,
                    nextValue: option.value,
                    isControlled: isSegmentedControlled,
                    setInternalValue,
                    onValueChange,
                  })
                }
              >
                {option.icon ? (
                  <span className="hans-toggle-segment-icon">{option.icon}</span>
                ) : null}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

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
      <div className="hans-toggle-switch-row">
        {leftLabel ? (
          <span className={`hans-toggle-side-label hans-toggle-label-${labelColor}`}>
            {leftLabel}
          </span>
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
            ${shouldExpandSwitch ? 'hans-toggle-has-track-content' : ''}
            ${switchColorClass}
          `}
          onClick={() =>
            handleSwitchToggle({
              disabled,
              isChecked,
              isControlled: isSwitchControlled,
              setInternalChecked,
              onChange,
            })
          }
          {...rest}
          style={computedStyle}
        >
          <span
            className={`
              hans-toggle-track-content
              ${isChecked ? 'hans-toggle-track-content-on' : 'hans-toggle-track-content-off'}
            `}
          >
            {isChecked ? onContent : offContent}
          </span>
          <span className="hans-toggle-thumb">{thumbContent}</span>
        </button>
        {rightLabel ? (
          <span className={`hans-toggle-side-label hans-toggle-label-${labelColor}`}>
            {rightLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
});

HansToggle.displayName = 'HansToggle';
