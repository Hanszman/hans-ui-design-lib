import type { HansDatePickerLocale } from '../../../../DatePicker.types';

export type MonthYearPickerMode = 'month' | 'year';

export type MonthOptionItem = {
  index: number;
  label: string;
  isSelected: boolean;
  isCurrent: boolean;
};

export type YearOptionItem = {
  year: number;
  isSelected: boolean;
  isCurrent: boolean;
};

export type BuildMonthOptionsParams = {
  pageYear: number;
  viewDate: Date;
  locale?: HansDatePickerLocale;
  today?: Date;
};

export type BuildYearOptionsParams = {
  windowStart: number;
  windowSize?: number;
  viewDate: Date;
  today?: Date;
};

export type GetNextViewDateFromMonthSelectionParams = {
  pageYear: number;
  monthIndex: number;
};

export type GetNextViewDateFromYearSelectionParams = {
  viewDate: Date;
  year: number;
};
