import type React from 'react';

export type InputValueChangeHandler = (value: string) => void;

export type InputValueEventName = 'valueChange' | 'valuechange' | 'value-change';

export type CreateInputValueEventHandlersParams = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onInput?: React.FormEventHandler<HTMLInputElement>;
  onValueChange?: InputValueChangeHandler;
};

export type DispatchInputValueEventsParams = {
  target: HTMLInputElement;
  value: string;
};
