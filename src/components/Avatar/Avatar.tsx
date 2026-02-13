import React from 'react';
import { HansIcon } from '../Icon/Icon';
import type { HansAvatarProps } from './Avatar.types';

export const HansAvatar = React.memo((props: HansAvatarProps) => {
  const {
    src = '',
    alt = 'Avatar',
    avatarSize = 'medium',
    customClasses = '',
    fallbackIconName = 'MdOutlineAccountCircle',
    ...rest
  } = props;

  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  const showFallback = !src || hasError;

  return (
    <div
      className={`
        hans-avatar
        hans-avatar-${avatarSize}
        ${customClasses}
      `}
      aria-label={alt}
    >
      {showFallback ? (
        <span className="hans-avatar-fallback" role="img" aria-hidden="true">
          <HansIcon
            name={fallbackIconName}
            iconSize={avatarSize}
            customClasses="hans-avatar-icon"
          />
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          className="hans-avatar-img"
          onError={() => setHasError(true)}
          {...rest}
        />
      )}
    </div>
  );
});

HansAvatar.displayName = 'HansAvatar';
