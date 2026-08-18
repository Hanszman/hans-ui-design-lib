import type {
  BuildMonthOptionsParams,
  BuildYearOptionsParams,
  GetNextViewDateFromMonthSelectionParams,
  GetNextViewDateFromYearSelectionParams,
  MonthOptionItem,
  YearOptionItem,
} from './MonthYearPicker.helper.types';
import { cloneDate } from '../../../../helpers/DatePicker.helper';
import { getDatePickerIntlLocale } from '../../helpers/DateTimeCalendar.helper';

export const YEAR_WINDOW_SIZE = 12;

export const getYearWindowStart = (
  year: number,
  windowSize: number = YEAR_WINDOW_SIZE,
): number => year - (((year % windowSize) + windowSize) % windowSize);

export const getYearWindowLabel = (
  windowStart: number,
  windowSize: number = YEAR_WINDOW_SIZE,
): string => `${windowStart} - ${windowStart + windowSize - 1}`;

export const buildMonthOptions = ({
  pageYear,
  viewDate,
  locale = 'en-us',
  today = new Date(),
}: BuildMonthOptionsParams): MonthOptionItem[] =>
  Array.from({ length: 12 }, (_, index) => ({
    index,
    label: new Date(pageYear, index, 1).toLocaleDateString(
      getDatePickerIntlLocale(locale),
      { month: 'long' },
    ),
    isSelected:
      viewDate.getFullYear() === pageYear && viewDate.getMonth() === index,
    isCurrent: today.getFullYear() === pageYear && today.getMonth() === index,
  }));

export const buildYearOptions = ({
  windowStart,
  windowSize = YEAR_WINDOW_SIZE,
  viewDate,
  today = new Date(),
}: BuildYearOptionsParams): YearOptionItem[] =>
  Array.from({ length: windowSize }, (_, index) => {
    const year = windowStart + index;
    return {
      year,
      isSelected: viewDate.getFullYear() === year,
      isCurrent: today.getFullYear() === year,
    };
  });

export const getNextViewDateFromMonthSelection = ({
  pageYear,
  monthIndex,
}: GetNextViewDateFromMonthSelectionParams): Date =>
  new Date(pageYear, monthIndex, 1);

export const getNextViewDateFromYearSelection = ({
  viewDate,
  year,
}: GetNextViewDateFromYearSelectionParams): Date => {
  const nextDate = cloneDate(viewDate);
  nextDate.setDate(1);
  nextDate.setFullYear(year);
  return nextDate;
};
