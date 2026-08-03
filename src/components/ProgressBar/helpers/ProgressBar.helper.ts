import type { Color, Size } from '../../../types/Common.types';

export type ProgressBarValues = {
  min: number;
  max: number;
  value: number;
  percentage: number;
};

export const normalizeProgressBarValues = (
  value: number,
  min: number,
  max: number,
): ProgressBarValues => {
  const safeMin = Number.isFinite(min) ? min : 0;
  const proposedMax = Number.isFinite(max) ? max : 100;
  const safeMax = proposedMax > safeMin ? proposedMax : safeMin + 1;
  const proposedValue = Number.isFinite(value) ? value : safeMin;
  const safeValue = Math.min(safeMax, Math.max(safeMin, proposedValue));

  return {
    min: safeMin,
    max: safeMax,
    value: safeValue,
    percentage: ((safeValue - safeMin) / (safeMax - safeMin)) * 100,
  };
};

export const getProgressBarClassName = (
  color: Color,
  size: Size,
  customClasses: string,
): string =>
  [
    'hans-progress-bar',
    `hans-progress-bar-${color}`,
    `hans-progress-bar-${size}`,
    customClasses,
  ]
    .filter(Boolean)
    .join(' ');
