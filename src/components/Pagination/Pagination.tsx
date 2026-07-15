import React from 'react';
import type { HansPaginationProps } from './Pagination.types';
import { HansButton } from '../Forms/Button/Button';
import {
  buildPaginationViewModel,
  hasMultiplePaginationPages,
  resolvePaginationControlContent,
  selectPaginationPage,
} from './helpers/Pagination.helper';

export const HansPagination = React.memo((props: HansPaginationProps) => {
  const {
    currentPage = 1,
    totalPages = 0,
    disabled = false,
    ariaLabel = 'Pagination',
    firstLabel = 'First',
    previousLabel = 'Previous',
    nextLabel = 'Next',
    lastLabel = 'Last',
    pageLabel = 'Page',
    firstContent,
    previousContent,
    nextContent,
    lastContent,
    maxVisiblePages = 5,
    paginationColor = 'primary',
    paginationSize = 'medium',
    activePageVariant = 'default',
    inactivePageVariant = 'outline',
    customClasses = '',
    onPageChange,
    ...rest
  } = props;

  const viewModel = React.useMemo(
    () =>
      buildPaginationViewModel({
        currentPage,
        totalPages,
        maxVisiblePages,
        disabled,
      }),
    [currentPage, disabled, maxVisiblePages, totalPages],
  );

  if (!hasMultiplePaginationPages({ totalPages })) {
    return null;
  }

  return (
    <nav
      className={['hans-pagination', customClasses].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      {...rest}
    >
      <div className="hans-pagination-group">
        <HansButton
          aria-label={firstLabel}
          buttonColor={paginationColor}
          buttonSize={paginationSize}
          buttonVariant="default"
          disabled={viewModel.isFirstDisabled}
          onClick={() =>
            selectPaginationPage({
              currentPage,
              totalPages,
              disabled,
              page: viewModel.firstPage,
              onPageChange,
            })
          }
        >
          {resolvePaginationControlContent({
            content: firstContent,
            fallbackLabel: firstLabel,
            iconAriaHidden: true,
          })}
        </HansButton>

        <HansButton
          aria-label={previousLabel}
          buttonColor={paginationColor}
          buttonSize={paginationSize}
          buttonVariant="default"
          disabled={viewModel.isPreviousDisabled}
          onClick={() =>
            selectPaginationPage({
              currentPage,
              totalPages,
              disabled,
              page: viewModel.previousPage,
              onPageChange,
            })
          }
        >
          {resolvePaginationControlContent({
            content: previousContent,
            fallbackLabel: previousLabel,
            iconAriaHidden: true,
          })}
        </HansButton>

        <div className="hans-pagination-pages">
          {viewModel.items.map((item) =>
            typeof item === 'number' ? (
              <HansButton
                key={item}
                label={String(item)}
                aria-current={item === currentPage ? 'page' : undefined}
                aria-label={`${pageLabel} ${item}`}
                buttonColor={paginationColor}
                buttonSize={paginationSize}
                buttonVariant={
                  item === currentPage ? activePageVariant : inactivePageVariant
                }
                disabled={disabled}
                onClick={() =>
                  selectPaginationPage({
                    currentPage,
                    totalPages,
                    disabled,
                    page: item,
                    onPageChange,
                  })
                }
              />
            ) : (
              <span
                key={item}
                className="hans-pagination-ellipsis"
                aria-hidden="true"
              >
                ...
              </span>
            ),
          )}
        </div>

        <HansButton
          aria-label={nextLabel}
          buttonColor={paginationColor}
          buttonSize={paginationSize}
          buttonVariant="default"
          disabled={viewModel.isNextDisabled}
          onClick={() =>
            selectPaginationPage({
              currentPage,
              totalPages,
              disabled,
              page: viewModel.nextPage,
              onPageChange,
            })
          }
        >
          {resolvePaginationControlContent({
            content: nextContent,
            fallbackLabel: nextLabel,
            iconAriaHidden: true,
          })}
        </HansButton>

        <HansButton
          aria-label={lastLabel}
          buttonColor={paginationColor}
          buttonSize={paginationSize}
          buttonVariant="default"
          disabled={viewModel.isLastDisabled}
          onClick={() =>
            selectPaginationPage({
              currentPage,
              totalPages,
              disabled,
              page: viewModel.lastPage,
              onPageChange,
            })
          }
        >
          {resolvePaginationControlContent({
            content: lastContent,
            fallbackLabel: lastLabel,
            iconAriaHidden: true,
          })}
        </HansButton>
      </div>
    </nav>
  );
});

HansPagination.displayName = 'HansPagination';
