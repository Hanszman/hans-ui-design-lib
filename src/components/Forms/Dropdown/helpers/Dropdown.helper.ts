import type { DropdownOption, DropdownValue } from '../Dropdown.types';

export const normalizeToArray = (value: DropdownValue | undefined): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.length > 0) return [value];
  return [];
};

export const getOptionId = (option: DropdownOption): string =>
  option.id ?? option.value;

export const getInitialDropdownValue = (
  value: DropdownValue | undefined,
  defaultValue: DropdownValue | undefined,
  isMulti: boolean,
): DropdownValue => {
  if (typeof value !== 'undefined') return value;
  if (typeof defaultValue !== 'undefined') return defaultValue;
  return isMulti ? [] : '';
};

export const getSelectedLabel = (
  isMulti: boolean,
  selectedOptions: DropdownOption[],
): string => {
  if (isMulti) return selectedOptions.map((option) => option.label).join(', ');
  return selectedOptions[0]?.label ?? '';
};

export const filterDropdownOptions = (
  options: DropdownOption[],
  enableAutocomplete: boolean,
  searchTerm: string,
): DropdownOption[] => {
  if (!enableAutocomplete || searchTerm.trim().length === 0) return options;
  const search = searchTerm.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(search));
};

export const getNextMultiValues = (
  selectedValues: string[],
  optionId: string,
): string[] =>
  selectedValues.includes(optionId)
    ? selectedValues.filter((valueItem) => valueItem !== optionId)
    : [...selectedValues, optionId];

export const getValuesAfterRemoval = (
  selectedValues: string[],
  optionId: string,
): string[] => selectedValues.filter((valueItem) => valueItem !== optionId);

export const getOpenDirection = (
  spaceBelow: number,
  spaceAbove: number,
  listHeight: number,
): 'up' | 'down' =>
  spaceBelow < listHeight && spaceAbove > listHeight ? 'up' : 'down';
