import type { SelectOptionItem } from '../SelectOption.types';

export type HansSelectOptionItemListProps = {
  items: SelectOptionItem[];
  selectedValues: string[];
  isMulti: boolean;
  openDirection: 'up' | 'down';
  dropdownHoverColor: string;
  noOptionsText: string;
  isLoadingOptions: boolean;
  loadingOptionsText: string;
  onSelectItem: (item: SelectOptionItem) => void;
  listId?: string;
};
