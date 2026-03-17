import type { Variant } from '../../../types/Common.types';
import type {
  HansKanbanColumnSurfaceStyleArgs,
  HansKanbanColumnDragStateArgs,
  HansKanbanColumnViewStateArgs,
  HansKanbanDragState,
  HansKanbanGroupedItems,
  HansKanbanHandleColumnDragOverArgs,
  HansKanbanHandleCommitMoveArgs,
  HansKanbanHandleDragEndArgs,
  HansKanbanHandleDropArgs,
  HansKanbanHandleItemDragOverArgs,
  HansKanbanHandleItemDragStartArgs,
  HansKanbanItemDragOverStateArgs,
  HansKanbanItemDragStateArgs,
  HansKanbanItemViewStateArgs,
  HansKanbanMoveArgs,
  HansKanbanMoveResult,
  HansKanbanMoveResultArgs,
  HansKanbanNextColumnDragStateArgs,
  HansKanbanNextDropStateArgs,
  HansKanbanNextItemDragOverStateArgs,
  HansKanbanNextItemDragStartStateArgs,
  HansKanbanDropStateArgs,
  HansKanbanSurfaceStyleArgs,
  HansKanbanStyleVars,
  HansKanbanSurfaceStyleVars,
} from './Kanban.helper.types';
import type {
  HansKanbanColumnData,
  HansKanbanItemData,
  HansKanbanMoveEvent,
} from '../Kanban.types';

export const createSurfaceVariantMap = ({
  color,
  variant,
}: HansKanbanSurfaceStyleArgs) => {
  const tokenPrefix = `--${color}`;
  const isBase = color === 'base';

  const map: Record<
    Variant,
    { bg: string; border: string; text: string; muted: string }
  > = {
    strong: {
      bg: `var(${tokenPrefix}-strong-color)`,
      border: `var(${tokenPrefix}-strong-color)`,
      text: 'var(--white)',
      muted: 'color-mix(in srgb, var(--white) 74%, transparent)',
    },
    default: {
      bg: `var(${tokenPrefix}-default-color)`,
      border: `var(${tokenPrefix}-default-color)`,
      text: isBase ? 'var(--text-color)' : 'var(--white)',
      muted: isBase
        ? 'color-mix(in srgb, var(--text-color) 68%, transparent)'
        : 'color-mix(in srgb, var(--white) 76%, transparent)',
    },
    neutral: {
      bg: `var(${tokenPrefix}-neutral-color)`,
      border: `var(${tokenPrefix}-neutral-color)`,
      text: isBase ? 'var(--text-color)' : `var(${tokenPrefix}-strong-color)`,
      muted: isBase
        ? 'color-mix(in srgb, var(--text-color) 68%, transparent)'
        : `color-mix(in srgb, var(${tokenPrefix}-strong-color) 72%, transparent)`,
    },
    outline: {
      bg: 'var(--white)',
      border: `var(${tokenPrefix}-default-color)`,
      text: isBase ? 'var(--text-color)' : `var(${tokenPrefix}-strong-color)`,
      muted: isBase
        ? 'color-mix(in srgb, var(--text-color) 68%, transparent)'
        : `color-mix(in srgb, var(${tokenPrefix}-strong-color) 72%, transparent)`,
    },
    transparent: {
      bg: 'color-mix(in srgb, var(--white) 74%, transparent)',
      border: `color-mix(in srgb, var(${tokenPrefix}-default-color) 24%, transparent)`,
      text: isBase ? 'var(--text-color)' : `var(${tokenPrefix}-strong-color)`,
      muted: isBase
        ? 'color-mix(in srgb, var(--text-color) 68%, transparent)'
        : `color-mix(in srgb, var(${tokenPrefix}-strong-color) 72%, transparent)`,
    },
  };

  return map[variant];
};

export const getHansKanbanStyleVars = ({
  columnMinWidth,
  boardMinHeight,
}: {
  columnMinWidth: string;
  boardMinHeight: string;
}): HansKanbanStyleVars => ({
  '--hans-kanban-column-min-width': columnMinWidth,
  '--hans-kanban-board-min-height': boardMinHeight,
});

