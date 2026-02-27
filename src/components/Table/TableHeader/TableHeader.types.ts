import type { HansTableColumn, HansTableSortState } from '../Table.types';
import type { HansLoadingProps } from '../../Loading/Loading.types';
import type { Color } from '../../../types/Common.types';

export type HansTableHeaderProps = {
  columns: HansTableColumn[];
  sortState: HansTableSortState;
  onSort: (column: HansTableColumn) => void;
  isLoading?: boolean;
  loadingType?: HansLoadingProps['loadingType'];
  loadingColor?: Color;
  loadingAriaLabel?: string;
};
