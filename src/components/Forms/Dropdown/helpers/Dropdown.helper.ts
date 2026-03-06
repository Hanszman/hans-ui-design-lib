import type React from 'react';
import type { DropdownItem } from '../Dropdown.types';
import type {
  CreateDropdownOpenSetterParams,
  CreateHandleDropdownSelectParams,
  ResolveDropdownItemIdParams,
} from './Dropdown.helper.types';

export const resolveDropdownItemId = ({
  item,
  index,
}: ResolveDropdownItemIdParams): string => item.id ?? `${item.value}-${index}`;

export const hasCustomDropdownContent = (
  children: React.ReactNode,
): boolean => Boolean(children);

export const getDropdownSelection = (
  item: DropdownItem,
  onSelect?: (item: DropdownItem) => void,
): void => {
  if (item.disabled || !onSelect) return;
  onSelect(item);
};

export const createDropdownOpenSetter =
  ({ setIsOpen, onOpenChange }: CreateDropdownOpenSetterParams) =>
  (nextOpen: boolean): void => {
    setIsOpen(nextOpen);
    if (onOpenChange) onOpenChange(nextOpen);
  };

export const createHandleDropdownSelect =
  ({
    closeOnSelect,
    setOpen,
    onSelect,
  }: CreateHandleDropdownSelectParams) =>
  (item: DropdownItem): void => {
    getDropdownSelection(item, onSelect);
    if (closeOnSelect && !item.disabled) setOpen(false);
  };
