import type React from 'react';
import type {
  CreateDatePickerApplyHandlerParams,
  CreateDatePickerBlurHandlerParams,
  CreateDatePickerChangeHandlerParams,
  CreateDatePickerDisplayInputHandlerParams,
  CreateDatePickerClearHandlerParams,
  CreateDatePickerInputMouseDownHandlerParams,
  CreateMonthNavigationHandlerParams,
  CreateDatePickerOpenHandlerParams,
  CreateDatePickerSelectDayHandlerParams,
  CreateDatePickerTimeInputHandlerParams,
  CreateDatePickerToggleIconMouseDownHandlerParams,
  CreateDatePickerTodayHandlerParams,
  CreateTimeInputChangeHandlerParams,
  CreateSyncDatePickerPopupOffsetsParams,
  DatePickerPopupOffsets,
  DatePickerTimeParts,
  FormatDatePickerDisplayParams,
  FormatDatePickerValueParams,
  ParseDatePickerValueParams,
  SyncTimeInputStateParams,
  SyncDatePickerStateParams,
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
export const WEEKDAY_LABELS_SUNDAY = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];
export const WEEKDAY_LABELS_MONDAY = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

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

export const getWeekdayLabels = (weekStartsOnSunday: boolean): string[] =>
  weekStartsOnSunday ? WEEKDAY_LABELS_SUNDAY : WEEKDAY_LABELS_MONDAY;

export const getDatePickerMonthLabel = (value: Date): string =>
  value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

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

export const addMonths = (value: Date, months: number): Date => {
  const nextDate = cloneDate(value);
  nextDate.setDate(1);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
};

export const getStartOfCalendarGrid = (
  viewDate: Date,
  weekStartsOnSunday: boolean,
): Date => {
  const startDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const weekday = startDate.getDay();
  const shift = weekStartsOnSunday ? weekday : (weekday + 6) % 7;
  startDate.setDate(startDate.getDate() - shift);
  return startDate;
};

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

export const buildCalendarDays = ({
  viewDate,
  selectedDate,
  weekStartsOnSunday,
  today = new Date(),
}: {
  viewDate: Date;
  selectedDate: Date | null;
  weekStartsOnSunday: boolean;
  today?: Date;
}) =>
  Array.from({ length: 42 }, (_, index) => {
    const nextDate = getStartOfCalendarGrid(viewDate, weekStartsOnSunday);
    nextDate.setDate(nextDate.getDate() + index);

    return {
      date: nextDate,
      isoValue: formatDatePickerValue({
        pickerType: 'date',
        date: nextDate,
        timePrecision: 'minute',
      }),
      isCurrentMonth: nextDate.getMonth() === viewDate.getMonth(),
      isSelected: isSameDay(nextDate, selectedDate),
      isToday: isSameDay(nextDate, today),
    };
  });

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

export const createDatePickerTimeInputHandler =
  ({
    timePrecision,
    setTimeInputValue,
  }: CreateDatePickerTimeInputHandlerParams) =>
  (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTimeInputValue(normalizeMaskedTimeValue(event.target.value, timePrecision));
  };

export const createDatePickerDisplayInputHandler =
  ({ setDisplayValue }: CreateDatePickerDisplayInputHandlerParams) =>
  (event: React.ChangeEvent<HTMLInputElement>): void => {
    setDisplayValue(event.target.value);
  };

export const createTimeInputChangeHandler =
  ({
    timePrecision,
    handleMaskedChange,
    setTimeInputValue,
    applyValue,
  }: CreateTimeInputChangeHandlerParams) =>
  (event: React.ChangeEvent<HTMLInputElement>): void => {
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

export const createMonthNavigationHandler =
  ({ viewDate, months, setViewDate }: CreateMonthNavigationHandlerParams) =>
  (): void => {
    setViewDate(addMonths(viewDate, months));
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
