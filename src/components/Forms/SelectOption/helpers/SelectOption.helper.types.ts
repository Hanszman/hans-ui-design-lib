import type React from 'react';
import type { SelectOptionValue } from '../SelectOption.types';

export type CreateHandleInputChangeParams = {
  enableAutocomplete: boolean;
  isOpen: boolean;
  setSearchTerm: (value: string) => void;
  setIsOpen: (value: boolean) => void;
  onSearch?: (term: string) => void;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type CreateHandleSelectOptionParams = {
  disabled: boolean;
  isMulti: boolean;
  selectedValues: string[];
  value: SelectOptionValue | undefined;
  enableAutocomplete: boolean;
  setInternalValue: (next: SelectOptionValue) => void;
  onChange?: (value: SelectOptionValue) => void;
  setSearchTerm: (value: string) => void;
  setIsOpen: (value: boolean) => void;
};

export type CreateHandleRemoveSelectedParams = {
  selectedValues: string[];
  value: SelectOptionValue | undefined;
  setInternalValue: (next: SelectOptionValue) => void;
  onChange?: (value: SelectOptionValue) => void;
};

export type CreateSetSelectOptionOpenParams = {
  disabled: boolean;
  ignoreFocusRef: React.MutableRefObject<boolean>;
  setIsOpen: (value: boolean) => void;
};

export type CreateSyncSelectOptionValueParams = {
  value: SelectOptionValue | undefined;
  setInternalValue: (next: SelectOptionValue) => void;
};

export type CreateSyncAutocompleteSearchTermParams = {
  enableAutocomplete: boolean;
  isMulti: boolean;
  selectedLabel: string;
  setSearchTerm: (value: string) => void;
};

export type CreateSyncPopupOffsetsParams = {
  selectOptionRef: React.RefObject<HTMLDivElement | null>;
  setPopupOffsets: (offsets: { up: number; down: number }) => void;
};


