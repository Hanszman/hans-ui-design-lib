import React from 'react';
import { HansInput } from '../../Input/Input';
import { HansIcon } from '../../../Icon/Icon';
import type { HansTimeInputProps } from './TimeInput.types';
import {
  createDatePickerChangeHandler,
  getDatePickerPlaceholder,
} from '../helpers/DatePicker.helper';
import {
  createTimeInputChangeHandler,
  createTimeInputMaskedValueHandler,
  syncTimeInputState,
} from './helpers/TimeInput.helper';

export const HansTimeInput = React.memo((props: HansTimeInputProps) => {
  const {
    label = '',
    labelColor = 'base',
    placeholder,
    inputId = 'hans-date-picker',
    inputColor = 'base',
    inputSize = 'medium',
    message = '',
    messageColor = 'base',
    customClasses = '',
    disabled = false,
    pickerType = 'time',
    value,
    defaultValue = '',
    timePrecision = 'minute',
    onChange,
    onMaskedValueChange,
    ...rest
  } = props;

  const isControlled = typeof value !== 'undefined';
  const [internalValue, setInternalValue] = React.useState(
    isControlled ? (value as string) : defaultValue,
  );
  const [timeInputValue, setTimeInputValue] = React.useState(
    isControlled ? (value as string) : defaultValue,
  );

  React.useEffect(() => {
    syncTimeInputState({
      isControlled,
      value: value as string | undefined,
      setInternalValue,
      setTimeInputValue,
    });
  }, [isControlled, value]);

  const applyValue = React.useMemo(
    () =>
      createDatePickerChangeHandler({
        disabled,
        isControlled,
        setInternalValue,
        onChange,
      }),
    [disabled, isControlled, onChange],
  );
  const syncMaskedValue = React.useMemo(
    () =>
      createTimeInputMaskedValueHandler({
        timePrecision,
        setTimeInputValue,
        onMaskedValueChange,
      }),
    [onMaskedValueChange, timePrecision],
  );
  const handleChange = React.useMemo(
    () =>
      createTimeInputChangeHandler({
        timePrecision,
        syncMaskedValue,
        setTimeInputValue,
        applyValue,
      }),
    [applyValue, syncMaskedValue, timePrecision],
  );

  const selectedValue = isControlled ? (value as string) : internalValue;

  return (
    <div className="hans-date-picker hans-date-picker-time-input">
      <HansInput
        label={label}
        labelColor={labelColor}
        message={message}
        messageColor={messageColor}
        inputId={inputId}
        inputColor={inputColor}
        inputSize={inputSize}
        placeholder={
          placeholder ?? getDatePickerPlaceholder(pickerType, timePrecision)
        }
        customClasses={`hans-date-picker-input ${customClasses}`}
        disabled={disabled}
        value={timeInputValue || selectedValue}
        onChange={handleChange}
        rightIcon={<HansIcon name="MdAccessTime" iconSize="small" />}
        {...rest}
      />
    </div>
  );
});

HansTimeInput.displayName = 'HansTimeInput';
