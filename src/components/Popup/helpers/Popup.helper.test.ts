import { vi } from 'vitest';
import {
  createPopupOpenSetter,
  getPopupDirection,
  handlePopupOutsideClick,
  resolvePopupDirection,
} from './Popup.helper';

describe('Popup.helper', () => {
  it('Should return down by default', () => {
    expect(
      getPopupDirection({ spaceBelow: 300, spaceAbove: 100, panelHeight: 200 }),
    ).toBe('down');
  });

  it('Should return up when there is no space below and enough above', () => {
    expect(
      getPopupDirection({ spaceBelow: 80, spaceAbove: 220, panelHeight: 120 }),
    ).toBe('up');
  });

  it('Should create popup open setter and honor disabled', () => {
    const onOpenChange = vi.fn();
    createPopupOpenSetter({ disabled: false, onOpenChange })(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    createPopupOpenSetter({ disabled: true, onOpenChange })(false);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('Should handle popup outside click', () => {
    const close = vi.fn();
    const container = document.createElement('div');
    const inner = document.createElement('span');
    container.appendChild(inner);
    const external = document.createElement('div');

    handlePopupOutsideClick({ container, target: inner, close });
    expect(close).not.toHaveBeenCalled();

    handlePopupOutsideClick({ container, target: external, close });
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('Should resolve popup direction from dom measurements', () => {
    const container = document.createElement('div');
    const panel = document.createElement('div');
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 300,
      width: 100,
      height: 40,
      top: 300,
      right: 100,
      bottom: 340,
      left: 0,
      toJSON: () => ({}),
    } as DOMRect);
    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      width: 100,
      height: 120,
      top: 0,
      right: 100,
      bottom: 120,
      left: 0,
      toJSON: () => ({}),
    } as DOMRect);

    expect(
      resolvePopupDirection({ container, panel, viewportHeight: 360 }),
    ).toBe('up');
    expect(
      resolvePopupDirection({ container: null, panel, viewportHeight: 360 }),
    ).toBeNull();
  });
});
