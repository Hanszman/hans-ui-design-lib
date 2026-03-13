import type { Color, Variant } from '../../../../types/Common.types';
import type { DatePickerDayItem } from '../helpers/DatePicker.helper.types';

export type HansDatePickerCalendarProps = {
  days: DatePickerDayItem[];
  weekdayLabels: string[];
  monthLabel: string;
  calendarColor: Color;
  calendarVariant: Variant;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: DatePickerDayItem) => void;
};
