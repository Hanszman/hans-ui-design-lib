import type {
  HansDatePickerTimePrecision,
} from '../../DatePicker.types';

export type CreateTimeInputChangeHandlerParams = {
  timePrecision: HansDatePickerTimePrecision;
  syncMaskedValue: (rawValue: string) => string;
  setTimeInputValue: (value: string) => void;
  applyValue: (value: string) => void;
};

export type CreateTimeInputMaskedValueHandlerParams = {
  timePrecision: HansDatePickerTimePrecision;
  setTimeInputValue: (value: string) => void;
  onMaskedValueChange?: (value: string) => void;
};

export type SyncTimeInputStateParams = {
  isControlled: boolean;
  value: string | undefined;
  setInternalValue: (value: string) => void;
  setTimeInputValue: (value: string) => void;
};
