import React from 'react';
import { HansIcon } from '../../Icon/Icon';
import { getTextAlignClass } from '../helpers/Table.helper';
import type { HansTableHeaderProps } from './TableHeader.types';

export const HansTableHeader = React.memo((props: HansTableHeaderProps) => {
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
