import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  createHansKanbanItemDragState,
  getHansKanbanColumnSurfaceStyle,
  getHansKanbanColumnDragState,
  getHansKanbanColumnViewState,
  getHansKanbanControlledItems,
  getHansKanbanDropIndex,
  getHansKanbanResolvedDropTargetIndex,
  getHansKanbanDropState,
  getHansKanbanItemDragOverState,
  getHansKanbanItemViewState,
  getHansKanbanNextColumnDragState,
  getHansKanbanNextDropState,
  getHansKanbanNextItemDragOverState,
  getHansKanbanNextItemDragStartState,
  getHansKanbanStyleVars,
  getHansKanbanSurfaceStyleVars,
  handleHansKanbanColumnDragOver,
  handleHansKanbanCommitMove,
  handleHansKanbanDragEnd,
  handleHansKanbanDrop,
  handleHansKanbanItemDragOver,
  handleHansKanbanItemDragStart,
  groupHansKanbanItems,
  createHansKanbanMoveResult,
  moveHansKanbanItem,
} from './Kanban.helper';
import type {
  HansKanbanColumnData,
  HansKanbanItemData,
} from '../Kanban.types';

const columns: HansKanbanColumnData[] = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
];

const items: HansKanbanItemData[] = [
  { id: 'item-1', columnId: 'todo', title: 'Backlog refinement' },
  { id: 'item-2', columnId: 'todo', title: 'Homepage review' },
  { id: 'item-3', columnId: 'doing', title: 'Modal polish' },
];

