import type { DatePickerTimeParts } from '../../../helpers/DatePicker.helper.types';

export type DateTimeCalendarDayItem = {
  date: Date;
  isoValue: string;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
};

export type BuildCalendarDaysParams = {
  viewDate: Date;
  selectedDate: Date | null;
  weekStartsOnSunday: boolean;
  today?: Date;
};

export type CreateMonthNavigationHandlerParams = {
  viewDate: Date;
  months: number;
  setViewDate: (value: Date) => void;
};

export type DateTimeCalendarTimeParts = DatePickerTimeParts;
