import {
  getMessageAccessibilityState,
  getMessageClassName,
  getMessageInlineStyle,
  resolveMessageTone,
} from './Message.helper';

describe('Message.helper', () => {
  it('Should resolve every visual variant from theme tokens', () => {
    expect(resolveMessageTone('success', 'strong').background).toBe(
      'var(--success-strong-color)',
    );
    expect(resolveMessageTone('success', 'default').text).toBe('var(--white)');
    expect(resolveMessageTone('warning', 'outline').background).toBe(
      'transparent',
    );
    expect(resolveMessageTone('info', 'transparent').border).toBe(
      'transparent',
    );
    expect(resolveMessageTone('primary', 'inverse').text).toBe(
      'var(--background-color)',
    );
    expect(resolveMessageTone('base', 'neutral').background).toBe(
      'var(--base-neutral-color)',
    );
  });

  it('Should build class names, styles and accessibility metadata', () => {
    expect(getMessageClassName('large', 'extra')).toContain(
      'hans-message-large extra',
    );
    expect(
      getMessageInlineStyle({
        messageColor: 'info',
        messageVariant: 'neutral',
        style: { width: 320 },
      }),
    ).toMatchObject({
      width: 320,
      '--hans-message-bg': 'var(--info-neutral-color)',
    });
    expect(getMessageAccessibilityState('warning')).toEqual({
      role: 'alert',
      ariaLive: 'polite',
    });
    expect(getMessageAccessibilityState('base')).toEqual({
      role: 'status',
      ariaLive: 'polite',
    });
  });
});
