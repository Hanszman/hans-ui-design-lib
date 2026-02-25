import type { Color, Size } from '../../../types/Common.types';

export const LOADING_COLOR_MAP: Record<
  Color,
  { border: string; borderTop: string; skeleton: string }
> = {
  base: {
    border: 'var(--base-neutral-color)',
    borderTop: 'var(--base-default-color)',
    skeleton: 'var(--base-neutral-color)',
  },
  primary: {
    border: 'var(--primary-neutral-color)',
    borderTop: 'var(--primary-default-color)',
    skeleton: 'var(--primary-neutral-color)',
  },
  secondary: {
    border: 'var(--secondary-neutral-color)',
    borderTop: 'var(--secondary-default-color)',
    skeleton: 'var(--secondary-neutral-color)',
  },
  success: {
    border: 'var(--success-neutral-color)',
    borderTop: 'var(--success-default-color)',
    skeleton: 'var(--success-neutral-color)',
  },
  danger: {
    border: 'var(--danger-neutral-color)',
    borderTop: 'var(--danger-default-color)',
    skeleton: 'var(--danger-neutral-color)',
  },
  warning: {
    border: 'var(--warning-neutral-color)',
    borderTop: 'var(--warning-default-color)',
    skeleton: 'var(--warning-neutral-color)',
  },
  info: {
    border: 'var(--info-neutral-color)',
    borderTop: 'var(--info-default-color)',
    skeleton: 'var(--info-neutral-color)',
  },
};

export const normalizeLoadingDimension = (
  value: string | number | undefined,
  fallback: string,
): string => {
  if (typeof value === 'number') return `${value}px`;
  if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  return fallback;
};

export const getLoadingClassName = (
  loadingType: 'spinner' | 'skeleton',
  loadingSize: Size,
  customClasses: string,
): string =>
  `hans-loading hans-loading-${loadingType} hans-loading-${loadingSize} ${customClasses}`;
