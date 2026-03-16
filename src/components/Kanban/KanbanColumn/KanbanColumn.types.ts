import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { HansKanbanColumnData } from '../Kanban.types';

const HansKanbanColumnSchema = {
  column: { type: 'custom', ref: {} as HansKanbanColumnData },
  itemCount: 'number',
  emptyColumnText: 'string',
  showColumnCount: 'boolean',
  isDragOver: 'boolean',
  showDropAtEnd: 'boolean',
  customClasses: 'string',
} as const;

export type HansKanbanColumnProps = InferPropsFromSchema<
  typeof HansKanbanColumnSchema
> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    children?: React.ReactNode;
  };

export const HansKanbanColumnPropsList = createPropsList(HansKanbanColumnSchema);
