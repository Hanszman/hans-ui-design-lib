import React from 'react';
import { HansIcon } from '../../Icon/Icon';
import { HansLoading } from '../../Loading/Loading';
import { getTextAlignClass } from '../helpers/Table.helper';
import type { HansTableHeaderProps } from './TableHeader.types';

export const HansTableHeader = React.memo((props: HansTableHeaderProps) => {
  const {
    columns,
    sortState,
    onSort,
    isLoading = false,
    loadingType = 'skeleton',
    loadingColor = 'base',
    loadingAriaLabel = 'Loading table header',
  } = props;

  if (isLoading) {
    return (
      <thead className="hans-table-head">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={getTextAlignClass(column.align)}
            >
              <HansLoading
                loadingType={loadingType}
                loadingColor={loadingColor}
                ariaLabel={loadingAriaLabel}
                skeletonWidth="100%"
                skeletonHeight="16px"
                customClasses="hans-table-header-loading"
              />
            </th>
          ))}
        </tr>
      </thead>
    );
  }

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
                        direction === 'asc' ? 'IoIosArrowUp' : 'IoIosArrowDown'
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
