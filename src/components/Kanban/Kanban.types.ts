import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color, Variant } from '../../types/Common.types';
import type { HansCardLayout } from '../Card/helpers/Card.helper.types';

export type HansKanbanColumnData = {
  id: string;
  title: string;
  description?: string;
  columnColor?: Color;
  columnVariant?: Variant;
};

export type HansKanbanItemData = {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  imageSrc?: string;
  imageAlt?: string;
  cardLayout?: HansCardLayout;
  cardColor?: Color;
  cardVariant?: Variant;
};

export type HansKanbanMoveEvent = {
  item: HansKanbanItemData;
  fromColumnId: string;
  toColumnId: string;
  fromIndex: number;
  toIndex: number;
  nextItems: HansKanbanItemData[];
};

const HansKanbanSchema = {
  columns: {
    type: 'custom',
    ref: {} as HansKanbanColumnData[],
    webComponentType: 'property',
  },
  items: {
    type: 'custom',
    ref: {} as HansKanbanItemData[],
    webComponentType: 'property',
  },
  defaultItems: {
    type: 'custom',
    ref: {} as HansKanbanItemData[],
    webComponentType: 'property',
  },
  boardLabel: 'string',
  emptyColumnText: 'string',
  customClasses: 'string',
  columnMinWidth: 'string',
  boardMinHeight: 'string',
  showColumnCounts: 'boolean',
  dragAndDrop: 'boolean',
  loading: 'boolean',
  loadingColor: { type: 'custom', ref: {} as Color },
  loadingAriaLabel: 'string',
} as const;

export type HansKanbanProps = InferPropsFromSchema<typeof HansKanbanSchema> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'color'> & {
    onItemsChange?: (items: HansKanbanItemData[]) => void;
    onMoveItem?: (event: HansKanbanMoveEvent) => void;
    onItemClick?: (item: HansKanbanItemData) => void;
  };

export const HansKanbanPropsList = createPropsList(HansKanbanSchema);
