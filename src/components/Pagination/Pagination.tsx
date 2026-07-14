import React from 'react';
import type { HansPaginationProps } from './Pagination.types';
import { HansButton } from '../Forms/Button/Button';
import {
  buildPaginationPages,
  canSelectPaginationPage,
  hasMultiplePaginationPages,
} from './helpers/Pagination.helper';

export const HansPagination = React.memo((props: HansPaginationProps) => {
  const {
    currentPage = 1,
    totalPages = 0,
    disabled = false,
    ariaLabel = 'Pagination',
    previousLabel = 'Previous',
    nextLabel = 'Next',
    pageLabel = 'Page',
    paginationColor = 'primary',
    paginationSize = 'medium',
    activePageVariant = 'default',
    inactivePageVariant = 'outline',
    customClasses = '',
    onPageChange,
    ...rest
  } = props;

  const pages = React.useMemo(() => buildPaginationPages(totalPages), [totalPages]);

  if (!hasMultiplePaginationPages({ totalPages })) {
    return null;
  }

  const selectPage = (page: number): void => {
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

  return (
    <nav
      className={['hans-pagination', customClasses].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      {...rest}
    >
      <HansButton
        label={previousLabel}
        buttonColor={paginationColor}
        buttonSize={paginationSize}
        buttonVariant="default"
        disabled={
          !canSelectPaginationPage({
            currentPage,
            totalPages,
            disabled,
            page: currentPage - 1,
          })
        }
        onClick={() => selectPage(currentPage - 1)}
      />

      <div className="hans-pagination-pages">
        {pages.map((page) => (
          <HansButton
            key={page}
            label={String(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`${pageLabel} ${page}`}
            buttonColor={paginationColor}
            buttonSize={paginationSize}
            buttonVariant={page === currentPage ? activePageVariant : inactivePageVariant}
            disabled={disabled}
            onClick={() => selectPage(page)}
          />
        ))}
      </div>

      <HansButton
        label={nextLabel}
        buttonColor={paginationColor}
        buttonSize={paginationSize}
        buttonVariant="default"
        disabled={
          !canSelectPaginationPage({
            currentPage,
            totalPages,
            disabled,
            page: currentPage + 1,
          })
        }
        onClick={() => selectPage(currentPage + 1)}
      />
    </nav>
  );
});

HansPagination.displayName = 'HansPagination';
