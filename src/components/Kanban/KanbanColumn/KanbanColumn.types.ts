import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Color } from '../../../types/Common.types';
import type { HansKanbanColumnData } from '../Kanban.types';

const HansKanbanColumnSchema = {
  column: { type: 'custom', ref: {} as HansKanbanColumnData },
  itemCount: 'number',
  emptyColumnText: 'string',
  showColumnCount: 'boolean',
  isDragOver: 'boolean',
  showDropAtEnd: 'boolean',
  loading: 'boolean',
  loadingColor: { type: 'custom', ref: {} as Color },
  loadingAriaLabel: 'string',
  customClasses: 'string',
} as const;

export type HansKanbanColumnProps = InferPropsFromSchema<
  typeof HansKanbanColumnSchema
> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    children?: React.ReactNode;
  };

export const HansKanbanColumnPropsList = createPropsList(HansKanbanColumnSchema);
