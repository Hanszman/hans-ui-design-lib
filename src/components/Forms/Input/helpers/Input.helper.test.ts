import type React from 'react';
import { vi } from 'vitest';
import {
  createInputValueEventHandlers,
  INPUT_VALUE_EVENT_NAMES,
} from './Input.helper';

const createInputEvent = (value: string) => {
  const input = document.createElement('input');
  input.value = value;

  return {
    currentTarget: input,
  } as React.ChangeEvent<HTMLInputElement> & React.FormEvent<HTMLInputElement>;
};

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

  it('Should call input handlers and emit normalized value changes', () => {
    const onInput = vi.fn();
    const onValueChange = vi.fn();
    const { handleInput } = createInputValueEventHandlers({
      onInput,
      onValueChange,
    });
    const event = createInputEvent('react');

    handleInput(event);

    expect(onInput).toHaveBeenCalledWith(event);
    expect(onValueChange).toHaveBeenCalledWith('react');
  });

  it('Should dispatch web component friendly value events', () => {
    const { handleInput } = createInputValueEventHandlers({});
    const event = createInputEvent('portfolio');
    const eventSpies = INPUT_VALUE_EVENT_NAMES.map((eventName) => {
      const spy = vi.fn();
      event.currentTarget.addEventListener(eventName, spy);
      return spy;
    });

    handleInput(event);

    eventSpies.forEach((spy) => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toMatchObject({
        bubbles: true,
        composed: true,
        detail: 'portfolio',
      });
    });
  });
});
