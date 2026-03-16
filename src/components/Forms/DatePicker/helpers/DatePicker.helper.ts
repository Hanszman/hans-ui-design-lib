import type React from 'react';
import type {
  CreateDatePickerChangeHandlerParams,
  CreateDatePickerOpenHandlerParams,
  CreateSyncDatePickerPopupOffsetsParams,
  DatePickerPopupOffsets,
  DatePickerTimeParts,
  FormatDatePickerDisplayParams,
  FormatDatePickerValueParams,
  ParseDatePickerValueParams,
} from './DatePicker.helper.types';
import type {
  HansDatePickerTimePrecision,
  HansDatePickerType,
} from '../DatePicker.types';

export const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
export const DATETIME_INPUT_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
export const TIME_INPUT_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
export const DISPLAY_DATE_INPUT_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
export const DISPLAY_DATETIME_INPUT_PATTERN =
  /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})(?::(\d{2}))?$/;

export const padDatePickerNumber = (value: number): string =>
  value.toString().padStart(2, '0');

export const getDatePickerPlaceholder = (
  pickerType: HansDatePickerType,
  timePrecision: HansDatePickerTimePrecision,
): string => {
  if (pickerType === 'time') {
    return timePrecision === 'second' ? 'HH:MM:SS' : 'HH:MM';
  }

  if (pickerType === 'datetime') {
    return timePrecision === 'second'
      ? 'DD/MM/YYYY HH:MM:SS'
      : 'DD/MM/YYYY HH:MM';
  }

  return 'DD/MM/YYYY';
};

export const resolveDateTimePickerType = (
  pickerType: HansDatePickerType,
): Exclude<HansDatePickerType, 'time'> =>
  pickerType === 'datetime' ? 'datetime' : 'date';

export const cloneDate = (value: Date): Date => new Date(value.getTime());

export const isMatchingDateParts = (
  date: Date,
  year: number,
  month: number,
  day: number,
): boolean =>
  date.getFullYear() === year &&
  date.getMonth() === month - 1 &&
  date.getDate() === day;

export const isSameDay = (left: Date | null, right: Date | null): boolean =>
  Boolean(
    left &&
      right &&
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate(),
  );

export const isValidDate = (value: Date | null): value is Date =>
  Boolean(value && !Number.isNaN(value.getTime()));

export const formatDatePickerTimeValue = (
  parts: DatePickerTimeParts,
  timePrecision: HansDatePickerTimePrecision,
): string => {
  const baseValue = `${padDatePickerNumber(parts.hours)}:${padDatePickerNumber(parts.minutes)}`;

  if (timePrecision === 'second') {
    return `${baseValue}:${padDatePickerNumber(parts.seconds)}`;
  }

  return baseValue;
};

export const parseTimeInputValue = (
  value: string,
  timePrecision: HansDatePickerTimePrecision,
): DatePickerTimeParts | null => {
  const match = value.match(TIME_INPUT_PATTERN);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? 0);
  const maxSegments = timePrecision === 'second' ? 3 : 2;

  if (
    value.split(':').length > maxSegments ||
    hours > 23 ||
    minutes > 59 ||
    seconds > 59 ||
    (timePrecision === 'minute' && match[3])
  ) {
    return null;
  }

  return { hours, minutes, seconds };
};

export const normalizeMaskedTimeValue = (
  rawValue: string,
  timePrecision: HansDatePickerTimePrecision,
): string => {
  const digits = rawValue
    .replace(/\D/g, '')
    .slice(0, timePrecision === 'second' ? 6 : 4);
  const parts = digits.match(/.{1,2}/g) ?? [];
  return parts.join(':');
};

export const formatDatePickerValue = ({
  pickerType,
  date,
  timePrecision,
}: FormatDatePickerValueParams): string => {
  const year = date.getFullYear();
  const month = padDatePickerNumber(date.getMonth() + 1);
  const day = padDatePickerNumber(date.getDate());

  if (pickerType === 'date') {
    return `${year}-${month}-${day}`;
  }

  if (pickerType === 'time') {
    return formatDatePickerTimeValue(
      {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
      },
      timePrecision,
    );
  }

  return `${year}-${month}-${day}T${formatDatePickerTimeValue(
    {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    },
    timePrecision,
  )}`;
};

export const parseDatePickerValue = ({
  pickerType,
  value,
  timePrecision,
}: ParseDatePickerValueParams): Date | null => {
  if (!value) return null;

  if (pickerType === 'date') {
    const match = value.match(DATE_INPUT_PATTERN);
    if (!match) return null;

    return new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      0,
      0,
      0,
      0,
    );
  }

  if (pickerType === 'datetime') {
    const match = value.match(DATETIME_INPUT_PATTERN);
    if (!match) return null;
    if (timePrecision === 'minute' && match[6]) return null;

    return new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4]),
      Number(match[5]),
      Number(match[6] ?? 0),
      0,
    );
  }

  const parsedTime = parseTimeInputValue(value, timePrecision);
  if (!parsedTime) return null;

  const nextDate = new Date(2000, 0, 1);
  nextDate.setHours(parsedTime.hours, parsedTime.minutes, parsedTime.seconds, 0);
  return nextDate;
};

