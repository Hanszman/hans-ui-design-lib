import type { Color } from '../../../../types/Common.types';

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
