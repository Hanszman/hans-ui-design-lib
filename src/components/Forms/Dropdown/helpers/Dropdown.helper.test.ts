import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { DropdownOption } from '../Dropdown.types';
import {
  createHandleInputChange,
  createHandleOpen,
  createHandleRemoveSelected,
  createHandleSelectOption,
  createHandleToggle,
  createSetDropdownOpen,
  filterDropdownOptions,
  getInitialDropdownValue,
  getNextMultiValues,
  getOpenDirection,
  getOptionId,
  getSelectedLabel,
  getValuesAfterRemoval,
  normalizeToArray,
} from './Dropdown.helper';

const options: DropdownOption[] = [
  { id: 'alpha', label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
];

describe('Dropdown.helper', () => {
  it('Should normalize dropdown values to array', () => {
    expect(normalizeToArray(undefined)).toEqual([]);
    expect(normalizeToArray('')).toEqual([]);
    expect(normalizeToArray('a')).toEqual(['a']);
    expect(normalizeToArray(['a', 'b'])).toEqual(['a', 'b']);
  });

  it('Should resolve option id with fallback to value', () => {
    expect(getOptionId(options[0])).toBe('alpha');
    expect(getOptionId(options[1])).toBe('b');
  });

  it('Should resolve initial dropdown value', () => {
    expect(getInitialDropdownValue('x', undefined, false)).toBe('x');
    expect(getInitialDropdownValue(undefined, ['x'], true)).toEqual(['x']);
    expect(getInitialDropdownValue(undefined, undefined, true)).toEqual([]);
    expect(getInitialDropdownValue(undefined, undefined, false)).toBe('');
  });

  it('Should resolve selected label for single and multi mode', () => {
    expect(getSelectedLabel(false, [options[0]])).toBe('Alpha');
    expect(getSelectedLabel(false, [])).toBe('');
    expect(getSelectedLabel(true, options)).toBe('Alpha, Beta');
  });

  it('Should filter options with autocomplete search', () => {
    expect(filterDropdownOptions(options, false, 'a')).toEqual(options);
    expect(filterDropdownOptions(options, true, '   ')).toEqual(options);
    expect(filterDropdownOptions(options, true, 'alp')).toEqual([options[0]]);
  });

  it('Should toggle and remove values in multiselect', () => {
    expect(getNextMultiValues(['a'], 'a')).toEqual([]);
    expect(getNextMultiValues(['a'], 'b')).toEqual(['a', 'b']);
    expect(getValuesAfterRemoval(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('Should resolve dropdown open direction', () => {
    expect(getOpenDirection(20, 200, 100)).toBe('up');
    expect(getOpenDirection(200, 20, 100)).toBe('down');
  });

  it('Should create input change handler and process events', () => {
    const setSearchTerm = vi.fn();
    const setIsOpen = vi.fn();
    const onSearch = vi.fn();
    const onInputChange = vi.fn();
    const event = {
      target: { value: 'abc' },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    createHandleInputChange({
      enableAutocomplete: false,
      isOpen: false,
      setSearchTerm,
      setIsOpen,
      onSearch,
      onInputChange,
    })(event);
    expect(setSearchTerm).not.toHaveBeenCalled();

    createHandleInputChange({
      enableAutocomplete: true,
      isOpen: false,
      setSearchTerm,
      setIsOpen,
      onSearch,
      onInputChange,
    })(event);
    expect(setSearchTerm).toHaveBeenCalledWith('abc');
    expect(setIsOpen).toHaveBeenCalledWith(true);
    expect(onSearch).toHaveBeenCalledWith('abc');
    expect(onInputChange).toHaveBeenCalledWith(event);
  });

  it('Should create select option handler for single and multi', () => {
    const setInternalValue = vi.fn();
    const onChange = vi.fn();
    const setSearchTerm = vi.fn();
    const setIsOpen = vi.fn();

    const single = createHandleSelectOption({
      disabled: false,
      isMulti: false,
      selectedValues: [],
      value: undefined,
      enableAutocomplete: true,
      setInternalValue,
      onChange,
      setSearchTerm,
      setIsOpen,
    });
    single(options[0]);
    expect(setInternalValue).toHaveBeenCalledWith('alpha');
    expect(onChange).toHaveBeenCalledWith('alpha');
    expect(setSearchTerm).toHaveBeenCalledWith('Alpha');
    expect(setIsOpen).toHaveBeenCalledWith(false);

    const multi = createHandleSelectOption({
      disabled: false,
      isMulti: true,
      selectedValues: ['alpha'],
      value: undefined,
      enableAutocomplete: true,
      setInternalValue,
      onChange,
      setSearchTerm,
      setIsOpen,
    });
    multi(options[0]);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('Should create remove selected handler', () => {
    const setInternalValue = vi.fn();
    const onChange = vi.fn();
    createHandleRemoveSelected({
      selectedValues: ['alpha', 'beta'],
      value: undefined,
      setInternalValue,
      onChange,
    })('alpha');
    expect(setInternalValue).toHaveBeenCalledWith(['beta']);
    expect(onChange).toHaveBeenCalledWith(['beta']);
  });

  it('Should create open/toggle handlers', () => {
    const setIsOpen = vi.fn();
    const ignoreFocusRef = { current: false };
    const setDropdownOpen = createSetDropdownOpen({
      disabled: false,
      ignoreFocusRef,
      setIsOpen,
    });

    createHandleOpen(setDropdownOpen)();
    expect(setIsOpen).toHaveBeenCalledWith(true);

    const toggle = createHandleToggle(setDropdownOpen, () => true);
    toggle();
    expect(ignoreFocusRef.current).toBe(true);
    expect(setIsOpen).toHaveBeenCalledWith(false);

    createSetDropdownOpen({
      disabled: true,
      ignoreFocusRef,
      setIsOpen,
    })(true, 'focus');
    expect(setIsOpen).toHaveBeenCalledTimes(2);
  });
});
