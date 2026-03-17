import React from 'react';
import { HansLoading } from '../Loading/Loading';
import { HansKanbanColumn } from './KanbanColumn/KanbanColumn';
import { HansKanbanItem } from './KanbanItem/KanbanItem';
import type { HansKanbanItemData, HansKanbanProps } from './Kanban.types';
import {
  createHansKanbanMoveResult,
  getHansKanbanColumnSurfaceStyle,
  getHansKanbanControlledItems,
  getHansKanbanNextColumnDragState,
  getHansKanbanNextDropState,
  getHansKanbanNextItemDragOverState,
  getHansKanbanNextItemDragStartState,
  getHansKanbanStyleVars,
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
    (nextDragState: HansKanbanDragState) => {
      const { nextItems, moveEvent } = createHansKanbanMoveResult({
        columns,
        items: resolvedItems,
        dragState: nextDragState,
      });

      if (!isControlled) setInternalItems(nextItems);
      onItemsChange?.(nextItems);
      onMoveItem?.(moveEvent);
    },
    [columns, isControlled, onItemsChange, onMoveItem, resolvedItems],
  );

  const handleDragEnd = () => {
    setDragState(null);
  };

  const handleColumnDragOver = (
    event: React.DragEvent<HTMLElement>,
    columnId: string,
    columnItemsLength: number,
  ) => {
    const nextDragState = getHansKanbanNextColumnDragState({
      dragAndDrop,
      dragState,
      columnId,
      columnItemsLength,
    });

    if (!nextDragState) return;
    event.preventDefault();
    setDragState(nextDragState);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLElement>,
    columnId: string,
    fallbackTargetIndex: number,
  ) => {
    const nextDragState = getHansKanbanNextDropState({
      dragAndDrop,
      dragState,
      columnId,
      fallbackTargetIndex,
    });

    if (!nextDragState) return;
    event.preventDefault();
    event.stopPropagation();

    commitMove(nextDragState);
    setDragState(null);
  };

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
          const isColumnDragOver =
            dragState?.targetColumnId === column.id && dragAndDrop;
          const showDropAtEnd =
            isColumnDragOver && dragState.targetIndex === columnItems.length;

          return (
            <HansKanbanColumn
              key={column.id}
              column={column}
              itemCount={columnItems.length}
              emptyColumnText={emptyColumnText}
              showColumnCount={showColumnCounts}
              isDragOver={isColumnDragOver}
              showDropAtEnd={showDropAtEnd}
              style={getHansKanbanColumnSurfaceStyle({
                color: column.columnColor,
                variant: column.columnVariant,
              })}
              onDragOver={(event) =>
                handleColumnDragOver(event, column.id, columnItems.length)
              }
              onDrop={(event) => handleDrop(event, column.id, columnItems.length)}
            >
              {columnItems.map((item, itemIndex) => (
                <HansKanbanItem
                  key={item.id}
                  item={item}
                  isDragging={dragState?.activeItemId === item.id}
                  showDropIndicator={
                    dragState?.targetColumnId === column.id &&
                    dragState.targetIndex === itemIndex
                  }
                  onClick={() => onItemClick?.(item)}
                  onDragStart={(event) => {
                    const nextDragState = getHansKanbanNextItemDragStartState({
                      dragAndDrop,
                      itemId: item.id,
                      columnId: column.id,
                      itemIndex,
                    });

                    if (!nextDragState) return;
                    event.dataTransfer.effectAllowed = 'move';
                    setDragState(nextDragState);
                  }}
                  onDragEnd={handleDragEnd}
                  onDragOver={(event) => {
                    const rect = (
                      event.currentTarget as HTMLDivElement
                    ).getBoundingClientRect();
                    const nextDragState = getHansKanbanNextItemDragOverState({
                      dragAndDrop,
                      dragState,
                      columnId: column.id,
                      itemIndex,
                      clientY: event.clientY,
                      itemTop: rect.top,
                      itemHeight: rect.height,
                    });

                    if (!nextDragState) return;
                    event.preventDefault();
                    setDragState(nextDragState);
                  }}
                  onDrop={(event) => handleDrop(event, column.id, columnItems.length)}
                />
              ))}
            </HansKanbanColumn>
          );
        })}
      </div>
    </div>
  );
});

HansKanban.displayName = 'HansKanban';
