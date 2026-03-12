import type React from 'react';
import { vi } from 'vitest';
import {
  createToastAutoDismissEffect,
  createToastCloseHandler,
  createToastStackEffect,
  getDefaultToastStackSnapshot,
  getToastAccessibilityState,
  getToastInlineStyle,
  getToastStackIndex,
  getToastStackOffset,
  getToastStackSnapshot,
  measureToastHeight,
  removeToastFromStack,
  resetToastStackRegistry,
  resolveToastTone,
  subscribeToastStack,
  upsertToastInStack,
} from './Toast.helper';

describe('Toast.helper', () => {
  afterEach(() => {
    resetToastStackRegistry();
  });

  it('Should resolve tone tokens for supported variants', () => {
    expect(
      resolveToastTone({ toastColor: 'success', toastVariant: 'neutral' }),
    ).toEqual({
      background: 'var(--success-neutral-color)',
      border: 'var(--success-default-color)',
      text: 'var(--success-strong-color)',
      accent: 'var(--success-default-color)',
      shadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
    });

    expect(
      resolveToastTone({ toastColor: 'primary', toastVariant: 'strong' }),
    ).toMatchObject({
      background: 'var(--primary-strong-color)',
      text: 'var(--primary-neutral-color)',
    });

    expect(
      resolveToastTone({ toastColor: 'base', toastVariant: 'outline' }),
    ).toMatchObject({
      background: 'var(--white)',
      border: 'var(--base-default-color)',
      text: 'var(--base-strong-color)',
    });

    expect(
      resolveToastTone({ toastColor: 'info', toastVariant: 'transparent' }),
    ).toMatchObject({
      background: 'rgba(255, 255, 255, 0.92)',
      accent: 'var(--info-default-color)',
    });
  });

  it('Should resolve role and aria-live by toast color', () => {
    expect(getToastAccessibilityState('danger')).toEqual({
      role: 'alert',
      ariaLive: 'assertive',
    });
    expect(getToastAccessibilityState('primary')).toEqual({
      role: 'status',
      ariaLive: 'polite',
    });
  });

  it('Should create inline style according to position and stack offset', () => {
    expect(
      getToastInlineStyle({
        toastColor: 'danger',
        toastVariant: 'default',
        position: 'top-left',
        offset: 24,
        stackOffset: 96,
        zIndex: 1002,
      }),
    ).toMatchObject({
      top: '24px',
      left: '24px',
      transform: 'translateY(96px)',
      zIndex: 1002,
      '--hans-toast-bg': 'var(--danger-default-color)',
    });

    expect(
      getToastInlineStyle({
        toastColor: 'success',
        toastVariant: 'neutral',
        position: 'bottom-right',
        offset: 16,
        stackOffset: 48,
        zIndex: 1001,
      }),
    ).toMatchObject({
      bottom: '16px',
      right: '16px',
      transform: 'translateY(-48px)',
    });
  });

  it('Should manage the toast stack registry and notify listeners', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToastStack(listener);

    upsertToastInStack('top-right', 'toast-1', 80);
    upsertToastInStack('top-right', 'toast-2', 64);
    upsertToastInStack('top-right', 'toast-1', 96);
    upsertToastInStack('bottom-left', 'toast-2', 64);

    expect(getToastStackIndex('top-right', 'toast-2')).toBe(-1);
    expect(getToastStackIndex('bottom-left', 'toast-2')).toBe(0);
    expect(getToastStackOffset('top-right', 'toast-1', 12)).toBe(0);
    expect(getToastStackSnapshot('bottom-left', 'toast-2', 12)).toEqual({
      offset: 0,
      index: 0,
    });

    removeToastFromStack('toast-1');
    expect(getToastStackIndex('bottom-left', 'toast-2')).toBe(0);

    unsubscribe();
    expect(listener).toHaveBeenCalledTimes(5);
  });

  it('Should measure height from DOM element', () => {
    const element = {
      getBoundingClientRect: () => ({ height: 72 }),
      offsetHeight: 0,
    } as HTMLDivElement;

    expect(measureToastHeight(element)).toBe(72);
    expect(measureToastHeight(null)).toBe(0);
  });

  it('Should create close handler for controlled and uncontrolled modes', () => {
    const setInternalVisible = vi.fn();
    const onVisibilityChange = vi.fn();
    const onClose = vi.fn();

    createToastCloseHandler({
      isControlled: false,
      setInternalVisible,
      onVisibilityChange,
      onClose,
    })('dismiss');

    expect(setInternalVisible).toHaveBeenCalledWith(false);
    expect(onVisibilityChange).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalledWith('dismiss');

    createToastCloseHandler({
      isControlled: true,
      setInternalVisible,
      onVisibilityChange,
      onClose,
    })('timeout');

    expect(setInternalVisible).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('timeout');
  });

  it('Should create stack and auto-dismiss effects', () => {
    vi.useFakeTimers();
    const containerRef = {
      current: {
        getBoundingClientRect: () => ({ height: 88 }),
        offsetHeight: 0,
      },
    } as React.RefObject<HTMLDivElement>;
    const handleClose = vi.fn();

    const stackCleanup = createToastStackEffect({
      visible: true,
      position: 'top-right',
      toastId: 'toast-effect',
      containerRef,
    })();

    expect(getToastStackIndex('top-right', 'toast-effect')).toBe(0);

    const dismissCleanup = createToastAutoDismissEffect({
      visible: true,
      duration: 500,
      handleClose,
    })();

    vi.advanceTimersByTime(500);
    expect(handleClose).toHaveBeenCalledWith('timeout');
    expect(getDefaultToastStackSnapshot()).toEqual({ offset: 0, index: -1 });

    stackCleanup?.();
    dismissCleanup?.();
    vi.useRealTimers();
  });
});
