import React from 'react';
import type { HansInputProps } from './Input.types';
import { HansInputActionIcon } from './InputActionIcon/InputActionIcon';
import {
  applyInputFormatting,
  createInputValueEventHandlers,
  dispatchInputActionEvents,
  normalizeInputValue,
  resolveInitialInputValue,
  shouldRenderInputAction,
} from './helpers/Input.helper';
import type { InputElement, InputFormattingResult } from './helpers/Input.helper.types';
import type { InputFormattingAction } from './Input.types';
import { HansIcon } from '../../Icon/Icon';

export const HansInput = React.memo((props: HansInputProps) => {
  const {
    label = '',
    labelColor = 'base',
    placeholder = '',
    value,
    defaultValue,
    inputId = 'hans-input',
    inputColor = 'base',
    inputSize = 'medium',
    inputType = 'text',
    textareaRows = 5,
    formattingToolbar = false,
    formattingToolbarAriaLabel = 'Text formatting',
    boldActionLabel = 'Bold',
    italicActionLabel = 'Italic',
    underlineActionLabel = 'Underline',
    unorderedListActionLabel = 'Bullet list',
    message = '',
    messageColor = 'base',
    customClasses = '',
    disabled = false,
    required = false,
    leftIcon,
    leftIconAriaLabel = 'Left input action',
    onLeftIconClick,
    rightIcon,
    rightIconAriaLabel = 'Right input action',
    onRightIconClick,
    children,
    onChange,
    onInput,
    onValueChange,
    ...rest
  } = props;

  const isControlled = typeof value !== 'undefined';
  const inputRef = React.useRef<InputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>(() =>
    resolveInitialInputValue(defaultValue),
  );

  const inputValue = isControlled ? normalizeInputValue(value) : uncontrolledValue;
  const shouldHandleLeftIconAction = shouldRenderInputAction({
    ariaLabel: props.leftIconAriaLabel,
    onIconClick: onLeftIconClick,
  });
  const shouldHandleRightIconAction = shouldRenderInputAction({
    ariaLabel: props.rightIconAriaLabel,
    onIconClick: onRightIconClick,
  });

  const { handleChange: dispatchChange, handleInput: dispatchInput } =
    createInputValueEventHandlers({
      onChange,
      onInput,
      onValueChange,
    });

  const handleChange: React.ChangeEventHandler<InputElement> = (event) => {
    if (!isControlled) {
      setUncontrolledValue(event.currentTarget.value);
    }

    dispatchChange(event);
  };

  const handleInput: React.FormEventHandler<InputElement> = (event) => {
    if (!isControlled) {
      setUncontrolledValue(event.currentTarget.value);
    }

    dispatchInput(event);
  };

  const handleLeftIconClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onLeftIconClick?.(event);

    dispatchInputActionEvents({
      target: event.currentTarget,
      side: 'left',
    });
  };

  const handleRightIconClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onRightIconClick?.(event);

    dispatchInputActionEvents({
      target: event.currentTarget,
      side: 'right',
    });
  };

  const inputClassName = [
    'hans-input',
    `hans-input-${inputSize}`,
    `hans-input-${inputColor}`,
    leftIcon ? 'hans-input-has-left-icon' : '',
    rightIcon ? 'hans-input-has-right-icon' : '',
    customClasses,
  ]
    .filter(Boolean)
    .join(' ');

  const applyFormatting = (action: InputFormattingAction): void => {
    const element = inputRef.current;
    if (!element) return;

    const result: InputFormattingResult = applyInputFormatting({
      value: inputValue,
      selectionStart: element.selectionStart ?? inputValue.length,
      selectionEnd: element.selectionEnd ?? inputValue.length,
      action,
    });
    if (!isControlled) setUncontrolledValue(result.value);
    element.value = result.value;
    element.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  };

  const sharedFieldProps = {
    id: inputId,
    disabled,
    required,
    placeholder,
    className: inputClassName,
    value: inputValue,
    onChange: handleChange,
    onInput: handleInput,
  };

  return (
    <div className="hans-input-div">
      {children}
      {label ? (
        <label
          htmlFor={inputId}
          className={`hans-input-label hans-input-label-${labelColor}`}
        >
          {label}
          {required ? (
            <span className="hans-input-required-indicator" aria-hidden="true">
              {' *'}
            </span>
          ) : null}
        </label>
      ) : null}

      {inputType === 'textarea' && formattingToolbar ? (
        <div
          className="hans-input-formatting-toolbar"
          role="toolbar"
          aria-label={formattingToolbarAriaLabel}
        >
          {([
            ['bold', 'LuBold', boldActionLabel],
            ['italic', 'LuItalic', italicActionLabel],
            ['underline', 'LuUnderline', underlineActionLabel],
            ['unordered-list', 'LuList', unorderedListActionLabel],
          ] as const).map(([action, icon, labelText]) => (
            <button
              key={action}
              type="button"
              className="hans-input-formatting-action"
              aria-label={labelText}
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyFormatting(action)}
            >
              <HansIcon name={icon} iconSize="small" />
            </button>
          ))}
        </div>
      ) : null}

      <div className={`hans-input-field ${inputType === 'textarea' ? 'hans-input-field-textarea' : ''}`}>
        {leftIcon ? (
          <HansInputActionIcon
            icon={leftIcon}
            side="left"
            inputColor={inputColor}
            disabled={disabled}
            ariaLabel={leftIconAriaLabel}
            onClick={shouldHandleLeftIconAction ? handleLeftIconClick : undefined}
          />
        ) : null}

        {inputType === 'textarea' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            rows={textareaRows}
            {...sharedFieldProps}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input ref={inputRef as React.RefObject<HTMLInputElement>} type={inputType} {...sharedFieldProps} {...rest} />
        )}

        {rightIcon ? (
          <HansInputActionIcon
            icon={rightIcon}
            side="right"
            inputColor={inputColor}
            disabled={disabled}
            ariaLabel={rightIconAriaLabel}
            onClick={shouldHandleRightIconAction ? handleRightIconClick : undefined}
          />
        ) : null}
      </div>

      {message ? (
        <p className={`hans-input-message hans-input-message-${messageColor}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
});

HansInput.displayName = 'HansInput';
