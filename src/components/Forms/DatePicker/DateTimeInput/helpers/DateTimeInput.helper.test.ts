import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  createDatePickerApplyHandler,
  createDatePickerBlurHandler,
  createDatePickerClearHandler,
  createDatePickerDisplayInputHandler,
  createDatePickerInputMouseDownHandler,
  createDatePickerSelectDayHandler,
  createDatePickerTodayHandler,
  createDatePickerToggleIconMouseDownHandler,
  getDatePickerAllowApply,
  syncDatePickerState,
} from './DateTimeInput.helper';

describe('DateTimeInput.helper', () => {
  it('Should create display and mouse handlers', () => {
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
  });

  it('Should create selection, clear, today and apply handlers', () => {
    const setDisplayValue = vi.fn();
    const setDraftDate = vi.fn();
    const setViewDate = vi.fn();
    const setTimeInputValue = vi.fn();
    const applyValue = vi.fn();
    const handleOpenChange = vi.fn();
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
    expect(setDraftDate).toHaveBeenCalledWith(day.date);

    createDatePickerClearHandler({
      setDraftDate,
      setTimeInputValue,
      setDisplayValue,
      applyValue,
      handleOpenChange,
    })();
    expect(setTimeInputValue).toHaveBeenCalledWith('');
    expect(applyValue).toHaveBeenCalledWith('');

    const now = new Date(2026, 2, 13, 11, 22, 33);
    createDatePickerTodayHandler({
      pickerType: 'date',
      timePrecision: 'minute',
      applyValue,
      setDisplayValue,
      setDraftDate,
      setViewDate,
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
      setViewDate,
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
      setViewDate,
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
    expect(getDatePickerAllowApply('date', null, '', 'minute')).toBe(true);
    expect(getDatePickerAllowApply('datetime', null, '', 'minute')).toBe(false);
  });

  it('Should sync state and resolve manual typing on blur', () => {
    const setDraftDate = vi.fn();
    const setViewDate = vi.fn();
    const setTimeInputValue = vi.fn();
    const setDisplayValue = vi.fn();
    const applyValue = vi.fn();

    syncDatePickerState({
      pickerType: 'time',
      value: '09:45',
      timePrecision: 'minute',
      setDraftDate,
      setViewDate,
      setTimeInputValue,
    });

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

    expect(applyValue).toHaveBeenCalledWith('');
    expect(applyValue).toHaveBeenCalledWith('2026-03-13T10:20');
  });
});
