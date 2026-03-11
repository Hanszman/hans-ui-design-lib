import { vi } from 'vitest';
import {
  createClearDropdownLeaveTimeout,
  createDropdownItemPath,
  createDropdownOpenSetter,
  createHandleDropdownItemEnter,
  createHandleDropdownListEnter,
  createHandleDropdownListLeave,
  createHandleDropdownSelect,
  getDropdownSubmenuArrowName,
  getDropdownItemClassName,
  getHoveredPathOnListLeave,
  getDropdownSelection,
  getNextDropdownSubmenuDirections,
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
    const action = vi.fn();
    getDropdownSelection({ label: 'A', value: 'a', action }, onSelect);
    expect(onSelect).toHaveBeenCalledWith({ label: 'A', value: 'a', action });
    expect(action).toHaveBeenCalledWith({ label: 'A', value: 'a', action });

    getDropdownSelection({ label: 'B', value: 'b', disabled: true }, onSelect);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenCalledTimes(1);
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
    expect(shouldShowDropdownSubmenu('0.1.2', '0.1')).toBe(true);
    expect(shouldShowDropdownSubmenu('0.1', '0.2')).toBe(false);

    const setHoveredPath = vi.fn();
    const setSubmenuDirection = vi.fn();
    const handleItemEnter = createHandleDropdownItemEnter({
      setHoveredPath,
      setSubmenuDirection,
      submenuWidth: 200,
    });
    const target = document.createElement('div');
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      x: 200,
      y: 0,
      width: 100,
      height: 20,
      top: 0,
      right: 300,
      bottom: 20,
      left: 200,
      toJSON: () => {},
    } as DOMRect);
    Object.defineProperty(window, 'innerWidth', { value: 320, writable: true });
    handleItemEnter('0.1', target);
    expect(setHoveredPath).toHaveBeenCalledWith('0.1');
    expect(setSubmenuDirection).toHaveBeenCalledWith('0.1', 'left');

    Object.defineProperty(window, 'innerWidth', { value: 900, writable: true });
    handleItemEnter('0.2', target);
    expect(setSubmenuDirection).toHaveBeenCalledWith('0.2', 'right');

    const originalWindow = globalThis.window;
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      configurable: true,
    });
    handleItemEnter('0.3', target);
    expect(setSubmenuDirection).toHaveBeenCalledTimes(2);
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true,
    });

    const sameDirectionSource: Record<string, 'left' | 'right'> = {
      '0.1': 'left',
    };
    const sameDirection = getNextDropdownSubmenuDirections(
      sameDirectionSource,
      '0.1',
      'left',
    );
    expect(sameDirection).toBe(sameDirectionSource);
    expect(getDropdownSubmenuArrowName('left')).toBe('IoIosArrowBack');
    expect(getDropdownSubmenuArrowName('right')).toBe('IoIosArrowForward');
    expect(getHoveredPathOnListLeave('')).toBeNull();
    expect(getHoveredPathOnListLeave('0')).toBeNull();
    expect(getHoveredPathOnListLeave('0.1.2')).toBe('0.1');
  });

  it('Should resolve dropdown item class names', () => {
    expect(
      getDropdownItemClassName(
        {
          item: { label: 'A', value: 'a' },
          itemPath: '0',
          itemId: 'a',
          index: 0,
          nested: false,
          isSelected: false,
          isDisabled: true,
          hasChildren: true,
        },
        'left',
      ),
    ).toContain('hans-dropdown-option-parent-left');
  });

  it('Should create dropdown timeout and list handlers', () => {
    vi.useFakeTimers();
    try {
      const timeoutRef = {
        current: setTimeout(() => undefined, 10),
      } as React.RefObject<ReturnType<typeof setTimeout> | null>;
      const setHoveredPath = vi.fn();
      const clearListLeaveTimeout = createClearDropdownLeaveTimeout({
        listLeaveTimeoutRef: timeoutRef,
      });

      clearListLeaveTimeout();
      expect(timeoutRef.current).toBeNull();

      createHandleDropdownListEnter(clearListLeaveTimeout)();
      expect(timeoutRef.current).toBeNull();

      const nestedList = document.createElement('ul');
      nestedList.className = 'hans-dropdown-list';
      createHandleDropdownListLeave({
        clearListLeaveTimeout,
        listLeaveTimeoutRef: timeoutRef,
        setHoveredPath,
        closeDelay: 50,
      })('0.1.2', {
        relatedTarget: document.body,
      } as React.MouseEvent);

      vi.advanceTimersByTime(51);
      expect(setHoveredPath).toHaveBeenCalledWith('0.1');

      createHandleDropdownListLeave({
        clearListLeaveTimeout,
        listLeaveTimeoutRef: timeoutRef,
        setHoveredPath,
        closeDelay: 50,
      })('0.1', {
        relatedTarget: nestedList,
      } as React.MouseEvent);

      vi.advanceTimersByTime(51);
      expect(setHoveredPath).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
