import type {
  BuildPaginationItemsParams,
  CanSelectPaginationPageParams,
  HasMultiplePaginationPagesParams,
  PaginationItem,
} from './Pagination.helper.types';

export const PAGINATION_ICON_NAME_PATTERN =
  /^[A-Z][a-z0-9]+(?:[A-Z][A-Za-z0-9]+)+$/;

const MIN_VISIBLE_PAGINATION_PAGES = 3;

export const sanitizePaginationVisiblePageCount = (
  maxVisiblePages: number,
): number => {
  if (!Number.isFinite(maxVisiblePages)) {
    return MIN_VISIBLE_PAGINATION_PAGES;
  }

  return Math.max(MIN_VISIBLE_PAGINATION_PAGES, Math.trunc(maxVisiblePages));
};

export const buildPaginationItems = ({
  currentPage,
  totalPages,
  maxVisiblePages,
}: BuildPaginationItemsParams): readonly PaginationItem[] => {
  if (totalPages <= 0) {
    return [];
  }

  const resolvedMaxVisiblePages = sanitizePaginationVisiblePageCount(
    maxVisiblePages,
  );

  if (totalPages <= resolvedMaxVisiblePages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const middlePageCount = Math.max(1, resolvedMaxVisiblePages - 2);
  let leftBoundary = Math.max(
    2,
    currentPage - Math.floor((middlePageCount - 1) / 2),
  );
  const rightBoundary = Math.min(
    totalPages - 1,
    leftBoundary + middlePageCount - 1,
  );

  leftBoundary = Math.max(2, rightBoundary - middlePageCount + 1);

  const items: PaginationItem[] = [1];

  if (leftBoundary > 2) {
    items.push('start-ellipsis');
  }

  for (let page = leftBoundary; page <= rightBoundary; page += 1) {
    items.push(page);
  }

  if (rightBoundary < totalPages - 1) {
    items.push('end-ellipsis');
  }

  items.push(totalPages);

  return items;
};

export const isPaginationIconName = (value: string): boolean =>
  PAGINATION_ICON_NAME_PATTERN.test(value.trim());

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

