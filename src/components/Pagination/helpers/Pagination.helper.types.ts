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
