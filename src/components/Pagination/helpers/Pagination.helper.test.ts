import { describe, expect, it } from 'vitest';
import {
  buildPaginationItems,
  canSelectPaginationPage,
  hasMultiplePaginationPages,
  isPaginationIconName,
  sanitizePaginationVisiblePageCount,
} from './Pagination.helper';

describe('Pagination.helper', () => {
  it('Should build compact page collections and detect multi-page ranges', () => {
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
    expect(hasMultiplePaginationPages({ totalPages: 2 })).toBe(true);
    expect(hasMultiplePaginationPages({ totalPages: 1 })).toBe(false);
  });

  it('Should validate page navigation targets and icon name detection', () => {
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
    expect(sanitizePaginationVisiblePageCount(1)).toBe(3);
    expect(sanitizePaginationVisiblePageCount(Number.NaN)).toBe(3);
    expect(isPaginationIconName('MdKeyboardArrowLeft')).toBe(true);
    expect(isPaginationIconName('Previous')).toBe(false);
  });
});
