import { vi } from 'vitest';
import {
  createInputValueEventHandlers,
  INPUT_VALUE_EVENT_NAMES,
} from './Input.helper';

type InputValueChangeEvent = Parameters<
  ReturnType<typeof createInputValueEventHandlers>['handleChange']
>[0];

const createInputEvent = (value: string) => {
  const host = document.createElement('hans-input');
  const shadowRoot = host.attachShadow({ mode: 'open' });
  const input = document.createElement('input');
  input.value = value;
  shadowRoot.appendChild(input);

  return {
    currentTarget: input,
    host,
  } as unknown as InputValueChangeEvent & { host: HTMLElement };
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
    const hostEventSpies = INPUT_VALUE_EVENT_NAMES.map((eventName) => {
      const spy = vi.fn();
      event.host.addEventListener(eventName, spy);
      return spy;
    });
    const inputSpy = vi.fn();

    event.host.addEventListener('input', inputSpy);

    handleInput(event);

    expect(event.host.getAttribute('value')).toBe('portfolio');
    expect((event.host as HTMLElement & { value?: string }).value).toBe(
      'portfolio',
    );
    expect(inputSpy).toHaveBeenCalledTimes(1);
    expect(inputSpy.mock.calls[0][0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: 'portfolio',
    });

    hostEventSpies.forEach((spy) => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toMatchObject({
        bubbles: true,
        composed: true,
        detail: 'portfolio',
      });
    });
  });

  it('Should dispatch change events with the normalized value', () => {
    const { handleChange } = createInputValueEventHandlers({});
    const event = createInputEvent('typescript');
    const changeSpy = vi.fn();

    event.host.addEventListener('change', changeSpy);

    handleChange(event);

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: 'typescript',
    });
  });
});
