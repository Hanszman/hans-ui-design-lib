import type React from 'react';
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

type CreateHandleInputChangeParams = {
  enableAutocomplete: boolean;
  isOpen: boolean;
  setSearchTerm: (value: string) => void;
  setIsOpen: (value: boolean) => void;
  onSearch?: (term: string) => void;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

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

type CreateHandleSelectOptionParams = {
  disabled: boolean;
  isMulti: boolean;
  selectedValues: string[];
  value: DropdownValue | undefined;
  enableAutocomplete: boolean;
  setInternalValue: (next: DropdownValue) => void;
  onChange?: (value: DropdownValue) => void;
  setSearchTerm: (value: string) => void;
  setIsOpen: (value: boolean) => void;
};

export const createHandleSelectOption =
  (params: CreateHandleSelectOptionParams) => (option: DropdownOption) => {
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

type CreateHandleRemoveSelectedParams = {
  selectedValues: string[];
  value: DropdownValue | undefined;
  setInternalValue: (next: DropdownValue) => void;
  onChange?: (value: DropdownValue) => void;
};

export const createHandleRemoveSelected =
  (params: CreateHandleRemoveSelectedParams) => (optionId: string) => {
    const { selectedValues, value, setInternalValue, onChange } = params;
    const nextValues = getValuesAfterRemoval(selectedValues, optionId);
    if (typeof value === 'undefined') setInternalValue(nextValues);
    if (onChange) onChange(nextValues);
  };

type CreateSetDropdownOpenParams = {
  disabled: boolean;
  ignoreFocusRef: React.MutableRefObject<boolean>;
  setIsOpen: (value: boolean) => void;
};

export const createSetDropdownOpen =
  (params: CreateSetDropdownOpenParams) =>
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
  (setDropdownOpen: (nextOpen: boolean, source: 'focus' | 'toggle') => void) =>
  () => {
    setDropdownOpen(true, 'focus');
  };

export const createHandleToggle =
  (
    setDropdownOpen: (nextOpen: boolean, source: 'focus' | 'toggle') => void,
    getIsOpen: () => boolean,
  ) =>
  () => {
    setDropdownOpen(!getIsOpen(), 'toggle');
  };
