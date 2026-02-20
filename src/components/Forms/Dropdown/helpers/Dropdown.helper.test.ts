import { describe, expect, it } from 'vitest';
import type { DropdownOption } from '../Dropdown.types';
import {
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
});
