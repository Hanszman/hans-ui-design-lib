import React from 'react';
import { HansIcon } from '../Icon/Icon';
import type { HansTagProps } from './Tag.types';

export const HansTag = React.memo((props: HansTagProps) => {
  const {
    label = '',
    tagSize = 'small',
    tagColor = 'base',
    actionIcon = '',
    imageSrc = '',
    imageAlt = '',
    mediaPosition = 'right',
    customClasses = '',
    disabled = false,
    onAction,
    ...rest
  } = props;

  const hasAction = Boolean(onAction && actionIcon);
  const hasImage = Boolean(imageSrc);
  const media = (
    <>
      {hasImage ? (
        <img
          className="hans-tag-image"
          src={imageSrc}
          alt={imageAlt || ''}
          loading="lazy"
        />
      ) : null}
      {hasAction ? (
        <button
          type="button"
          className="hans-tag-action"
          aria-label={`Action ${label}`}
          onClick={onAction}
          disabled={disabled}
        >
          <span className="hans-tag-icon">
            <HansIcon name={actionIcon} />
          </span>
        </button>
      ) : null}
    </>
  );

  return (
    <span
      className={`
        hans-tag
        hans-tag-${tagSize}
        hans-tag-${tagColor}
        hans-tag-media-${mediaPosition}
        ${customClasses}
      `}
      {...rest}
    >
      {mediaPosition === 'left' ? media : null}
      <span className="hans-tag-label">{label}</span>
      {mediaPosition === 'right' ? media : null}
    </span>
  );
});

HansTag.displayName = 'HansTag';
