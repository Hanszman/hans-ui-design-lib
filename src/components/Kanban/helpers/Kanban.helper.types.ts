import type { Color, Variant } from '../../../types/Common.types';
import type {
  HansKanbanColumnData,
  HansKanbanItemData,
  HansKanbanMoveEvent,
} from '../Kanban.types';
import type React from 'react';

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

export type HansKanbanStyleVars = React.CSSProperties & {
  '--hans-kanban-column-min-width': string;
  '--hans-kanban-board-min-height': string;
};

export type HansKanbanSurfaceStyleVars = React.CSSProperties & {
  '--hans-kanban-surface-bg': string;
  '--hans-kanban-surface-border': string;
  '--hans-kanban-surface-text': string;
  '--hans-kanban-surface-muted': string;
};

export type HansKanbanMoveResult = {
  nextItems: HansKanbanItemData[];
  moveEvent: HansKanbanMoveEvent;
};

export type HansKanbanMoveResultArgs = {
  columns: HansKanbanColumnData[];
  items: HansKanbanItemData[];
  dragState: HansKanbanDragState;
};

export type HansKanbanColumnDragStateArgs = {
  dragState: HansKanbanDragState;
  columnId: string;
  columnItemsLength: number;
};

export type HansKanbanDropStateArgs = {
  dragState: HansKanbanDragState;
  columnId: string;
  fallbackTargetIndex: number;
};

export type HansKanbanItemDragStateArgs = {
  itemId: string;
  columnId: string;
  itemIndex: number;
};

export type HansKanbanItemDragOverStateArgs = {
  dragState: HansKanbanDragState;
  columnId: string;
  itemIndex: number;
  clientY: number;
  itemTop: number;
  itemHeight: number;
};

export type HansKanbanDragGateArgs = {
  dragAndDrop: boolean;
  dragState: HansKanbanDragState | null;
};

export type HansKanbanColumnSurfaceStyleArgs = {
  color?: Color;
  variant?: Variant;
};

export type HansKanbanNextColumnDragStateArgs = HansKanbanDragGateArgs & {
  columnId: string;
  columnItemsLength: number;
};

export type HansKanbanNextDropStateArgs = HansKanbanDragGateArgs & {
  columnId: string;
  fallbackTargetIndex: number;
};

export type HansKanbanNextItemDragStartStateArgs = {
  dragAndDrop: boolean;
  itemId: string;
  columnId: string;
  itemIndex: number;
};

export type HansKanbanNextItemDragOverStateArgs = HansKanbanDragGateArgs & {
  columnId: string;
  itemIndex: number;
  clientY: number;
  itemTop: number;
  itemHeight: number;
};
