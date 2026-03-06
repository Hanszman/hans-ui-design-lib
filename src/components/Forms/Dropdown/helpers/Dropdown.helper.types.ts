import type { DropdownItem } from '../Dropdown.types';

export type ResolveDropdownItemIdParams = {
  item: DropdownItem;
  index: number;
};

export type CreateDropdownOpenSetterParams = {
  setIsOpen: (nextOpen: boolean) => void;
  onOpenChange?: (nextOpen: boolean) => void;
};

export type CreateHandleDropdownSelectParams = {
  closeOnSelect: boolean;
  setOpen: (nextOpen: boolean) => void;
  onSelect?: (item: DropdownItem) => void;
};
