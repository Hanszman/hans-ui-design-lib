import type React from 'react';
import type {
  CreateInputValueEventHandlersParams,
  DispatchInputActionEventsParams,
  DispatchInputValueEventsParams,
  InputActionEventName,
  InputActionSide,
  InputValueEventName,
  ResolveInitialInputValueParams,
  ResolveInputActionParams,
  StandardInputEventName,
  ApplyInputFormattingParams,
  InputElement,
  InputFormattingResult,
} from './Input.helper.types';

export const INPUT_VALUE_EVENT_NAMES: readonly InputValueEventName[] = [
  'valueChange',
  'valuechange',
  'value-change',
];
export const INPUT_ACTION_EVENT_NAMES_BY_SIDE: Readonly<
  Record<InputActionSide, readonly InputActionEventName[]>
> = {
  left: ['leftIconClick', 'lefticonclick', 'left-icon-click'],
  right: ['rightIconClick', 'righticonclick', 'right-icon-click'],
};

export const dispatchInputValueEvents = ({
  target,
  value,
  eventName,
}: DispatchInputValueEventsParams): void => {
  const host = resolveInputHost(target);

  if (!host) {
    return;
  }

  syncHostValue(host, value);
  host.dispatchEvent(createStandardInputEvent(eventName, value));

  for (const valueEventName of INPUT_VALUE_EVENT_NAMES) {
    host.dispatchEvent(createValueEvent(valueEventName, value));
  }
};

export const dispatchInputActionEvents = ({
  target,
  side,
}: DispatchInputActionEventsParams): void => {
  const host = resolveInputHost(target);

  if (!host) {
    return;
  }

  for (const eventName of INPUT_ACTION_EVENT_NAMES_BY_SIDE[side]) {
    host.dispatchEvent(createActionEvent(eventName));
  }
};

export const normalizeInputValue = (
  value: ResolveInitialInputValueParams,
): string => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    return value;
  }

  return '';
};

export const resolveInitialInputValue = (
  defaultValue: ResolveInitialInputValueParams,
): string => normalizeInputValue(defaultValue);

export const shouldRenderInputAction = ({
  ariaLabel,
  onIconClick,
}: ResolveInputActionParams): boolean =>
  typeof onIconClick === 'function' ||
  (typeof ariaLabel === 'string' && ariaLabel.trim().length > 0);

export const createInputValueEventHandlers = ({
  onChange,
  onInput,
  onValueChange,
}: CreateInputValueEventHandlersParams): {
  handleChange: React.ChangeEventHandler<InputElement>;
  handleInput: React.FormEventHandler<InputElement>;
} => ({
  handleChange: (event) => {
    onChange?.(event);
    const value = event.currentTarget.value;
    onValueChange?.(value);
    dispatchInputValueEvents({
      target: event.currentTarget,
      value,
      eventName: 'change',
    });
  },
  handleInput: (event) => {
    onInput?.(event);
    const value = event.currentTarget.value;
    onValueChange?.(value);
    dispatchInputValueEvents({
      target: event.currentTarget,
      value,
      eventName: 'input',
    });
  },
});

const INPUT_FORMATTING_MARKERS = {
  bold: ['**', '**'],
  italic: ['*', '*'],
  underline: ['__', '__'],
  'unordered-list': ['- ', ''],
} as const;

export const applyInputFormatting = ({
  value,
  selectionStart,
  selectionEnd,
  action,
}: ApplyInputFormattingParams): InputFormattingResult => {
  const [openingMarker, closingMarker] = INPUT_FORMATTING_MARKERS[action];
  const selectedText = value.slice(selectionStart, selectionEnd);
  const formattedText =
    action === 'unordered-list'
      ? selectedText
          .split('\n')
          .map((line) => `${openingMarker}${line}`)
          .join('\n')
      : `${openingMarker}${selectedText}${closingMarker}`;
  const nextValue = `${value.slice(0, selectionStart)}${formattedText}${value.slice(selectionEnd)}`;
  return {
    value: nextValue,
    selectionStart: selectionStart + openingMarker.length,
    selectionEnd:
      action === 'unordered-list'
        ? selectionStart + formattedText.length
        : selectionStart + openingMarker.length + selectedText.length,
  };
};

const createValueEvent = (
  eventName: InputValueEventName,
  value: string,
): CustomEvent<string> =>
  new CustomEvent(eventName, {
    bubbles: true,
    composed: true,
    detail: value,
  });

const createStandardInputEvent = (
  eventName: StandardInputEventName,
  value: string,
): Event => {
  if (eventName === 'input' && typeof InputEvent !== 'undefined') {
    return new InputEvent(eventName, {
      bubbles: true,
      composed: true,
      data: value,
      inputType: value ? 'insertText' : 'deleteContentBackward',
    });
  }

  return new Event(eventName, {
    bubbles: true,
    composed: true,
  });
};

const createActionEvent = (eventName: InputActionEventName): CustomEvent<null> =>
  new CustomEvent(eventName, {
    bubbles: true,
    composed: true,
    detail: null,
  });

const resolveInputHost = (target: HTMLElement): HTMLElement | null => {
  const rootNode = target.getRootNode();

  if (rootNode instanceof ShadowRoot && rootNode.host) {
    return rootNode.host as HTMLElement;
  }

  return null;
};

const syncHostValue = (
  host: HTMLElement & { value?: string },
  value: string,
): void => {
  host.value = value;
  host.removeAttribute('value');
};
