import type React from 'react';
import type {
  CreateInputValueEventHandlersParams,
  DispatchInputValueEventsParams,
  InputValueEventName,
} from './Input.helper.types';

export const INPUT_VALUE_EVENT_NAMES: readonly InputValueEventName[] = [
  'valueChange',
  'valuechange',
  'value-change',
];

export const dispatchInputValueEvents = ({
  target,
  value,
}: DispatchInputValueEventsParams): void => {
  for (const eventName of INPUT_VALUE_EVENT_NAMES) {
    target.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        detail: value,
      }),
    );
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
    dispatchInputValueEvents({ target: event.currentTarget, value });
  },
  handleInput: (event) => {
    onInput?.(event);
    const value = event.currentTarget.value;
    onValueChange?.(value);
    dispatchInputValueEvents({ target: event.currentTarget, value });
  },
});
