import { describe, expect, it } from 'vitest';
import {
  getHansKanbanDropIndex,
  getHansKanbanStyleVars,
  getHansKanbanSurfaceStyleVars,
  groupHansKanbanItems,
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
});
