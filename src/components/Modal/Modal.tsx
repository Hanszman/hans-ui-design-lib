import React from 'react';
import { createPortal } from 'react-dom';
import { HansButton } from '../Forms/Button/Button';
import { HansIcon } from '../Icon/Icon';
import { HansLoading } from '../Loading/Loading';
import { HansPagination } from '../Pagination/Pagination';
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
  ModalProjectedContent,
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
    closeOnConfirm = true,
    closeOnCancel = true,
    lockBodyScroll = true,
    showHeaderDivider = true,
    showFooterDivider = true,
    renderBody = false,
    disablePortal = false,
    loading = false,
    confirmLabel = '',
    cancelLabel = '',
    closeButtonLabel = 'Close modal',
    confirmButtonColor = 'primary',
    cancelButtonColor = 'base',
    dismissButtonColor = 'base',
    confirmDisabled = false,
    cancelDisabled = false,
    confirmLoading = false,
    paginationCurrentPage = 1,
    paginationTotalPages = 0,
    paginationDisabled = false,
    paginationAriaLabel = 'Pagination',
    paginationFirstLabel = 'First',
    paginationPreviousLabel = 'Previous',
    paginationNextLabel = 'Next',
    paginationLastLabel = 'Last',
    paginationPageLabel = 'Page',
    paginationFirstContent,
    paginationPreviousContent,
    paginationNextContent,
    paginationLastContent,
    paginationMaxVisiblePages = 5,
    paginationColor = 'primary',
    paginationSize = 'medium',
    paginationActivePageVariant = 'default',
    paginationInactivePageVariant = 'outline',
    customClasses = '',
    overlayClassName = '',
    dialogClassName = '',
    headerClassName = '',
    bodyClassName = '',
    footerClassName = '',
    contentClassName = '',
    maxBodyHeight = 'calc(100vh - 14rem)',
    children,
    container,
    onOpenChange,
    onClose,
    onConfirm,
    onCancel,
    onPageChange,
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
        shouldClose: closeOnConfirm,
      }),
    [close, closeOnConfirm, onConfirm],
  );
  const handleCancel = React.useMemo(
    () =>
      createModalActionHandler({
        onAction: onCancel,
        close,
        reason: 'cancel',
        shouldClose: closeOnCancel,
      }),
    [close, closeOnCancel, onCancel],
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
  const hasBody = loading || renderBody || hasRenderableModalContent(children);
  const hasFooterContent = hasRenderableModalContent(footer);
  const hasPagination = paginationTotalPages > 1;
  const hasFooterSupport = hasPagination || hasFooterContent;
  const hasFooter = shouldRenderModalFooter({
    footer,
    confirmLabel,
    cancelLabel,
    hasPagination,
  });
  const resolvedMaxBodyHeight =
    placement === 'center' ? maxBodyHeight : '100vh';
  const shouldProjectWebComponentContent =
    renderBody && !hasRenderableModalContent(children) && Boolean(container);
  const modalBodyContent = loading ? (
    <HansLoading
      loadingType="spinner"
      loadingSize="medium"
      loadingColor={modalColor}
      ariaLabel="Modal loading"
    />
  ) : hasRenderableModalContent(children) ? (
    children
  ) : shouldProjectWebComponentContent ? (
    <ModalProjectedContent container={container!} />
  ) : (
    <slot />
  );

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
      className={['hans-modal-portal', overlayClassName].filter(Boolean).join(' ')}
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
          <div className={['hans-modal-content', contentClassName].filter(Boolean).join(' ')}>
            {hasHeader ? (
              <div
                className={[
                  'hans-modal-header',
                  showHeaderDivider ? 'hans-modal-header-divider' : '',
                  headerClassName,
                ]
                  .filter(Boolean)
                  .join(' ')}
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
                className={['hans-modal-body', bodyClassName].filter(Boolean).join(' ')}
                style={
                  {
                    '--hans-modal-body-max-height': resolvedMaxBodyHeight,
                  } as React.CSSProperties
                }
              >
                <div
                  className={[
                    'hans-modal-body-content',
                    loading ? 'hans-modal-body-loading' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {modalBodyContent}
                </div>
              </div>
            ) : null}

            {hasFooter ? (
              <div
                className={[
                  'hans-modal-footer',
                  showFooterDivider ? 'hans-modal-footer-divider' : '',
                  hasFooterSupport ? '' : 'hans-modal-footer-actions-only',
                  footerClassName,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {hasFooterSupport ? (
                  <div className="hans-modal-footer-support">
                    {hasPagination ? (
                      <div className="hans-modal-footer-pagination">
                        <HansPagination
                          currentPage={paginationCurrentPage}
                          totalPages={paginationTotalPages}
                          disabled={paginationDisabled}
                          ariaLabel={paginationAriaLabel}
                          firstLabel={paginationFirstLabel}
                          previousLabel={paginationPreviousLabel}
                          nextLabel={paginationNextLabel}
                          lastLabel={paginationLastLabel}
                          pageLabel={paginationPageLabel}
                          firstContent={paginationFirstContent}
                          previousContent={paginationPreviousContent}
                          nextContent={paginationNextContent}
                          lastContent={paginationLastContent}
                          maxVisiblePages={paginationMaxVisiblePages}
                          paginationColor={paginationColor}
                          paginationSize={paginationSize}
                          activePageVariant={paginationActivePageVariant}
                          inactivePageVariant={paginationInactivePageVariant}
                          onPageChange={onPageChange}
                        />
                      </div>
                    ) : null}

                    {hasFooterContent ? (
                      <div className="hans-modal-footer-content">{footer}</div>
                    ) : null}
                  </div>
                ) : null}

                <div className="hans-modal-footer-actions">
                  {cancelLabel ? (
                    <HansButton
                      label={cancelLabel}
                      buttonVariant="outline"
                      buttonColor={cancelButtonColor}
                      disabled={cancelDisabled}
                      onClick={handleCancel}
                    />
                  ) : null}

                  {confirmLabel ? (
                    <HansButton
                      label={confirmLabel}
                      buttonVariant="default"
                      buttonColor={confirmButtonColor}
                      disabled={confirmDisabled}
                      loading={confirmLoading}
                      onClick={handleConfirm}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  if (disablePortal) return modalContent;

  const target = getModalPortalTarget(portalTarget);
  return target ? createPortal(modalContent, target) : modalContent;
});

HansModal.displayName = 'HansModal';
