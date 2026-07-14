import type {
  CanSelectPaginationPageParams,
  HasMultiplePaginationPagesParams,
} from './Pagination.helper.types';

export const buildPaginationPages = (totalPages: number): readonly number[] =>
  totalPages > 0
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : [];

export const hasMultiplePaginationPages = ({
  totalPages,
}: HasMultiplePaginationPagesParams): boolean => totalPages > 1;

export const canSelectPaginationPage = ({
  currentPage,
  totalPages,
  disabled,
  page,
}: CanSelectPaginationPageParams): boolean => {
  if (disabled) {
    return false;
  }

  if (page < 1 || page > totalPages) {
    return false;
  }

  return page !== currentPage;
};
