import type React from 'react';
import type {
  TextareaFormattingAction,
  TextareaValueChangeHandler,
} from '../Textarea.types';

export type TextareaValueEventName = 'input' | 'change';

export type DispatchTextareaValueEventsParams = {
  target: HTMLTextAreaElement;
  value: string;
  eventName: TextareaValueEventName;
};

export type CreateTextareaValueEventHandlersParams = {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onInput?: React.InputEventHandler<HTMLTextAreaElement>;
  onValueChange?: TextareaValueChangeHandler;
};

export type ApplyTextareaFormattingParams = {
  action: TextareaFormattingAction;
  editor: HTMLDivElement;
  selectionRange?: Range | null;
};
