import { describe, expect, it } from 'vitest';
import {
  YEAR_WINDOW_SIZE,
  buildMonthOptions,
  buildYearOptions,
  getNextViewDateFromMonthSelection,
  getNextViewDateFromYearSelection,
  getYearWindowLabel,
  getYearWindowStart,
} from './MonthYearPicker.helper';

describe('MonthYearPicker.helper', () => {
  it('Should compute year window boundaries', () => {
    expect(getYearWindowStart(2026)).toBe(2016);
    expect(getYearWindowStart(2016)).toBe(2016);
    expect(getYearWindowStart(2027, 10)).toBe(2020);
    expect(getYearWindowLabel(2016)).toBe('2016 - 2027');
    expect(YEAR_WINDOW_SIZE).toBe(12);
  });

  it('Should build localized month options with selection and current markers', () => {
    const viewDate = new Date(2026, 2, 13);
    const today = new Date(2026, 2, 13);
    const options = buildMonthOptions({ pageYear: 2026, viewDate, today });

    expect(options).toHaveLength(12);
    expect(options[2]).toEqual(
      expect.objectContaining({ index: 2, label: 'March', isSelected: true, isCurrent: true }),
    );
    expect(options[0].isSelected).toBe(false);

    const ptOptions = buildMonthOptions({
      pageYear: 2026,
      viewDate,
      locale: 'pt-br',
    });
    expect(ptOptions[2].label).toBe('março');

    const otherYearOptions = buildMonthOptions({
      pageYear: 2025,
      viewDate,
      today,
    });
    expect(otherYearOptions[2].isSelected).toBe(false);
    expect(otherYearOptions[2].isCurrent).toBe(false);
  });

  it('Should build year options for a window with selection and current markers', () => {
    const viewDate = new Date(2026, 2, 13);
    const today = new Date(2026, 2, 13);
    const options = buildYearOptions({ windowStart: 2016, viewDate, today });

    expect(options).toHaveLength(12);
    expect(options).toContainEqual({ year: 2026, isSelected: true, isCurrent: true });
    expect(options[0]).toEqual({ year: 2016, isSelected: false, isCurrent: false });
  });

  it('Should compute the next view date from a month or year selection', () => {
    expect(getNextViewDateFromMonthSelection({ pageYear: 2026, monthIndex: 5 })).toEqual(
      new Date(2026, 5, 1),
    );

    const viewDate = new Date(2026, 4, 20);
    expect(getNextViewDateFromYearSelection({ viewDate, year: 2030 })).toEqual(
      new Date(2030, 4, 1),
    );
  });
});
