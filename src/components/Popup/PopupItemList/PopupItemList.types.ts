import type React from 'react';
import type { PopupOptionItem } from '../Popup.types';

export type HansPopupItemListItemState = {
  item: PopupOptionItem;
  itemPath: string;
  itemId: string;
  index: number;
  nested: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  hasChildren: boolean;
};

export type HansPopupItemListProps = {
  items: PopupOptionItem[];
  id?: string;
  className?: string;
  role?: 'listbox' | 'menu';
  itemRole?: 'option' | 'menuitem';
  style?: React.CSSProperties;
  dataDirection?: 'up' | 'down';
  ariaMultiselectable?: boolean;
  parentPath?: string;
  nested?: boolean;
  emptyText: string;
  emptyClassName?: string;
  itemClassName?: string | ((state: HansPopupItemListItemState) => string);
  itemLabelClassName?: string;
  selectedItemIds?: string[];
  resolveItemId?: (item: PopupOptionItem, itemPath: string) => string;
  onItemClick?: (
    item: PopupOptionItem,
    state: HansPopupItemListItemState,
  ) => void;
  onItemEnter?: (
    state: HansPopupItemListItemState,
    target: HTMLElement,
  ) => void;
  onListMouseEnter?: (parentPath: string, event: React.MouseEvent) => void;
  onListMouseLeave?: (parentPath: string, event: React.MouseEvent) => void;
  renderLeading?: (state: HansPopupItemListItemState) => React.ReactNode;
  renderTrailing?: (state: HansPopupItemListItemState) => React.ReactNode;
  renderChildren?: (state: HansPopupItemListItemState) => React.ReactNode;
};
