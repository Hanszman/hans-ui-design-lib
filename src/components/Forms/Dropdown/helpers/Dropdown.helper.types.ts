import type { DropdownValue } from '../Dropdown.types';

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
  value: DropdownValue | undefined;
  enableAutocomplete: boolean;
  setInternalValue: (next: DropdownValue) => void;
  onChange?: (value: DropdownValue) => void;
  setSearchTerm: (value: string) => void;
  setIsOpen: (value: boolean) => void;
};

export type CreateHandleRemoveSelectedParams = {
  selectedValues: string[];
  value: DropdownValue | undefined;
  setInternalValue: (next: DropdownValue) => void;
  onChange?: (value: DropdownValue) => void;
};

export type CreateSetDropdownOpenParams = {
  disabled: boolean;
  ignoreFocusRef: React.MutableRefObject<boolean>;
  setIsOpen: (value: boolean) => void;
};
