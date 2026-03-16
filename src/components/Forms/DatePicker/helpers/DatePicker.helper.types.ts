import type React from 'react';
import type {
  HansDatePickerTimePrecision,
  HansDatePickerType,
} from '../DatePicker.types';

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

export type DatePickerPopupOffsets = {
  up: number;
  down: number;
};

export type CreateSyncDatePickerPopupOffsetsParams = {
  datePickerRef: React.RefObject<HTMLDivElement | null>;
  setPopupOffsets: (offsets: DatePickerPopupOffsets) => void;
};
