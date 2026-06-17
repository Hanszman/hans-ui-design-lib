import type React from 'react';
import { vi } from 'vitest';
import { createInputValueEventHandlers } from './Input.helper';

const createInputEvent = (value: string) =>
  ({
    currentTarget: { value },
  }) as React.ChangeEvent<HTMLInputElement> & React.FormEvent<HTMLInputElement>;

describe('Input helper', () => {
  it('Should call change handlers and emit normalized value changes', () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    const { handleChange } = createInputValueEventHandlers({
      onChange,
      onValueChange,
    });
    const event = createInputEvent('angular');

    handleChange(event);

    expect(onChange).toHaveBeenCalledWith(event);
    expect(onValueChange).toHaveBeenCalledWith('angular');
  });

  it('Should call input handlers without duplicating value changes', () => {
    const onInput = vi.fn();
    const onValueChange = vi.fn();
    const { handleInput } = createInputValueEventHandlers({
      onInput,
      onValueChange,
    });
    const event = createInputEvent('react');

    handleInput(event);

    expect(onInput).toHaveBeenCalledWith(event);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
