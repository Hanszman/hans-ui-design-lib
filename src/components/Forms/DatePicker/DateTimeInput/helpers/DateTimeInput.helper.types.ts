import type {
  HansDatePickerFormat,
  HansDatePickerTimePrecision,
  HansDatePickerType,
} from '../../DatePicker.types';

export type CreateDatePickerDisplayInputHandlerParams = {
  pickerType: Exclude<HansDatePickerType, 'time'>;
  timePrecision: HansDatePickerTimePrecision;
  setDisplayValue: (value: string) => void;
};

export type CreateDatePickerBlurHandlerParams = {
  pickerType: Exclude<HansDatePickerType, 'time'>;
  allowInputTyping: boolean;
  timePrecision: HansDatePickerTimePrecision;
  dateFormat?: HansDatePickerFormat;
  displayValue: string;
  setDisplayValue: (value: string) => void;
  setDraftDate: (value: Date | null) => void;
  setViewDate: (value: Date) => void;
  setTimeInputValue: (value: string) => void;
  applyValue: (value: string) => void;
};

export type SyncDatePickerStateParams = {
  pickerType: HansDatePickerType;
  value: string;
  timePrecision: HansDatePickerTimePrecision;
  dateFormat?: HansDatePickerFormat;
  setDraftDate: (value: Date | null) => void;
  setViewDate: (value: Date) => void;
  setTimeInputValue: (value: string) => void;
  setDisplayValue?: (value: string) => void;
};

export type CreateDatePickerInputMouseDownHandlerParams = {
  allowInputTyping: boolean;
  isOpen: boolean;
  handleOpenChange: (nextOpen: boolean) => void;
};

export type CreateDatePickerToggleIconMouseDownHandlerParams = {
  isOpen: boolean;
  handleOpenChange: (nextOpen: boolean) => void;
};

export type CreateDatePickerSelectDayHandlerParams = {
  pickerType: Exclude<HansDatePickerType, 'time'>;
  timePrecision: HansDatePickerTimePrecision;
  dateFormat?: HansDatePickerFormat;
  applyValue: (value: string) => void;
  setDisplayValue: (value: string) => void;
  setDraftDate: (value: Date | null) => void;
  setViewDate: (value: Date) => void;
  handleOpenChange: (nextOpen: boolean) => void;
};

export type CreateDatePickerClearHandlerParams = {
  setDraftDate: (value: Date | null) => void;
  setTimeInputValue: (value: string) => void;
  setDisplayValue?: (value: string) => void;
  applyValue: (value: string) => void;
  handleOpenChange?: (nextOpen: boolean) => void;
};

export type CreateDatePickerTodayHandlerParams = {
  pickerType: Exclude<HansDatePickerType, 'time'>;
  timePrecision: HansDatePickerTimePrecision;
  dateFormat?: HansDatePickerFormat;
  applyValue: (value: string) => void;
  setDisplayValue: (value: string) => void;
  setDraftDate: (value: Date | null) => void;
  setViewDate: (value: Date) => void;
  setTimeInputValue: (value: string) => void;
  handleOpenChange: (nextOpen: boolean) => void;
  now?: Date;
};

export type HansDateTimeCalendarViewState = 'days' | 'months' | 'years';

export type CreateOpenMonthYearPickerHandlerParams = {
  viewDate: Date;
  setPageAnchor: (value: number) => void;
  setCalendarView: (view: HansDateTimeCalendarViewState) => void;
};

export type CreateMonthYearPageNavigationHandlerParams = {
  calendarView: HansDateTimeCalendarViewState;
  pageAnchor: number;
  direction: 1 | -1;
  setPageAnchor: (value: number) => void;
};

export type CreateSelectMonthYearHandlerParams = {
  calendarView: HansDateTimeCalendarViewState;
  pageAnchor: number;
  viewDate: Date;
  setViewDate: (value: Date) => void;
  setCalendarView: (view: HansDateTimeCalendarViewState) => void;
};

export type CreateDatePickerApplyHandlerParams = {
  pickerType: Extract<HansDatePickerType, 'datetime'>;
  draftDate: Date | null;
  timeInputValue: string;
  timePrecision: HansDatePickerTimePrecision;
  dateFormat?: HansDatePickerFormat;
  setTimeInputValue: (value: string) => void;
  setDisplayValue: (value: string) => void;
  applyValue: (value: string) => void;
  handleOpenChange: (nextOpen: boolean) => void;
};
