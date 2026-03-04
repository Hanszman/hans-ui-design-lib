import React from 'react';
import type { Size, Color } from '../../../../types/Common.types';

export const TOGGLE_SIZE_CONFIG = {
  small: { base: 42, max: 88, perChar: 7 },
  medium: { base: 52, max: 112, perChar: 8 },
  large: { base: 66, max: 140, perChar: 9 },
} as const;

export const normalizeToggleColor = (toggleColor: Color): Color =>
  toggleColor === 'base' ? 'primary' : toggleColor;

export const getToggleColorClass = (
  checked: boolean,
  disabled: boolean,
  normalizedColor: Color,
): string => {
  if (!checked && !disabled) return 'hans-toggle-off';
  if (!checked && disabled) return 'hans-toggle-off-disabled';
  if (checked && disabled) return 'hans-toggle-on-disabled';
  return `hans-toggle-on-${normalizedColor}`;
};

export const getLoadingSizeFromToggleSize = (toggleSize: Size): Size => {
  if (toggleSize === 'small') return 'small';
  if (toggleSize === 'large') return 'large';
  return 'medium';
};

export const getSegmentedSkeletonHeight = (toggleSize: Size): string => {
  if (toggleSize === 'small') return '32px';
  if (toggleSize === 'large') return '52px';
  return '40px';
};

export const getContentLength = (content: React.ReactNode): number => {
  if (typeof content === 'string') return content.length;
  if (typeof content === 'number') return content.toString().length;
  if (content) return 2;
  return 0;
};

export const getSwitchWidth = (
  toggleSize: Size,
  onContent: React.ReactNode,
  offContent: React.ReactNode,
): number | undefined => {
  const maxTrackContentLength = Math.max(
    getContentLength(onContent),
    getContentLength(offContent),
  );
  if (maxTrackContentLength === 0) return undefined;

  const normalizedTrackLength = Math.min(maxTrackContentLength, 10);
  const sizeConfig = TOGGLE_SIZE_CONFIG[toggleSize];
  return Math.min(
    sizeConfig.base + normalizedTrackLength * sizeConfig.perChar,
    sizeConfig.max,
  );
};

export const buildToggleStyle = (
  style: React.CSSProperties | undefined,
  computedWidth: number | undefined,
): React.CSSProperties => ({
  ...(style || {}),
  ...(computedWidth ? { width: `${computedWidth}px` } : {}),
});

type SwitchToggleHandlerParams = {
  disabled: boolean;
  isChecked: boolean;
  isControlled: boolean;
  setInternalChecked: React.Dispatch<React.SetStateAction<boolean>>;
  onChange?: (checked: boolean) => void;
};

export const handleSwitchToggle = ({
  disabled,
  isChecked,
  isControlled,
  setInternalChecked,
  onChange,
}: SwitchToggleHandlerParams): void => {
  if (disabled) return;
  const nextValue = !isChecked;
  if (!isControlled) setInternalChecked(nextValue);
  if (onChange) onChange(nextValue);
};

type OptionSelectHandlerParams = {
  disabled: boolean;
  optionDisabled?: boolean;
  nextValue: string;
  isControlled: boolean;
  setInternalValue: React.Dispatch<React.SetStateAction<string>>;
  onValueChange?: (value: string) => void;
};

export const handleOptionSelect = ({
  disabled,
  optionDisabled,
  nextValue,
  isControlled,
  setInternalValue,
  onValueChange,
}: OptionSelectHandlerParams): void => {
  if (disabled || optionDisabled) return;
  if (!isControlled) setInternalValue(nextValue);
  if (onValueChange) onValueChange(nextValue);
};
