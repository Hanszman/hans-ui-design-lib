import React from 'react';
import { HansLoading } from '../../../Loading/Loading';
import type { HansToggleSegmentedProps } from './ToggleSegmented.types';
import {
  getLoadingSizeFromToggleSize,
  getSegmentedSkeletonHeight,
  handleOptionSelect,
  normalizeToggleColor,
} from '../helpers/Toggle.helper';

export const HansToggleSegmented = React.memo(
  (props: HansToggleSegmentedProps) => {
    const {
      label = '',
      labelColor = 'base',
      loading = false,
      disabled = false,
      toggleColor = 'primary',
      toggleSize = 'medium',
      value,
      defaultValue = '',
      options = [],
      customClasses = '',
      inputId = 'hans-toggle',
      onValueChange,
    } = props;

    const normalizedColor = normalizeToggleColor(toggleColor);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue || options[0]?.value || '',
    );
    const isControlled = typeof value !== 'undefined';
    const selectedValue = isControlled ? value : internalValue;
    const loadingSize = getLoadingSizeFromToggleSize(toggleSize);
    const segmentedSkeletonHeight = getSegmentedSkeletonHeight(toggleSize);

    return (
      <div className={`hans-toggle-wrapper ${customClasses}`}>
        {label ? (
          <span className={`hans-toggle-label hans-toggle-label-${labelColor}`}>
            {label}
          </span>
        ) : null}
        {loading ? (
          <HansLoading
            loadingType="skeleton"
            loadingSize={loadingSize}
            skeletonWidth="100%"
            skeletonHeight={segmentedSkeletonHeight}
            customClasses="hans-toggle-loading-segmented"
            ariaLabel="Loading segmented toggle"
          />
        ) : (
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
                      isControlled,
                      setInternalValue,
                      onValueChange,
                    })
                  }
                >
                  {option.icon ? (
                    <span className="hans-toggle-segment-icon">
                      {option.icon}
                    </span>
                  ) : null}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

HansToggleSegmented.displayName = 'HansToggleSegmented';
