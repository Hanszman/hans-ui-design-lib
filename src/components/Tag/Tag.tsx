import React from 'react';
import { HansIcon } from '../Icon/Icon';
import type { HansTagProps } from './Tag.types';

export const HansTag = React.memo((props: HansTagProps) => {
  const {
    label = '',
    tagSize = 'small',
    tagColor = 'base',
    actionIcon = '',
    customClasses = '',
    disabled = false,
    onAction,
    ...rest
  } = props;

  const hasAction = Boolean(onAction && actionIcon);

  return (
    <span
      className={`
        hans-tag
        hans-tag-${tagSize}
        hans-tag-${tagColor}
        ${customClasses}
      `}
      {...rest}
    >
      <span className="hans-tag-label">{label}</span>
      {hasAction ? (
        <button
          type="button"
          className="hans-tag-action"
          aria-label={`Action ${label}`}
          onClick={onAction}
          disabled={disabled}
        >
          <HansIcon name={actionIcon} iconSize="medium" />
        </button>
      ) : null}
    </span>
  );
});

HansTag.displayName = 'HansTag';
