import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HansKanbanColumn } from './KanbanColumn';

describe('HansKanbanColumn', () => {
  it('Should render column copy count and empty state', () => {
    render(
      <HansKanbanColumn
        column={{
          id: 'todo',
          title: 'To do',
          description: 'Incoming work',
        }}
        itemCount={0}
        emptyColumnText="No items here"
      />,
    );

    expect(screen.getByText('To do')).toBeInTheDocument();
    expect(screen.getByText('Incoming work')).toBeInTheDocument();
    expect(screen.getByText('No items here')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('Should hide count and render children when items are present', () => {
    render(
      <HansKanbanColumn
        column={{ id: 'doing', title: 'Doing' }}
        itemCount={2}
        showColumnCount={false}
      >
        <div>Child item</div>
      </HansKanbanColumn>,
    );

    expect(screen.getByText('Child item')).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });
});