export const parseTypedDatePickerDisplayValue = (
  pickerType: Exclude<HansDatePickerType, 'time'>,
  value: string,
  timePrecision: HansDatePickerTimePrecision,
): Date | null => {
  if (pickerType === 'date') {
    const match = value.match(DISPLAY_DATE_INPUT_PATTERN);
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const nextDate = new Date(year, month - 1, day, 0, 0, 0, 0);

    return isMatchingDateParts(nextDate, year, month, day) ? nextDate : null;
  }

  const match = value.match(DISPLAY_DATETIME_INPUT_PATTERN);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const hours = Number(match[4]);
  const minutes = Number(match[5]);
  const seconds = Number(match[6] ?? 0);

  if (hours > 23 || minutes > 59 || seconds > 59) return null;
  if (timePrecision === 'minute' && match[6]) return null;

  const nextDate = new Date(year, month - 1, day, hours, minutes, seconds, 0);

  return isMatchingDateParts(nextDate, year, month, day) ? nextDate : null;
};

export const formatDatePickerDisplay = ({
  pickerType,
  value,
  timePrecision,
  noDateText,
}: FormatDatePickerDisplayParams): string => {
  const parsedValue = parseDatePickerValue({
    pickerType,
    value,
    timePrecision,
  });
  if (!parsedValue) return value ?? noDateText;

  if (pickerType === 'time') {
    return formatDatePickerTimeValue(
      {
        hours: parsedValue.getHours(),
        minutes: parsedValue.getMinutes(),
        seconds: parsedValue.getSeconds(),
      },
      timePrecision,
    );
  }

  const dateValue = parsedValue.toLocaleDateString('en-GB');
  if (pickerType === 'date') return dateValue;

  return `${dateValue} ${formatDatePickerTimeValue(
    {
      hours: parsedValue.getHours(),
      minutes: parsedValue.getMinutes(),
      seconds: parsedValue.getSeconds(),
    },
    timePrecision,
  )}`;
};

export const getDatePickerDisplayValueFromStoredValue = (
  pickerType: HansDatePickerType,
  value: string,
  timePrecision: HansDatePickerTimePrecision,
): string =>
  formatDatePickerDisplay({
    pickerType,
    value,
    timePrecision,
    noDateText: '',
  });

export const getInitialDatePickerDisplayValue = (
  pickerType: Exclude<HansDatePickerType, 'time'>,
  value: string,
  timePrecision: HansDatePickerTimePrecision,
): string =>
  getDatePickerDisplayValueFromStoredValue(pickerType, value, timePrecision);

export const mergeDateAndTime = (
  date: Date,
  timeValue: string,
  timePrecision: HansDatePickerTimePrecision,
): Date | null => {
  const parsedTime = parseTimeInputValue(timeValue, timePrecision);
  if (!parsedTime) return null;

  const nextDate = cloneDate(date);
  nextDate.setHours(parsedTime.hours, parsedTime.minutes, parsedTime.seconds, 0);
  return nextDate;
};

export const getDatePickerSelectionFromValue = (
  pickerType: HansDatePickerType,
  value: string | undefined,
  timePrecision: HansDatePickerTimePrecision,
): Date | null =>
  parseDatePickerValue({
    pickerType,
    value,
    timePrecision,
  });

export const getInitialDatePickerViewDate = (
  pickerType: HansDatePickerType,
  value: string | undefined,
  timePrecision: HansDatePickerTimePrecision,
): Date => {
  const parsedValue = getDatePickerSelectionFromValue(
    pickerType,
    value,
    timePrecision,
  );
  return parsedValue ?? new Date();
};

export const getDatePickerFieldStyle = (
  popupOffsets: DatePickerPopupOffsets,
): React.CSSProperties =>
  ({
    '--hans-date-picker-up-offset': `${popupOffsets.up}px`,
    '--hans-date-picker-down-offset': `${popupOffsets.down}px`,
  }) as React.CSSProperties;

export const parsePx = (value: string): number => {
  const parsedValue = Number.parseFloat(value);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

export const getElementOuterHeight = (element: Element | null): number => {
  if (!(element instanceof HTMLElement) || typeof window === 'undefined') {
    return 0;
  }

  const styles = window.getComputedStyle(element);
  return (
    element.offsetHeight +
    parsePx(styles.marginTop) +
    parsePx(styles.marginBottom)
  );
};

export const getDatePickerPopupOffsets = (
  container: HTMLElement | null,
): DatePickerPopupOffsets => {
  if (!container) return { up: 0, down: 0 };

  return {
    up: getElementOuterHeight(container.querySelector('.hans-input-label')),
    down: getElementOuterHeight(container.querySelector('.hans-input-message')),
  };
};

export const createSyncDatePickerPopupOffsets =
  ({ datePickerRef, setPopupOffsets }: CreateSyncDatePickerPopupOffsetsParams) =>
  (): void => {
    setPopupOffsets(getDatePickerPopupOffsets(datePickerRef.current));
  };

export const createDatePickerChangeHandler =
  ({
    disabled,
    isControlled,
    setInternalValue,
    onChange,
  }: CreateDatePickerChangeHandlerParams) =>
  (nextValue: string): void => {
    if (disabled) return;
    if (!isControlled) setInternalValue(nextValue);
    if (onChange) onChange(nextValue);
  };

export const createDatePickerOpenHandler =
  ({
    disabled,
    setIsOpen,
    onOpenChange,
  }: CreateDatePickerOpenHandlerParams) =>
  (nextOpen: boolean): void => {
    if (disabled) return;
    setIsOpen(nextOpen);
    if (onOpenChange) onOpenChange(nextOpen);
  };
