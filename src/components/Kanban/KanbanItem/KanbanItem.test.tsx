import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HansKanbanItem } from './KanbanItem';

const cardSpy = vi.fn();

vi.mock('../../Loading/Loading', () => ({
  HansLoading: ({ ariaLabel }: { ariaLabel?: string }) => (
    <span data-testid="mock-kanban-item-loading" aria-label={ariaLabel} />
  ),
}));

vi.mock('../../Card/Card', () => ({
  HansCard: (props: Record<string, unknown>) => {
    cardSpy(props);

    return (
      <div data-testid="mock-kanban-card">
        <span>{String(props.title ?? '')}</span>
        <span>{String(props.description ?? '')}</span>
      </div>
    );
  },
}));

describe('HansKanbanItem', () => {
  it('Should render card content and drag state classes', () => {
    cardSpy.mockClear();

    render(
      <HansKanbanItem
        item={{
          id: 'item-1',
          columnId: 'todo',
          title: 'Implement kanban',
          description: 'Manual drag and drop',
        }}
        isDragging
        showDropIndicator
      />,
    );

    expect(screen.getByText('Implement kanban')).toBeInTheDocument();
    expect(screen.getByText('Manual drag and drop')).toBeInTheDocument();
    expect(screen.getByTestId('hans-kanban-item-item-1')).toHaveClass(
      'hans-kanban-item-dragging',
      'hans-kanban-item-drop-indicator',
    );
    expect(cardSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        cardColor: 'base',
        cardVariant: 'neutral',
        imageAlt: 'Implement kanban',
      }),
    );
  });

  it('Should forward explicit card values to HansCard', () => {
    cardSpy.mockClear();

    render(
      <HansKanbanItem
        item={{
          id: 'item-2',
          columnId: 'review',
          title: 'Visual review',
          description: 'Image mode',
          imageSrc: 'https://image.test/review.png',
          imageAlt: 'Review image',
          avatarAlt: 'Reviewer avatar',
          cardLayout: 'image',
          cardColor: 'secondary',
          cardVariant: 'outline',
        }}
        draggable={false}
      />,
    );

    expect(screen.getByTestId('hans-kanban-item-item-2')).toHaveAttribute(
      'draggable',
      'false',
    );
    expect(cardSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        imageAlt: 'Review image',
        avatarAlt: 'Reviewer avatar',
        cardLayout: 'image',
        cardColor: 'secondary',
        cardVariant: 'outline',
      }),
    );
  });

  it('Should use the final fallback labels when title and alt values are empty', () => {
    cardSpy.mockClear();

    render(
      <HansKanbanItem
        item={{
          id: 'item-3',
          columnId: 'done',
          title: '',
          imageSrc: 'https://image.test/fallback.png',
        }}
      />,
    );

    expect(cardSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        avatarAlt: 'Kanban card avatar',
        imageAlt: 'Kanban card image',
      }),
    );
  });

  it('Should render skeleton loading when requested', () => {
    cardSpy.mockClear();

    render(
      <HansKanbanItem
        item={{
          id: 'item-4',
          columnId: 'todo',
          title: 'Loading item',
        }}
        loading
        loadingAriaLabel="Loading backlog item"
      />,
    );

    expect(screen.getByTestId('mock-kanban-item-loading')).toHaveAttribute(
      'aria-label',
      'Loading backlog item',
    );
    expect(cardSpy).not.toHaveBeenCalled();
  });
});
