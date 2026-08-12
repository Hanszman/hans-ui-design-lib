import React from 'react';
import { LuBold, LuItalic, LuList, LuUnderline } from 'react-icons/lu';
import type {
  HansTextareaProps,
  TextareaFormattingAction,
} from './Textarea.types';
import {
  applyTextareaFormatting,
  createTextareaValueEventHandlers,
  dispatchTextareaValueEvents,
  textareaHtmlToValue,
  textareaValueToHtml,
} from './helpers/Textarea.helper';

export const HansTextarea = React.memo((props: HansTextareaProps) => {
  const {
    label = '',
    labelColor = 'base',
    placeholder = '',
    value,
    defaultValue = '',
    textareaId = 'hans-textarea',
    textareaColor = 'base',
    textareaSize = 'medium',
    rows = 5,
    message = '',
    messageColor = 'base',
    customClasses = '',
    disabled = false,
    required = false,
    formattingToolbar = false,
    formattingToolbarAriaLabel = 'Formatting tools',
    boldButtonAriaLabel = 'Bold',
    italicButtonAriaLabel = 'Italic',
    underlineButtonAriaLabel = 'Underline',
    listButtonAriaLabel = 'Bulleted list',
    children,
    onChange,
    onInput,
    onValueChange,
    ...rest
  } = props;
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = controlled ? value : internalValue;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const selectionRangeRef = React.useRef<Range | null>(null);
  const editorHtml = React.useMemo(
    () => textareaValueToHtml(currentValue),
    [currentValue],
  );

  React.useLayoutEffect(() => {
    if (formattingToolbar && editorRef.current?.innerHTML !== editorHtml) {
      editorRef.current!.innerHTML = editorHtml;
    }
  }, [editorHtml, formattingToolbar]);

  const { handleChange: dispatchChange, handleInput: dispatchInput } =
    createTextareaValueEventHandlers({ onChange, onInput, onValueChange });

  const syncRichValue = (eventName: 'input' | 'change') => {
    const nextValue = textareaHtmlToValue(editorRef.current);
    if (!controlled) {
      setInternalValue(nextValue);
    }
    if (textareaRef.current) {
      dispatchTextareaValueEvents({
        target: textareaRef.current,
        value: nextValue,
        eventName,
      });
    }
    onValueChange?.(nextValue);
  };

  const format = (action: TextareaFormattingAction) => {
    selectionRangeRef.current = applyTextareaFormatting({
      action,
      editor: editorRef.current!,
      selectionRange: selectionRangeRef.current,
    });
    syncRichValue('input');
  };

  const captureSelection = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
      selectionRangeRef.current = range.cloneRange();
    }
  };

  const className = [
    'hans-textarea',
    `hans-textarea-${textareaSize}`,
    `hans-textarea-${textareaColor}`,
    customClasses,
  ]
    .filter(Boolean)
    .join(' ');
  const toolbarActions = [
    { action: 'bold', label: boldButtonAriaLabel, icon: <LuBold /> },
    { action: 'italic', label: italicButtonAriaLabel, icon: <LuItalic /> },
    { action: 'underline', label: underlineButtonAriaLabel, icon: <LuUnderline /> },
    { action: 'list', label: listButtonAriaLabel, icon: <LuList /> },
  ] as const;

  return (
    <div className="hans-textarea-div">
      {children}
      {label ? (
        <label htmlFor={textareaId} className={`hans-textarea-label hans-textarea-label-${labelColor}`}>
          {label}
          {required ? <span className="hans-textarea-required-indicator" aria-hidden="true">{' *'}</span> : null}
        </label>
      ) : null}

      <div className={`hans-textarea-field ${formattingToolbar ? 'hans-textarea-field-rich' : ''}`}>
        {formattingToolbar ? (
          <>
            <div className="hans-textarea-toolbar" role="toolbar" aria-label={formattingToolbarAriaLabel}>
              {toolbarActions.map(({ action, label: actionLabel, icon }) => (
                <button
                  key={action}
                  type="button"
                  aria-label={actionLabel}
                  disabled={disabled}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => format(action)}
                >
                  {icon}
                </button>
              ))}
            </div>
            <div
              ref={editorRef}
              id={textareaId}
              className={className}
              contentEditable={!disabled}
              role="textbox"
              aria-multiline="true"
              aria-required={required}
              aria-disabled={disabled}
              data-placeholder={placeholder}
              style={{ minHeight: `${Math.max(rows, 2) * 1.5}rem` }}
              onInput={(event) => {
                event.stopPropagation();
                syncRichValue('input');
                captureSelection();
              }}
              onKeyUp={captureSelection}
              onMouseUp={captureSelection}
              onSelect={captureSelection}
              onBlur={() => {
                captureSelection();
                syncRichValue('change');
              }}
              suppressContentEditableWarning
            />
            <textarea ref={textareaRef} value={currentValue} readOnly hidden aria-hidden="true" />
          </>
        ) : (
          <textarea
            ref={textareaRef}
            id={textareaId}
            className={className}
            placeholder={placeholder}
            value={currentValue}
            rows={Math.max(rows, 2)}
            disabled={disabled}
            required={required}
            onChange={(event) => {
              if (!controlled) setInternalValue(event.currentTarget.value);
              dispatchChange(event);
            }}
            onInput={(event) => {
              if (!controlled) setInternalValue(event.currentTarget.value);
              dispatchInput(event);
            }}
            {...rest}
          />
        )}
      </div>

      {message ? <p className={`hans-textarea-message hans-textarea-message-${messageColor}`}>{message}</p> : null}
    </div>
  );
});

HansTextarea.displayName = 'HansTextarea';