describe('Kanban.helper', () => {
  it('Should create board and surface style variables', () => {
    expect(
      getHansKanbanStyleVars({
        columnMinWidth: '20rem',
        boardMinHeight: '30rem',
      }),
    ).toEqual({
      '--hans-kanban-column-min-width': '20rem',
      '--hans-kanban-board-min-height': '30rem',
    });

    expect(
      getHansKanbanSurfaceStyleVars({
        color: 'primary',
        variant: 'outline',
      })['--hans-kanban-surface-border'],
    ).toBe('var(--primary-default-color)');
    expect(
      getHansKanbanColumnSurfaceStyle({
        color: 'success',
        variant: 'transparent',
      })['--hans-kanban-surface-bg'],
    ).toBe('color-mix(in srgb, var(--white) 74%, transparent)');
    expect(
      getHansKanbanColumnSurfaceStyle({})['--hans-kanban-surface-border'],
    ).toBe('var(--base-default-color)');

    expect(
      getHansKanbanColumnViewState({
        dragAndDrop: true,
        dragState: {
          activeItemId: 'item-1',
          sourceColumnId: 'todo',
          sourceIndex: 0,
          targetColumnId: 'doing',
          targetIndex: 1,
        },
        columnId: 'doing',
        columnItemsLength: 1,
        color: 'primary',
        variant: 'outline',
      }),
    ).toEqual({
      columnItemsLength: 1,
      isDragOver: true,
      showDropAtEnd: true,
      style: {
        '--hans-kanban-surface-bg': 'var(--white)',
        '--hans-kanban-surface-border': 'var(--primary-default-color)',
        '--hans-kanban-surface-text': 'var(--primary-strong-color)',
        '--hans-kanban-surface-muted':
          'color-mix(in srgb, var(--primary-strong-color) 72%, transparent)',
      },
    });
  });

  it('Should group items by their column', () => {
    const grouped = groupHansKanbanItems(columns, [
      ...items,
      {
        id: 'item-unknown',
        columnId: 'unknown',
        title: 'Ignored item',
      },
    ]);

    expect(grouped.todo).toHaveLength(2);
    expect(grouped.doing[0]?.title).toBe('Modal polish');
    expect(grouped.done).toEqual([]);
  });

  it('Should calculate drop indexes based on the hover position', () => {
    expect(
      getHansKanbanDropIndex({
        clientY: 120,
        itemTop: 100,
        itemHeight: 80,
        currentIndex: 2,
      }),
    ).toBe(2);

    expect(
      getHansKanbanDropIndex({
        clientY: 170,
        itemTop: 100,
        itemHeight: 80,
        currentIndex: 2,
      }),
    ).toBe(3);

    expect(
      getHansKanbanResolvedDropTargetIndex({
        dragState: {
          activeItemId: 'item-1',
          sourceColumnId: 'todo',
          sourceIndex: 0,
          targetColumnId: 'doing',
          targetIndex: 2,
        },
        columnId: 'doing',
        fallbackTargetIndex: 0,
        itemIndex: 1,
        event: {
          clientY: undefined,
          currentTarget: {
            getBoundingClientRect: () => ({
              top: 100,
              height: 80,
            }),
          },
        } as unknown as React.DragEvent<HTMLElement>,
      }),
    ).toBe(2);
  });

  it('Should move items between columns and reorder within the same column', () => {
    const movedAcrossColumns = moveHansKanbanItem({
      columns,
      items,
      activeItemId: 'item-2',
      sourceColumnId: 'todo',
      targetColumnId: 'doing',
      targetIndex: 1,
    });

    expect(movedAcrossColumns.map((item) => item.id)).toEqual([
      'item-1',
      'item-3',
      'item-2',
    ]);
    expect(movedAcrossColumns[2]?.columnId).toBe('doing');

    const reordered = moveHansKanbanItem({
      columns,
      items,
      activeItemId: 'item-1',
      sourceColumnId: 'todo',
      targetColumnId: 'todo',
      targetIndex: 2,
    });

    expect(reordered.map((item) => item.id)).toEqual([
      'item-2',
      'item-1',
      'item-3',
    ]);
  });

  it('Should keep the same array when the moved item cannot be found and support transparent base surfaces', () => {
    const untouched = moveHansKanbanItem({
      columns,
      items,
      activeItemId: 'missing-item',
      sourceColumnId: 'todo',
      targetColumnId: 'done',
      targetIndex: 0,
    });

    expect(untouched).toEqual(items);
    expect(
      getHansKanbanSurfaceStyleVars({
        color: 'base',
        variant: 'transparent',
      })['--hans-kanban-surface-text'],
    ).toBe('var(--text-color)');
    expect(
      getHansKanbanSurfaceStyleVars({
        color: 'success',
        variant: 'strong',
      })['--hans-kanban-surface-bg'],
    ).toBe('var(--success-strong-color)');
    expect(
      getHansKanbanSurfaceStyleVars({
        color: 'base',
        variant: 'neutral',
      })['--hans-kanban-surface-text'],
    ).toBe('var(--text-color)');
    expect(
      getHansKanbanSurfaceStyleVars({
        color: 'danger',
        variant: 'default',
      })['--hans-kanban-surface-text'],
    ).toBe('var(--white)');
  });

  it('Should support moving later items upward within the same column', () => {
    const reordered = moveHansKanbanItem({
      columns,
      items,
      activeItemId: 'item-2',
      sourceColumnId: 'todo',
      targetColumnId: 'todo',
      targetIndex: 0,
    });

    expect(reordered.map((item) => item.id)).toEqual([
      'item-2',
      'item-1',
      'item-3',
    ]);
  });

  it('Should keep items intact when source or target columns are missing from the grouped map', () => {
    const untouched = moveHansKanbanItem({
      columns,
      items,
      activeItemId: 'item-1',
      sourceColumnId: 'missing-source',
      targetColumnId: 'missing-target',
      targetIndex: 0,
    });

    expect(untouched).toEqual(items);
  });

  it('Should resolve controlled items and create move event payloads', () => {
    expect(
      getHansKanbanControlledItems({
        isControlled: true,
        items,
        internalItems: [],
      }),
    ).toEqual(items);
    expect(
      getHansKanbanControlledItems({
        isControlled: false,
        items,
        internalItems: [items[0] as HansKanbanItemData],
      }),
    ).toEqual([items[0]]);

    const moveResult = createHansKanbanMoveResult({
      columns,
      items,
      dragState: {
        activeItemId: 'item-2',
        sourceColumnId: 'todo',
        sourceIndex: 1,
        targetColumnId: 'doing',
        targetIndex: 1,
      },
    });

    expect(moveResult.nextItems.map((item) => item.id)).toEqual([
      'item-1',
      'item-3',
      'item-2',
    ]);
    expect(moveResult.moveEvent.fromColumnId).toBe('todo');
    expect(moveResult.moveEvent.toColumnId).toBe('doing');
    expect(moveResult.moveEvent.item.id).toBe('item-2');
  });

  it('Should derive drag states for columns, items and drops', () => {
    const initialDragState = createHansKanbanItemDragState({
      itemId: 'item-1',
      columnId: 'todo',
      itemIndex: 0,
    });

    expect(initialDragState).toEqual({
      activeItemId: 'item-1',
      sourceColumnId: 'todo',
      sourceIndex: 0,
      targetColumnId: 'todo',
      targetIndex: 0,
    });

    expect(
      getHansKanbanColumnDragState({
        dragState: initialDragState,
        columnId: 'doing',
        columnItemsLength: 2,
      }),
    ).toEqual({
      ...initialDragState,
      targetColumnId: 'doing',
      targetIndex: 2,
    });

    expect(
      getHansKanbanDropState({
        dragState: initialDragState,
        columnId: 'todo',
        targetIndex: 3,
      }),
    ).toEqual({
      ...initialDragState,
      targetColumnId: 'todo',
      targetIndex: 3,
    });

    expect(
      getHansKanbanDropState({
        dragState: initialDragState,
        columnId: 'done',
        targetIndex: 1,
      }),
    ).toEqual({
      ...initialDragState,
      targetColumnId: 'done',
      targetIndex: 1,
    });

    expect(
      getHansKanbanItemDragOverState({
        dragState: initialDragState,
        columnId: 'doing',
        itemIndex: 0,
        clientY: 80,
        itemTop: 20,
        itemHeight: 100,
      }),
    ).toEqual({
      ...initialDragState,
        targetColumnId: 'doing',
        targetIndex: 1,
      });

    expect(
      getHansKanbanItemViewState({
        dragState: initialDragState,
        columnId: 'todo',
        itemId: 'item-1',
        itemIndex: 0,
      }),
    ).toEqual({
      isDragging: true,
      showDropIndicator: true,
    });
  });

  it('Should gate drag state updates when drag and drop is disabled or missing state', () => {
    expect(
      getHansKanbanNextItemDragStartState({
        dragAndDrop: false,
        itemId: 'item-1',
        columnId: 'todo',
        itemIndex: 0,
      }),
    ).toBeNull();

    const initialDragState = createHansKanbanItemDragState({
      itemId: 'item-1',
      columnId: 'todo',
      itemIndex: 0,
    });

    expect(
      getHansKanbanNextItemDragStartState({
        dragAndDrop: true,
        itemId: 'item-1',
        columnId: 'todo',
        itemIndex: 0,
      }),
    ).toEqual(initialDragState);

    expect(
      getHansKanbanNextColumnDragState({
        dragAndDrop: false,
        dragState: initialDragState,
        columnId: 'doing',
        columnItemsLength: 1,
      }),
    ).toBeNull();

    expect(
      getHansKanbanNextColumnDragState({
        dragAndDrop: true,
        dragState: null,
        columnId: 'doing',
        columnItemsLength: 1,
      }),
    ).toBeNull();

    expect(
      getHansKanbanNextColumnDragState({
        dragAndDrop: true,
        dragState: initialDragState,
        columnId: 'doing',
        columnItemsLength: 1,
      }),
    ).toEqual({
      ...initialDragState,
      targetColumnId: 'doing',
      targetIndex: 1,
    });

    expect(
      getHansKanbanNextDropState({
        dragAndDrop: false,
        dragState: initialDragState,
        columnId: 'done',
        targetIndex: 2,
      }),
    ).toBeNull();

    expect(
      getHansKanbanNextDropState({
        dragAndDrop: true,
        dragState: null,
        columnId: 'done',
        targetIndex: 2,
      }),
    ).toBeNull();

    expect(
      getHansKanbanNextDropState({
        dragAndDrop: true,
        dragState: initialDragState,
        columnId: 'done',
        targetIndex: 2,
      }),
    ).toEqual({
      ...initialDragState,
      targetColumnId: 'done',
      targetIndex: 2,
    });

    expect(
      getHansKanbanNextItemDragOverState({
        dragAndDrop: false,
        dragState: initialDragState,
        columnId: 'doing',
        itemIndex: 1,
        clientY: 120,
        itemTop: 60,
        itemHeight: 80,
      }),
    ).toBeNull();

    expect(
      getHansKanbanNextItemDragOverState({
        dragAndDrop: true,
        dragState: null,
        columnId: 'doing',
        itemIndex: 1,
        clientY: 120,
        itemTop: 60,
        itemHeight: 80,
      }),
    ).toBeNull();

    expect(
      getHansKanbanNextItemDragOverState({
        dragAndDrop: true,
        dragState: initialDragState,
        columnId: 'doing',
        itemIndex: 1,
        clientY: 120,
        itemTop: 60,
        itemHeight: 80,
      }),
    ).toEqual({
      ...initialDragState,
        targetColumnId: 'doing',
        targetIndex: 2,
      });
  });

  it('Should handle drag and drop side effects through helper handlers', () => {
    const setDragState = vi.fn();
    const setInternalItems = vi.fn();
    const onItemsChange = vi.fn();
    const onMoveItem = vi.fn();
    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();
    const event = {
      preventDefault,
      stopPropagation,
      dataTransfer: { effectAllowed: 'none' },
      currentTarget: {
        getBoundingClientRect: () => ({
          top: 100,
          height: 100,
        }),
      },
      clientY: 170,
    } as unknown as React.DragEvent<HTMLDivElement>;
    const baseDragState = createHansKanbanItemDragState({
      itemId: 'item-1',
      columnId: 'todo',
      itemIndex: 0,
    });
    const dragStateRef = {
      current: null,
    } as React.MutableRefObject<ReturnType<typeof createHansKanbanItemDragState> | null>;

    handleHansKanbanItemDragStart({
      dragAndDrop: true,
      itemId: 'item-1',
      columnId: 'todo',
      itemIndex: 0,
      dragStateRef,
      setDragState,
      event,
    });

    expect(event.dataTransfer.effectAllowed).toBe('move');
    expect(dragStateRef.current).toEqual(baseDragState);
    expect(setDragState).toHaveBeenCalledWith(baseDragState);

    handleHansKanbanColumnDragOver({
      dragAndDrop: true,
      dragStateRef,
      columnId: 'doing',
      columnItemsLength: 1,
      setDragState,
      event: event as unknown as React.DragEvent<HTMLElement>,
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(setDragState).toHaveBeenLastCalledWith({
      ...baseDragState,
      targetColumnId: 'doing',
      targetIndex: 1,
    });

    handleHansKanbanItemDragOver({
      dragAndDrop: true,
      dragStateRef,
      columnId: 'doing',
      itemIndex: 1,
      setDragState,
      event,
    });

    expect(stopPropagation).toHaveBeenCalled();
    expect(setDragState).toHaveBeenLastCalledWith({
      ...baseDragState,
      targetColumnId: 'doing',
      targetIndex: 2,
    });

    const commitMove = vi.fn();

    handleHansKanbanDrop({
      dragAndDrop: true,
      dragStateRef,
      columnId: 'done',
      fallbackTargetIndex: 0,
      commitMove,
      setDragState,
      event: event as unknown as React.DragEvent<HTMLElement>,
    });

    expect(commitMove).toHaveBeenCalledWith({
      ...baseDragState,
      targetColumnId: 'done',
      targetIndex: 0,
    });
    expect(dragStateRef.current).toBeNull();
    expect(setDragState).toHaveBeenLastCalledWith(null);

    handleHansKanbanCommitMove({
      columns,
      items,
      dragState: {
        activeItemId: 'item-1',
        sourceColumnId: 'todo',
        sourceIndex: 0,
        targetColumnId: 'doing',
        targetIndex: 1,
      },
      isControlled: false,
      setInternalItems,
      onItemsChange,
      onMoveItem,
    });

    expect(setInternalItems).toHaveBeenCalled();
    expect(onItemsChange).toHaveBeenCalled();
    expect(onMoveItem).toHaveBeenCalled();

    dragStateRef.current = baseDragState;
    handleHansKanbanDragEnd({ dragStateRef, setDragState });
    expect(dragStateRef.current).toBeNull();
    expect(setDragState).toHaveBeenLastCalledWith(null);
  });
});
