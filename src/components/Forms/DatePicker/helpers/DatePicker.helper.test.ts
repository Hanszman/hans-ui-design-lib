import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  addMonths,
  buildCalendarDays,
  cloneDate,
  createDatePickerApplyHandler,
  createDatePickerBlurHandler,
  createDatePickerChangeHandler,
  createDatePickerClearHandler,
  createDatePickerDisplayInputHandler,
  createDatePickerInputMouseDownHandler,
  createDatePickerOpenHandler,
  createDatePickerSelectDayHandler,
  createDatePickerTimeInputHandler,
  createDatePickerTodayHandler,
  createDatePickerToggleIconMouseDownHandler,
  createMonthNavigationHandler,
  createTimeInputChangeHandler,
  createSyncDatePickerPopupOffsets,
  formatDatePickerDisplay,
  formatDatePickerTimeValue,
  formatDatePickerValue,
  getDatePickerAllowApply,
  getDatePickerFieldStyle,
  getDatePickerDisplayValueFromStoredValue,
  getDatePickerMonthLabel,
  getDatePickerPlaceholder,
  getDatePickerPopupOffsets,
  getDatePickerSelectionFromValue,
  getElementOuterHeight,
  getInitialDatePickerDisplayValue,
  getInitialDatePickerViewDate,
  getStartOfCalendarGrid,
  getWeekdayLabels,
  isSameDay,
  isValidDate,
  mergeDateAndTime,
  normalizeMaskedTimeValue,
  padDatePickerNumber,
  parseDatePickerValue,
  parseTypedDatePickerDisplayValue,
  parsePx,
  parseTimeInputValue,
  resolveDateTimePickerType,
  syncDatePickerState,
  syncTimeInputState,
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
    expect(resolveDateTimePickerType('datetime')).toBe('datetime');
    expect(resolveDateTimePickerType('time')).toBe('date');
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
    expect(
      getDatePickerDisplayValueFromStoredValue(
        'datetime',
        '2026-03-13T09:05',
        'minute',
      ),
    ).toBe('13/03/2026 09:05');
    expect(
      getInitialDatePickerDisplayValue('date', '2026-03-13', 'minute'),
    ).toBe('13/03/2026');
    expect(parseTypedDatePickerDisplayValue('date', '31/02/2026', 'minute')).toBeNull();
    expect(parseTypedDatePickerDisplayValue('date', 'oops', 'minute')).toBeNull();
    expect(
      parseTypedDatePickerDisplayValue('datetime', 'oops', 'minute'),
    ).toBeNull();
    expect(
      parseTypedDatePickerDisplayValue(
        'datetime',
        '13/03/2026 25:20',
        'minute',
      ),
    ).toBeNull();
    expect(
      parseTypedDatePickerDisplayValue(
        'datetime',
        '13/03/2026 09:05:40',
        'minute',
      ),
    ).toBeNull();
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

  it('Should create advanced handlers for typing, selection and navigation', () => {
    const setDisplayValue = vi.fn();
    createDatePickerDisplayInputHandler({ setDisplayValue })({
      target: { value: '13/03/2026' },
    } as React.ChangeEvent<HTMLInputElement>);
    expect(setDisplayValue).toHaveBeenCalledWith('13/03/2026');

    const handleOpenChange = vi.fn();
    const mouseDownEvent = { preventDefault: vi.fn() } as unknown as React.MouseEvent<HTMLInputElement>;
    createDatePickerInputMouseDownHandler({
      allowInputTyping: false,
      isOpen: false,
      handleOpenChange,
    })(mouseDownEvent);
    expect(mouseDownEvent.preventDefault).toHaveBeenCalled();
    expect(handleOpenChange).toHaveBeenCalledWith(true);

    createDatePickerInputMouseDownHandler({
      allowInputTyping: true,
      isOpen: false,
      handleOpenChange,
    })(mouseDownEvent);
    expect(handleOpenChange).toHaveBeenCalledTimes(1);

    const toggleEvent = { preventDefault: vi.fn() } as unknown as React.MouseEvent<HTMLButtonElement>;
    createDatePickerToggleIconMouseDownHandler({
      isOpen: true,
      handleOpenChange,
    })(toggleEvent);
    expect(toggleEvent.preventDefault).toHaveBeenCalled();
    expect(handleOpenChange).toHaveBeenCalledWith(false);

    const setViewDate = vi.fn();
    createMonthNavigationHandler({
      viewDate: new Date(2026, 2, 13),
      months: 1,
      setViewDate,
    })();
    expect(setViewDate).toHaveBeenCalled();

    const setDraftDate = vi.fn();
    const applyValue = vi.fn();
    const day = { date: new Date(2026, 2, 13), isoValue: '2026-03-13' };
    createDatePickerSelectDayHandler({
      pickerType: 'date',
      timePrecision: 'minute',
      applyValue,
      setDisplayValue,
      setDraftDate,
      setViewDate,
      handleOpenChange,
    })(day);
    expect(setDraftDate).toHaveBeenCalledWith(day.date);
    expect(applyValue).toHaveBeenCalledWith('2026-03-13');

    createDatePickerSelectDayHandler({
      pickerType: 'datetime',
      timePrecision: 'minute',
      applyValue,
      setDisplayValue,
      setDraftDate,
      setViewDate,
      handleOpenChange,
    })(day);
    expect(applyValue).toHaveBeenCalledTimes(1);
  });

  it('Should create clear, today and apply handlers', () => {
    const setDraftDate = vi.fn();
    const setTimeInputValue = vi.fn();
    const setDisplayValue = vi.fn();
    const applyValue = vi.fn();
    const handleOpenChange = vi.fn();

    createDatePickerClearHandler({
      setDraftDate,
      setTimeInputValue,
      setDisplayValue,
      applyValue,
      handleOpenChange,
    })();
    expect(setDraftDate).toHaveBeenCalledWith(null);
    expect(setTimeInputValue).toHaveBeenCalledWith('');
    expect(setDisplayValue).toHaveBeenCalledWith('');
    expect(applyValue).toHaveBeenCalledWith('');
    expect(handleOpenChange).toHaveBeenCalledWith(false);

    createDatePickerClearHandler({
      setDraftDate,
      setTimeInputValue,
      applyValue,
    })();

    const now = new Date(2026, 2, 13, 11, 22, 33);
    createDatePickerTodayHandler({
      pickerType: 'date',
      timePrecision: 'minute',
      applyValue,
      setDisplayValue,
      setDraftDate,
      setViewDate: vi.fn(),
      setTimeInputValue,
      handleOpenChange,
      now,
    })();
    expect(applyValue).toHaveBeenCalledWith('2026-03-13');

    createDatePickerTodayHandler({
      pickerType: 'datetime',
      timePrecision: 'second',
      applyValue,
      setDisplayValue,
      setDraftDate,
      setViewDate: vi.fn(),
      setTimeInputValue,
      handleOpenChange,
      now,
    })();
    expect(setTimeInputValue).toHaveBeenCalledWith('11:22:33');
    createDatePickerTodayHandler({
      pickerType: 'datetime',
      timePrecision: 'minute',
      applyValue,
      setDisplayValue,
      setDraftDate,
      setViewDate: vi.fn(),
      setTimeInputValue,
      handleOpenChange,
      now,
    })();
    expect(setTimeInputValue).toHaveBeenCalledWith('11:22');

    createDatePickerApplyHandler({
      pickerType: 'datetime',
      draftDate: null,
      timeInputValue: '10:20',
      timePrecision: 'minute',
      setTimeInputValue,
      setDisplayValue,
      applyValue,
      handleOpenChange,
    })();

    createDatePickerApplyHandler({
      pickerType: 'datetime',
      draftDate: new Date(2026, 2, 13),
      timeInputValue: '99:99',
      timePrecision: 'minute',
      setTimeInputValue,
      setDisplayValue,
      applyValue,
      handleOpenChange,
    })();
    expect(setTimeInputValue).toHaveBeenCalledWith('');

    createDatePickerApplyHandler({
      pickerType: 'datetime',
      draftDate: new Date(2026, 2, 13),
      timeInputValue: '10:20',
      timePrecision: 'minute',
      setTimeInputValue,
      setDisplayValue,
      applyValue,
      handleOpenChange,
    })();
    expect(applyValue).toHaveBeenCalledWith('2026-03-13T10:20');
    expect(handleOpenChange).toHaveBeenCalledWith(false);
    expect(getDatePickerAllowApply('date', null, '', 'minute')).toBe(true);
    expect(getDatePickerAllowApply('datetime', null, '', 'minute')).toBe(false);
    expect(
      getDatePickerAllowApply(
        'datetime',
        new Date(2026, 2, 13),
        '10:20',
        'minute',
      ),
    ).toBe(true);
  });

  it('Should create blur, sync and time change handlers', () => {
    const setInternalValue = vi.fn();
    const setTimeInputValue = vi.fn();
    syncTimeInputState({
      isControlled: false,
      value: '08:00',
      setInternalValue,
      setTimeInputValue,
    });
    expect(setInternalValue).not.toHaveBeenCalled();

    syncTimeInputState({
      isControlled: true,
      value: '08:00',
      setInternalValue,
      setTimeInputValue,
    });
    expect(setInternalValue).toHaveBeenCalledWith('08:00');
    expect(setTimeInputValue).toHaveBeenCalledWith('08:00');
    syncTimeInputState({
      isControlled: true,
      value: undefined,
      setInternalValue,
      setTimeInputValue,
    });
    expect(setInternalValue).toHaveBeenCalledWith('');

    const handleMaskedChange = vi.fn();
    const applyValue = vi.fn();
    const setMaskedValue = vi.fn();
    const timeChangeHandler = createTimeInputChangeHandler({
      timePrecision: 'minute',
      handleMaskedChange,
      setTimeInputValue: setMaskedValue,
      applyValue,
    });
    timeChangeHandler({
      target: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>);
    timeChangeHandler({
      target: { value: '12' },
    } as React.ChangeEvent<HTMLInputElement>);
    timeChangeHandler({
      target: { value: '2560' },
    } as React.ChangeEvent<HTMLInputElement>);
    timeChangeHandler({
      target: { value: '1234' },
    } as React.ChangeEvent<HTMLInputElement>);
    expect(handleMaskedChange).toHaveBeenCalledTimes(4);
    expect(applyValue).toHaveBeenCalledWith('');
    expect(applyValue).toHaveBeenCalledWith('12:34');

    const setDraftDate = vi.fn();
    const setViewDate = vi.fn();
    const setDisplayValue = vi.fn();
    syncDatePickerState({
      pickerType: 'time',
      value: '09:45',
      timePrecision: 'minute',
      setDraftDate,
      setViewDate,
      setTimeInputValue,
    });
    expect(setDisplayValue).not.toHaveBeenCalled();

    createDatePickerBlurHandler({
      pickerType: 'date',
      allowInputTyping: false,
      timePrecision: 'minute',
      displayValue: '13/03/2026',
      setDisplayValue,
      setDraftDate,
      setViewDate,
      setTimeInputValue,
      applyValue,
    })();

    createDatePickerBlurHandler({
      pickerType: 'date',
      allowInputTyping: true,
      timePrecision: 'minute',
      displayValue: '   ',
      setDisplayValue,
      setDraftDate,
      setViewDate,
      setTimeInputValue,
      applyValue,
    })();
    expect(setDisplayValue).toHaveBeenCalledWith('');

    createDatePickerBlurHandler({
      pickerType: 'datetime',
      allowInputTyping: true,
      timePrecision: 'minute',
      displayValue: '31/02/2026 10:20',
      setDisplayValue,
      setDraftDate,
      setViewDate,
      setTimeInputValue,
      applyValue,
    })();

    createDatePickerBlurHandler({
      pickerType: 'datetime',
      allowInputTyping: true,
      timePrecision: 'minute',
      displayValue: '13/03/2026 10:20',
      setDisplayValue,
      setDraftDate,
      setViewDate,
      setTimeInputValue,
      applyValue,
    })();
    expect(applyValue).toHaveBeenCalledWith('2026-03-13T10:20');
  });
});
