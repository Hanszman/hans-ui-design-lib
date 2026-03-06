import { vi } from 'vitest';
import {
  createDropdownItemPath,
  createDropdownOpenSetter,
  createHandleDropdownItemEnter,
  createHandleDropdownSelect,
  getDropdownSelection,
  hasCustomDropdownContent,
  hasNestedDropdownItems,
  resolveDropdownItemId,
  shouldShowDropdownSubmenu,
} from './Dropdown.helper';

describe('Dropdown.helper', () => {
  it('Should resolve dropdown item id', () => {
    expect(
      resolveDropdownItemId({
        item: { id: 'x', label: 'X', value: 'x' },
        itemPath: '1',
      }),
    ).toBe('x');
    expect(
      resolveDropdownItemId({
        item: { label: 'Y', value: 'y' },
        itemPath: '2',
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

  it('Should create dropdown open setter', () => {
    const setIsOpen = vi.fn();
    const onOpenChange = vi.fn();
    const setOpen = createDropdownOpenSetter({ setIsOpen, onOpenChange });

    setOpen(true);

    expect(setIsOpen).toHaveBeenCalledWith(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('Should create dropdown select handler and close menu when required', () => {
    const onSelect = vi.fn();
    const setOpen = vi.fn();
    const handleSelect = createHandleDropdownSelect({
      closeOnSelect: true,
      setOpen,
      onSelect,
    });

    handleSelect({ label: 'A', value: 'a' });
    expect(onSelect).toHaveBeenCalledWith({ label: 'A', value: 'a' });
    expect(setOpen).toHaveBeenCalledWith(false);

    handleSelect({ label: 'B', value: 'b', disabled: true });
    expect(setOpen).toHaveBeenCalledTimes(1);

    handleSelect({ label: 'C', value: 'c', children: [{ label: 'C1', value: 'c1' }] });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('Should handle nested dropdown helpers', () => {
    expect(createDropdownItemPath('', 0)).toBe('0');
    expect(createDropdownItemPath('0', 1)).toBe('0.1');
    expect(hasNestedDropdownItems({ label: 'A', value: 'a' })).toBe(false);
    expect(
      hasNestedDropdownItems({
        label: 'B',
        value: 'b',
        children: [{ label: 'B1', value: 'b1' }],
      }),
    ).toBe(true);
    expect(shouldShowDropdownSubmenu('0.1', '0.1')).toBe(true);
    expect(shouldShowDropdownSubmenu('0.1', '0.2')).toBe(false);

    const setHoveredPath = vi.fn();
    const handleItemEnter = createHandleDropdownItemEnter({ setHoveredPath });
    handleItemEnter('0.1');
    expect(setHoveredPath).toHaveBeenCalledWith('0.1');
  });
});
