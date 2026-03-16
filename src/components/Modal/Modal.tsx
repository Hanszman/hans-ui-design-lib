import React from 'react';
import { createPortal } from 'react-dom';
import { HansButton } from '../Forms/Button/Button';
import { HansIcon } from '../Icon/Icon';
import type { HansModalProps } from './Modal.types';
import {
  createModalActionHandler,
  createModalBackdropClickHandler,
  createModalBodyScrollLockEffect,
  createModalCloseHandler,
  createModalEscapeKeyEffect,
  getModalClassName,
  getModalInlineStyle,
  getModalPortalTarget,
  hasRenderableModalContent,
  shouldRenderModalFooter,
  shouldRenderModalHeader,
} from './helpers/Modal.helper';

export const HansModal = React.memo((props: HansModalProps) => {
  const {
    isOpen,
    defaultOpen = false,
    modalSize = 'medium',
    modalColor = 'base',
    modalVariant = 'neutral',
    placement = 'center',
    title,
    header,
    footer,
    dismissible = true,
    showOverlay = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    lockBodyScroll = true,
    showHeaderDivider = true,
    showFooterDivider = true,
    confirmLabel = '',
    cancelLabel = '',
    closeButtonLabel = 'Close modal',
    confirmButtonColor = 'primary',
    cancelButtonColor = 'base',
    dismissButtonColor = 'base',
    customClasses = '',
    overlayClassName = '',
    dialogClassName = '',
    headerClassName = '',
    bodyClassName = '',
    footerClassName = '',
    contentClassName = '',
    maxBodyHeight = 'calc(100vh - 14rem)',
    children,
    onOpenChange,
    onClose,
    onConfirm,
    onCancel,
    portalTarget,
    style,
    ...rest
  } = props;

  const titleId = React.useId();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = typeof isOpen !== 'undefined';
  const open = isControlled ? Boolean(isOpen) : internalOpen;
  const close = React.useMemo(
    () =>
      createModalCloseHandler({
        isControlled,
        setInternalOpen,
        onOpenChange,
        onClose,
      }),
    [isControlled, onClose, onOpenChange],
  );
  const handleConfirm = React.useMemo(
    () =>
      createModalActionHandler({
        onAction: onConfirm,
        close,
        reason: 'confirm',
      }),
    [close, onConfirm],
  );
  const handleCancel = React.useMemo(
    () =>
      createModalActionHandler({
        onAction: onCancel,
        close,
        reason: 'cancel',
      }),
    [close, onCancel],
  );
  const handleBackdropClick = React.useMemo(
    () =>
      createModalBackdropClickHandler({
        closeOnBackdropClick,
        close,
      }),
    [close, closeOnBackdropClick],
  );
  const hasHeader = shouldRenderModalHeader({ title, dismissible, header });
  const hasBody = hasRenderableModalContent(children);
  const hasFooter = shouldRenderModalFooter({
    footer,
    confirmLabel,
    cancelLabel,
  });

  React.useEffect(() => {
    return createModalEscapeKeyEffect({
      isOpen: open,
      closeOnEscape,
      close,
    })();
  }, [close, closeOnEscape, open]);

  React.useEffect(() => {
    return createModalBodyScrollLockEffect({
      isOpen: open,
      lockBodyScroll,
    })();
  }, [lockBodyScroll, open]);

  React.useEffect(() => {
    if (!open || !dialogRef.current) return;
    dialogRef.current.focus();
  }, [open]);

  if (!open) return null;

  const modalContent = (
    <div
      className={`hans-modal-portal ${overlayClassName}`}
      style={getModalInlineStyle({
        modalColor,
        modalVariant,
        dismissButtonColor,
        style,
      })}
      data-placement={placement}
    >
      {showOverlay ? (
        <div className="hans-modal-overlay" aria-hidden="true" />
      ) : null}

      <div className="hans-modal-shell" onClick={handleBackdropClick}>
        <div
          ref={dialogRef}
          className={getModalClassName({
            modalSize,
            placement,
            customClasses,
            dialogClassName,
          })}
          role="dialog"
          aria-modal="true"
          aria-labelledby={
            hasRenderableModalContent(title) ? titleId : undefined
          }
          tabIndex={-1}
          {...rest}
        >
          <div className={`hans-modal-content ${contentClassName}`}>
            {hasHeader ? (
              <div
                className={`
                  hans-modal-header
                  ${showHeaderDivider && hasBody ? 'hans-modal-header-divider' : ''}
                  ${headerClassName}
                `}
              >
                <div className="hans-modal-header-main">
                  {hasRenderableModalContent(title) ? (
                    <div id={titleId} className="hans-modal-title">
                      {title}
                    </div>
                  ) : null}
                  {hasRenderableModalContent(header) ? (
                    <div className="hans-modal-header-content">{header}</div>
                  ) : null}
                </div>

                {dismissible ? (
                  <button
                    type="button"
                    className="hans-modal-dismiss"
                    aria-label={closeButtonLabel}
                    onClick={() => close('dismiss')}
                  >
                    <HansIcon name="IoIosCloseCircle" />
                  </button>
                ) : null}
              </div>
            ) : null}

            {hasBody ? (
              <div
                className={`hans-modal-body ${bodyClassName}`}
                style={
                  {
                    '--hans-modal-body-max-height': maxBodyHeight,
                  } as React.CSSProperties
                }
              >
                {children}
              </div>
            ) : null}

            {hasFooter ? (
              <div
                className={`
                  hans-modal-footer
                  ${showFooterDivider && hasBody ? 'hans-modal-footer-divider' : ''}
                  ${footerClassName}
                `}
              >
                {hasRenderableModalContent(footer) ? (
                  <div className="hans-modal-footer-content">{footer}</div>
                ) : null}

                {cancelLabel ? (
                  <HansButton
                    label={cancelLabel}
                    buttonVariant="outline"
                    buttonColor={cancelButtonColor}
                    onClick={handleCancel}
                  />
                ) : null}

                {confirmLabel ? (
                  <HansButton
                    label={confirmLabel}
                    buttonVariant="default"
                    buttonColor={confirmButtonColor}
                    onClick={handleConfirm}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  const target = getModalPortalTarget(portalTarget);
  return target ? createPortal(modalContent, target) : modalContent;
});

HansModal.displayName = 'HansModal';
