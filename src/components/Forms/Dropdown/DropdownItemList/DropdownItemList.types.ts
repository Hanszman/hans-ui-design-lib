import type { DropdownItem } from '../Dropdown.types';

export type HansDropdownItemListProps = {
  items: DropdownItem[];
  noOptionsText: string;
  hoveredPath: string | null;
  submenuDirections: Record<string, 'left' | 'right'>;
  parentPath?: string;
  nested?: boolean;
  popupId?: string;
  onItemEnter: (path: string, target: HTMLElement) => void;
  onListLeave?: (parentPath: string) => void;
  onSelect: (item: DropdownItem) => void;
};
