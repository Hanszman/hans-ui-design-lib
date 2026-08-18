import type { Color, Variant } from '../../../../../types/Common.types';
import type {
  DateTimeCalendarDayItem,
} from './helpers/DateTimeCalendar.helper.types';
import type { HansDatePickerLocale } from '../../DatePicker.types';

export type HansDateTimeCalendarView = 'days' | 'months' | 'years';

export type HansDateTimeCalendarProps = {
  calendarView: HansDateTimeCalendarView;
  days: DateTimeCalendarDayItem[];
  weekdayLabels: string[];
  viewDate: Date;
  pageAnchor: number;
  locale?: HansDatePickerLocale;
  calendarColor: Color;
  calendarVariant: Variant;
  inputColor: Color;
  timePrecision: 'minute' | 'second';
  pickerType: 'date' | 'datetime';
  timeInputValue: string;
  clearLabel: string;
  todayLabel: string;
  applyLabel: string;
  timeLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  monthPickerLabel?: string;
  yearPickerLabel?: string;
  backToCalendarLabel?: string;
  previousYearLabel?: string;
  nextYearLabel?: string;
  previousYearsLabel?: string;
  nextYearsLabel?: string;
  allowApply: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: DateTimeCalendarDayItem) => void;
  onOpenMonthPicker: () => void;
  onOpenYearPicker: () => void;
  onSelectMonthYear: (value: number) => void;
  onPreviousMonthYearPage: () => void;
  onNextMonthYearPage: () => void;
  onBackToCalendar: () => void;
  onTimeInputChange: (value: string) => void;
  onClear: () => void;
  onToday: () => void;
  onApply: () => void;
};
