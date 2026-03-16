import type { Color, Variant } from '../../../types/Common.types';
import type {
  HansKanbanColumnData,
  HansKanbanItemData,
} from '../Kanban.types';

export type HansKanbanGroupedItems = Record<string, HansKanbanItemData[]>;

export type HansKanbanDragState = {
  activeItemId: string;
  sourceColumnId: string;
  sourceIndex: number;
  targetColumnId: string;
  targetIndex: number;
};

export type HansKanbanMoveArgs = {
  columns: HansKanbanColumnData[];
  items: HansKanbanItemData[];
  activeItemId: string;
  sourceColumnId: string;
  targetColumnId: string;
  targetIndex: number;
};

export type HansKanbanSurfaceStyleArgs = {
  color: Color;
  variant: Variant;
};
