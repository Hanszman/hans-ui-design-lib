import type React from 'react';
import type { Color, Variant } from '../../../../types/Common.types';
import type { DatePickerDayItem } from '../helpers/DatePicker.helper.types';

export type HansDatePickerCalendarProps = {
  days: DatePickerDayItem[];
  weekdayLabels: string[];
  monthLabel: string;
  calendarColor: Color;
  calendarVariant: Variant;
  inputColor: Color;
  timePrecision: 'minute' | 'second';
  pickerType: 'date' | 'datetime';
  timeInputValue: string;
  clearLabel: string;
  todayLabel: string;
  applyLabel: string;
  allowApply: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: DatePickerDayItem) => void;
  onTimeInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  onToday: () => void;
  onApply: () => void;
};
