import type React from 'react';
import type { CreateInputValueEventHandlersParams } from './Input.helper.types';

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
    onValueChange?.(event.currentTarget.value);
  },
  handleInput: (event) => {
    onInput?.(event);
  },
});

