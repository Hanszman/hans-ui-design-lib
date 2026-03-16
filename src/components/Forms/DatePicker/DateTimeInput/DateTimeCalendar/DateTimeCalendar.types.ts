import type { Color, Variant } from '../../../../../types/Common.types';
import type {
  DateTimeCalendarDayItem,
} from './helpers/DateTimeCalendar.helper.types';

export type HansDateTimeCalendarProps = {
  days: DateTimeCalendarDayItem[];
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
  onSelectDay: (day: DateTimeCalendarDayItem) => void;
  onTimeInputChange: (value: string) => void;
  onClear: () => void;
  onToday: () => void;
  onApply: () => void;
};
