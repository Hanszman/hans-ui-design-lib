import type React from 'react';
import type {
  CreateDatePickerApplyHandlerParams,
  CreateDatePickerBlurHandlerParams,
  CreateDatePickerClearHandlerParams,
  CreateDatePickerDisplayInputHandlerParams,
  CreateDatePickerInputMouseDownHandlerParams,
  CreateDatePickerSelectDayHandlerParams,
  CreateDatePickerTodayHandlerParams,
  CreateDatePickerToggleIconMouseDownHandlerParams,
  SyncDatePickerStateParams,
} from './DateTimeInput.helper.types';
import type {
  HansDatePickerTimePrecision,
  HansDatePickerType,
} from '../../DatePicker.types';
import {
  formatDatePickerTimeValue,
  formatDatePickerValue,
  getDatePickerDisplayValueFromStoredValue,
  getDatePickerSelectionFromValue,
  getInitialDatePickerDisplayValue,
  mergeDateAndTime,
  parseTypedDatePickerDisplayValue,
} from '../../helpers/DatePicker.helper';

export const createDatePickerDisplayInputHandler =
  ({ setDisplayValue }: CreateDatePickerDisplayInputHandlerParams) =>
  (event: React.ChangeEvent<HTMLInputElement>): void => {
    setDisplayValue(event.target.value);
  };

export const createDatePickerInputMouseDownHandler =
  ({
    allowInputTyping,
    isOpen,
    handleOpenChange,
  }: CreateDatePickerInputMouseDownHandlerParams) =>
  (event: React.MouseEvent<HTMLInputElement>): void => {
    if (allowInputTyping) return;
    event.preventDefault();
    handleOpenChange(!isOpen);
  };

export const createDatePickerToggleIconMouseDownHandler =
  ({
    isOpen,
    handleOpenChange,
  }: CreateDatePickerToggleIconMouseDownHandlerParams) =>
  (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    handleOpenChange(!isOpen);
  };

export const createDatePickerSelectDayHandler =
  ({
    pickerType,
    timePrecision,
    applyValue,
    setDisplayValue,
    setDraftDate,
    setViewDate,
    handleOpenChange,
  }: CreateDatePickerSelectDayHandlerParams) =>
  (day: {
    date: Date;
    isoValue: string;
  }): void => {
    setDraftDate(day.date);
    setViewDate(day.date);

    if (pickerType === 'date') {
      applyValue(day.isoValue);
      setDisplayValue(
        getInitialDatePickerDisplayValue(
          pickerType,
          day.isoValue,
          timePrecision,
        ),
      );
      handleOpenChange(false);
    }
  };

export const createDatePickerClearHandler =
  ({
    setDraftDate,
    setTimeInputValue,
    setDisplayValue,
    applyValue,
    handleOpenChange,
  }: CreateDatePickerClearHandlerParams) =>
  (): void => {
    setDraftDate(null);
    setTimeInputValue('');
    if (setDisplayValue) setDisplayValue('');
    applyValue('');
    if (handleOpenChange) handleOpenChange(false);
  };

export const createDatePickerTodayHandler =
  ({
    pickerType,
    timePrecision,
    applyValue,
    setDisplayValue,
    setDraftDate,
    setViewDate,
    setTimeInputValue,
    handleOpenChange,
    now = new Date(),
  }: CreateDatePickerTodayHandlerParams) =>
  (): void => {
    setDraftDate(now);
    setViewDate(now);

    if (pickerType === 'date') {
      const nextValue = formatDatePickerValue({
        pickerType,
        date: now,
        timePrecision,
      });
      applyValue(nextValue);
      setDisplayValue(
        getInitialDatePickerDisplayValue(pickerType, nextValue, timePrecision),
      );
      handleOpenChange(false);
      return;
    }

    setTimeInputValue(
      now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: timePrecision === 'second' ? '2-digit' : undefined,
        hour12: false,
      }),
    );
  };

export const createDatePickerApplyHandler =
  ({
    pickerType,
    draftDate,
    timeInputValue,
    timePrecision,
    setTimeInputValue,
    setDisplayValue,
    applyValue,
    handleOpenChange,
  }: CreateDatePickerApplyHandlerParams) =>
  (): void => {
    if (!draftDate) return;
    const mergedDate = mergeDateAndTime(draftDate, timeInputValue, timePrecision);
    if (!mergedDate) {
      setTimeInputValue('');
      applyValue('');
      return;
    }

    const nextValue = formatDatePickerValue({
      pickerType,
      date: mergedDate,
      timePrecision,
    });
    applyValue(nextValue);
    setDisplayValue(
      getInitialDatePickerDisplayValue(pickerType, nextValue, timePrecision),
    );
    handleOpenChange(false);
  };

export const getDatePickerAllowApply = (
  pickerType: Exclude<HansDatePickerType, 'time'>,
  draftDate: Date | null,
  timeInputValue: string,
  timePrecision: HansDatePickerTimePrecision,
): boolean =>
  pickerType === 'date' ||
  Boolean(draftDate && mergeDateAndTime(draftDate, timeInputValue, timePrecision));

export const syncDatePickerState = ({
  pickerType,
  value,
  timePrecision,
  setDraftDate,
  setViewDate,
  setTimeInputValue,
  setDisplayValue,
}: SyncDatePickerStateParams): void => {
  const nextDate = getDatePickerSelectionFromValue(
    pickerType,
    value,
    timePrecision,
  );

  setDraftDate(nextDate);
  setViewDate(nextDate ?? new Date());
  setTimeInputValue(
    nextDate
      ? formatDatePickerTimeValue(
          {
            hours: nextDate.getHours(),
            minutes: nextDate.getMinutes(),
            seconds: nextDate.getSeconds(),
          },
          timePrecision,
        )
      : '',
  );

  if (setDisplayValue && pickerType !== 'time') {
    setDisplayValue(
      getDatePickerDisplayValueFromStoredValue(pickerType, value, timePrecision),
    );
  }
};

export const createDatePickerBlurHandler =
  ({
    pickerType,
    allowInputTyping,
    timePrecision,
    displayValue,
    setDisplayValue,
    setDraftDate,
    setViewDate,
    setTimeInputValue,
    applyValue,
  }: CreateDatePickerBlurHandlerParams) =>
  (): void => {
    if (!allowInputTyping) return;

    if (!displayValue.trim()) {
      setDisplayValue('');
      setDraftDate(null);
      setTimeInputValue('');
      applyValue('');
      return;
    }

    const parsedDate = parseTypedDatePickerDisplayValue(
      pickerType,
      displayValue.trim(),
      timePrecision,
    );

    if (!parsedDate) {
      setDisplayValue('');
      setDraftDate(null);
      setTimeInputValue('');
      applyValue('');
      return;
    }

    const storedValue = formatDatePickerValue({
      pickerType,
      date: parsedDate,
      timePrecision,
    });

    setDraftDate(parsedDate);
    setViewDate(parsedDate);
    setTimeInputValue(
      formatDatePickerTimeValue(
        {
          hours: parsedDate.getHours(),
          minutes: parsedDate.getMinutes(),
          seconds: parsedDate.getSeconds(),
        },
        timePrecision,
      ),
    );
    setDisplayValue(
      getDatePickerDisplayValueFromStoredValue(
        pickerType,
        storedValue,
        timePrecision,
      ),
    );
    applyValue(storedValue);
  };
