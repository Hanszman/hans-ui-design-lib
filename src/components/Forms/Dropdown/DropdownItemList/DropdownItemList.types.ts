import type React from 'react';
import type { DropdownItem } from '../Dropdown.types';
import type { SubmenuAnchor } from '../helpers/Dropdown.helper.types';

export type HansDropdownItemListProps = {
  items: DropdownItem[];
  noOptionsText: string;
  hoveredPath: string | null;
  submenuDirections: Record<string, 'left' | 'right'>;
  submenuAnchors: Record<string, SubmenuAnchor>;
  positionStyle?: React.CSSProperties;
  optionTextColor?: string;
  optionHoverBackgroundColor?: string;
  optionHoverTextColor?: string;
  emptyTextColor?: string;
  parentPath?: string;
  nested?: boolean;
  popupId?: string;
  onItemEnter: (path: string, target: HTMLElement) => void;
  onListEnter?: (parentPath: string, event: React.MouseEvent) => void;
  onListLeave?: (parentPath: string, event: React.MouseEvent) => void;
  onSelect: (item: DropdownItem) => void;
};
