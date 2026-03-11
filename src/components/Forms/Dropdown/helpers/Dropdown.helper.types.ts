import type React from 'react';
import type { DropdownItem } from '../Dropdown.types';

export type ResolveDropdownItemIdParams = {
  item: DropdownItem;
  itemPath: string;
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

export type CreateHandleDropdownItemEnterParams = {
  setHoveredPath: (nextPath: string | null) => void;
  setSubmenuDirection: (path: string, direction: 'left' | 'right') => void;
  submenuWidth?: number;
};

export type CreateClearDropdownLeaveTimeoutParams = {
  listLeaveTimeoutRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
};

export type CreateHandleDropdownListLeaveParams = {
  clearListLeaveTimeout: () => void;
  listLeaveTimeoutRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
  setHoveredPath: (nextPath: string | null) => void;
  closeDelay?: number;
};
