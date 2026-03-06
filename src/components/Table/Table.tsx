import React from 'react';
import { HansSelectOption } from '../Forms/SelectOption/SelectOption';
import { HansInput } from '../Forms/Input/Input';
import { HansTableBody } from './TableBody/TableBody';
import { HansTableHeader } from './TableHeader/TableHeader';
import type {
  HansTableColumn,
  HansTableProps,
  HansTableSortState,
} from './Table.types';
import {
  applyTableFilters,
  getDropdownFilterOptions,
  getFilterPlaceholder,
  getNextSortState,
  getTableStyleVars,
  getTextAlignClass,
  sortTableRows,
} from './helpers/Table.helper';

export const HansTable = React.memo((props: HansTableProps) => {
  const {
    columns = [],
    rows = [],
    headerColor = 'base',
    rowColor = 'base',
    customClasses = '',
    emptyText = 'No records found',
    headerTextColor,
    rowTextColor,
    borderColor,
    dividerColor,
    rowHoverColor,
    showColumnDividers = false,
    defaultDropdownFilterClearLabel = 'Clear filter',
    isLoading = false,
    loadingType = 'skeleton',
    loadingColor = 'base',
    loadingAriaLabel = 'Loading table data',
    maxHeight,
    minWidth,
    striped = false,
    initialSort,
    initialFilters,
    onSortChange,
    onFiltersChange,
    ...rest
  } = props;

  const [sortState, setSortState] = React.useState<HansTableSortState>(
    initialSort ?? null,
  );
  const [filters, setFilters] = React.useState<Record<string, string>>(
    initialFilters ?? {},
  );

  React.useEffect(() => {
    if (typeof initialSort === 'undefined') return;
    setSortState(initialSort);
  }, [initialSort]);

  React.useEffect(() => {
    if (typeof initialFilters === 'undefined') return;
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasFilters = React.useMemo(
    () => columns.some((column) => Boolean(column.filter)),
    [columns],
  );
  const showFilters = hasFilters && !isLoading;

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
        headerTextColor,
        rowTextColor,
        borderColor,
        dividerColor,
        rowHoverColor,
      }),
    [
      borderColor,
      dividerColor,
      headerColor,
      headerTextColor,
      rowColor,
      rowHoverColor,
      rowTextColor,
    ],
  );

  const wrapperStyles = React.useMemo(
    () => ({
      ...styleVars,
      '--hans-table-max-height': maxHeight ?? 'none',
      '--hans-table-min-width': minWidth ?? '100%',
    }) as React.CSSProperties,
    [styleVars, maxHeight, minWidth],
  );

  const handleSort = (column: HansTableColumn) => {
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
    <div
      className={`
        hans-table-wrapper
        ${showColumnDividers ? 'hans-table-with-column-dividers' : ''}
        ${customClasses}
      `}
      style={wrapperStyles}
      {...rest}
    >
      <table className="hans-table">
        <colgroup>
          {columns.map((column) => (
            <col
              key={`hans-table-col-${column.key}`}
              style={column.width ? { width: column.width } : undefined}
            />
          ))}
        </colgroup>
        <HansTableHeader
          columns={columns}
          sortState={sortState}
          onSort={handleSort}
          isLoading={isLoading}
          loadingType={loadingType}
          loadingColor={loadingColor}
          loadingAriaLabel={loadingAriaLabel}
        />
        {showFilters ? (
          <tbody className="hans-table-filters">
            <tr>
              {columns.map((column) => (
                <td
                  key={`filter-${column.key}`}
                  className={getTextAlignClass(
                    column.filterAlign ?? column.align,
                  )}
                >
                  {column.filter ? (
                    column.filter.type === 'dropdown' ? (
                      <HansSelectOption
                        label=""
                        options={getDropdownFilterOptions(
                          column,
                          defaultDropdownFilterClearLabel,
                        )}
                        placeholder={getFilterPlaceholder(column)}
                        inputSize="small"
                        value={filters[column.key] ?? ''}
                        onChange={(nextValue) =>
                          handleFilterChange(column.key, String(nextValue))
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
          isLoading={isLoading}
          loadingType={loadingType}
          loadingColor={loadingColor}
          loadingAriaLabel={loadingAriaLabel}
        />
      </table>
    </div>
  );
});

HansTable.displayName = 'HansTable';
