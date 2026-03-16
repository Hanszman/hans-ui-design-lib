import React from 'react';
import type {
  CreateModalActionHandlerParams,
  CreateModalBackdropClickHandlerParams,
  CreateModalBodyScrollLockEffectParams,
  CreateModalCloseHandlerParams,
  CreateModalEscapeKeyEffectParams,
  GetModalClassNameParams,
  GetModalInlineStyleParams,
  ModalTone,
  ResolveModalToneParams,
} from './Modal.helper.types';
import type { Color } from '../../../types/Common.types';
import type { ModalCloseReason } from '../Modal.types';

export const getModalTokenPrefix = (modalColor: Color): string =>
  modalColor === 'base' ? 'base' : modalColor;

export const resolveModalTone = ({
  modalColor,
  modalVariant,
}: ResolveModalToneParams): ModalTone => {
  const tokenPrefix = getModalTokenPrefix(modalColor);

  if (modalVariant === 'strong') {
    return {
      background: `var(--${tokenPrefix}-strong-color)`,
      border: `var(--${tokenPrefix}-default-color)`,
      text: 'var(--white)',
      mutedText: 'rgba(255, 255, 255, 0.78)',
      overlay: 'rgba(15, 23, 42, 0.62)',
      shadow: '0 24px 64px rgba(15, 23, 42, 0.34)',
    };
  }

  if (modalVariant === 'default') {
    return {
      background: `var(--${tokenPrefix}-default-color)`,
      border: `var(--${tokenPrefix}-strong-color)`,
      text: 'var(--white)',
      mutedText: 'rgba(255, 255, 255, 0.8)',
      overlay: 'rgba(15, 23, 42, 0.56)',
      shadow: '0 24px 60px rgba(15, 23, 42, 0.3)',
    };
  }

  if (modalVariant === 'outline') {
    return {
      background: 'var(--white)',
      border: `var(--${tokenPrefix}-default-color)`,
      text: `var(--${tokenPrefix}-strong-color)`,
      mutedText: `var(--${tokenPrefix}-default-color)`,
      overlay: 'rgba(15, 23, 42, 0.52)',
      shadow: '0 22px 54px rgba(15, 23, 42, 0.2)',
    };
  }

  if (modalVariant === 'transparent') {
    return {
      background: 'rgba(255, 255, 255, 0.88)',
      border: `var(--${tokenPrefix}-neutral-color)`,
      text: `var(--${tokenPrefix}-strong-color)`,
      mutedText: `var(--${tokenPrefix}-default-color)`,
      overlay: 'rgba(15, 23, 42, 0.44)',
      shadow: '0 18px 48px rgba(15, 23, 42, 0.18)',
    };
  }

  return {
    background: `var(--${tokenPrefix}-neutral-color)`,
    border: `var(--${tokenPrefix}-default-color)`,
    text: `var(--${tokenPrefix}-strong-color)`,
    mutedText: `var(--${tokenPrefix}-default-color)`,
    overlay: 'rgba(15, 23, 42, 0.48)',
    shadow: '0 20px 52px rgba(15, 23, 42, 0.18)',
  };
};

export const getModalInlineStyle = ({
  modalColor,
  modalVariant,
  style,
}: GetModalInlineStyleParams): React.CSSProperties => {
  const tone = resolveModalTone({ modalColor, modalVariant });

  return {
    ...(style || {}),
    '--hans-modal-bg': tone.background,
    '--hans-modal-border': tone.border,
    '--hans-modal-text': tone.text,
    '--hans-modal-muted-text': tone.mutedText,
    '--hans-modal-overlay': tone.overlay,
    '--hans-modal-shadow': tone.shadow,
  } as React.CSSProperties;
};

export const getModalClassName = ({
  modalSize,
  placement,
  customClasses,
  dialogClassName,
}: GetModalClassNameParams): string => `
  hans-modal-dialog
  hans-modal-${modalSize}
  hans-modal-placement-${placement}
  ${dialogClassName}
  ${customClasses}
`;

export const hasRenderableModalContent = (
  content: React.ReactNode,
): boolean =>
  React.Children.toArray(content).some((child) => {
    if (typeof child === 'string') return child.trim().length > 0;
    return Boolean(child);
  });

export const shouldRenderModalHeader = ({
  title,
  dismissible,
  header,
}: {
  title?: React.ReactNode;
  dismissible: boolean;
  header?: React.ReactNode;
}): boolean =>
  Boolean(
    dismissible ||
      hasRenderableModalContent(title) ||
      hasRenderableModalContent(header),
  );

export const shouldRenderModalFooter = ({
  footer,
  confirmLabel,
  cancelLabel,
}: {
  footer?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}): boolean =>
  Boolean(
    hasRenderableModalContent(footer) ||
      (confirmLabel && confirmLabel.trim().length > 0) ||
      (cancelLabel && cancelLabel.trim().length > 0),
  );

export const createModalCloseHandler =
  ({
    isControlled,
    setInternalOpen,
    onOpenChange,
    onClose,
  }: CreateModalCloseHandlerParams) =>
  (reason: ModalCloseReason): void => {
    if (!isControlled) setInternalOpen(false);
    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose(reason);
  };

export const createModalActionHandler =
  ({ onAction, close, reason }: CreateModalActionHandlerParams) =>
  (): void => {
    if (onAction) onAction();
    close(reason);
  };

export const createModalBackdropClickHandler =
  ({ closeOnBackdropClick, close }: CreateModalBackdropClickHandlerParams) =>
  (event: React.MouseEvent<HTMLDivElement>): void => {
    if (!closeOnBackdropClick) return;
    if (event.target !== event.currentTarget) return;
    close('backdrop');
  };

export const createModalEscapeKeyEffect =
  ({ isOpen, closeOnEscape, close }: CreateModalEscapeKeyEffectParams) =>
  (): VoidFunction | undefined => {
    if (!isOpen || !closeOnEscape || typeof document === 'undefined') {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close('escape');
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  };

export const createModalBodyScrollLockEffect =
  ({ isOpen, lockBodyScroll }: CreateModalBodyScrollLockEffectParams) =>
  (): VoidFunction | undefined => {
    if (!isOpen || !lockBodyScroll || typeof document === 'undefined') {
      return undefined;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousOverflow;
    };
  };

export const getModalPortalTarget = (
  portalTarget?: HTMLElement | null,
): HTMLElement | null => {
  if (portalTarget) return portalTarget;
  if (typeof document === 'undefined') return null;
  return document.body;
};
