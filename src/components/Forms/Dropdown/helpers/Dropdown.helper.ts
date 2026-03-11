import type React from 'react';
import type { DropdownItem } from '../Dropdown.types';
import type { HansPopupItemListItemState } from '../../../Popup/PopupItemList/PopupItemList.types';
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
): boolean =>
  hoveredPath === currentPath ||
  hoveredPath?.startsWith(`${currentPath}.`) === true;

export const getHoveredPathOnListLeave = (
  parentPath: string,
): string | null => {
  if (parentPath.length === 0) return null;
  const lastDotIndex = parentPath.lastIndexOf('.');
  if (lastDotIndex < 0) return null;
  return parentPath.slice(0, lastDotIndex);
};

export const getNextDropdownSubmenuDirections = (
  previousDirections: Record<string, 'left' | 'right'>,
  path: string,
  direction: 'left' | 'right',
): Record<string, 'left' | 'right'> => {
  if (previousDirections[path] === direction) return previousDirections;
  return { ...previousDirections, [path]: direction };
};

export const getDropdownSubmenuArrowName = (
  direction: 'left' | 'right',
): 'IoIosArrowBack' | 'IoIosArrowForward' =>
  direction === 'left' ? 'IoIosArrowBack' : 'IoIosArrowForward';

export const getDropdownItemClassName = (
  state: HansPopupItemListItemState,
  submenuDirection: 'left' | 'right',
): string => `
  hans-dropdown-option
  ${state.isDisabled ? 'hans-dropdown-option-disabled' : ''}
  ${state.hasChildren ? 'hans-dropdown-option-parent' : ''}
  ${state.hasChildren ? `hans-dropdown-option-parent-${submenuDirection}` : ''}
`;

export const getDropdownSelection = (
  item: DropdownItem,
  onSelect?: (item: DropdownItem) => void,
): void => {
  if (item.disabled) return;
  if (item.action) item.action(item);
  if (onSelect) onSelect(item);
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
  ({
    setHoveredPath,
    setSubmenuDirection,
    submenuWidth = 240,
  }: CreateHandleDropdownItemEnterParams) =>
  (path: string, target: HTMLElement): void => {
    setHoveredPath(path);
    if (typeof window === 'undefined') return;
    const targetRect = target.getBoundingClientRect();
    const availableSpaceRight = window.innerWidth - targetRect.right;
    const direction = availableSpaceRight < submenuWidth ? 'left' : 'right';
    setSubmenuDirection(path, direction);
  };
