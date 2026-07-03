import type React from 'react';

export type InputValueChangeHandler = (value: string) => void;
export type InputActionSide = 'left' | 'right';
export type InputActionEventName =
  | 'leftIconClick'
  | 'lefticonclick'
  | 'left-icon-click'
  | 'rightIconClick'
  | 'righticonclick'
  | 'right-icon-click';

export type InputValueEventName =
  | 'valueChange'
  | 'valuechange'
  | 'value-change';

export type StandardInputEventName = 'input' | 'change';

export type CreateInputValueEventHandlersParams = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onInput?: React.FormEventHandler<HTMLInputElement>;
  onValueChange?: InputValueChangeHandler;
};

export type DispatchInputValueEventsParams = {
  target: HTMLInputElement;
  value: string;
  eventName: StandardInputEventName;
};

export type DispatchInputActionEventsParams = {
  target: HTMLElement;
  side: InputActionSide;
};
