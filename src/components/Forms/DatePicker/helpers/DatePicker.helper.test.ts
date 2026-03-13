import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  addMonths,
  buildCalendarDays,
  cloneDate,
  createDatePickerChangeHandler,
  createDatePickerOpenHandler,
  createDatePickerTimeInputHandler,
  createSyncDatePickerPopupOffsets,
  formatDatePickerDisplay,
  formatDatePickerTimeValue,
  formatDatePickerValue,
  getDatePickerFieldStyle,
  getDatePickerMonthLabel,
  getDatePickerPlaceholder,
  getDatePickerPopupOffsets,
  getDatePickerSelectionFromValue,
  getElementOuterHeight,
  getInitialDatePickerViewDate,
  getStartOfCalendarGrid,
  getWeekdayLabels,
  isSameDay,
  isValidDate,
  mergeDateAndTime,
  normalizeMaskedTimeValue,
  padDatePickerNumber,
  parseDatePickerValue,
  parsePx,
  parseTimeInputValue,
} from './DatePicker.helper';

describe('DatePicker.helper', () => {
  it('Should resolve placeholders, labels and padded values', () => {
    expect(padDatePickerNumber(4)).toBe('04');
    expect(getDatePickerPlaceholder('date', 'minute')).toBe('DD/MM/YYYY');
    expect(getDatePickerPlaceholder('datetime', 'minute')).toBe(
      'DD/MM/YYYY HH:MM',
    );
    expect(getDatePickerPlaceholder('datetime', 'second')).toBe(
      'DD/MM/YYYY HH:MM:SS',
    );
    expect(getDatePickerPlaceholder('time', 'second')).toBe('HH:MM:SS');
    expect(getWeekdayLabels(true)).toEqual([
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ]);
    expect(getWeekdayLabels(false)).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ]);
    expect(getDatePickerMonthLabel(new Date(2026, 2, 1))).toBe('March 2026');
  });

  it('Should clone, shift months and resolve calendar grid start', () => {
    const baseDate = new Date(2026, 2, 13, 15, 20, 10);
    const clonedDate = cloneDate(baseDate);

    expect(clonedDate).not.toBe(baseDate);
    expect(clonedDate.getTime()).toBe(baseDate.getTime());
    expect(addMonths(new Date(2026, 0, 31), 1).getMonth()).toBe(1);
    expect(getStartOfCalendarGrid(new Date(2026, 2, 15), true).getDay()).toBe(
      0,
    );
    expect(
      getStartOfCalendarGrid(new Date(2026, 2, 15), false).getDay(),
    ).toBe(1);
  });

  it('Should validate, parse and format time values', () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date('invalid'))).toBe(false);
    expect(
      formatDatePickerTimeValue({ hours: 9, minutes: 5, seconds: 3 }, 'minute'),
    ).toBe('09:05');
    expect(
      formatDatePickerTimeValue({ hours: 9, minutes: 5, seconds: 3 }, 'second'),
    ).toBe('09:05:03');
    expect(parseTimeInputValue('09:05', 'minute')).toEqual({
      hours: 9,
      minutes: 5,
      seconds: 0,
    });
    expect(parseTimeInputValue('09:05:03', 'second')).toEqual({
      hours: 9,
      minutes: 5,
      seconds: 3,
    });
    expect(parseTimeInputValue('09:05:03', 'minute')).toBeNull();
    expect(parseTimeInputValue('29:05', 'minute')).toBeNull();
    expect(parseTimeInputValue('ab', 'minute')).toBeNull();
    expect(normalizeMaskedTimeValue('123456', 'minute')).toBe('12:34');
    expect(normalizeMaskedTimeValue('123456', 'second')).toBe('12:34:56');
  });

  it('Should parse and format picker values', () => {
    const dateValue = new Date(2026, 2, 13, 9, 5, 3);

    expect(
      formatDatePickerValue({
        pickerType: 'date',
        date: dateValue,
        timePrecision: 'minute',
      }),
    ).toBe('2026-03-13');
    expect(
      formatDatePickerValue({
        pickerType: 'time',
        date: dateValue,
        timePrecision: 'second',
      }),
    ).toBe('09:05:03');
    expect(
      formatDatePickerValue({
        pickerType: 'datetime',
        date: dateValue,
        timePrecision: 'minute',
      }),
    ).toBe('2026-03-13T09:05');

    expect(
      parseDatePickerValue({
        pickerType: 'date',
        value: '2026-03-13',
        timePrecision: 'minute',
      })?.getDate(),
    ).toBe(13);
    expect(
      parseDatePickerValue({
        pickerType: 'datetime',
        value: '2026-03-13T09:05',
        timePrecision: 'minute',
      })?.getHours(),
    ).toBe(9);
    expect(
      parseDatePickerValue({
        pickerType: 'time',
        value: '09:05:03',
        timePrecision: 'second',
      })?.getSeconds(),
    ).toBe(3);
    expect(
      parseDatePickerValue({
        pickerType: 'datetime',
        value: '2026-03-13T09:05:03',
        timePrecision: 'minute',
      }),
    ).toBeNull();
    expect(
      parseDatePickerValue({
        pickerType: 'datetime',
        value: 'oops',
        timePrecision: 'minute',
      }),
    ).toBeNull();
    expect(
      parseDatePickerValue({
        pickerType: 'time',
        value: 'oops',
        timePrecision: 'minute',
      }),
    ).toBeNull();
    expect(
      formatDatePickerDisplay({
        pickerType: 'date',
        value: '2026-03-13',
        timePrecision: 'minute',
        noDateText: '',
      }),
    ).toBe('13/03/2026');
    expect(
      formatDatePickerDisplay({
        pickerType: 'datetime',
        value: '2026-03-13T09:05',
        timePrecision: 'minute',
        noDateText: '',
      }),
    ).toBe('13/03/2026 09:05');
    expect(
      formatDatePickerDisplay({
        pickerType: 'time',
        value: '09:05',
        timePrecision: 'minute',
        noDateText: '',
      }),
    ).toBe('09:05');
    expect(
      formatDatePickerDisplay({
        pickerType: 'date',
        value: undefined,
        timePrecision: 'minute',
        noDateText: 'No date',
      }),
    ).toBe('No date');
    expect(
      formatDatePickerDisplay({
        pickerType: 'date',
        value: 'invalid',
        timePrecision: 'minute',
        noDateText: 'No date',
      }),
    ).toBe('invalid');
  });

  it('Should resolve selection, initial view date and merge time', () => {
    expect(
      getDatePickerSelectionFromValue('date', '2026-03-13', 'minute')?.getMonth(),
    ).toBe(2);
    expect(isSameDay(new Date(2026, 2, 13), new Date(2026, 2, 13))).toBe(true);
    expect(
      getInitialDatePickerViewDate('date', '2026-03-13', 'minute').getFullYear(),
    ).toBe(2026);
    expect(
      mergeDateAndTime(new Date(2026, 2, 13), '12:45', 'minute')?.getHours(),
    ).toBe(12);
    expect(mergeDateAndTime(new Date(2026, 2, 13), '99:45', 'minute')).toBeNull();
  });

  it('Should build calendar days and mark current month, today and selection', () => {
    const days = buildCalendarDays({
      viewDate: new Date(2026, 2, 13),
      selectedDate: new Date(2026, 2, 13),
      weekStartsOnSunday: true,
      today: new Date(2026, 2, 13),
    });

    expect(days).toHaveLength(42);
    expect(days.some((day) => day.isSelected)).toBe(true);
    expect(days.some((day) => day.isToday)).toBe(true);
    expect(days.some((day) => !day.isCurrentMonth)).toBe(true);
  });

  it('Should resolve popup offsets and field style', () => {
    expect(parsePx('2.5px')).toBe(2.5);
    expect(parsePx('abc')).toBe(0);
    expect(getElementOuterHeight(null)).toBe(0);

    const container = document.createElement('div');
    const label = document.createElement('label');
    label.className = 'hans-input-label';
    Object.defineProperty(label, 'offsetHeight', { value: 12 });
    label.style.marginTop = '1px';
    label.style.marginBottom = '2px';

    const message = document.createElement('p');
    message.className = 'hans-input-message';
    Object.defineProperty(message, 'offsetHeight', { value: 10 });
    message.style.marginTop = '3px';
    message.style.marginBottom = '4px';

    container.appendChild(label);
    container.appendChild(message);

    expect(getDatePickerPopupOffsets(container)).toEqual({ up: 15, down: 17 });
    expect(getDatePickerPopupOffsets(null)).toEqual({ up: 0, down: 0 });
    expect(getDatePickerFieldStyle({ up: 15, down: 17 })).toEqual({
      '--hans-date-picker-up-offset': '15px',
      '--hans-date-picker-down-offset': '17px',
    });
  });

  it('Should create change, open, time-input and popup sync handlers', () => {
    const setInternalValue = vi.fn();
    const onChange = vi.fn();
    const handleChange = createDatePickerChangeHandler({
      disabled: false,
      isControlled: false,
      setInternalValue,
      onChange,
    });
    handleChange('2026-03-13');
    expect(setInternalValue).toHaveBeenCalledWith('2026-03-13');
    expect(onChange).toHaveBeenCalledWith('2026-03-13');

    createDatePickerChangeHandler({
      disabled: true,
      isControlled: false,
      setInternalValue,
      onChange,
    })('2026-03-14');
    expect(onChange).toHaveBeenCalledTimes(1);

    const setIsOpen = vi.fn();
    const onOpenChange = vi.fn();
    createDatePickerOpenHandler({
      disabled: false,
      setIsOpen,
      onOpenChange,
    })(true);
    expect(setIsOpen).toHaveBeenCalledWith(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    createDatePickerOpenHandler({
      disabled: true,
      setIsOpen,
      onOpenChange,
    })(false);
    expect(onOpenChange).toHaveBeenCalledTimes(1);

    const setTimeInputValue = vi.fn();
    const event = {
      target: { value: '123456' },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    createDatePickerTimeInputHandler({
      timePrecision: 'second',
      setTimeInputValue,
    })(event);
    expect(setTimeInputValue).toHaveBeenCalledWith('12:34:56');

    const setPopupOffsets = vi.fn();
    createSyncDatePickerPopupOffsets({
      datePickerRef: { current: document.createElement('div') },
      setPopupOffsets,
    })();
    expect(setPopupOffsets).toHaveBeenCalledWith({ up: 0, down: 0 });
  });
});
