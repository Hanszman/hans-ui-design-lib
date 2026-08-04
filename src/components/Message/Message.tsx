import React from 'react';
import { HansIcon } from '../Icon/Icon';
import type { HansMessageProps } from './Message.types';
import {
  getMessageAccessibilityState,
  getMessageClassName,
  getMessageInlineStyle,
} from './helpers/Message.helper';

export const HansMessage = React.memo((props: HansMessageProps) => {
  const {
    title = '',
    message = '',
    isVisible,
    defaultVisible = true,
    messageColor = 'base',
    messageVariant = 'neutral',
    messageSize = 'medium',
    iconName = '',
    dismissible = false,
    closeButtonLabel = 'Dismiss message',
    customClasses = '',
    onClose,
    onVisibilityChange,
    style,
    ...rest
  } = props;

  const [internalVisible, setInternalVisible] = React.useState(defaultVisible);
  const controlled = typeof isVisible !== 'undefined';
  const visible = controlled ? Boolean(isVisible) : internalVisible;
  const { role, ariaLive } = getMessageAccessibilityState(messageColor);

  const handleClose = (): void => {
    if (!controlled) setInternalVisible(false);
    onVisibilityChange?.(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div
      className={getMessageClassName(messageSize, customClasses)}
      style={getMessageInlineStyle({ messageColor, messageVariant, style })}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      {...rest}
    >
      {iconName ? (
        <span className="hans-message-icon" aria-hidden="true">
          <HansIcon name={iconName} iconSize={messageSize} />
        </span>
      ) : null}

      <span className="hans-message-content">
        {title ? <strong className="hans-message-title">{title}</strong> : null}
        {message ? <span className="hans-message-copy">{message}</span> : null}
      </span>

      {dismissible ? (
        <button
          type="button"
          className="hans-message-close"
          aria-label={closeButtonLabel}
          onClick={handleClose}
        >
          <HansIcon name="IoIosClose" iconSize={messageSize} />
        </button>
      ) : null}
    </div>
  );
});

HansMessage.displayName = 'HansMessage';
