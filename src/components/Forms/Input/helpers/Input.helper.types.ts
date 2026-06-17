import type React from 'react';

export type InputValueChangeHandler = (value: string) => void;

export type CreateInputValueEventHandlersParams = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onInput?: React.FormEventHandler<HTMLInputElement>;
  onValueChange?: InputValueChangeHandler;
};

