import type { Color, Variant } from '../../../../../../types/Common.types';
import type { HansDatePickerLocale } from '../../../DatePicker.types';
import type { MonthYearPickerMode } from './helpers/MonthYearPicker.helper.types';

export type HansMonthYearPickerProps = {
  mode: MonthYearPickerMode;
  viewDate: Date;
  pageAnchor: number;
  locale?: HansDatePickerLocale;
  calendarColor: Color;
  calendarVariant: Variant;
  backLabel: string;
  previousPageLabel: string;
  nextPageLabel: string;
  onSelect: (value: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onBack: () => void;
};
