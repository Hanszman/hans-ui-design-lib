import React from 'react';
import { vi } from 'vitest';
import {
  createPopupDirectionFrameHandler,
  createPopupOpenSetter,
  createPopupOutsideMouseDownHandler,
  createPopupStateHandlers,
  getPopupDirection,
  getPopupPanelStyle,
  hasPopupRenderableContent,
  handlePopupOutsideClick,
  resolvePopupItemClassName,
  resolvePopupItemPath,
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

  it('Should create popup state handlers', () => {
    const setOpen = vi.fn();
    const { open, close, toggle } = createPopupStateHandlers({
      isOpen: true,
      setOpen,
    });

    open();
    close();
    toggle();

    expect(setOpen).toHaveBeenNthCalledWith(1, true);
    expect(setOpen).toHaveBeenNthCalledWith(2, false);
    expect(setOpen).toHaveBeenNthCalledWith(3, false);
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

    handlePopupOutsideClick({ container: null, target: external, close });
    handlePopupOutsideClick({ container, target: null, close });
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('Should keep popup open when shadow DOM events are retargeted to the host', () => {
    const close = vi.fn();
    const host = document.createElement('hans-dropdown');
    const shadow = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');

    shadow.appendChild(container);

    handlePopupOutsideClick({ container, target: host, close });

    expect(close).not.toHaveBeenCalled();
  });

  it('Should create outside mouse down handler from refs', () => {
    const close = vi.fn();
    const container = document.createElement('div');
    const ref = { current: container };
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', {
      value: document.createElement('div'),
    });

    createPopupOutsideMouseDownHandler({
      containerRef: ref,
      close,
    })(event);

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

  it('Should create popup direction frame handler and notify direction', () => {
    const setDirection = vi.fn();
    const onDirectionChange = vi.fn();
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

    Object.defineProperty(window, 'innerHeight', {
      value: 360,
      writable: true,
    });

    createPopupDirectionFrameHandler({
      containerRef: { current: container },
      panelRef: { current: panel },
      setDirection,
      onDirectionChange,
    })();

    expect(setDirection).toHaveBeenCalledWith('up');
    expect(onDirectionChange).toHaveBeenCalledWith('up');
  });

  it('Should skip popup direction frame handling when window is unavailable', () => {
    const originalWindow = globalThis.window;
    const setDirection = vi.fn();
    const onDirectionChange = vi.fn();

    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      configurable: true,
    });

    try {
      createPopupDirectionFrameHandler({
        containerRef: { current: document.createElement('div') },
        panelRef: { current: document.createElement('div') },
        setDirection,
        onDirectionChange,
      })();

      expect(setDirection).not.toHaveBeenCalled();
      expect(onDirectionChange).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(globalThis, 'window', {
        value: originalWindow,
        configurable: true,
      });
    }
  });

  it('Should skip popup direction notifications when direction cannot be resolved', () => {
    const setDirection = vi.fn();
    const onDirectionChange = vi.fn();

    createPopupDirectionFrameHandler({
      containerRef: { current: null },
      panelRef: { current: document.createElement('div') },
      setDirection,
      onDirectionChange,
    })();

    expect(setDirection).not.toHaveBeenCalled();
    expect(onDirectionChange).not.toHaveBeenCalled();
  });

  it('Should detect popup renderable content correctly', () => {
    expect(hasPopupRenderableContent(null)).toBe(false);
    expect(hasPopupRenderableContent(undefined)).toBe(false);
    expect(hasPopupRenderableContent(false)).toBe(false);
    expect(hasPopupRenderableContent('   ')).toBe(false);
    expect(
      hasPopupRenderableContent(React.createElement('span', null, 'content')),
    ).toBe(true);
    expect(hasPopupRenderableContent('content')).toBe(true);
  });

  it('Should resolve popup panel style', () => {
    expect(
      getPopupPanelStyle({ popupBackgroundColor: 'rgb(255, 255, 255)' }),
    ).toEqual({
      '--hans-popup-bg': 'rgb(255, 255, 255)',
    });
  });

  it('Should resolve popup item helpers', () => {
    expect(resolvePopupItemPath('', 1)).toBe('1');
    expect(resolvePopupItemPath('1', 2)).toBe('1.2');

    expect(
      resolvePopupItemClassName('fixed', {
        item: { label: 'A', value: 'a' },
        itemPath: '0',
        itemId: 'a',
        index: 0,
        nested: false,
        isSelected: false,
        isDisabled: false,
        hasChildren: false,
      }),
    ).toBe('fixed');

    expect(
      resolvePopupItemClassName(
        (state) => (state.isDisabled ? 'disabled' : 'enabled'),
        {
          item: { label: 'B', value: 'b' },
          itemPath: '1',
          itemId: 'b',
          index: 1,
          nested: false,
          isSelected: false,
          isDisabled: true,
          hasChildren: false,
        },
      ),
    ).toBe('disabled');
  });
});
