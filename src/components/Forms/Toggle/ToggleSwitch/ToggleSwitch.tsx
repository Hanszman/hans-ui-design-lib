import React from 'react';
import { HansLoading } from '../../../Loading/Loading';
import type { HansToggleSwitchProps } from './ToggleSwitch.types';
import {
  buildToggleStyle,
  getContentLength,
  getLoadingSizeFromToggleSize,
  getSwitchWidth,
  getToggleColorClass,
  handleSwitchToggle,
  normalizeToggleColor,
} from '../helpers/Toggle.helper';

export const HansToggleSwitch = React.memo((props: HansToggleSwitchProps) => {
  const {
    label = '',
    labelColor = 'base',
    leftLabel = '',
    rightLabel = '',
    checked,
    defaultChecked = false,
    loading = false,
    disabled = false,
    toggleColor = 'primary',
    toggleSize = 'medium',
    onContent,
    offContent,
    thumbContent,
    customClasses = '',
    inputId = 'hans-toggle',
    onChange,
    ...rest
  } = props;

  const normalizedColor = normalizeToggleColor(toggleColor);
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = typeof checked !== 'undefined';
  const isChecked = isControlled ? checked : internalChecked;
  const switchColorClass = getToggleColorClass(
    isChecked,
    disabled,
    normalizedColor,
  );
  const maxTrackContentLength = Math.max(
    getContentLength(onContent),
    getContentLength(offContent),
  );
  const shouldExpandSwitch = maxTrackContentLength > 0;
  const computedWidth = getSwitchWidth(toggleSize, onContent, offContent);
  const computedStyle = buildToggleStyle(
    rest.style as React.CSSProperties | undefined,
    computedWidth,
  );
  const loadingSize = getLoadingSizeFromToggleSize(toggleSize);

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
          <span
            className={`hans-toggle-side-label hans-toggle-label-${labelColor}`}
          >
            {leftLabel}
          </span>
        ) : null}
        {loading ? (
          <HansLoading
            loadingType="spinner"
            loadingSize={loadingSize}
            loadingColor={normalizedColor}
            customClasses="hans-toggle-loading-switch"
            ariaLabel="Loading switch toggle"
          />
        ) : (
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
                isControlled,
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
        )}
        {rightLabel ? (
          <span
            className={`hans-toggle-side-label hans-toggle-label-${labelColor}`}
          >
            {rightLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
});

HansToggleSwitch.displayName = 'HansToggleSwitch';
