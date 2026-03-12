import type React from 'react';
import type { Color } from '../../../types/Common.types';
import type {
  CreateToastAutoDismissEffectParams,
  CreateToastCloseHandlerParams,
  CreateToastStackEffectParams,
  GetToastInlineStyleParams,
  ResolveToastToneParams,
  ToastStackSnapshot,
  ToastStackRegistry,
} from './Toast.helper.types';
import type { ToastCloseReason, ToastPosition } from '../Toast.types';

export const createEmptyToastStackRegistry = (): ToastStackRegistry => ({
  'top-right': [],
  'top-left': [],
  'bottom-right': [],
  'bottom-left': [],
});

export const toastStackListeners = new Set<() => void>();
let toastStackRegistry = createEmptyToastStackRegistry();

export const notifyToastStackListeners = (): void => {
  toastStackListeners.forEach((listener) => listener());
};

export const getToastTokenPrefix = (toastColor: Color): string =>
  toastColor === 'base' ? 'base' : toastColor;

export const subscribeToastStack = (listener: () => void): (() => void) => {
  toastStackListeners.add(listener);
  return () => {
    toastStackListeners.delete(listener);
  };
};

export const resetToastStackRegistry = (): void => {
  toastStackRegistry = createEmptyToastStackRegistry();
  notifyToastStackListeners();
};

export const removeToastFromStack = (id: string): void => {
  let changed = false;

  (Object.keys(toastStackRegistry) as ToastPosition[]).forEach((position) => {
    const nextItems = toastStackRegistry[position].filter(
      (item) => item.id !== id,
    );
    if (nextItems.length !== toastStackRegistry[position].length) {
      toastStackRegistry[position] = nextItems;
      changed = true;
    }
  });

  if (changed) notifyToastStackListeners();
};

export const upsertToastInStack = (
  position: ToastPosition,
  id: string,
  height: number,
): void => {
  let changed = false;

  (Object.keys(toastStackRegistry) as ToastPosition[]).forEach(
    (currentPosition) => {
      const currentItems = toastStackRegistry[currentPosition];
      const currentIndex = currentItems.findIndex((item) => item.id === id);

      if (currentPosition !== position && currentIndex >= 0) {
        toastStackRegistry[currentPosition] = currentItems.filter(
          (item) => item.id !== id,
        );
        changed = true;
      }
    },
  );

  const targetItems = toastStackRegistry[position];
  const targetIndex = targetItems.findIndex((item) => item.id === id);

  if (targetIndex >= 0) {
    if (targetItems[targetIndex].height !== height) {
      toastStackRegistry[position] = targetItems.map((item, index) =>
        index === targetIndex ? { ...item, height } : item,
      );
      changed = true;
    }
  } else {
    toastStackRegistry[position] = [...targetItems, { id, height }];
    changed = true;
  }

  if (changed) notifyToastStackListeners();
};

export const getToastStackIndex = (
  position: ToastPosition,
  id: string,
): number => toastStackRegistry[position].findIndex((item) => item.id === id);

export const getDefaultToastStackSnapshot = (): ToastStackSnapshot => ({
  offset: 0,
  index: -1,
});

export const getToastStackOffset = (
  position: ToastPosition,
  id: string,
  stackGap: number,
): number => {
  const items = toastStackRegistry[position];
  const currentIndex = items.findIndex((item) => item.id === id);

  if (currentIndex <= 0) return 0;

  return items
    .slice(0, currentIndex)
    .reduce((offset, item) => offset + item.height + stackGap, 0);
};

export const getToastStackSnapshot = (
  position: ToastPosition,
  id: string,
  stackGap: number,
): ToastStackSnapshot => ({
  offset: getToastStackOffset(position, id, stackGap),
  index: getToastStackIndex(position, id),
});

export const measureToastHeight = (element: HTMLDivElement | null): number => {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  return rect.height || element.offsetHeight || 0;
};

export const getToastAccessibilityState = (
  toastColor: Color,
): { role: 'status' | 'alert'; ariaLive: 'polite' | 'assertive' } => ({
  role:
    toastColor === 'danger' || toastColor === 'warning' ? 'alert' : 'status',
  ariaLive: toastColor === 'danger' ? 'assertive' : 'polite',
});

