import React from 'react';
import { HansLoading } from '../../Loading/Loading';
import {
  formatTableCellValue,
  getTextAlignClass,
} from '../helpers/Table.helper';
import type { HansTableBodyProps } from './TableBody.types';

export const HansTableBody = React.memo((props: HansTableBodyProps) => {
  const {
    columns,
    rows,
    striped,
    emptyText,
    isLoading,
    loadingType,
    loadingColor,
    loadingAriaLabel,
  } = props;

  if (isLoading) {
    return (
      <tbody>
        <tr>
          <td className="hans-table-loading" colSpan={columns.length}>
            <HansLoading
              loadingType={loadingType}
              loadingColor={loadingColor}
              ariaLabel={loadingAriaLabel}
              skeletonWidth="100%"
              skeletonHeight="120px"
            />
          </td>
        </tr>
      </tbody>
    );
  }

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
              <td
                key={`${column.key}-${rowIndex}`}
                className={getTextAlignClass(column.align)}
              >
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
