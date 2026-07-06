import { vi } from 'vitest';
import {
  createInputValueEventHandlers,
  dispatchInputActionEvents,
  INPUT_ACTION_EVENT_NAMES_BY_SIDE,
  INPUT_VALUE_EVENT_NAMES,
  normalizeInputValue,
  resolveInitialInputValue,
  shouldRenderInputAction,
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
  } as unknown as InputValueChangeEvent & {
    host: HTMLElement & { value?: string };
  };
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

  it('Should dispatch standard host input events and framework friendly value events', () => {
    const { handleInput } = createInputValueEventHandlers({});
    const event = createInputEvent('portfolio');
    const hostEventSpies = INPUT_VALUE_EVENT_NAMES.map((eventName) => {
      const spy = vi.fn();
      event.host.addEventListener(eventName, spy);
      return spy;
    });
    const inputSpy = vi.fn();

    event.host.addEventListener('input', inputSpy);
    event.host.setAttribute('value', 'stale');

    handleInput(event);

    expect(event.host.getAttribute('value')).toBeNull();
    expect(event.host.value).toBe('portfolio');
    expect(inputSpy).toHaveBeenCalledTimes(1);
    expect(inputSpy.mock.calls[0][0]).toMatchObject({
      bubbles: true,
      composed: true,
      type: 'input',
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

  it('Should remove the host value attribute when the normalized value becomes empty', () => {
    const { handleInput } = createInputValueEventHandlers({});
    const event = createInputEvent('');

    event.host.setAttribute('value', 'previous');

    handleInput(event);

    expect(event.host.hasAttribute('value')).toBe(false);
    expect(event.host.value).toBe('');
  });

  it('Should dispatch standard change events with the normalized value on the host property', () => {
    const { handleChange } = createInputValueEventHandlers({});
    const event = createInputEvent('typescript');
    const changeSpy = vi.fn();

    event.host.addEventListener('change', changeSpy);

    handleChange(event);

    expect(event.host.value).toBe('typescript');
    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0]).toMatchObject({
      bubbles: true,
      composed: true,
      type: 'change',
    });
    expect(
      (changeSpy.mock.calls[0][0] as Event & { detail?: string }).detail,
    ).toBeUndefined();
  });

  it('Should dispatch framework friendly right icon action events', () => {
    const event = createInputEvent('visibility');
    const hostEventSpies = INPUT_ACTION_EVENT_NAMES_BY_SIDE.right.map((eventName) => {
      const spy = vi.fn();
      event.host.addEventListener(eventName, spy);
      return spy;
    });

    dispatchInputActionEvents({
      target: event.currentTarget,
      side: 'right',
    });

    hostEventSpies.forEach((spy) => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toMatchObject({
        bubbles: true,
        composed: true,
        detail: null,
      });
    });
  });

  it('Should dispatch framework friendly left icon action events', () => {
    const event = createInputEvent('mail');
    const hostEventSpies = INPUT_ACTION_EVENT_NAMES_BY_SIDE.left.map((eventName) => {
      const spy = vi.fn();
      event.host.addEventListener(eventName, spy);
      return spy;
    });

    dispatchInputActionEvents({
      target: event.currentTarget,
      side: 'left',
    });

    hostEventSpies.forEach((spy) => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toMatchObject({
        bubbles: true,
        composed: true,
        detail: null,
      });
    });
  });

  it('Should normalize primitive and array input values through the helper', () => {
    expect(normalizeInputValue('mail')).toBe('mail');
    expect(normalizeInputValue(123)).toBe('123');
    expect(normalizeInputValue(['Angular', 'React'])).toBe('Angular, React');
    expect(normalizeInputValue(undefined)).toBe('');
  });

  it('Should resolve the initial input value through the normalization helper', () => {
    expect(resolveInitialInputValue('secret')).toBe('secret');
    expect(resolveInitialInputValue(['A', 'B'])).toBe('A, B');
    expect(resolveInitialInputValue(undefined)).toBe('');
  });

  it('Should treat explicit aria labels as an input action contract', () => {
    expect(
      shouldRenderInputAction({
        ariaLabel: 'Show password',
      }),
    ).toBe(true);
    expect(
      shouldRenderInputAction({
        onIconClick: vi.fn(),
      }),
    ).toBe(true);
    expect(
      shouldRenderInputAction({
        ariaLabel: '   ',
      }),
    ).toBe(false);
  });
});
