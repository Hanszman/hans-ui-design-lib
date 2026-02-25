import React from 'react';
import type { HansLoadingProps } from './Loading.types';
import {
  getLoadingClassName,
  LOADING_COLOR_MAP,
  normalizeLoadingDimension,
} from './helpers/Loading.helper';

export const HansLoading = React.memo((props: HansLoadingProps) => {
  const {
    loadingType = 'spinner',
    loadingSize = 'medium',
    loadingColor = 'base',
    skeletonWidth = '100%',
    skeletonHeight = '100%',
    rounded = true,
    customClasses = '',
    ariaLabel = 'Loading',
    ...rest
  } = props;

  const token = LOADING_COLOR_MAP[loadingColor];
  const className = getLoadingClassName(loadingType, loadingSize, customClasses);
  const isSkeleton = loadingType === 'skeleton';

  if (isSkeleton) {
    return (
      <span
        className={`${className} ${rounded ? 'hans-loading-rounded' : ''}`}
        style={
          {
            '--hans-loading-skeleton-color': token.skeleton,
            '--hans-loading-width': normalizeLoadingDimension(skeletonWidth, '100%'),
            '--hans-loading-height': normalizeLoadingDimension(
              skeletonHeight,
              '100%',
            ),
          } as React.CSSProperties
        }
        role="status"
        aria-label={ariaLabel}
        {...rest}
      />
    );
  }

  return (
    <span
      className={className}
      style={
        {
          '--hans-loading-spinner-border': token.border,
          '--hans-loading-spinner-top': token.borderTop,
        } as React.CSSProperties
      }
      role="status"
      aria-label={ariaLabel}
      {...rest}
    />
  );
});

HansLoading.displayName = 'HansLoading';
