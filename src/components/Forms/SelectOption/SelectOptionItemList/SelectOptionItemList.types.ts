import type { SelectOptionItem } from '../SelectOption.types';

export type HansSelectOptionItemListProps = {
  options: SelectOptionItem[];
  selectedValues: string[];
  isMulti: boolean;
  openDirection: 'up' | 'down';
  dropdownHoverColor: string;
  noOptionsText: string;
  isLoadingOptions: boolean;
  loadingOptionsText: string;
  onSelectOption: (option: SelectOptionItem) => void;
  listId?: string;
};
