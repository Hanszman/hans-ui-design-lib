import type { Color, Size } from '../../../types/Common.types';

export const LOADING_COLOR_MAP: Record<
  Color,
  { border: string; borderTop: string; skeleton: string }
> = {
  base: {
    border: 'var(--base-neutral-color)',
    borderTop: 'var(--base-default-color)',
    skeleton: 'var(--base-default-color)',
  },
  primary: {
    border: 'var(--primary-neutral-color)',
    borderTop: 'var(--primary-default-color)',
    skeleton: 'var(--primary-default-color)',
  },
  secondary: {
    border: 'var(--secondary-neutral-color)',
    borderTop: 'var(--secondary-default-color)',
    skeleton: 'var(--secondary-default-color)',
  },
  success: {
    border: 'var(--success-neutral-color)',
    borderTop: 'var(--success-default-color)',
    skeleton: 'var(--success-default-color)',
  },
  danger: {
    border: 'var(--danger-neutral-color)',
    borderTop: 'var(--danger-default-color)',
    skeleton: 'var(--danger-default-color)',
  },
  warning: {
    border: 'var(--warning-neutral-color)',
    borderTop: 'var(--warning-default-color)',
    skeleton: 'var(--warning-default-color)',
  },
  info: {
    border: 'var(--info-neutral-color)',
    borderTop: 'var(--info-default-color)',
    skeleton: 'var(--info-default-color)',
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
): string => {
  const sizeClass =
    loadingType === 'spinner' ? `hans-loading-${loadingSize}` : '';
  return `hans-loading hans-loading-${loadingType} ${sizeClass} ${customClasses}`;
};
