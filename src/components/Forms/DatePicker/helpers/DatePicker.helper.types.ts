import type React from 'react';
import type {
  HansDatePickerTimePrecision,
  HansDatePickerType,
} from '../DatePicker.types';

export type DatePickerDayItem = {
  date: Date;
  isoValue: string;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
};

export type DatePickerTimeParts = {
  hours: number;
  minutes: number;
  seconds: number;
};

export type ParseDatePickerValueParams = {
  pickerType: HansDatePickerType;
  value: string | undefined;
  timePrecision: HansDatePickerTimePrecision;
};

export type FormatDatePickerValueParams = {
  pickerType: HansDatePickerType;
  date: Date;
  timePrecision: HansDatePickerTimePrecision;
};

export type FormatDatePickerDisplayParams = {
  pickerType: HansDatePickerType;
  value: string | undefined;
  timePrecision: HansDatePickerTimePrecision;
  noDateText: string;
};

export type CreateDatePickerChangeHandlerParams = {
  disabled: boolean;
  isControlled: boolean;
  setInternalValue: (value: string) => void;
  onChange?: (value: string) => void;
};

export type CreateDatePickerOpenHandlerParams = {
  disabled: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenChange?: (open: boolean) => void;
};

export type CreateDatePickerTimeInputHandlerParams = {
  timePrecision: HansDatePickerTimePrecision;
  setTimeInputValue: (value: string) => void;
};

export type CreateDatePickerDisplayInputHandlerParams = {
  setDisplayValue: (value: string) => void;
};

export type CreateDatePickerBlurHandlerParams = {
  pickerType: Exclude<HansDatePickerType, 'time'>;
  allowInputTyping: boolean;
  timePrecision: HansDatePickerTimePrecision;
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
  setDraftDate: (value: Date | null) => void;
  setViewDate: (value: Date) => void;
  setTimeInputValue: (value: string) => void;
  setDisplayValue?: (value: string) => void;
};

export type DatePickerPopupOffsets = {
  up: number;
  down: number;
};

export type CreateSyncDatePickerPopupOffsetsParams = {
  datePickerRef: React.RefObject<HTMLDivElement | null>;
  setPopupOffsets: (offsets: DatePickerPopupOffsets) => void;
};
