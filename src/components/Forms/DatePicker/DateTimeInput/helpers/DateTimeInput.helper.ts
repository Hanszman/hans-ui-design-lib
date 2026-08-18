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
  CreateMonthYearPageNavigationHandlerParams,
  CreateOpenMonthYearPickerHandlerParams,
  CreateSelectMonthYearHandlerParams,
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
import {
  YEAR_WINDOW_SIZE,
  getNextViewDateFromMonthSelection,
  getNextViewDateFromYearSelection,
  getYearWindowStart,
} from '../DateTimeCalendar/MonthYearPicker/helpers/MonthYearPicker.helper';

export const createDatePickerDisplayInputHandler =
  ({
    pickerType,
    timePrecision,
    setDisplayValue,
  }: CreateDatePickerDisplayInputHandlerParams) =>
  (event: React.ChangeEvent<HTMLInputElement>): void => {
    const digits = event.target.value.replace(/\D/g, '');

    if (pickerType === 'date') {
      const nextValue = digits.slice(0, 8).replace(
        /(\d{0,2})(\d{0,2})(\d{0,4})/,
        (_, day, month, year) =>
          [day, month, year].filter(Boolean).join('/'),
      );
      setDisplayValue(nextValue);
      return;
    }

    const maxDigits = timePrecision === 'second' ? 14 : 12;
    const maskedDigits = digits.slice(0, maxDigits);
    const datePart = maskedDigits.slice(0, 8).replace(
      /(\d{0,2})(\d{0,2})(\d{0,4})/,
      (_, day, month, year) =>
        [day, month, year].filter(Boolean).join('/'),
    );
    const timeDigits = maskedDigits.slice(8);
    const timePart = timeDigits.replace(
      timePrecision === 'second'
        ? /(\d{0,2})(\d{0,2})(\d{0,2})/
        : /(\d{0,2})(\d{0,2})/,
      (_, hours, minutes, seconds) =>
        [hours, minutes, seconds].filter(Boolean).join(':'),
    );

    setDisplayValue([datePart, timePart].filter(Boolean).join(' '));
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
    dateFormat = 'DD/MM/YYYY',
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
          dateFormat,
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
    dateFormat = 'DD/MM/YYYY',
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
        getInitialDatePickerDisplayValue(pickerType, nextValue, timePrecision, dateFormat),
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
    dateFormat = 'DD/MM/YYYY',
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
      getInitialDatePickerDisplayValue(pickerType, nextValue, timePrecision, dateFormat),
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
  dateFormat = 'DD/MM/YYYY',
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
      getDatePickerDisplayValueFromStoredValue(pickerType, value, timePrecision, dateFormat),
    );
  }
};

export const createDatePickerBlurHandler =
  ({
    pickerType,
    allowInputTyping,
    timePrecision,
    dateFormat = 'DD/MM/YYYY',
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
      dateFormat,
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
        dateFormat,
      ),
    );
    applyValue(storedValue);
  };

export const createOpenMonthPickerHandler =
  ({
    viewDate,
    setPageAnchor,
    setCalendarView,
  }: CreateOpenMonthYearPickerHandlerParams) =>
  (): void => {
    setPageAnchor(viewDate.getFullYear());
    setCalendarView('months');
  };

export const createOpenYearPickerHandler =
  ({
    viewDate,
    setPageAnchor,
    setCalendarView,
  }: CreateOpenMonthYearPickerHandlerParams) =>
  (): void => {
    setPageAnchor(getYearWindowStart(viewDate.getFullYear()));
    setCalendarView('years');
  };

export const createMonthYearPageNavigationHandler =
  ({
    calendarView,
    pageAnchor,
    direction,
    setPageAnchor,
  }: CreateMonthYearPageNavigationHandlerParams) =>
  (): void => {
    const step = calendarView === 'months' ? 1 : YEAR_WINDOW_SIZE;
    setPageAnchor(pageAnchor + step * direction);
  };

export const createSelectMonthYearHandler =
  ({
    calendarView,
    pageAnchor,
    viewDate,
    setViewDate,
    setCalendarView,
  }: CreateSelectMonthYearHandlerParams) =>
  (value: number): void => {
    const nextViewDate =
      calendarView === 'months'
        ? getNextViewDateFromMonthSelection({ pageYear: pageAnchor, monthIndex: value })
        : getNextViewDateFromYearSelection({ viewDate, year: value });

    setViewDate(nextViewDate);
    setCalendarView('days');
  };

export const createBackToCalendarHandler =
  ({
    setCalendarView,
  }: {
    setCalendarView: (view: 'days' | 'months' | 'years') => void;
  }) =>
  (): void => {
    setCalendarView('days');
  };
