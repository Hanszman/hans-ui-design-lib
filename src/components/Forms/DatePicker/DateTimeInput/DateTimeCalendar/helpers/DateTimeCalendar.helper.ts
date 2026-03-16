import type {
  BuildCalendarDaysParams,
  CreateMonthNavigationHandlerParams,
} from './DateTimeCalendar.helper.types';
import {
  cloneDate,
  formatDatePickerValue,
  isSameDay,
} from '../../../helpers/DatePicker.helper';

export const WEEKDAY_LABELS_SUNDAY = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

export const WEEKDAY_LABELS_MONDAY = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

export const getWeekdayLabels = (weekStartsOnSunday: boolean): string[] =>
  weekStartsOnSunday ? WEEKDAY_LABELS_SUNDAY : WEEKDAY_LABELS_MONDAY;

export const getDatePickerMonthLabel = (value: Date): string =>
  value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

export const addMonths = (value: Date, months: number): Date => {
  const nextDate = cloneDate(value);
  nextDate.setDate(1);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
};

export const getStartOfCalendarGrid = (
  viewDate: Date,
  weekStartsOnSunday: boolean,
): Date => {
  const startDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const weekday = startDate.getDay();
  const shift = weekStartsOnSunday ? weekday : (weekday + 6) % 7;
  startDate.setDate(startDate.getDate() - shift);
  return startDate;
};

export const buildCalendarDays = ({
  viewDate,
  selectedDate,
  weekStartsOnSunday,
  today = new Date(),
}: BuildCalendarDaysParams) =>
  Array.from({ length: 42 }, (_, index) => {
    const nextDate = getStartOfCalendarGrid(viewDate, weekStartsOnSunday);
    nextDate.setDate(nextDate.getDate() + index);

    return {
      date: nextDate,
      isoValue: formatDatePickerValue({
        pickerType: 'date',
        date: nextDate,
        timePrecision: 'minute',
      }),
      isCurrentMonth: nextDate.getMonth() === viewDate.getMonth(),
      isSelected: isSameDay(nextDate, selectedDate),
      isToday: isSameDay(nextDate, today),
    };
  });

export const createMonthNavigationHandler =
  ({ viewDate, months, setViewDate }: CreateMonthNavigationHandlerParams) =>
  (): void => {
    setViewDate(addMonths(viewDate, months));
  };
