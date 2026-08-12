import { describe, expect, it, vi } from 'vitest';
import {
  applyTextareaFormatting,
  createTextareaValueEventHandlers,
  dispatchTextareaValueEvents,
  textareaHtmlToValue,
  textareaValueToHtml,
} from './Textarea.helper';

describe('Textarea.helper', () => {
  it('Should convert persisted formatting into safe rich HTML', () => {
    expect(textareaValueToHtml('')).toBe('');
    expect(
      textareaValueToHtml('**Bold**\n*Italic*\n__Under__\n\n- One\n- Two'),
    ).toBe(
      '<div><strong>Bold</strong></div><div><em>Italic</em></div><div><u>Under</u></div><div><br></div><ul><li>One</li><li>Two</li></ul>',
    );
    expect(textareaValueToHtml('<script> & "quote" \'single\'')).toContain(
      '&lt;script&gt; &amp; &quot;quote&quot; &#039;single&#039;',
    );
    expect(textareaValueToHtml('- First\nParagraph')).toBe(
      '<ul><li>First</li></ul><div>Paragraph</div>',
    );
  });

  it('Should serialize rich HTML into the persisted text format', () => {
    const editor = document.createElement('div');
    editor.innerHTML =
      '<div><b>Bold</b> and <i>italic</i><br><u>under</u></div><ol><li><strong>One</strong></li></ol><div>A<!-- ignored -->B</div>';
    expect(textareaHtmlToValue(editor)).toBe(
      '**Bold** and *italic*\n__under__\n- **One**\nAB',
    );
    expect(textareaHtmlToValue(null)).toBe('');
  });

  it.each([
    ['bold', 'STRONG'],
    ['italic', 'EM'],
    ['underline', 'U'],
  ] as const)('Should apply and remove %s formatting', (action, tagName) => {
    const editor = document.createElement('div');
    editor.textContent = 'Selected';
    document.body.append(editor);
    const range = document.createRange();
    range.selectNodeContents(editor);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    const focus = vi.spyOn(editor, 'focus');
    const nextRange = applyTextareaFormatting({
      action,
      editor,
      selectionRange: range,
    });
    expect(focus).toHaveBeenCalled();
    expect(nextRange).toBeInstanceOf(Range);
    expect(editor.firstElementChild?.tagName).toBe(tagName);
    const formattedRange = document.createRange();
    formattedRange.selectNodeContents(editor.firstElementChild!);
    expect(
      applyTextareaFormatting({
        action,
        editor,
        selectionRange: formattedRange,
      }),
    ).toBeInstanceOf(Range);
    expect(editor.firstElementChild).toBeNull();
    editor.remove();
  });

  it('Should apply and remove unordered lists', () => {
    const editor = document.createElement('div');
    editor.textContent = 'First\nSecond';
    document.body.append(editor);
    const range = document.createRange();
    range.selectNodeContents(editor);
    expect(
      applyTextareaFormatting({
        action: 'list',
        editor,
        selectionRange: range,
      }),
    ).toBeInstanceOf(Range);
    expect(editor.querySelectorAll('li')).toHaveLength(2);
    const listRange = document.createRange();
    listRange.selectNodeContents(editor.querySelector('li')!);
    expect(
      applyTextareaFormatting({
        action: 'list',
        editor,
        selectionRange: listRange,
      }),
    ).toBeInstanceOf(Range);
    expect(editor.querySelector('ul')).toBeNull();
    editor.remove();
  });

  it('Should preserve collapsed selections', () => {
    const editor = document.createElement('div');
    editor.textContent = 'Text';
    document.body.append(editor);
    const range = document.createRange();
    range.setStart(editor.firstChild!, 1);
    range.collapse(true);
    expect(
      applyTextareaFormatting({
        action: 'bold',
        editor,
        selectionRange: range,
      }),
    ).toBeInstanceOf(Range);
    editor.remove();
  });

  it('Should tolerate selections outside the editor and empty list selections', () => {
    const editor = document.createElement('div');
    const outside = document.createElement('span');
    outside.textContent = 'Outside';
    document.body.append(editor, outside);
    const outsideRange = document.createRange();
    outsideRange.selectNodeContents(outside);
    expect(
      applyTextareaFormatting({
        action: 'bold',
        editor,
        selectionRange: outsideRange,
      }),
    ).toBeNull();
    const emptyRange = document.createRange();
    emptyRange.selectNodeContents(editor);
    expect(
      applyTextareaFormatting({
        action: 'list',
        editor,
        selectionRange: emptyRange,
      }),
    ).toBeInstanceOf(Range);
    editor.innerHTML = '<ul></ul>';
    const emptyListRange = document.createRange();
    emptyListRange.selectNodeContents(editor.firstElementChild!);
    expect(
      applyTextareaFormatting({
        action: 'list',
        editor,
        selectionRange: emptyListRange,
      }),
    ).toBeNull();
    editor.innerHTML = '<strong></strong>';
    const emptyStrongRange = document.createRange();
    emptyStrongRange.selectNodeContents(editor.firstElementChild!);
    expect(
      applyTextareaFormatting({
        action: 'bold',
        editor,
        selectionRange: emptyStrongRange,
      }),
    ).toBeNull();
    editor.remove();
    outside.remove();
  });

  it('Should tolerate a browser without a selection object', () => {
    const editor = document.createElement('div');
    const getSelection = vi.spyOn(window, 'getSelection').mockReturnValue(null);
    expect(applyTextareaFormatting({ action: 'bold', editor })).toBeNull();
    getSelection.mockRestore();
  });

  it('Should tolerate formatting without an available browser selection', () => {
    const editor = document.createElement('div');
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    expect(applyTextareaFormatting({ action: 'bold', editor })).toBeNull();
  });

  it('Should dispatch native and value events from light DOM textareas', () => {
    const textarea = document.createElement('textarea');
    const input = vi.fn();
    const valuechange = vi.fn();
    textarea.addEventListener('input', input);
    textarea.addEventListener('valuechange', valuechange);
    dispatchTextareaValueEvents({
      target: textarea,
      value: 'Next',
      eventName: 'input',
    });
    expect(textarea.value).toBe('Next');
    expect(input).toHaveBeenCalledOnce();
    expect(valuechange).toHaveBeenCalledOnce();
  });

  it('Should dispatch bridge events from the shadow host', () => {
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });
    const textarea = document.createElement('textarea');
    shadow.append(textarea);
    const change = vi.fn();
    host.addEventListener('change', change);
    dispatchTextareaValueEvents({
      target: textarea,
      value: 'Next',
      eventName: 'change',
    });
    expect(change).toHaveBeenCalledOnce();
  });

  it('Should compose consumer callbacks and tolerate omitted callbacks', () => {
    const onChange = vi.fn();
    const onInput = vi.fn();
    const onValueChange = vi.fn();
    const handlers = createTextareaValueEventHandlers({
      onChange,
      onInput,
      onValueChange,
    });
    const textarea = document.createElement('textarea');
    textarea.value = 'Text';
    handlers.handleChange({
      currentTarget: textarea,
    } as React.ChangeEvent<HTMLTextAreaElement>);
    handlers.handleInput({
      currentTarget: textarea,
    } as React.InputEvent<HTMLTextAreaElement>);
    expect(onChange).toHaveBeenCalledOnce();
    expect(onInput).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledTimes(2);
    const optionalHandlers = createTextareaValueEventHandlers({});
    optionalHandlers.handleChange({
      currentTarget: textarea,
    } as React.ChangeEvent<HTMLTextAreaElement>);
    optionalHandlers.handleInput({
      currentTarget: textarea,
    } as React.InputEvent<HTMLTextAreaElement>);
  });
});
