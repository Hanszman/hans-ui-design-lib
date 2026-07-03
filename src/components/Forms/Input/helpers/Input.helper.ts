import type React from 'react';
import type {
  CreateInputValueEventHandlersParams,
  DispatchInputActionEventsParams,
  DispatchInputValueEventsParams,
  InputActionEventName,
  InputValueEventName,
  StandardInputEventName,
} from './Input.helper.types';

export const INPUT_VALUE_EVENT_NAMES: readonly InputValueEventName[] = [
  'valueChange',
  'valuechange',
  'value-change',
];
export const INPUT_ACTION_EVENT_NAMES: readonly InputActionEventName[] = [
  'rightIconClick',
  'righticonclick',
  'right-icon-click',
];

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
}: DispatchInputActionEventsParams): void => {
  const host = resolveInputHost(target);

  if (!host) {
    return;
  }

  for (const eventName of INPUT_ACTION_EVENT_NAMES) {
    host.dispatchEvent(createActionEvent(eventName));
  }
};

export const createInputValueEventHandlers = ({
  onChange,
  onInput,
  onValueChange,
}: CreateInputValueEventHandlersParams): {
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleInput: React.FormEventHandler<HTMLInputElement>;
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

const resolveInputHost = (
  target: HTMLElement,
): HTMLElement | null => {
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
