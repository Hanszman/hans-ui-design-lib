import React from 'react';
import { HansIcon } from '../../Icon/Icon';
import type {
  BuildPaginationItemsParams,
  BuildPaginationViewModelParams,
  CanSelectPaginationPageParams,
  HasMultiplePaginationPagesParams,
  PaginationItem,
  PaginationViewModel,
  ResolvePaginationControlContentParams,
  SelectPaginationPageParams,
} from './Pagination.helper.types';

export const PAGINATION_ICON_NAME_PATTERN =
  /^[A-Z][a-z0-9]+(?:[A-Z][A-Za-z0-9]+)+$/;

const MIN_VISIBLE_PAGINATION_PAGES = 3;
const FIRST_PAGINATION_PAGE = 1;

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

  const items: PaginationItem[] = [FIRST_PAGINATION_PAGE];

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

export const resolvePaginationControlContent = ({
  content,
  fallbackLabel,
  iconAriaHidden = false,
}: ResolvePaginationControlContentParams): React.ReactNode => {
  if (React.isValidElement(content)) {
    return content;
  }

  if (typeof content === 'string' && content.trim().length > 0) {
    if (isPaginationIconName(content)) {
      return React.createElement(
        'span',
        { 'aria-hidden': iconAriaHidden },
        React.createElement(HansIcon, {
          name: content,
          iconSize: 'small',
        }),
      );
    }

    return content;
  }

  return fallbackLabel;
};

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

  if (page < FIRST_PAGINATION_PAGE || page > totalPages) {
    return false;
  }

  return page !== currentPage;
};

export const selectPaginationPage = ({
  currentPage,
  totalPages,
  disabled,
  page,
  onPageChange,
}: SelectPaginationPageParams): void => {
  if (
    !canSelectPaginationPage({
      currentPage,
      totalPages,
      disabled,
      page,
    })
  ) {
    return;
  }

  onPageChange?.(page);
};

export const buildPaginationViewModel = ({
  currentPage,
  totalPages,
  maxVisiblePages,
  disabled,
}: BuildPaginationViewModelParams): PaginationViewModel => {
  const firstPage = FIRST_PAGINATION_PAGE;
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const lastPage = totalPages;

  return {
    items: buildPaginationItems({ currentPage, totalPages, maxVisiblePages }),
    firstPage,
    previousPage,
    nextPage,
    lastPage,
    isFirstDisabled: !canSelectPaginationPage({
      currentPage,
      totalPages,
      disabled,
      page: firstPage,
    }),
    isPreviousDisabled: !canSelectPaginationPage({
      currentPage,
      totalPages,
      disabled,
      page: previousPage,
    }),
    isNextDisabled: !canSelectPaginationPage({
      currentPage,
      totalPages,
      disabled,
      page: nextPage,
    }),
    isLastDisabled: !canSelectPaginationPage({
      currentPage,
      totalPages,
      disabled,
      page: lastPage,
    }),
  };
};
