import { describe, expect, it, vi } from 'vitest';
import {
  cloneDate,
  createDatePickerChangeHandler,
  createDatePickerOpenHandler,
  createSyncDatePickerPopupOffsets,
  formatDatePickerDisplay,
  formatDatePickerTimeValue,
  formatDatePickerValue,
  getDatePickerDisplayValueFromStoredValue,
  getDatePickerFieldStyle,
  getDatePickerPlaceholder,
  getDatePickerPopupOffsets,
  getDatePickerSelectionFromValue,
  getElementOuterHeight,
  getInitialDatePickerDisplayValue,
  getInitialDatePickerViewDate,
  isSameDay,
  isValidDate,
  mergeDateAndTime,
  normalizeMaskedTimeValue,
  padDatePickerNumber,
  parseDatePickerValue,
  parsePx,
  parseTimeInputValue,
  parseTypedDatePickerDisplayValue,
  resolveDateTimePickerType,
} from './DatePicker.helper';

describe('DatePicker.helper', () => {
  it('Should resolve placeholders and shared parsing helpers', () => {
    expect(padDatePickerNumber(4)).toBe('04');
    expect(getDatePickerPlaceholder('date', 'minute')).toBe('DD/MM/YYYY');
    expect(getDatePickerPlaceholder('datetime', 'second')).toBe(
      'DD/MM/YYYY HH:MM:SS',
    );
    expect(getDatePickerPlaceholder('time', 'second')).toBe('HH:MM:SS');
    expect(resolveDateTimePickerType('datetime')).toBe('datetime');
    expect(resolveDateTimePickerType('time')).toBe('date');

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
    expect(parseTimeInputValue('25:05', 'minute')).toBeNull();
    expect(normalizeMaskedTimeValue('123456', 'minute')).toBe('12:34');
    expect(normalizeMaskedTimeValue('123456', 'second')).toBe('12:34:56');
  });

  it('Should format and parse date, datetime and time values', () => {
    const dateValue = new Date(2026, 2, 13, 9, 5, 3);

    expect(
      formatDatePickerTimeValue({ hours: 9, minutes: 5, seconds: 3 }, 'minute'),
    ).toBe('09:05');
    expect(
      formatDatePickerTimeValue({ hours: 9, minutes: 5, seconds: 3 }, 'second'),
    ).toBe('09:05:03');
    expect(
      formatDatePickerValue({
        pickerType: 'date',
        date: dateValue,
        timePrecision: 'minute',
      }),
    ).toBe('2026-03-13');
    expect(
      formatDatePickerValue({
        pickerType: 'datetime',
        date: dateValue,
        timePrecision: 'minute',
      }),
    ).toBe('2026-03-13T09:05');
    expect(
      formatDatePickerValue({
        pickerType: 'time',
        date: dateValue,
        timePrecision: 'second',
      }),
    ).toBe('09:05:03');

    expect(
      parseDatePickerValue({
        pickerType: 'date',
        value: '2026-03-13',
        timePrecision: 'minute',
      })?.getDate(),
    ).toBe(13);
    expect(
      parseDatePickerValue({
        pickerType: 'date',
        value: 'oops',
        timePrecision: 'minute',
      }),
    ).toBeNull();
    expect(
      parseDatePickerValue({
        pickerType: 'datetime',
        value: '2026-03-13T09:05',
        timePrecision: 'minute',
      })?.getHours(),
    ).toBe(9);
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
        value: '09:05:03',
        timePrecision: 'second',
      })?.getSeconds(),
    ).toBe(3);
    expect(
      parseDatePickerValue({
        pickerType: 'time',
        value: 'oops',
        timePrecision: 'minute',
      }),
    ).toBeNull();
    expect(
      parseDatePickerValue({
        pickerType: 'datetime',
        value: '2026-03-13T09:05:03',
        timePrecision: 'minute',
      }),
    ).toBeNull();
    expect(
      parseTypedDatePickerDisplayValue('date', '31/02/2026', 'minute'),
    ).toBeNull();
    expect(parseTypedDatePickerDisplayValue('date', 'oops', 'minute')).toBeNull();
    expect(
      parseTypedDatePickerDisplayValue('datetime', 'oops', 'minute'),
    ).toBeNull();
    expect(
      parseTypedDatePickerDisplayValue('datetime', '13/03/2026 25:20', 'minute'),
    ).toBeNull();
    expect(
      parseTypedDatePickerDisplayValue(
        'datetime',
        '13/03/2026 09:05:40',
        'minute',
      ),
    ).toBeNull();
  });

  it('Should expose shared display, selection and validation helpers', () => {
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
      getDatePickerDisplayValueFromStoredValue(
        'datetime',
        '2026-03-13T09:05',
        'minute',
      ),
    ).toBe('13/03/2026 09:05');
    expect(
      getInitialDatePickerDisplayValue('date', '2026-03-13', 'minute'),
    ).toBe('13/03/2026');
    expect(
      getDatePickerSelectionFromValue('date', '2026-03-13', 'minute')?.getMonth(),
    ).toBe(2);
    expect(
      getInitialDatePickerViewDate('date', '2026-03-13', 'minute').getFullYear(),
    ).toBe(2026);
    expect(mergeDateAndTime(new Date(2026, 2, 13), '12:45', 'minute')?.getHours()).toBe(12);
    expect(mergeDateAndTime(new Date(2026, 2, 13), '99:45', 'minute')).toBeNull();
    expect(isSameDay(new Date(2026, 2, 13), new Date(2026, 2, 13))).toBe(true);
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date('invalid'))).toBe(false);
    expect(cloneDate(new Date(2026, 2, 13))).not.toBe(new Date(2026, 2, 13));
  });

  it('Should resolve popup offsets and base handlers', () => {
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

    const setInternalValue = vi.fn();
    const onChange = vi.fn();
    createDatePickerChangeHandler({
      disabled: false,
      isControlled: false,
      setInternalValue,
      onChange,
    })('2026-03-13');
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
    createDatePickerOpenHandler({
      disabled: true,
      setIsOpen,
      onOpenChange,
    })(false);
    expect(onOpenChange).toHaveBeenCalledTimes(1);

    const setPopupOffsets = vi.fn();
    createSyncDatePickerPopupOffsets({
      datePickerRef: { current: document.createElement('div') },
      setPopupOffsets,
    })();
    expect(setPopupOffsets).toHaveBeenCalledWith({ up: 0, down: 0 });
  });
});
