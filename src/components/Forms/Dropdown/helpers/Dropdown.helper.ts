import type React from 'react';
import type { DropdownItem } from '../Dropdown.types';
import type {
  CreateHandleDropdownItemEnterParams,
  CreateDropdownOpenSetterParams,
  CreateHandleDropdownSelectParams,
  ResolveDropdownItemIdParams,
} from './Dropdown.helper.types';

export const resolveDropdownItemId = ({
  item,
  itemPath,
}: ResolveDropdownItemIdParams): string => item.id ?? `${item.value}-${itemPath}`;

export const hasCustomDropdownContent = (
  children: React.ReactNode,
): boolean => Boolean(children);

export const hasNestedDropdownItems = (item: DropdownItem): boolean =>
  Array.isArray(item.children) && item.children.length > 0;

export const createDropdownItemPath = (
  parentPath: string,
  index: number,
): string => (parentPath.length > 0 ? `${parentPath}.${index}` : `${index}`);

export const shouldShowDropdownSubmenu = (
  hoveredPath: string | null,
  currentPath: string,
): boolean => hoveredPath === currentPath;

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
    if (hasNestedDropdownItems(item)) return;
    getDropdownSelection(item, onSelect);
    if (closeOnSelect && !item.disabled) setOpen(false);
  };

export const createHandleDropdownItemEnter =
  ({ setHoveredPath }: CreateHandleDropdownItemEnterParams) =>
  (path: string): void => {
    setHoveredPath(path);
  };