export const resolveToastTone = ({
  toastColor,
  toastVariant,
}: ResolveToastToneParams) => {
  const tokenPrefix = getToastTokenPrefix(toastColor);

  if (toastVariant === 'strong') {
    return {
      background: `var(--${tokenPrefix}-strong-color)`,
      border: `var(--${tokenPrefix}-default-color)`,
      text: `var(--${tokenPrefix}-neutral-color)`,
      accent: `var(--${tokenPrefix}-neutral-color)`,
      shadow: '0 18px 40px rgba(15, 23, 42, 0.2)',
    };
  }

  if (toastVariant === 'default') {
    return {
      background: `var(--${tokenPrefix}-default-color)`,
      border: `var(--${tokenPrefix}-strong-color)`,
      text: 'var(--white)',
      accent: `var(--${tokenPrefix}-strong-color)`,
      shadow: '0 18px 40px rgba(15, 23, 42, 0.16)',
    };
  }

  if (toastVariant === 'outline') {
    return {
      background: 'var(--white)',
      border: `var(--${tokenPrefix}-default-color)`,
      text: `var(--${tokenPrefix}-strong-color)`,
      accent: `var(--${tokenPrefix}-default-color)`,
      shadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
    };
  }

  if (toastVariant === 'transparent') {
    return {
      background: 'rgba(255, 255, 255, 0.92)',
      border: `var(--${tokenPrefix}-neutral-color)`,
      text: `var(--${tokenPrefix}-strong-color)`,
      accent: `var(--${tokenPrefix}-default-color)`,
      shadow: '0 14px 30px rgba(15, 23, 42, 0.1)',
    };
  }

  return {
    background: `var(--${tokenPrefix}-neutral-color)`,
    border: `var(--${tokenPrefix}-default-color)`,
    text: `var(--${tokenPrefix}-strong-color)`,
    accent: `var(--${tokenPrefix}-default-color)`,
    shadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
  };
};

export const getToastClassName = (
  toastSize: 'small' | 'medium' | 'large',
  customClasses: string,
): string => `
  hans-toast
  hans-toast-${toastSize}
  ${customClasses}
`;

export const getToastInlineStyle = ({
  toastColor,
  toastVariant,
  position,
  offset,
  stackOffset,
  zIndex,
  style,
}: GetToastInlineStyleParams): React.CSSProperties => {
  const tone = resolveToastTone({ toastColor, toastVariant });
  const isTop = position.startsWith('top');
  const isRight = position.endsWith('right');

  return {
    ...(style || {}),
    [isTop ? 'top' : 'bottom']: `${offset}px`,
    [isRight ? 'right' : 'left']: `${offset}px`,
    '--hans-toast-bg': tone.background,
    '--hans-toast-border': tone.border,
    '--hans-toast-text': tone.text,
    '--hans-toast-accent': tone.accent,
    '--hans-toast-shadow': tone.shadow,
    '--hans-toast-stack-offset': `${stackOffset}px`,
    transform: `translateY(${isTop ? stackOffset : stackOffset * -1}px)`,
    zIndex,
  } as React.CSSProperties;
};

export const createToastCloseHandler =
  ({
    isControlled,
    setInternalVisible,
    onVisibilityChange,
    onClose,
  }: CreateToastCloseHandlerParams) =>
  (reason: ToastCloseReason): void => {
    if (!isControlled) setInternalVisible(false);
    if (onVisibilityChange) onVisibilityChange(false);
    if (onClose) onClose(reason);
  };

export const createToastStackEffect =
  ({
    visible,
    position,
    toastId,
    containerRef,
  }: CreateToastStackEffectParams) =>
  (): VoidFunction | undefined => {
    if (!visible) {
      removeToastFromStack(toastId);
      return undefined;
    }

    const syncHeight = () =>
      upsertToastInStack(
        position,
        toastId,
        measureToastHeight(containerRef.current),
      );

    syncHeight();

    if (typeof ResizeObserver === 'undefined' || !containerRef.current) {
      return () => {
        removeToastFromStack(toastId);
      };
    }

    const observer = new ResizeObserver(() => syncHeight());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      removeToastFromStack(toastId);
    };
  };

export const createToastAutoDismissEffect =
  ({
    visible,
    duration,
    handleClose,
  }: CreateToastAutoDismissEffectParams) =>
  (): VoidFunction | undefined => {
    if (!visible || duration <= 0) return undefined;

    const timer = window.setTimeout(() => handleClose('timeout'), duration);
    return () => window.clearTimeout(timer);
  };
