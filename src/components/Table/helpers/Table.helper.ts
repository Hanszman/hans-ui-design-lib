import type React from 'react';
import type {
  HansTableColumn,
  HansTableProps,
  HansTableRow,
  HansTableSortState,
} from '../Table.types';

const getTokenColor = (
  color: NonNullable<HansTableProps['headerColor']>,
  tone: 'strong' | 'default' | 'neutral',
): string => `var(--${color}-${tone}-color)`;

export const getNextSortState = (
  currentSort: HansTableSortState,
  columnKey: string,
): HansTableSortState => {
  if (!currentSort || currentSort.columnKey !== columnKey) {
    return { columnKey, direction: 'asc' };
  }

  if (currentSort.direction === 'asc') {
    return { columnKey, direction: 'desc' };
  }

  return { columnKey, direction: 'asc' };
};

export const formatTableCellValue = (value: unknown): string => {
  if (value === null || typeof value === 'undefined') return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean')
    return `${value}`;
  if (Array.isArray(value))
    return value.map((item) => formatTableCellValue(item)).join(', ');

  return JSON.stringify(value);
};

const getComparableValue = (value: unknown): string | number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return value.toLowerCase();
  if (typeof value === 'boolean') return Number(value);
  return formatTableCellValue(value).toLowerCase();
};

export const sortTableRows = (
  rows: HansTableRow[],
  sortState: HansTableSortState,
): HansTableRow[] => {
  if (!sortState) return rows;
  const { columnKey, direction } = sortState;
  const sorted = [...rows].sort((firstRow, secondRow) => {
    const first = getComparableValue(firstRow[columnKey]);
    const second = getComparableValue(secondRow[columnKey]);

    if (first < second) return direction === 'asc' ? -1 : 1;
    if (first > second) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

export const applyTableFilters = (
  rows: HansTableRow[],
  columns: HansTableColumn[],
  filters: Record<string, string>,
): HansTableRow[] => {
  const activeFilters = Object.entries(filters).filter(
    ([, value]) => value.trim().length > 0,
  );
  if (activeFilters.length === 0) return rows;

  const filterableColumns = new Set(
    columns.filter((column) => column.filter).map((column) => column.key),
  );

  return rows.filter((row) =>
    activeFilters.every(([columnKey, filterValue]) => {
      if (!filterableColumns.has(columnKey)) return true;
      const current = formatTableCellValue(row[columnKey]).toLowerCase();
      return current.includes(filterValue.toLowerCase().trim());
    }),
  );
};

export const getFilterPlaceholder = (column: HansTableColumn): string => {
  if (!column.filter) return '';
  if (column.filter.placeholder) return column.filter.placeholder;

  return column.filter.type === 'input'
    ? `Filter ${column.header}`
    : `Select ${column.header}`;
};

export const getDropdownFilterOptions = (
  column: HansTableColumn,
  clearLabel: string,
) => {
  if (!column.filter || column.filter.type !== 'dropdown') return [];

  return [
    {
      label: column.filter.clearLabel ?? clearLabel,
      value: '',
    },
    ...column.filter.options,
  ];
};

export const getTextAlignClass = (align: HansTableColumn['align']): string => {
  if (align === 'center') return 'hans-table-align-center';
  if (align === 'right') return 'hans-table-align-right';
  return 'hans-table-align-left';
};

export const getTableStyleVars = ({
  headerColor = 'base',
  rowColor = 'base',
  headerTextColor,
  rowTextColor,
  borderColor,
  dividerColor,
  rowHoverColor,
}: Pick<
  HansTableProps,
  | 'headerColor'
  | 'rowColor'
  | 'headerTextColor'
  | 'rowTextColor'
  | 'borderColor'
  | 'dividerColor'
  | 'rowHoverColor'
>): React.CSSProperties =>
  ({
    '--hans-table-header-bg': getTokenColor(headerColor, 'strong'),
    '--hans-table-header-text': getTokenColor(headerTextColor ?? headerColor, 'neutral'),
    '--hans-table-row-bg':
      rowColor === 'base' ? 'var(--white-color)' : getTokenColor(rowColor, 'neutral'),
    '--hans-table-row-text': getTokenColor(rowTextColor ?? rowColor, 'strong'),
    '--hans-table-border': getTokenColor(borderColor ?? 'base', 'default'),
    '--hans-table-divider': getTokenColor(dividerColor ?? 'base', 'neutral'),
    '--hans-table-row-hover': getTokenColor(rowHoverColor ?? rowColor, 'default'),
  }) as React.CSSProperties;
