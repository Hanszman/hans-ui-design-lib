import React from 'react';
import { HansInput } from '../../Input/Input';
import { HansIcon } from '../../../Icon/Icon';
import type { HansTimeInputProps } from './TimeInput.types';
import {
  createDatePickerChangeHandler,
  createDatePickerTimeInputHandler,
  normalizeMaskedTimeValue,
  mergeDateAndTime,
  getDatePickerPlaceholder,
} from '../helpers/DatePicker.helper';

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
    if (!isControlled) return;
    setInternalValue(value as string);
    setTimeInputValue(value as string);
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
  const handleMaskedChange = React.useMemo(
    () =>
      createDatePickerTimeInputHandler({
        timePrecision,
        setTimeInputValue,
      }),
    [timePrecision],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    handleMaskedChange(event);

    const normalizedValue = normalizeMaskedTimeValue(
      event.target.value,
      timePrecision,
    );
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
