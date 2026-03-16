import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  createTimeInputChangeHandler,
  createTimeInputMaskedValueHandler,
  syncTimeInputState,
} from './TimeInput.helper';

describe('TimeInput.helper', () => {
  it('Should sync masked values and clear invalid times', () => {
    const setTimeInputValue = vi.fn();
    const onMaskedValueChange = vi.fn();
    const syncMaskedValue = createTimeInputMaskedValueHandler({
      timePrecision: 'minute',
      setTimeInputValue,
      onMaskedValueChange,
    });

    expect(syncMaskedValue('1234')).toBe('12:34');
    expect(setTimeInputValue).toHaveBeenCalledWith('12:34');
    expect(onMaskedValueChange).toHaveBeenCalledWith('12:34');

    const applyValue = vi.fn();
    const handleChange = createTimeInputChangeHandler({
      timePrecision: 'minute',
      syncMaskedValue,
      setTimeInputValue,
      applyValue,
    });

    handleChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    handleChange({ target: { value: '12' } } as React.ChangeEvent<HTMLInputElement>);
    handleChange({ target: { value: '2560' } } as React.ChangeEvent<HTMLInputElement>);
    handleChange({ target: { value: '0945' } } as React.ChangeEvent<HTMLInputElement>);

    expect(applyValue).toHaveBeenCalledWith('');
    expect(applyValue).toHaveBeenCalledWith('09:45');
  });

  it('Should sync controlled state only when needed', () => {
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
      value: undefined,
      setInternalValue,
      setTimeInputValue,
    });
    expect(setInternalValue).toHaveBeenCalledWith('');
    expect(setTimeInputValue).toHaveBeenCalledWith('');
  });
});