export const getHansKanbanSurfaceStyleVars = ({
  color,
  variant,
}: HansKanbanSurfaceStyleArgs): HansKanbanSurfaceStyleVars => {
  const resolved = createSurfaceVariantMap({ color, variant });

  return {
    '--hans-kanban-surface-bg': resolved.bg,
    '--hans-kanban-surface-border': resolved.border,
    '--hans-kanban-surface-text': resolved.text,
    '--hans-kanban-surface-muted': resolved.muted,
  };
};

export const getHansKanbanColumnSurfaceStyle = ({
  color = 'base',
  variant = 'outline',
}: HansKanbanColumnSurfaceStyleArgs): HansKanbanSurfaceStyleVars =>
  getHansKanbanSurfaceStyleVars({
    color,
    variant,
  });

export const groupHansKanbanItems = (
  columns: HansKanbanColumnData[],
  items: HansKanbanItemData[],
): HansKanbanGroupedItems => {
  const groupedItems = columns.reduce<HansKanbanGroupedItems>((acc, column) => {
    acc[column.id] = [];
    return acc;
  }, {});

  items.forEach((item) => {
    if (!groupedItems[item.columnId]) return;
    groupedItems[item.columnId].push(item);
  });

  return groupedItems;
};

export const getHansKanbanDropIndex = ({
  clientY,
  itemTop,
  itemHeight,
  currentIndex,
}: {
  clientY: number;
  itemTop: number;
  itemHeight: number;
  currentIndex: number;
}) => {
  const middle = itemTop + itemHeight / 2;
  return clientY >= middle ? currentIndex + 1 : currentIndex;
};

export const moveHansKanbanItem = ({
  columns,
  items,
  activeItemId,
  sourceColumnId,
  targetColumnId,
  targetIndex,
}: HansKanbanMoveArgs): HansKanbanItemData[] => {
  const grouped = groupHansKanbanItems(columns, items);
  const sourceItems = [...(grouped[sourceColumnId] ?? [])];
  const targetItems =
    sourceColumnId === targetColumnId
      ? sourceItems
      : [...(grouped[targetColumnId] ?? [])];

  const sourceIndex = sourceItems.findIndex((item) => item.id === activeItemId);
  if (sourceIndex < 0) return items;

  const rawTargetIndex = targetIndex;
  const [movedItem] = sourceItems.splice(sourceIndex, 1);

  const safeTargetIndex = Math.max(
    0,
    Math.min(rawTargetIndex, targetItems.length),
  );
  const adjustedTargetIndex =
    sourceColumnId === targetColumnId
      ? Math.max(
          0,
          Math.min(
            sourceIndex < rawTargetIndex ? rawTargetIndex - 1 : rawTargetIndex,
            targetItems.length,
          ),
        )
      : safeTargetIndex;

  const nextItem = {
    ...movedItem,
    columnId: targetColumnId,
  };

  targetItems.splice(adjustedTargetIndex, 0, nextItem);

  const nextGrouped = {
    ...grouped,
    [sourceColumnId]:
      sourceColumnId === targetColumnId ? targetItems : sourceItems,
    [targetColumnId]: targetItems,
  };

  return columns.flatMap((column) => nextGrouped[column.id]);
};

export const createHansKanbanMoveResult = ({
  columns,
  items,
  dragState,
}: HansKanbanMoveResultArgs): HansKanbanMoveResult => {
  const nextItems = moveHansKanbanItem({
    columns,
    items,
    activeItemId: dragState.activeItemId,
    sourceColumnId: dragState.sourceColumnId,
    targetColumnId: dragState.targetColumnId,
    targetIndex: dragState.targetIndex,
  });

  const item = nextItems.find(
    (nextItem) => nextItem.id === dragState.activeItemId,
  ) as HansKanbanItemData;

  const moveEvent: HansKanbanMoveEvent = {
    item,
    fromColumnId: dragState.sourceColumnId,
    toColumnId: dragState.targetColumnId,
    fromIndex: dragState.sourceIndex,
    toIndex: dragState.targetIndex,
    nextItems,
  };

  return {
    nextItems,
    moveEvent,
  };
};

