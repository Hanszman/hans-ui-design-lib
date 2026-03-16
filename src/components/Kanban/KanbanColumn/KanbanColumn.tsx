import React from 'react';
import type { HansKanbanColumnProps } from './KanbanColumn.types';

export const HansKanbanColumn = React.memo((props: HansKanbanColumnProps) => {
  const {
    column,
    itemCount = 0,
    emptyColumnText = 'Drop items here',
    showColumnCount = true,
    isDragOver = false,
    showDropAtEnd = false,
    customClasses = '',
    children,
    ...rest
  } = props;

  return (
    <section
      className={`
        hans-kanban-column
        ${isDragOver ? 'hans-kanban-column-drag-over' : ''}
        ${customClasses}
      `}
      data-testid={`hans-kanban-column-${column?.id}`}
      {...rest}
    >
      <header className="hans-kanban-column-header">
        <div className="hans-kanban-column-copy">
          <strong className="hans-kanban-column-title">{column?.title}</strong>
          {column?.description ? (
            <span className="hans-kanban-column-description">
              {column.description}
            </span>
          ) : null}
        </div>
        {showColumnCount ? (
          <span className="hans-kanban-column-count">{itemCount}</span>
        ) : null}
      </header>

      <div className="hans-kanban-column-body">
        {itemCount > 0 ? (
          children
        ) : (
          <span className="hans-kanban-column-empty">{emptyColumnText}</span>
        )}
        {showDropAtEnd ? (
          <span className="hans-kanban-column-drop-indicator" aria-hidden="true" />
        ) : null}
      </div>
    </section>
  );
});

HansKanbanColumn.displayName = 'HansKanbanColumn';
