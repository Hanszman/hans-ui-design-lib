import type { HansTableColumn, HansTableRow } from '../Table.types';

export type HansTableBodyProps = {
  columns: HansTableColumn[];
  rows: HansTableRow[];
  striped: boolean;
  emptyText: string;
};
