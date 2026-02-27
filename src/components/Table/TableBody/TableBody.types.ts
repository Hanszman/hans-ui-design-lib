import type { HansTableColumn, HansTableRow } from '../Table.types';
import type { HansLoadingProps } from '../../Loading/Loading.types';
import type { Color } from '../../../types/Common.types';

export type HansTableBodyProps = {
  columns: HansTableColumn[];
  rows: HansTableRow[];
  striped: boolean;
  emptyText: string;
  isLoading: boolean;
  loadingType: HansLoadingProps['loadingType'];
  loadingColor: Color;
  loadingAriaLabel: string;
};
