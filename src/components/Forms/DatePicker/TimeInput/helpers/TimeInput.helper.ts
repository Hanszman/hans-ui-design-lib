import type React from 'react';
import type {
  CreateTimeInputChangeHandlerParams,
  CreateTimeInputMaskedValueHandlerParams,
  SyncTimeInputStateParams,
} from './TimeInput.helper.types';
import {
  mergeDateAndTime,
  normalizeMaskedTimeValue,
} from '../../helpers/DatePicker.helper';

export const createTimeInputMaskedValueHandler =
  ({
    timePrecision,
    setTimeInputValue,
    onMaskedValueChange,
  }: CreateTimeInputMaskedValueHandlerParams) =>
  (rawValue: string): string => {
    const nextValue = normalizeMaskedTimeValue(rawValue, timePrecision);
    setTimeInputValue(nextValue);
    if (onMaskedValueChange) onMaskedValueChange(nextValue);
    return nextValue;
  };

export const createTimeInputChangeHandler =
  ({
    timePrecision,
    syncMaskedValue,
    setTimeInputValue,
    applyValue,
  }: CreateTimeInputChangeHandlerParams) =>
  (event: React.ChangeEvent<HTMLInputElement>): void => {
    const normalizedValue = syncMaskedValue(event.target.value);
    const expectedLength = timePrecision === 'second' ? 8 : 5;

    if (!normalizedValue) {
      setTimeInputValue('');
      applyValue('');
      return;
    }

    if (normalizedValue.length !== expectedLength) return;

    if (
      !mergeDateAndTime(new Date(2000, 0, 1), normalizedValue, timePrecision)
    ) {
      setTimeInputValue('');
      applyValue('');
      return;
    }

    applyValue(normalizedValue);
  };

export const syncTimeInputState = ({
  isControlled,
  value,
  setInternalValue,
  setTimeInputValue,
}: SyncTimeInputStateParams): void => {
  if (!isControlled) return;

  const nextValue = value ?? '';
  setInternalValue(nextValue);
  setTimeInputValue(nextValue);
};
