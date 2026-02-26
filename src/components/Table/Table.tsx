import React from 'react';
import { HansDropdown } from '../Forms/Dropdown/Dropdown';
import { HansInput } from '../Forms/Input/Input';
import { HansIcon } from '../Icon/Icon';
import type {
  HansTableColumn,
  HansTableProps,
  HansTableRow,
  HansTableSortState,
} from './Table.types';
import {
  applyTableFilters,
  formatTableCellValue,
  getFilterPlaceholder,
  getNextSortState,
  getTableStyleVars,
  getTextAlignClass,
  sortTableRows,
} from './helpers/Table.helper';

type HansTableHeaderProps = {
  columns: HansTableColumn[];
  sortState: HansTableSortState;
  onSort: (column: HansTableColumn) => void;
};

const HansTableHeader = React.memo((props: HansTableHeaderProps) => {
  const { columns, sortState, onSort } = props;

  return (
    <thead className="hans-table-head">
      <tr>
        {columns.map((column) => {
          const direction =
            sortState?.columnKey === column.key ? sortState.direction : null;
          return (
            <th
              key={column.key}
              className={getTextAlignClass(column.align)}
              style={column.width ? { width: column.width } : undefined}
            >
              <div className="hans-table-head-content">
                <span>{column.header}</span>
                {column.sortable ? (
                  <button
                    type="button"
                    className="hans-table-sort-button"
                    aria-label={`Sort by ${column.header}`}
                    onClick={() => onSort(column)}
                  >
                    <HansIcon
                      name={
                        direction === 'asc'
                          ? 'IoIosArrowUp'
                          : 'IoIosArrowDown'
                      }
                      iconSize="small"
                      customClasses={
                        direction ? 'hans-table-sort-icon-active' : ''
                      }
                    />
                  </button>
                ) : null}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
});

HansTableHeader.displayName = 'HansTableHeader';

type HansTableBodyProps = {
  columns: HansTableColumn[];
  rows: HansTableRow[];
  striped: boolean;
  emptyText: string;
};

const HansTableBody = React.memo((props: HansTableBodyProps) => {
  const { columns, rows, striped, emptyText } = props;
  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td className="hans-table-empty" colSpan={columns.length}>
            {emptyText}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={striped ? 'hans-table-striped' : ''}>
      {rows.map((row, rowIndex) => (
        <tr key={`hans-table-row-${rowIndex}`}>
          {columns.map((column) => {
            const value = row[column.key];
            return (
              <td key={`${column.key}-${rowIndex}`} className={getTextAlignClass(column.align)}>
                {column.render
                  ? column.render(value, row, rowIndex)
                  : formatTableCellValue(value)}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
});

HansTableBody.displayName = 'HansTableBody';

export const HansTable = React.memo((props: HansTableProps) => {
  const {
    columns = [],
    rows = [],
    headerColor = 'base',
    rowColor = 'base',
    customClasses = '',
    emptyText = 'No records found',
    headerBackgroundColor,
    headerTextColor,
    rowBackgroundColor,
    rowTextColor,
    borderColor,
    dividerColor,
    rowHoverColor,
    striped = false,
    initialSort = null,
    initialFilters = {},
    onSortChange,
    onFiltersChange,
    ...rest
  } = props;

  const [sortState, setSortState] = React.useState<HansTableSortState>(
    initialSort,
  );
  const [filters, setFilters] = React.useState<Record<string, string>>(
    initialFilters,
  );

  React.useEffect(() => {
    setSortState(initialSort);
  }, [initialSort]);

  React.useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasFilters = React.useMemo(
    () => columns.some((column) => Boolean(column.filter)),
    [columns],
  );

  const filteredRows = React.useMemo(
    () => applyTableFilters(rows, columns, filters),
    [rows, columns, filters],
  );

  const sortedRows = React.useMemo(
    () => sortTableRows(filteredRows, sortState),
    [filteredRows, sortState],
  );

  const styleVars = React.useMemo(
    () =>
      getTableStyleVars({
        headerColor,
        rowColor,
        headerBackgroundColor,
        headerTextColor,
        rowBackgroundColor,
        rowTextColor,
        borderColor,
        dividerColor,
        rowHoverColor,
      }),
    [
      headerColor,
      rowColor,
      headerBackgroundColor,
      headerTextColor,
      rowBackgroundColor,
      rowTextColor,
      borderColor,
      dividerColor,
      rowHoverColor,
    ],
  );

  const handleSort = (column: HansTableColumn) => {
    if (!column.sortable) return;
    const nextSortState = getNextSortState(sortState, column.key);
    setSortState(nextSortState);
    if (onSortChange) onSortChange(nextSortState);
  };

  const handleFilterChange = (columnKey: string, filterValue: string) => {
    setFilters((prev) => {
      const next = { ...prev, [columnKey]: filterValue };
      if (onFiltersChange) onFiltersChange(next);
      return next;
    });
  };

  return (
    <div className={`hans-table-wrapper ${customClasses}`} style={styleVars} {...rest}>
      <table className="hans-table">
        <HansTableHeader
          columns={columns}
          sortState={sortState}
          onSort={handleSort}
        />
        {hasFilters ? (
          <tbody className="hans-table-filters">
            <tr>
              {columns.map((column) => (
                <td key={`filter-${column.key}`}>
                  {column.filter ? (
                    column.filter.type === 'dropdown' ? (
                      <HansDropdown
                        label=""
                        options={column.filter.options}
                        placeholder={getFilterPlaceholder(column)}
                        inputSize="small"
                        value={filters[column.key] ?? ''}
                        onChange={(nextValue) =>
                          handleFilterChange(
                            column.key,
                            typeof nextValue === 'string' ? nextValue : '',
                          )
                        }
                        selectionType="single"
                        enableAutocomplete={
                          column.filter.enableAutocomplete ?? true
                        }
                        customClasses="hans-table-filter-dropdown"
                      />
                    ) : (
                      <HansInput
                        label=""
                        placeholder={getFilterPlaceholder(column)}
                        inputSize="small"
                        value={filters[column.key] ?? ''}
                        onChange={(event) =>
                          handleFilterChange(column.key, event.target.value)
                        }
                        customClasses="hans-table-filter-input"
                      />
                    )
                  ) : null}
                </td>
              ))}
            </tr>
          </tbody>
        ) : null}
        <HansTableBody
          columns={columns}
          rows={sortedRows}
          striped={striped}
          emptyText={emptyText}
        />
      </table>
    </div>
  );
});

HansTable.displayName = 'HansTable';

