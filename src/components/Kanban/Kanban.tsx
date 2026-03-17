import React from 'react';
import { HansLoading } from '../Loading/Loading';
import { HansKanbanColumn } from './KanbanColumn/KanbanColumn';
import { HansKanbanItem } from './KanbanItem/KanbanItem';
import type { HansKanbanItemData, HansKanbanProps } from './Kanban.types';
import {
  getHansKanbanColumnViewState,
  getHansKanbanControlledItems,
  getHansKanbanItemViewState,
  getHansKanbanStyleVars,
  handleHansKanbanColumnDragOver,
  handleHansKanbanCommitMove,
  handleHansKanbanDragEnd,
  handleHansKanbanDrop,
  handleHansKanbanItemDragOver,
  handleHansKanbanItemDragStart,
  groupHansKanbanItems,
} from './helpers/Kanban.helper';
import type { HansKanbanDragState } from './helpers/Kanban.helper.types';

export const HansKanban = React.memo((props: HansKanbanProps) => {
  const {
    columns = [],
    items,
    defaultItems = [],
    boardLabel = 'Kanban board',
    emptyColumnText = 'Drop items here',
    customClasses = '',
    columnMinWidth = '20rem',
    boardMinHeight = '28rem',
    showColumnCounts = true,
    dragAndDrop = true,
    loading = false,
    loadingColor = 'base',
    loadingAriaLabel = 'Loading kanban board',
    onItemsChange,
    onMoveItem,
    onItemClick,
    ...rest
  } = props;

  const isControlled = typeof items !== 'undefined';
  const [internalItems, setInternalItems] = React.useState<HansKanbanItemData[]>(
    defaultItems,
  );
  const [dragState, setDragState] = React.useState<HansKanbanDragState | null>(
    null,
  );
  const dragStateRef = React.useRef<HansKanbanDragState | null>(null);

  const resolvedItems = React.useMemo(
    () =>
      getHansKanbanControlledItems({
        isControlled,
        items,
        internalItems,
      }),
    [internalItems, isControlled, items],
  );

  const groupedItems = React.useMemo(
    () => groupHansKanbanItems(columns, resolvedItems),
    [columns, resolvedItems],
  );

  const boardStyles = React.useMemo(
    () =>
      getHansKanbanStyleVars({
        columnMinWidth,
        boardMinHeight,
      }),
    [boardMinHeight, columnMinWidth],
  );

  const commitMove = React.useCallback(
    (nextDragState: HansKanbanDragState) =>
      handleHansKanbanCommitMove({
        columns,
        items: resolvedItems,
        dragState: nextDragState,
        isControlled,
        setInternalItems,
        onItemsChange,
        onMoveItem,
      }),
    [columns, isControlled, onItemsChange, onMoveItem, resolvedItems],
  );

  const handleColumnDragOver = (
    event: React.DragEvent<HTMLElement>,
    columnId: string,
    columnItemsLength: number,
  ) =>
    handleHansKanbanColumnDragOver({
      dragAndDrop,
      dragStateRef,
      columnId,
      columnItemsLength,
      setDragState,
      event,
    });

  const handleDrop = (
    event: React.DragEvent<HTMLElement>,
    columnId: string,
    fallbackTargetIndex: number,
    itemIndex?: number,
  ) =>
    handleHansKanbanDrop({
      dragAndDrop,
      dragStateRef,
      columnId,
      fallbackTargetIndex,
      itemIndex,
      commitMove,
      setDragState,
      event,
    });

  if (loading) {
    return (
      <div
        className={`hans-kanban-loading ${customClasses}`}
        style={boardStyles}
        aria-label={boardLabel}
        {...rest}
      >
        <HansLoading
          loadingType="skeleton"
          loadingColor={loadingColor}
          skeletonWidth="100%"
          skeletonHeight="100%"
          ariaLabel={loadingAriaLabel}
          customClasses="hans-kanban-loading-skeleton"
        />
      </div>
    );
  }

  return (
    <div
      className={`hans-kanban-wrapper ${customClasses}`}
      style={boardStyles}
      aria-label={boardLabel}
      {...rest}
    >
      <div className="hans-kanban-board">
        {columns.map((column) => {
          const columnItems = groupedItems[column.id];
          const columnViewState = getHansKanbanColumnViewState({
            dragAndDrop,
            dragState,
            columnId: column.id,
            columnItemsLength: columnItems.length,
            color: column.columnColor,
            variant: column.columnVariant,
          });

          return (
            <HansKanbanColumn
              key={column.id}
              column={column}
              itemCount={columnItems.length}
              emptyColumnText={emptyColumnText}
              showColumnCount={showColumnCounts}
              isDragOver={columnViewState.isDragOver}
              showDropAtEnd={columnViewState.showDropAtEnd}
              style={columnViewState.style}
              onDragOver={(event) =>
                handleColumnDragOver(event, column.id, columnItems.length)
              }
              onDrop={(event) => handleDrop(event, column.id, columnItems.length)}
            >
              {columnItems.map((item, itemIndex) => {
                const itemViewState = getHansKanbanItemViewState({
                  dragState,
                  columnId: column.id,
                  itemId: item.id,
                  itemIndex,
                });

                return (
                  <HansKanbanItem
                    key={item.id}
                    item={item}
                    isDragging={itemViewState.isDragging}
                    showDropIndicator={itemViewState.showDropIndicator}
                    onClick={() => onItemClick?.(item)}
                    onDragStart={(event) =>
                      handleHansKanbanItemDragStart({
                        dragAndDrop,
                        itemId: item.id,
                        columnId: column.id,
                        itemIndex,
                        dragStateRef,
                        setDragState,
                        event,
                      })
                    }
                    onDragEnd={() =>
                      handleHansKanbanDragEnd({
                        dragStateRef,
                        setDragState,
                      })
                    }
                    onDragOver={(event) =>
                      handleHansKanbanItemDragOver({
                        dragAndDrop,
                        dragStateRef,
                        columnId: column.id,
                        itemIndex,
                        setDragState,
                        event,
                      })
                    }
                    onDrop={(event) =>
                      handleDrop(event, column.id, columnItems.length, itemIndex)
                    }
                  />
                );
              })}
            </HansKanbanColumn>
          );
        })}
      </div>
    </div>
  );
});

HansKanban.displayName = 'HansKanban';
