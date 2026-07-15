import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  buildPaginationItems,
  buildPaginationViewModel,
  canSelectPaginationPage,
  hasMultiplePaginationPages,
  resolvePaginationControlContent,
  isPaginationIconName,
  sanitizePaginationVisiblePageCount,
  selectPaginationPage,
} from './Pagination.helper';

vi.mock('../../Icon/Icon', () => ({
  HansIcon: ({ name }: { name?: string }) =>
    React.createElement(
      'span',
      { 'data-testid': `helper-pagination-icon-${name}` },
      name,
    ),
}));

describe('Pagination.helper', () => {
  it('Should build compact page collections, long-range view models and detect multi-page ranges', () => {
    expect(
      buildPaginationItems({
        currentPage: 2,
        totalPages: 4,
        maxVisiblePages: 5,
      }),
    ).toEqual([1, 2, 3, 4]);
    expect(
      buildPaginationItems({
        currentPage: 6,
        totalPages: 10,
        maxVisiblePages: 5,
      }),
    ).toEqual([1, 'start-ellipsis', 5, 6, 7, 'end-ellipsis', 10]);
    expect(
      buildPaginationItems({
        currentPage: 1,
        totalPages: 0,
        maxVisiblePages: 5,
      }),
    ).toEqual([]);
    expect(
      buildPaginationViewModel({
        currentPage: 6,
        totalPages: 10,
        maxVisiblePages: 5,
        disabled: false,
      }),
    ).toEqual({
      items: [1, 'start-ellipsis', 5, 6, 7, 'end-ellipsis', 10],
      firstPage: 1,
      previousPage: 5,
      nextPage: 7,
      lastPage: 10,
      isFirstDisabled: false,
      isPreviousDisabled: false,
      isNextDisabled: false,
      isLastDisabled: false,
    });
    expect(hasMultiplePaginationPages({ totalPages: 2 })).toBe(true);
    expect(hasMultiplePaginationPages({ totalPages: 1 })).toBe(false);
  });

  it('Should validate page navigation targets, content resolution and icon name detection', () => {
    const onPageChange = vi.fn();

    expect(
      canSelectPaginationPage({
        currentPage: 2,
        totalPages: 4,
        disabled: false,
        page: 1,
      }),
    ).toBe(true);
    expect(
      canSelectPaginationPage({
        currentPage: 2,
        totalPages: 4,
        disabled: false,
        page: 2,
      }),
    ).toBe(false);
    expect(
      canSelectPaginationPage({
        currentPage: 2,
        totalPages: 4,
        disabled: true,
        page: 3,
      }),
    ).toBe(false);
    expect(
      canSelectPaginationPage({
        currentPage: 2,
        totalPages: 4,
        disabled: false,
        page: 5,
      }),
    ).toBe(false);

    selectPaginationPage({
      currentPage: 2,
      totalPages: 4,
      disabled: false,
      page: 3,
      onPageChange,
    });
    selectPaginationPage({
      currentPage: 2,
      totalPages: 4,
      disabled: false,
      page: 2,
      onPageChange,
    });

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(3);

    const elementContent = React.createElement('strong', null, 'Prev');
    const { rerender } = render(
      React.createElement(
        'div',
        null,
        resolvePaginationControlContent({
          content: 'MdKeyboardArrowLeft',
          fallbackLabel: 'Previous',
          iconAriaHidden: true,
        }),
      ),
    );
    expect(
      screen.getByTestId('helper-pagination-icon-MdKeyboardArrowLeft'),
    ).toBeInTheDocument();

    rerender(
      React.createElement(
        'div',
        null,
        resolvePaginationControlContent({
          content: 'Next',
          fallbackLabel: 'Fallback',
        }),
      ),
    );
    expect(screen.getByText('Next')).toBeInTheDocument();

    rerender(
      React.createElement(
        'div',
        null,
        resolvePaginationControlContent({
          content: elementContent,
          fallbackLabel: 'Fallback',
        }),
      ),
    );
    expect(screen.getByText('Prev')).toBeInTheDocument();

    rerender(
      React.createElement(
        'div',
        null,
        resolvePaginationControlContent({
          content: '',
          fallbackLabel: 'Fallback',
        }),
      ),
    );
    expect(screen.getByText('Fallback')).toBeInTheDocument();

    expect(sanitizePaginationVisiblePageCount(1)).toBe(3);
    expect(sanitizePaginationVisiblePageCount(Number.NaN)).toBe(3);
    expect(isPaginationIconName('MdKeyboardArrowLeft')).toBe(true);
    expect(isPaginationIconName('Previous')).toBe(false);
  });
});
