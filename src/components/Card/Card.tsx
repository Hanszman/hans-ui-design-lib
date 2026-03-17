import React from 'react';
import { HansAvatar } from '../Avatar/Avatar';
import { HansLoading } from '../Loading/Loading';
import type { HansCardProps } from './Card.types';
import {
  getHansCardClassName,
  getHansCardStyleVars,
  resolveHansCardLayout,
} from './helpers/Card.helper';

export const HansCard = React.memo((props: HansCardProps) => {
  const {
    title = '',
    description = '',
    imageSrc = '',
    imageAlt = 'Card image',
    avatarSrc = '',
    avatarAlt = title || 'Card avatar',
    avatarLoading = false,
    cardLayout,
    cardSize = 'medium',
    cardColor = 'base',
    cardVariant = 'neutral',
    loading = false,
    loadingColor,
    loadingAriaLabel = 'Loading card',
    customClasses = '',
    children,
    ...rest
  } = props;

  const resolvedLayout = resolveHansCardLayout(cardLayout, imageSrc);
  const className = getHansCardClassName({
    cardLayout: resolvedLayout,
    cardSize,
    customClasses,
  });
  const styleVars = getHansCardStyleVars({
    cardColor,
    cardVariant,
    imageSrc,
  });
  const resolvedLoadingColor = loadingColor ?? cardColor;

  if (loading) {
    return (
      <div
        className={`${className} hans-card-loading`}
        style={styleVars}
        {...rest}
      >
        <HansLoading
          loadingType="skeleton"
          loadingColor={resolvedLoadingColor}
          skeletonWidth="100%"
          skeletonHeight="100%"
          ariaLabel={loadingAriaLabel}
          customClasses="hans-card-skeleton"
        />
      </div>
    );
  }

  if (resolvedLayout === 'image') {
    return (
      <div className={className} style={styleVars} {...rest}>
        <div
          className="hans-card-image-surface"
          role="img"
          aria-label={imageAlt}
        >
          <div className="hans-card-image-overlay">
            <div className="hans-card-image-copy">
              {title ? <strong className="hans-card-title">{title}</strong> : null}
              {description ? (
                <span className="hans-card-description">{description}</span>
              ) : null}
            </div>
            {children ? <div className="hans-card-extra">{children}</div> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={styleVars} {...rest}>
      <div className="hans-card-profile-main">
        <HansAvatar
          src={avatarSrc}
          alt={avatarAlt}
          avatarSize={cardSize}
          loading={avatarLoading}
        />
        <div className="hans-card-copy">
          {title ? <strong className="hans-card-title">{title}</strong> : null}
          {description ? (
            <span className="hans-card-description">{description}</span>
          ) : null}
        </div>
      </div>
      {children ? <div className="hans-card-extra">{children}</div> : null}
    </div>
  );
});

HansCard.displayName = 'HansCard';
