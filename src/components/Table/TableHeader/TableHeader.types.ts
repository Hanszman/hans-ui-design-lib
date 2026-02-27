import type { HansTableColumn, HansTableSortState } from '../Table.types';

export type HansTableHeaderProps = {
  columns: HansTableColumn[];
  sortState: HansTableSortState;
  onSort: (column: HansTableColumn) => void;
};
