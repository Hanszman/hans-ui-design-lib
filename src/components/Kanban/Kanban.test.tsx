import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HansKanban } from './Kanban';

vi.mock('../Loading/Loading', () => ({
  HansLoading: ({
    ariaLabel,
    loadingType,
  }: {
    ariaLabel?: string;
    loadingType?: string;
  }) => (
    <span
      data-testid="mock-kanban-loading"
      aria-label={ariaLabel}
      data-type={loadingType}
    />
  ),
}));

vi.mock('./KanbanItem/KanbanItem', () => ({
  HansKanbanItem: ({
    item,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    onClick,
    isDragging,
    showDropIndicator,
  }: {
    item: { id: string; title: string };
    onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd?: () => void;
    onClick?: () => void;
    isDragging?: boolean;
    showDropIndicator?: boolean;
  }) => (
    <div
      data-testid={`kanban-item-${item.id}`}
      draggable
      data-dragging={String(isDragging)}
      data-indicator={String(showDropIndicator)}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      {item.title}
    </div>
  ),
}));

const columns = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'Doing' },
];

const items = [
  { id: 'item-1', columnId: 'todo', title: 'First item' },
  { id: 'item-2', columnId: 'todo', title: 'Second item' },
  { id: 'item-3', columnId: 'doing', title: 'Third item' },
];

describe('HansKanban', () => {
  it('Should render columns items and empty states', () => {
    render(
      <HansKanban
        columns={[...columns, { id: 'done', title: 'Done' }]}
        items={items}
        emptyColumnText="Nothing here"
      />,
    );

    expect(screen.getByText('To do')).toBeInTheDocument();
    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('Should move items between columns and notify listeners', () => {
    const onItemsChange = vi.fn();
    const onMoveItem = vi.fn();
    const dataTransfer = { effectAllowed: 'move' };

    render(
      <HansKanban
        columns={columns}
        items={items}
        onItemsChange={onItemsChange}
        onMoveItem={onMoveItem}
      />,
    );

    const firstItem = screen.getByTestId('kanban-item-item-1');
    const thirdItem = screen.getByTestId('kanban-item-item-3');

    Object.defineProperty(thirdItem, 'getBoundingClientRect', {
      value: () => ({ top: 100, height: 100 }),
    });

    fireEvent.dragStart(firstItem, { dataTransfer });
    fireEvent.dragOver(thirdItem, { clientY: 170 });
    fireEvent.drop(thirdItem);

    expect(onItemsChange).toHaveBeenCalledTimes(1);
    expect(
      onItemsChange.mock.calls[0][0].map((item: { id: string }) => item.id),
    ).toEqual(['item-2', 'item-3', 'item-1']);
    expect(onMoveItem).toHaveBeenCalledWith(
      expect.objectContaining({
        fromColumnId: 'todo',
        toColumnId: 'doing',
      }),
    );
  });

  it('Should support uncontrolled mode item clicks and loading state', () => {
    const onItemClick = vi.fn();

    const { rerender } = render(
      <HansKanban
        columns={columns}
        defaultItems={items}
        onItemClick={onItemClick}
      />,
    );

    fireEvent.click(screen.getByTestId('kanban-item-item-2'));
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'item-2' }),
    );

    rerender(<HansKanban columns={columns} loading loadingColor="primary" />);

    expect(screen.getByTestId('mock-kanban-loading')).toHaveAttribute(
      'aria-label',
      'Loading kanban board',
    );
    expect(screen.getByTestId('mock-kanban-loading')).toHaveAttribute(
      'data-type',
      'skeleton',
    );
  });

  it('Should support dropping into an empty column and clearing drag state on drag end', () => {
    const dataTransfer = { effectAllowed: 'move' };

    render(
      <HansKanban
        columns={[...columns, { id: 'done', title: 'Done' }]}
        defaultItems={items}
      />,
    );

    const firstItem = screen.getByTestId('kanban-item-item-1');
    const doneColumn = screen.getByTestId('hans-kanban-column-done');

    fireEvent.dragStart(firstItem, { dataTransfer });
    fireEvent.dragOver(doneColumn);
    fireEvent.drop(doneColumn);

    expect(doneColumn).toHaveTextContent('First item');

    fireEvent.dragStart(screen.getByTestId('kanban-item-item-2'), { dataTransfer });
    fireEvent.dragEnd(screen.getByTestId('kanban-item-item-2'));

    expect(screen.getByTestId('kanban-item-item-2')).toHaveAttribute(
      'data-dragging',
      'false',
    );
  });

  it('Should ignore drag updates when drag and drop is disabled', () => {
    const onItemsChange = vi.fn();
    const dataTransfer = { effectAllowed: 'move' };

    render(
      <HansKanban
        columns={columns}
        items={items}
        dragAndDrop={false}
        onItemsChange={onItemsChange}
      />,
    );

    fireEvent.dragStart(screen.getByTestId('kanban-item-item-1'), { dataTransfer });
    fireEvent.dragOver(screen.getByTestId('kanban-item-item-3'), { clientY: 170 });
    fireEvent.drop(screen.getByTestId('kanban-item-item-3'));

    expect(onItemsChange).not.toHaveBeenCalled();
  });

  it('Should use the fallback target index when dropping directly on another column', () => {
    const onItemsChange = vi.fn();
    const dataTransfer = { effectAllowed: 'move' };

    render(
      <HansKanban
        columns={[...columns, { id: 'done', title: 'Done' }]}
        items={items}
        onItemsChange={onItemsChange}
      />,
    );

    fireEvent.dragStart(screen.getByTestId('kanban-item-item-1'), { dataTransfer });
    fireEvent.drop(screen.getByTestId('hans-kanban-column-done'));

    expect(
      onItemsChange.mock.calls.at(-1)?.[0].map((item: { id: string }) => item.id),
    ).toEqual(['item-2', 'item-3', 'item-1']);
  });

  it('Should render an empty board when no columns are provided', () => {
    render(<HansKanban columns={[]} items={[]} />);

    expect(document.querySelector('.hans-kanban-board')?.children).toHaveLength(0);
  });
});
