import {
  buildToggleStyle,
  getLoadingSizeFromToggleSize,
  getSegmentedSkeletonHeight,
  getContentLength,
  getSwitchWidth,
  getToggleColorClass,
  handleOptionSelect,
  handleSwitchToggle,
  normalizeToggleColor,
} from './Toggle.helper';
import { vi } from 'vitest';
import React from 'react';

describe('Toggle.helper', () => {
  it('Should fallback base color to primary', () => {
    expect(normalizeToggleColor('base')).toBe('primary');
    expect(normalizeToggleColor('success')).toBe('success');
  });

  it('Should return off class for unchecked toggle', () => {
    expect(getToggleColorClass(false, false, 'primary')).toBe(
      'hans-toggle-off',
    );
  });

  it('Should return off disabled class when unchecked and disabled', () => {
    expect(getToggleColorClass(false, true, 'primary')).toBe(
      'hans-toggle-off-disabled',
    );
  });

  it('Should return on disabled class when checked and disabled', () => {
    expect(getToggleColorClass(true, true, 'danger')).toBe(
      'hans-toggle-on-disabled',
    );
  });

  it('Should return color class when checked and enabled', () => {
    expect(getToggleColorClass(true, false, 'warning')).toBe(
      'hans-toggle-on-warning',
    );
  });

  it('Should compute content length for text, number and icon', () => {
    expect(getContentLength('abc')).toBe(3);
    expect(getContentLength(1234)).toBe(4);
    expect(getContentLength(React.createElement('span', null, 'icon'))).toBe(2);
    expect(getContentLength(null)).toBe(0);
  });

  it('Should compute switch width with max clamp', () => {
    expect(getSwitchWidth('small', '', '')).toBeUndefined();
    expect(getSwitchWidth('small', 'ON', 'OFF')).toBe(63);
    expect(getSwitchWidth('small', '123456789012345', '')).toBe(88);
  });

  it('Should merge style with computed width', () => {
    expect(buildToggleStyle(undefined, undefined)).toEqual({});
    expect(buildToggleStyle({ opacity: 0.5 }, 80)).toEqual({
      opacity: 0.5,
      width: '80px',
    });
  });

  it('Should toggle switch and call onChange when enabled', () => {
    const setInternalChecked = vi.fn();
    const onChange = vi.fn();

    handleSwitchToggle({
      disabled: false,
      isChecked: false,
      isControlled: false,
      setInternalChecked,
      onChange,
    });

    expect(setInternalChecked).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('Should not toggle switch when disabled', () => {
    const setInternalChecked = vi.fn();
    const onChange = vi.fn();

    handleSwitchToggle({
      disabled: true,
      isChecked: true,
      isControlled: false,
      setInternalChecked,
      onChange,
    });

    expect(setInternalChecked).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should select segmented option with controlled and uncontrolled modes', () => {
    const setInternalValue = vi.fn();
    const onValueChange = vi.fn();

    handleOptionSelect({
      disabled: false,
      optionDisabled: false,
      nextValue: 'a',
      isControlled: false,
      setInternalValue,
      onValueChange,
    });
    expect(setInternalValue).toHaveBeenCalledWith('a');
    expect(onValueChange).toHaveBeenCalledWith('a');

    handleOptionSelect({
      disabled: false,
      optionDisabled: false,
      nextValue: 'b',
      isControlled: true,
      setInternalValue,
      onValueChange,
    });
    expect(setInternalValue).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('Should not select segmented option when disabled', () => {
    const setInternalValue = vi.fn();
    const onValueChange = vi.fn();

    handleOptionSelect({
      disabled: false,
      optionDisabled: true,
      nextValue: 'a',
      isControlled: false,
      setInternalValue,
      onValueChange,
    });
    handleOptionSelect({
      disabled: true,
      optionDisabled: false,
      nextValue: 'a',
      isControlled: false,
      setInternalValue,
      onValueChange,
    });

    expect(setInternalValue).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('Should map loading helpers based on size', () => {
    expect(getLoadingSizeFromToggleSize('small')).toBe('small');
    expect(getLoadingSizeFromToggleSize('medium')).toBe('medium');
    expect(getLoadingSizeFromToggleSize('large')).toBe('large');

    expect(getSegmentedSkeletonHeight('small')).toBe('32px');
    expect(getSegmentedSkeletonHeight('medium')).toBe('40px');
    expect(getSegmentedSkeletonHeight('large')).toBe('52px');
  });
});
