import type React from 'react';
import type { OptionItem } from '../../../types/Common.types';

export type HansPopupItemListItemState = {
  item: OptionItem;
  itemPath: string;
  itemId: string;
  index: number;
  nested: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  hasChildren: boolean;
};

export type HansPopupItemListProps = {
  items: OptionItem[];
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
  resolveItemId?: (item: OptionItem, itemPath: string) => string;
  onItemClick?: (item: OptionItem, state: HansPopupItemListItemState) => void;
  onItemEnter?: (
    state: HansPopupItemListItemState,
    target: HTMLElement,
  ) => void;
  onListMouseEnter?: (parentPath: string) => void;
  onListMouseLeave?: (parentPath: string) => void;
  renderLeading?: (state: HansPopupItemListItemState) => React.ReactNode;
  renderTrailing?: (state: HansPopupItemListItemState) => React.ReactNode;
  renderChildren?: (state: HansPopupItemListItemState) => React.ReactNode;
};
