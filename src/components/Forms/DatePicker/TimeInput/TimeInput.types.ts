import type { HansDatePickerProps } from '../DatePicker.types';

export type HansTimeInputProps = HansDatePickerProps & {
  onMaskedValueChange?: (value: string) => void;
};
