import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Color, Size, Variant } from '../../../types/Common.types';

export type HansDatePickerType = 'date' | 'datetime' | 'time';

export type HansDatePickerTimePrecision = 'minute' | 'second';

const HansDatePickerSchema = {
  label: 'string',
  labelColor: { type: 'custom', ref: {} as Color },
  placeholder: 'string',
  inputId: 'string',
  inputColor: { type: 'custom', ref: {} as Color },
  inputSize: { type: 'custom', ref: {} as Size },
  message: 'string',
  messageColor: { type: 'custom', ref: {} as Color },
  customClasses: 'string',
  disabled: 'boolean',
  pickerType: { type: 'custom', ref: {} as HansDatePickerType },
  value: 'string',
  defaultValue: 'string',
  calendarColor: { type: 'custom', ref: {} as Color },
  calendarVariant: { type: 'custom', ref: {} as Variant },
  popupBackgroundColor: 'string',
  noDateText: 'string',
  clearLabel: 'string',
  todayLabel: 'string',
  applyLabel: 'string',
  timePrecision: { type: 'custom', ref: {} as HansDatePickerTimePrecision },
  weekStartsOnSunday: 'boolean',
  allowInputTyping: 'boolean',
} as const;

export type HansDatePickerProps = InferPropsFromSchema<
  typeof HansDatePickerSchema
> &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'type'
  > & {
    onChange?: (value: string) => void;
    onOpenChange?: (open: boolean) => void;
  };

export const HansDatePickerPropsList = createPropsList(HansDatePickerSchema);
