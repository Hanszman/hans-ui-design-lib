import React from 'react';
import { HansCard } from '../../Card/Card';
import type { HansKanbanItemProps } from './KanbanItem.types';

export const HansKanbanItem = React.memo((props: HansKanbanItemProps) => {
  const {
    item,
    draggable = true,
    isDragging = false,
    showDropIndicator = false,
    customClasses = '',
    ...rest
  } = props;

  return (
    <div
      className={`
        hans-kanban-item
        ${isDragging ? 'hans-kanban-item-dragging' : ''}
        ${showDropIndicator ? 'hans-kanban-item-drop-indicator' : ''}
        ${customClasses}
      `}
      draggable={draggable}
      data-testid={`hans-kanban-item-${item?.id}`}
      {...rest}
    >
      <HansCard
        title={item?.title}
        description={item?.description}
        avatarSrc={item?.avatarSrc}
        avatarAlt={item?.avatarAlt || item?.title || 'Kanban card avatar'}
        imageSrc={item?.imageSrc}
        imageAlt={item?.imageAlt || item?.title || 'Kanban card image'}
        cardLayout={item?.cardLayout}
        cardColor={item?.cardColor ?? 'base'}
        cardVariant={item?.cardVariant ?? 'neutral'}
        cardSize="medium"
        customClasses="hans-kanban-item-card"
      />
    </div>
  );
});

HansKanbanItem.displayName = 'HansKanbanItem';
