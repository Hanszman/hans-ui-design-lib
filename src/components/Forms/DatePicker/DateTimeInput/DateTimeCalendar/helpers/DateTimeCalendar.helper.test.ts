import { describe, expect, it, vi } from 'vitest';
import {
  addMonths,
  buildCalendarDays,
  createMonthNavigationHandler,
  getDatePickerMonthLabel,
  getStartOfCalendarGrid,
  getWeekdayLabels,
} from './DateTimeCalendar.helper';

describe('DateTimeCalendar.helper', () => {
  it('Should resolve labels and month navigation helpers', () => {
    expect(getWeekdayLabels(true)).toEqual([
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ]);
    expect(getWeekdayLabels(false)).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ]);
    expect(getDatePickerMonthLabel(new Date(2026, 2, 1))).toBe('March 2026');
    expect(addMonths(new Date(2026, 0, 31), 1).getMonth()).toBe(1);
    expect(getStartOfCalendarGrid(new Date(2026, 2, 15), true).getDay()).toBe(0);
    expect(getStartOfCalendarGrid(new Date(2026, 2, 15), false).getDay()).toBe(1);

    const setViewDate = vi.fn();
    createMonthNavigationHandler({
      viewDate: new Date(2026, 2, 13),
      months: 1,
      setViewDate,
    })();
    expect(setViewDate).toHaveBeenCalled();
  });

  it('Should build the calendar grid with selection and today markers', () => {
    const days = buildCalendarDays({
      viewDate: new Date(2026, 2, 13),
      selectedDate: new Date(2026, 2, 13),
      weekStartsOnSunday: true,
      today: new Date(2026, 2, 13),
    });

    expect(days).toHaveLength(42);
    expect(days.some((day) => day.isSelected)).toBe(true);
    expect(days.some((day) => day.isToday)).toBe(true);
    expect(days.some((day) => !day.isCurrentMonth)).toBe(true);
  });
});
