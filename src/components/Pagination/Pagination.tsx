import React from 'react';
import type { HansPaginationProps } from './Pagination.types';
import { HansButton } from '../Forms/Button/Button';
import { HansIcon } from '../Icon/Icon';
import {
  buildPaginationItems,
  canSelectPaginationPage,
  hasMultiplePaginationPages,
  isPaginationIconName,
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

  const pageItems = React.useMemo(
    () => buildPaginationItems({ currentPage, totalPages, maxVisiblePages }),
    [currentPage, maxVisiblePages, totalPages],
  );

  const resolveControlContent = React.useCallback(
    (
      content: React.ReactNode,
      fallbackLabel: string,
      iconAriaHidden = false,
    ): React.ReactNode => {
      if (React.isValidElement(content)) {
        return content;
      }

      if (typeof content === 'string' && content.trim().length > 0) {
        return isPaginationIconName(content) ? (
          <HansIcon
            name={content}
            iconSize="small"
            aria-hidden={iconAriaHidden}
          />
        ) : (
          content
        );
      }

      return fallbackLabel;
    },
    [],
  );

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
      <div className="hans-pagination-group">
        <HansButton
          aria-label={firstLabel}
          buttonColor={paginationColor}
          buttonSize={paginationSize}
          buttonVariant="default"
          disabled={
            !canSelectPaginationPage({
              currentPage,
              totalPages,
              disabled,
              page: 1,
            })
          }
          onClick={() => selectPage(1)}
        >
          {resolveControlContent(firstContent, firstLabel, true)}
        </HansButton>

        <HansButton
          aria-label={previousLabel}
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
        >
          {resolveControlContent(previousContent, previousLabel, true)}
        </HansButton>

        <div className="hans-pagination-pages">
          {pageItems.map((item) =>
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
                onClick={() => selectPage(item)}
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
          disabled={
            !canSelectPaginationPage({
              currentPage,
              totalPages,
              disabled,
              page: currentPage + 1,
            })
          }
          onClick={() => selectPage(currentPage + 1)}
        >
          {resolveControlContent(nextContent, nextLabel, true)}
        </HansButton>

        <HansButton
          aria-label={lastLabel}
          buttonColor={paginationColor}
          buttonSize={paginationSize}
          buttonVariant="default"
          disabled={
            !canSelectPaginationPage({
              currentPage,
              totalPages,
              disabled,
              page: totalPages,
            })
          }
          onClick={() => selectPage(totalPages)}
        >
          {resolveControlContent(lastContent, lastLabel, true)}
        </HansButton>
      </div>
    </nav>
  );
});

HansPagination.displayName = 'HansPagination';
