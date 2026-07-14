export interface HasMultiplePaginationPagesParams {
  readonly totalPages: number;
}

export interface CanSelectPaginationPageParams
  extends HasMultiplePaginationPagesParams {
  readonly currentPage: number;
  readonly disabled: boolean;
  readonly page: number;
}