export const getHansKanbanControlledItems = ({
  isControlled,
  items,
  internalItems,
}: {
  isControlled: boolean;
  items: HansKanbanItemData[] | undefined;
  internalItems: HansKanbanItemData[];
}) => (isControlled ? (items as HansKanbanItemData[]) : internalItems);

export const getHansKanbanColumnViewState = ({
  dragAndDrop,
  dragState,
  columnId,
  columnItemsLength,
  color,
  variant,
}: HansKanbanColumnViewStateArgs) => ({
  columnItemsLength,
  isDragOver: Boolean(dragAndDrop && dragState?.targetColumnId === columnId),
  showDropAtEnd: Boolean(
    dragAndDrop &&
      dragState?.targetColumnId === columnId &&
      dragState.targetIndex === columnItemsLength,
  ),
  style: getHansKanbanColumnSurfaceStyle({
    color,
    variant,
  }),
});

export const getHansKanbanItemViewState = ({
  dragState,
  columnId,
  itemId,
  itemIndex,
}: HansKanbanItemViewStateArgs) => ({
  isDragging: dragState?.activeItemId === itemId,
  showDropIndicator:
    dragState?.targetColumnId === columnId && dragState.targetIndex === itemIndex,
});

export const getHansKanbanColumnDragState = ({
  dragState,
  columnId,
  columnItemsLength,
}: HansKanbanColumnDragStateArgs): HansKanbanDragState => ({
  ...dragState,
  targetColumnId: columnId,
  targetIndex: columnItemsLength,
});

export const getHansKanbanNextColumnDragState = ({
  dragAndDrop,
  dragState,
  columnId,
  columnItemsLength,
}: HansKanbanNextColumnDragStateArgs): HansKanbanDragState | null => {
  if (!dragAndDrop || !dragState) return null;

  return getHansKanbanColumnDragState({
    dragState,
    columnId,
    columnItemsLength,
  });
};

export const getHansKanbanDropState = ({
  dragState,
  columnId,
  targetIndex,
}: HansKanbanDropStateArgs): HansKanbanDragState => ({
  ...dragState,
  targetColumnId: columnId,
  targetIndex,
});

export const getHansKanbanNextDropState = ({
  dragAndDrop,
  dragState,
  columnId,
  targetIndex,
}: HansKanbanNextDropStateArgs): HansKanbanDragState | null => {
  if (!dragAndDrop || !dragState) return null;

  return getHansKanbanDropState({
    dragState,
    columnId,
    targetIndex,
  });
};

export const getHansKanbanResolvedDropTargetIndex = ({
  dragState,
  columnId,
  event,
  fallbackTargetIndex,
  itemIndex,
}: {
  dragState: HansKanbanDragState | null;
  columnId: string;
  event: React.DragEvent<HTMLElement>;
  fallbackTargetIndex: number;
  itemIndex?: number;
}) => {
  if (typeof itemIndex !== 'number') {
    return dragState?.targetColumnId === columnId
      ? dragState.targetIndex
      : fallbackTargetIndex;
  }

  if (typeof event.clientY !== 'number') {
    return dragState?.targetColumnId === columnId
      ? dragState.targetIndex
      : fallbackTargetIndex;
  }

  const rect = event.currentTarget.getBoundingClientRect();

  return getHansKanbanDropIndex({
    clientY: event.clientY,
    itemTop: rect.top,
    itemHeight: rect.height,
    currentIndex: itemIndex,
  });
};

export const createHansKanbanItemDragState = ({
  itemId,
  columnId,
  itemIndex,
}: HansKanbanItemDragStateArgs): HansKanbanDragState => ({
  activeItemId: itemId,
  sourceColumnId: columnId,
  sourceIndex: itemIndex,
  targetColumnId: columnId,
  targetIndex: itemIndex,
});

export const getHansKanbanNextItemDragStartState = ({
  dragAndDrop,
  itemId,
  columnId,
  itemIndex,
}: HansKanbanNextItemDragStartStateArgs): HansKanbanDragState | null => {
  if (!dragAndDrop) return null;

  return createHansKanbanItemDragState({
    itemId,
    columnId,
    itemIndex,
  });
};

