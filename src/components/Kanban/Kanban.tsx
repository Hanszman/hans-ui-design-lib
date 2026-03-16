import React from 'react';
import { HansLoading } from '../Loading/Loading';
import { HansKanbanColumn } from './KanbanColumn/KanbanColumn';
import { HansKanbanItem } from './KanbanItem/KanbanItem';
import type {
  HansKanbanItemData,
  HansKanbanMoveEvent,
  HansKanbanProps,
} from './Kanban.types';
import {
  getHansKanbanDropIndex,
  getHansKanbanStyleVars,
  getHansKanbanSurfaceStyleVars,
  groupHansKanbanItems,
  moveHansKanbanItem,
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
    () => (isControlled ? (items as HansKanbanItemData[]) : internalItems),
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
      const nextItems = moveHansKanbanItem({
        columns,
        items: resolvedItems,
        activeItemId: nextDragState.activeItemId,
        sourceColumnId: nextDragState.sourceColumnId,
        targetColumnId: nextDragState.targetColumnId,
        targetIndex: nextDragState.targetIndex,
      });

      const movedItem = nextItems.find(
        (item) => item.id === nextDragState.activeItemId,
      ) as HansKanbanItemData;

      if (!isControlled) setInternalItems(nextItems);
      if (onItemsChange) onItemsChange(nextItems);

      const moveEvent: HansKanbanMoveEvent = {
        item: movedItem,
        fromColumnId: nextDragState.sourceColumnId,
        toColumnId: nextDragState.targetColumnId,
        fromIndex: nextDragState.sourceIndex,
        toIndex: nextDragState.targetIndex,
        nextItems,
      };

      if (onMoveItem) onMoveItem(moveEvent);
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
    if (!dragAndDrop || !dragState) return;
    event.preventDefault();

    setDragState({
      ...dragState,
      targetColumnId: columnId,
      targetIndex: columnItemsLength,
    });
  };

  const handleDrop = (
    event: React.DragEvent<HTMLElement>,
    columnId: string,
    fallbackTargetIndex: number,
  ) => {
    if (!dragAndDrop || !dragState) return;
    event.preventDefault();
    event.stopPropagation();

    const nextDragState = {
      ...dragState,
      targetColumnId: columnId,
      targetIndex:
        dragState.targetColumnId === columnId
          ? dragState.targetIndex
          : fallbackTargetIndex,
    };

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
          loadingType="spinner"
          loadingSize="large"
          loadingColor={loadingColor}
          ariaLabel={loadingAriaLabel}
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
              style={getHansKanbanSurfaceStyleVars({
                color: column.columnColor ?? 'base',
                variant: column.columnVariant ?? 'outline',
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
                    if (!dragAndDrop) return;
                    event.dataTransfer.effectAllowed = 'move';
                    setDragState({
                      activeItemId: item.id,
                      sourceColumnId: column.id,
                      sourceIndex: itemIndex,
                      targetColumnId: column.id,
                      targetIndex: itemIndex,
                    });
                  }}
                  onDragEnd={handleDragEnd}
                  onDragOver={(event) => {
                    if (!dragAndDrop || !dragState) return;
                    event.preventDefault();

                    const rect = (
                      event.currentTarget as HTMLDivElement
                    ).getBoundingClientRect();
                    const targetIndex = getHansKanbanDropIndex({
                      clientY: event.clientY,
                      itemTop: rect.top,
                      itemHeight: rect.height,
                      currentIndex: itemIndex,
                    });

                    setDragState({
                      ...dragState,
                      targetColumnId: column.id,
                      targetIndex,
                    });
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
