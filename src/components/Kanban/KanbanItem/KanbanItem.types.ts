import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Color } from '../../../types/Common.types';
import type { HansKanbanItemData } from '../Kanban.types';

const HansKanbanItemSchema = {
  item: {
    type: 'custom',
    ref: {} as HansKanbanItemData,
    webComponentType: 'property',
  },
  draggable: 'boolean',
  isDragging: 'boolean',
  showDropIndicator: 'boolean',
  loading: 'boolean',
  loadingColor: { type: 'custom', ref: {} as Color },
  loadingAriaLabel: 'string',
  customClasses: 'string',
} as const;

export type HansKanbanItemProps = InferPropsFromSchema<
  typeof HansKanbanItemSchema
> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

export const HansKanbanItemPropsList = createPropsList(HansKanbanItemSchema);
