import type React from 'react';
import type { Color, Size, Variant } from '../../../types/Common.types';
import type {
  GetMessageInlineStyleParams,
  MessageTone,
} from './Message.helper.types';

export const getMessageAccessibilityState = (
  messageColor: Color,
): { role: 'status' | 'alert'; ariaLive: 'polite' | 'assertive' } => ({
  role:
    messageColor === 'danger' || messageColor === 'warning'
      ? 'alert'
      : 'status',
  ariaLive: messageColor === 'danger' ? 'assertive' : 'polite',
});

export const resolveMessageTone = (
  messageColor: Color,
  messageVariant: Variant,
): MessageTone => {
  const prefix = messageColor === 'base' ? 'base' : messageColor;
  const strong = `var(--${prefix}-strong-color)`;
  const color = `var(--${prefix}-default-color)`;
  const neutral = `var(--${prefix}-neutral-color)`;

  switch (messageVariant) {
    case 'strong':
      return {
        background: strong,
        border: color,
        text: neutral,
        accent: neutral,
      };
    case 'default':
      return {
        background: color,
        border: strong,
        text: 'var(--white)',
        accent: strong,
      };
    case 'outline':
      return {
        background: 'transparent',
        border: color,
        text: strong,
        accent: color,
      };
    case 'transparent':
      return {
        background: `color-mix(in srgb, ${neutral} 34%, transparent)`,
        border: 'transparent',
        text: strong,
        accent: color,
      };
    case 'inverse':
      return {
        background: 'var(--text-color)',
        border: color,
        text: 'var(--background-color)',
        accent: neutral,
      };
    case 'neutral':
    default:
      return {
        background: neutral,
        border: color,
        text: strong,
        accent: color,
      };
  }
};

export const getMessageClassName = (
  messageSize: Size,
  customClasses: string,
): string => `hans-message hans-message-${messageSize} ${customClasses}`;

export const getMessageInlineStyle = ({
  messageColor,
  messageVariant,
  style,
}: GetMessageInlineStyleParams): React.CSSProperties => {
  const tone = resolveMessageTone(messageColor, messageVariant);
  return {
    ...style,
    '--hans-message-bg': tone.background,
    '--hans-message-border': tone.border,
    '--hans-message-text': tone.text,
    '--hans-message-accent': tone.accent,
  } as React.CSSProperties;
};
