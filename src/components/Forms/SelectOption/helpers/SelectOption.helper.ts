import type React from 'react';
import type {
  SelectOptionItem,
  SelectOptionValue,
} from '../SelectOption.types';
import type {
  CreateHandleInputChangeParams,
  CreateHandleRemoveSelectedParams,
  CreateHandleSelectOptionParams,
  CreateSetSelectOptionOpenParams,
} from './SelectOption.helper.types';

export const normalizeToArray = (
  value: SelectOptionValue | undefined,
): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.length > 0) return [value];
  return [];
};

export const getOptionId = (option: SelectOptionItem): string =>
  option.id ?? option.value;

export const getInitialSelectOptionValue = (
  value: SelectOptionValue | undefined,
  defaultValue: SelectOptionValue | undefined,
  isMulti: boolean,
): SelectOptionValue => {
  if (typeof value !== 'undefined') return value;
  if (typeof defaultValue !== 'undefined') return defaultValue;
  return isMulti ? [] : '';
};

export const getSelectedLabel = (
  isMulti: boolean,
  selectedOptions: SelectOptionItem[],
): string => {
  if (isMulti) return selectedOptions.map((option) => option.label).join(', ');
  return selectedOptions[0]?.label ?? '';
};

export const filterSelectOptionItens = (
  options: SelectOptionItem[],
  enableAutocomplete: boolean,
  searchTerm: string,
): SelectOptionItem[] => {
  if (!enableAutocomplete || searchTerm.trim().length === 0) return options;
  const search = searchTerm.toLowerCase();
  return options.filter((option) =>
    option.label.toLowerCase().includes(search),
  );
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

export const createHandleInputChange =
  (params: CreateHandleInputChangeParams) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      enableAutocomplete,
      isOpen,
      setSearchTerm,
      setIsOpen,
      onSearch,
      onInputChange,
    } = params;
    if (!enableAutocomplete) return;
    const nextValue = event.target.value;
    setSearchTerm(nextValue);
    if (!isOpen) setIsOpen(true);
    if (onSearch) onSearch(nextValue);
    if (onInputChange) onInputChange(event);
  };

export const createHandleSelectOption =
  (params: CreateHandleSelectOptionParams) => (option: SelectOptionItem) => {
    const {
      disabled,
      isMulti,
      selectedValues,
      value,
      enableAutocomplete,
      setInternalValue,
      onChange,
      setSearchTerm,
      setIsOpen,
    } = params;

    if (option.disabled || disabled) return;
    const optionId = getOptionId(option);

    if (isMulti) {
      const nextValues = getNextMultiValues(selectedValues, optionId);
      if (typeof value === 'undefined') setInternalValue(nextValues);
      if (onChange) onChange(nextValues);
      if (enableAutocomplete) setSearchTerm('');
      return;
    }

    if (typeof value === 'undefined') setInternalValue(optionId);
    if (onChange) onChange(optionId);
    if (enableAutocomplete) setSearchTerm(option.label);
    setIsOpen(false);
  };

export const createHandleRemoveSelected =
  (params: CreateHandleRemoveSelectedParams) => (optionId: string) => {
    const { selectedValues, value, setInternalValue, onChange } = params;
    const nextValues = getValuesAfterRemoval(selectedValues, optionId);
    if (typeof value === 'undefined') setInternalValue(nextValues);
    if (onChange) onChange(nextValues);
  };

export const createSetSelectOptionOpen =
  (params: CreateSetSelectOptionOpenParams) =>
  (nextOpen: boolean, source: 'focus' | 'toggle') => {
    const { disabled, ignoreFocusRef, setIsOpen } = params;
    if (disabled) return;
    if (source === 'focus' && ignoreFocusRef.current) {
      ignoreFocusRef.current = false;
      return;
    }
    if (source === 'toggle' && !nextOpen) {
      ignoreFocusRef.current = true;
    }
    setIsOpen(nextOpen);
  };

export const createHandleOpen =
  (setSelectOptionOpen: (nextOpen: boolean, source: 'focus' | 'toggle') => void) =>
  () => {
    setSelectOptionOpen(true, 'focus');
  };

export const createHandleToggle =
  (
    setSelectOptionOpen: (nextOpen: boolean, source: 'focus' | 'toggle') => void,
    getIsOpen: () => boolean,
  ) =>
  () => {
    setSelectOptionOpen(!getIsOpen(), 'toggle');
  };




