import { vi } from 'vitest';
import {
  getDropdownSelection,
  hasCustomDropdownContent,
  resolveDropdownItemId,
} from './Dropdown.helper';

describe('Dropdown.helper', () => {
  it('Should resolve dropdown item id', () => {
    expect(
      resolveDropdownItemId({
        item: { id: 'x', label: 'X', value: 'x' },
        index: 1,
      }),
    ).toBe('x');
    expect(
      resolveDropdownItemId({
        item: { label: 'Y', value: 'y' },
        index: 2,
      }),
    ).toBe('y-2');
  });

  it('Should detect custom content', () => {
    expect(hasCustomDropdownContent(null)).toBe(false);
    expect(hasCustomDropdownContent(undefined)).toBe(false);
    expect(hasCustomDropdownContent('x')).toBe(true);
  });

  it('Should dispatch selection only for enabled items', () => {
    const onSelect = vi.fn();
    getDropdownSelection({ label: 'A', value: 'a' }, onSelect);
    expect(onSelect).toHaveBeenCalledWith({ label: 'A', value: 'a' });

    getDropdownSelection({ label: 'B', value: 'b', disabled: true }, onSelect);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
