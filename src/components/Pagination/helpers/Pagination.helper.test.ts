import { describe, expect, it } from 'vitest';
import {
  buildPaginationPages,
  canSelectPaginationPage,
  hasMultiplePaginationPages,
} from './Pagination.helper';

describe('Pagination.helper', () => {
  it('Should build page numbers and detect multi-page collections', () => {
    expect(buildPaginationPages(4)).toEqual([1, 2, 3, 4]);
    expect(buildPaginationPages(0)).toEqual([]);
    expect(hasMultiplePaginationPages({ totalPages: 2 })).toBe(true);
    expect(hasMultiplePaginationPages({ totalPages: 1 })).toBe(false);
  });

  it('Should validate page navigation targets', () => {
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
  });
});
