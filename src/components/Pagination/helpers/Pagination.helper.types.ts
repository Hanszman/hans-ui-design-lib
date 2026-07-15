import type React from 'react';

export type PaginationEllipsisItem = 'start-ellipsis' | 'end-ellipsis';

export type PaginationItem = number | PaginationEllipsisItem;

export interface HasMultiplePaginationPagesParams {
  readonly totalPages: number;
}

export interface BuildPaginationItemsParams
  extends HasMultiplePaginationPagesParams {
  readonly currentPage: number;
  readonly maxVisiblePages: number;
}

export interface CanSelectPaginationPageParams
  extends HasMultiplePaginationPagesParams {
  readonly currentPage: number;
  readonly disabled: boolean;
  readonly page: number;
}

export interface SelectPaginationPageParams
  extends CanSelectPaginationPageParams {
  readonly onPageChange?: (page: number) => void;
}

export interface ResolvePaginationControlContentParams {
  readonly content: React.ReactNode;
  readonly fallbackLabel: string;
  readonly iconAriaHidden?: boolean;
}

export interface BuildPaginationViewModelParams
  extends BuildPaginationItemsParams {
  readonly disabled: boolean;
}

export interface PaginationViewModel {
  readonly items: readonly PaginationItem[];
  readonly firstPage: number;
  readonly previousPage: number;
  readonly nextPage: number;
  readonly lastPage: number;
  readonly isFirstDisabled: boolean;
  readonly isPreviousDisabled: boolean;
  readonly isNextDisabled: boolean;
  readonly isLastDisabled: boolean;
}
