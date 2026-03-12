import React from 'react';
import { createPortal } from 'react-dom';
import { HansIcon } from '../Icon/Icon';
import type { HansToastProps } from './Toast.types';
import {
  createToastAutoDismissEffect,
  createToastCloseHandler,
  createToastStackEffect,
  getToastAccessibilityState,
  getToastClassName,
  getToastInlineStyle,
  getToastStackIndex,
  getToastStackOffset,
  subscribeToastStack,
} from './helpers/Toast.helper';

export const HansToast = React.memo((props: HansToastProps) => {
  const {
    title = '',
    message = '',
    isVisible,
    defaultVisible = true,
    duration = 4000,
    toastColor = 'base',
    toastVariant = 'neutral',
    toastSize = 'medium',
    position = 'top-right',
    dismissible = true,
    iconName = '',
    stackGap = 12,
    offset = 16,
    closeButtonLabel = 'Dismiss notification',
    customClasses = '',
    titleClassName = '',
    messageClassName = '',
    onClose,
    onVisibilityChange,
    portalTarget = null,
    style,
    ...rest
  } = props;

  const toastId = React.useId();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [internalVisible, setInternalVisible] = React.useState(defaultVisible);
  const isControlled = typeof isVisible !== 'undefined';
  const visible = isControlled ? Boolean(isVisible) : internalVisible;
  const handleClose = createToastCloseHandler({
    isControlled,
    setInternalVisible,
    onVisibilityChange,
    onClose,
  });
  const stackOffset = React.useSyncExternalStore(
    subscribeToastStack,
    () => getToastStackOffset(position, toastId, stackGap),
    () => 0,
  );
  const stackIndex = React.useSyncExternalStore(
    subscribeToastStack,
    () => getToastStackIndex(position, toastId),
    () => -1,
  );
  const { role, ariaLive } = getToastAccessibilityState(toastColor);

  React.useLayoutEffect(() => {
    return createToastStackEffect({
      visible,
      position,
      toastId,
      containerRef,
    })();
  }, [message, position, title, toastId, toastSize, visible]);

  React.useEffect(() => {
    return createToastAutoDismissEffect({
      visible,
      duration,
      handleClose,
    })();
  }, [duration, handleClose, visible]);

  if (!visible) return null;

  const className = getToastClassName(toastSize, customClasses);
  const inlineStyle = getToastInlineStyle({
    toastColor,
    toastVariant,
    position,
    offset,
    stackOffset,
    zIndex: 1000 + Math.max(stackIndex, 0),
    style,
  });

  const toastContent = (
    <div
      ref={containerRef}
      className={className}
      style={inlineStyle}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      data-position={position}
      {...rest}
    >
      <span className="hans-toast-accent" aria-hidden="true" />

      {iconName ? (
        <span className="hans-toast-icon">
          <HansIcon name={iconName} iconSize={toastSize} />
        </span>
      ) : null}

      <div className="hans-toast-content">
        {title ? (
          <span className={`hans-toast-title ${titleClassName}`}>{title}</span>
        ) : null}
        {message ? (
          <span className={`hans-toast-message ${messageClassName}`}>
            {message}
          </span>
        ) : null}
      </div>

      {dismissible ? (
        <button
          type="button"
          className="hans-toast-close"
          aria-label={closeButtonLabel}
          onClick={() => handleClose('dismiss')}
        >
          <HansIcon name="IoIosCloseCircle" />
        </button>
      ) : null}
    </div>
  );

  if (portalTarget) {
    return createPortal(toastContent, portalTarget);
  }

  return toastContent;
});

HansToast.displayName = 'HansToast';
