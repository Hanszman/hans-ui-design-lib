import type React from 'react';
import type {
  InputFormattingAction,
  InputIconClickHandler,
  InputValue,
} from '../Input.types';

export type InputElement = HTMLInputElement | HTMLTextAreaElement;

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
  onChange?: React.ChangeEventHandler<InputElement>;
  onInput?: React.FormEventHandler<InputElement>;
  onValueChange?: InputValueChangeHandler;
};

export type ResolveInitialInputValueParams = InputValue | undefined;

export type ResolveInputActionParams = {
  ariaLabel?: string;
  onIconClick?: InputIconClickHandler;
};

export type DispatchInputValueEventsParams = {
  target: InputElement;
  value: string;
  eventName: StandardInputEventName;
};

export type DispatchInputActionEventsParams = {
  target: HTMLElement;
  side: InputActionSide;
};

export type ApplyInputFormattingParams = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
  action: InputFormattingAction;
};

export type InputFormattingResult = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};
