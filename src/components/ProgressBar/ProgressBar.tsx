import React from 'react';
import type { HansProgressBarProps } from './ProgressBar.types';
import {
  getProgressBarClassName,
  normalizeProgressBarValues,
} from './helpers/ProgressBar.helper';

export const HansProgressBar = React.memo((props: HansProgressBarProps) => {
  const {
    value = 0,
    min = 0,
    max = 100,
    label = '',
    valueLabel = '',
    progressColor = 'primary',
    progressSize = 'medium',
    showValue = true,
    customClasses = '',
    style,
    ...rest
  } = props;
  const normalized = normalizeProgressBarValues(value, min, max);
  const visibleValue = valueLabel || `${Math.round(normalized.percentage)}%`;
  const accessibleName = rest['aria-label'] ?? label;

  return (
    <div
      className={getProgressBarClassName(
        progressColor,
        progressSize,
        customClasses,
      )}
      style={style}
      {...rest}
    >
      {label || showValue ? (
        <div className="hans-progress-bar-copy">
          {label ? (
            <span className="hans-progress-bar-label">{label}</span>
          ) : null}
          {showValue ? (
            <span className="hans-progress-bar-value">{visibleValue}</span>
          ) : null}
        </div>
      ) : null}

      <div
        className="hans-progress-bar-track"
        role="progressbar"
        aria-label={accessibleName || undefined}
        aria-valuemin={normalized.min}
        aria-valuemax={normalized.max}
        aria-valuenow={normalized.value}
        aria-valuetext={valueLabel || undefined}
      >
        <span
          className="hans-progress-bar-fill"
          style={{ width: `${normalized.percentage}%` }}
        />
      </div>
    </div>
  );
});

HansProgressBar.displayName = 'HansProgressBar';
