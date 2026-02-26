import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color } from '../../types/Common.types';
import type { DropdownOption } from '../Forms/Dropdown/Dropdown.types';

export type HansTableRow = Record<string, unknown>;

export type HansTableSortDirection = 'asc' | 'desc';

export type HansTableSortState = {
  columnKey: string;
  direction: HansTableSortDirection;
} | null;

export type HansTableFilterConfig =
  | {
      type: 'input';
      placeholder?: string;
    }
  | {
      type: 'dropdown';
      placeholder?: string;
      options: DropdownOption[];
      enableAutocomplete?: boolean;
    };

export type HansTableColumn = {
  key: string;
  header: string;
  sortable?: boolean;
  filter?: HansTableFilterConfig;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: HansTableRow, rowIndex: number) => React.ReactNode;
};

const HansTableSchema = {
  columns: { type: 'custom', ref: {} as HansTableColumn[] },
  rows: { type: 'custom', ref: {} as HansTableRow[] },
  headerColor: { type: 'custom', ref: {} as Color },
  rowColor: { type: 'custom', ref: {} as Color },
  customClasses: 'string',
  emptyText: 'string',
  headerBackgroundColor: 'string',
  headerTextColor: 'string',
  rowBackgroundColor: 'string',
  rowTextColor: 'string',
  borderColor: 'string',
  dividerColor: 'string',
  rowHoverColor: 'string',
  striped: 'boolean',
} as const;

export type HansTableProps = InferPropsFromSchema<typeof HansTableSchema> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> & {
    initialSort?: HansTableSortState;
    initialFilters?: Record<string, string>;
    onSortChange?: (sortState: HansTableSortState) => void;
    onFiltersChange?: (filters: Record<string, string>) => void;
  };

export const HansTablePropsList = createPropsList(HansTableSchema);