export const getHansKanbanItemDragOverState = ({
  dragState,
  columnId,
  itemIndex,
  clientY,
  itemTop,
  itemHeight,
}: HansKanbanItemDragOverStateArgs): HansKanbanDragState => ({
  ...dragState,
  targetColumnId: columnId,
  targetIndex: getHansKanbanDropIndex({
    clientY,
    itemTop,
    itemHeight,
    currentIndex: itemIndex,
  }),
});

export const getHansKanbanNextItemDragOverState = ({
  dragAndDrop,
  dragState,
  columnId,
  itemIndex,
  clientY,
  itemTop,
  itemHeight,
}: HansKanbanNextItemDragOverStateArgs): HansKanbanDragState | null => {
  if (!dragAndDrop || !dragState) return null;

  return getHansKanbanItemDragOverState({
    dragState,
    columnId,
    itemIndex,
    clientY,
    itemTop,
    itemHeight,
  });
};

export const handleHansKanbanDragEnd = ({
  dragStateRef,
  setDragState,
}: HansKanbanHandleDragEndArgs) => {
  dragStateRef.current = null;
  setDragState(null);
};

export const handleHansKanbanCommitMove = ({
  columns,
  items,
  dragState,
  isControlled,
  setInternalItems,
  onItemsChange,
  onMoveItem,
}: HansKanbanHandleCommitMoveArgs) => {
  const { nextItems, moveEvent } = createHansKanbanMoveResult({
    columns,
    items,
    dragState,
  });

  if (!isControlled) setInternalItems(nextItems);
  onItemsChange?.(nextItems);
  onMoveItem?.(moveEvent);
};

export const handleHansKanbanColumnDragOver = ({
  dragAndDrop,
  dragStateRef,
  columnId,
  columnItemsLength,
  setDragState,
  event,
}: HansKanbanHandleColumnDragOverArgs) => {
  const nextDragState = getHansKanbanNextColumnDragState({
    dragAndDrop,
    dragState: dragStateRef.current,
    columnId,
    columnItemsLength,
  });

  if (!nextDragState) return;

  event.preventDefault();
  dragStateRef.current = nextDragState;
  setDragState(nextDragState);
};

export const handleHansKanbanDrop = ({
  dragAndDrop,
  dragStateRef,
  columnId,
  fallbackTargetIndex,
  itemIndex,
  commitMove,
  setDragState,
  event,
}: HansKanbanHandleDropArgs) => {
  const currentDragState = dragStateRef.current;
  const targetIndex = getHansKanbanResolvedDropTargetIndex({
    dragState: currentDragState,
    columnId,
    event,
    fallbackTargetIndex,
    itemIndex,
  });
  const nextDragState = getHansKanbanNextDropState({
    dragAndDrop,
    dragState: currentDragState,
    columnId,
    targetIndex,
  });

  if (!nextDragState) return;

  event.preventDefault();
  event.stopPropagation();
  commitMove(nextDragState);
  dragStateRef.current = null;
  setDragState(null);
};

export const handleHansKanbanItemDragStart = ({
  dragAndDrop,
  itemId,
  columnId,
  itemIndex,
  dragStateRef,
  setDragState,
  event,
}: HansKanbanHandleItemDragStartArgs) => {
  const nextDragState = getHansKanbanNextItemDragStartState({
    dragAndDrop,
    itemId,
    columnId,
    itemIndex,
  });

  if (!nextDragState) return;

  event.dataTransfer.effectAllowed = 'move';
  dragStateRef.current = nextDragState;
  setDragState(nextDragState);
};

export const handleHansKanbanItemDragOver = ({
  dragAndDrop,
  dragStateRef,
  columnId,
  itemIndex,
  setDragState,
  event,
}: HansKanbanHandleItemDragOverArgs) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const nextDragState = getHansKanbanNextItemDragOverState({
    dragAndDrop,
    dragState: dragStateRef.current,
    columnId,
    itemIndex,
    clientY: event.clientY,
    itemTop: rect.top,
    itemHeight: rect.height,
  });

  if (!nextDragState) return;

  event.preventDefault();
  event.stopPropagation();
  dragStateRef.current = nextDragState;
  setDragState(nextDragState);
};
