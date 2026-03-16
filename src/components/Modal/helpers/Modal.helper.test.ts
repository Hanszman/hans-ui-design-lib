import React from 'react';
import { vi } from 'vitest';
import {
  createModalActionHandler,
  createModalBackdropClickHandler,
  createModalBodyScrollLockEffect,
  createModalCloseHandler,
  createModalEscapeKeyEffect,
  getModalClassName,
  getModalInlineStyle,
  getModalPortalTarget,
  getModalTokenPrefix,
  hasRenderableModalContent,
  resolveModalTone,
  shouldRenderModalFooter,
  shouldRenderModalHeader,
} from './Modal.helper';

describe('Modal.helper', () => {
  it('Should resolve modal token prefix and tones', () => {
    expect(getModalTokenPrefix('base')).toBe('base');
    expect(getModalTokenPrefix('primary')).toBe('primary');

    expect(
      resolveModalTone({ modalColor: 'primary', modalVariant: 'strong' }),
    ).toMatchObject({
      background: 'var(--primary-strong-color)',
      text: 'var(--white)',
    });

    expect(
      resolveModalTone({ modalColor: 'success', modalVariant: 'default' }),
    ).toMatchObject({
      background: 'var(--success-default-color)',
      border: 'var(--success-strong-color)',
    });

    expect(
      resolveModalTone({ modalColor: 'danger', modalVariant: 'outline' }),
    ).toMatchObject({
      background: 'var(--white)',
      text: 'var(--danger-strong-color)',
    });

    expect(
      resolveModalTone({ modalColor: 'info', modalVariant: 'transparent' }),
    ).toMatchObject({
      background: 'rgba(255, 255, 255, 0.88)',
    });

    expect(
      resolveModalTone({ modalColor: 'warning', modalVariant: 'neutral' }),
    ).toMatchObject({
      background: 'var(--warning-neutral-color)',
    });
  });

  it('Should resolve class names and inline style vars', () => {
    expect(
      getModalClassName({
        modalSize: 'large',
        placement: 'right',
        customClasses: 'custom-modal',
        dialogClassName: 'dialog-extra',
      }),
    ).toContain('hans-modal-placement-right');

    expect(
      getModalInlineStyle({
        modalColor: 'secondary',
        modalVariant: 'outline',
        style: { opacity: 0.9 },
      }),
    ).toEqual(
      expect.objectContaining({
        '--hans-modal-bg': 'var(--white)',
        '--hans-modal-border': 'var(--secondary-default-color)',
        opacity: 0.9,
      }),
    );
  });

  it('Should detect header footer and body content correctly', () => {
    expect(hasRenderableModalContent(null)).toBe(false);
    expect(hasRenderableModalContent(false)).toBe(false);
    expect(hasRenderableModalContent('   ')).toBe(false);
    expect(hasRenderableModalContent('content')).toBe(true);
    expect(
      hasRenderableModalContent(React.createElement('div', null, 'Hello')),
    ).toBe(true);

    expect(
      shouldRenderModalHeader({
        title: 'Title',
        dismissible: false,
        header: null,
      }),
    ).toBe(true);
    expect(
      shouldRenderModalHeader({
        title: null,
        dismissible: true,
        header: null,
      }),
    ).toBe(true);
    expect(
      shouldRenderModalHeader({
        title: null,
        dismissible: false,
        header: null,
      }),
    ).toBe(false);

    expect(
      shouldRenderModalFooter({
        footer: null,
        confirmLabel: 'Save',
        cancelLabel: '',
      }),
    ).toBe(true);
    expect(
      shouldRenderModalFooter({
        footer: React.createElement('span', null, 'Footer'),
        confirmLabel: '',
        cancelLabel: '',
      }),
    ).toBe(true);
    expect(
      shouldRenderModalFooter({
        footer: null,
        confirmLabel: '',
        cancelLabel: '',
      }),
    ).toBe(false);
  });

  it('Should create close action and backdrop handlers', () => {
    const setInternalOpen = vi.fn();
    const onOpenChange = vi.fn();
    const onClose = vi.fn();
    const close = createModalCloseHandler({
      isControlled: false,
      setInternalOpen,
      onOpenChange,
      onClose,
    });

    close('dismiss');

    expect(setInternalOpen).toHaveBeenCalledWith(false);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalledWith('dismiss');

    const onAction = vi.fn();
    createModalActionHandler({
      onAction,
      close,
      reason: 'confirm',
    })();

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('confirm');

    const closeBackdrop = vi.fn();
    const backdropHandler = createModalBackdropClickHandler({
      closeOnBackdropClick: true,
      close: closeBackdrop,
    });

    backdropHandler({
      target: 'same',
      currentTarget: 'same',
    } as unknown as React.MouseEvent<HTMLDivElement>);

    expect(closeBackdrop).toHaveBeenCalledWith('backdrop');

    createModalBackdropClickHandler({
      closeOnBackdropClick: false,
      close: closeBackdrop,
    })({
      target: 'same',
      currentTarget: 'same',
    } as unknown as React.MouseEvent<HTMLDivElement>);

    expect(closeBackdrop).toHaveBeenCalledTimes(1);
  });

  it('Should create escape and body scroll effects', () => {
    const close = vi.fn();
    let keydownHandler: ((event: KeyboardEvent) => void) | undefined;
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    addEventListenerSpy.mockImplementation(((
      eventName: string,
      listener: EventListenerOrEventListenerObject,
    ) => {
      if (eventName === 'keydown' && typeof listener === 'function') {
        keydownHandler = listener as (event: KeyboardEvent) => void;
      }
    }) as typeof document.addEventListener);
    removeEventListenerSpy.mockImplementation(() => undefined);

    const cleanupEscape = createModalEscapeKeyEffect({
      isOpen: true,
      closeOnEscape: true,
      close,
    })!();

    expect(keydownHandler).toBeDefined();
    if (keydownHandler) {
      keydownHandler(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    }
    expect(close).toHaveBeenCalledWith('escape');
    expect(cleanupEscape).toBeTypeOf('function');
    if (!cleanupEscape) throw new Error('cleanupEscape should be defined');
    cleanupEscape();
    expect(removeEventListenerSpy).toHaveBeenCalled();

    document.body.style.overflow = 'auto';
    const cleanupScroll = createModalBodyScrollLockEffect({
      isOpen: true,
      lockBodyScroll: true,
    })!();

    expect(document.body.style.overflow).toBe('hidden');
    expect(cleanupScroll).toBeTypeOf('function');
    if (!cleanupScroll) throw new Error('cleanupScroll should be defined');
    cleanupScroll();
    expect(document.body.style.overflow).toBe('auto');

    expect(
      createModalEscapeKeyEffect({
        isOpen: false,
        closeOnEscape: true,
        close,
      })(),
    ).toBeUndefined();
    expect(
      createModalBodyScrollLockEffect({
        isOpen: false,
        lockBodyScroll: true,
      })(),
    ).toBeUndefined();
  });

  it('Should resolve modal portal target', () => {
    const target = document.createElement('div');
    expect(getModalPortalTarget(target)).toBe(target);
    expect(getModalPortalTarget()).toBe(document.body);

    const originalDocument = globalThis.document;
    Object.defineProperty(globalThis, 'document', {
      value: undefined,
      configurable: true,
    });

    try {
      expect(
        shouldRenderModalFooter({
          footer: null,
          confirmLabel: '',
          cancelLabel: 'Close',
        }),
      ).toBe(true);
      expect(getModalPortalTarget()).toBeNull();
    } finally {
      Object.defineProperty(globalThis, 'document', {
        value: originalDocument,
        configurable: true,
      });
    }
  });
});
