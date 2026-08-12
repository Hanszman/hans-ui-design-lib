import type React from 'react';
import type {
  ApplyTextareaFormattingParams,
  CreateTextareaValueEventHandlersParams,
  DispatchTextareaValueEventsParams,
} from './Textarea.helper.types';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const formatInlineValue = (value: string): string =>
  escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<u>$1</u>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

export const textareaValueToHtml = (value: string): string => {
  if (!value.trim()) {
    return '';
  }

  const blocks: string[] = [];
  let listItems: string[] = [];
  const flushList = () => {
    if (listItems.length) {
      blocks.push(`<ul>${listItems.join('')}</ul>`);
      listItems = [];
    }
  };

  value.split(/\r?\n/).forEach((line) => {
    if (line.startsWith('- ')) {
      listItems.push(`<li>${formatInlineValue(line.slice(2))}</li>`);
      return;
    }

    flushList();
    blocks.push(
      line ? `<div>${formatInlineValue(line)}</div>` : '<div><br></div>',
    );
  });
  flushList();

  return blocks.join('');
};

const serializeInlineNode = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent!;
  }
  if (!(node instanceof HTMLElement)) {
    return '';
  }

  const content = Array.from(node.childNodes).map(serializeInlineNode).join('');
  switch (node.tagName) {
    case 'STRONG':
    case 'B':
      return `**${content}**`;
    case 'EM':
    case 'I':
      return `*${content}*`;
    case 'U':
      return `__${content}__`;
    case 'BR':
      return '\n';
    default:
      return content;
  }
};

export const textareaHtmlToValue = (editor: HTMLElement | null): string => {
  if (!editor) {
    return '';
  }

  const lines: string[] = [];
  Array.from(editor.childNodes).forEach((node) => {
    if (node instanceof HTMLUListElement || node instanceof HTMLOListElement) {
      Array.from(node.children).forEach((item) => {
        lines.push(`- ${serializeInlineNode(item)}`);
      });
      return;
    }
    lines.push(serializeInlineNode(node));
  });

  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export const applyTextareaFormatting = ({
  action,
  editor,
  selectionRange,
}: ApplyTextareaFormattingParams): Range | null => {
  editor.focus();
  const selection = window.getSelection();
  if (!selection) return null;
  if (selectionRange) {
    selection.removeAllRanges();
    selection.addRange(selectionRange);
  }
  if (!selection.rangeCount) return null;

  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return null;
  const closestElement = (node: Node, tags: readonly string[]) => {
    const element = node instanceof Element ? node : node.parentElement;
    const closest = element?.closest(tags.join(','));
    return closest && editor.contains(closest) ? closest : null;
  };
  const selectContents = (node: Node) => {
    const nextRange = document.createRange();
    nextRange.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(nextRange);
    return nextRange.cloneRange();
  };
  const unwrap = (element: Element) => {
    const fragment = document.createDocumentFragment();
    while (element.firstChild) fragment.append(element.firstChild);
    element.replaceWith(fragment);
  };

  if (action === 'list') {
    const activeList = closestElement(range.startContainer, ['ul', 'ol']);
    if (activeList) {
      const replacement = document.createDocumentFragment();
      Array.from(activeList.children).forEach((item) => {
        const line = document.createElement('div');
        while (item.firstChild) line.append(item.firstChild);
        replacement.append(line);
      });
      const lastLine = replacement.lastChild;
      activeList.replaceWith(replacement);
      return lastLine ? selectContents(lastLine) : null;
    }

    const lines = range.toString().split(/\r?\n/).filter(Boolean);
    if (!lines.length) return range.cloneRange();
    const list = document.createElement('ul');
    lines.forEach((line) => {
      const item = document.createElement('li');
      item.textContent = line;
      list.append(item);
    });

    const blockContainer = closestElement(range.commonAncestorContainer, ['div']);
    range.deleteContents();
    if (
      blockContainer &&
      blockContainer.parentElement === editor &&
      !blockContainer.textContent?.trim()
    ) {
      blockContainer.replaceWith(list);
    } else {
      range.insertNode(list);
    }
    return selectContents(list);
  }

  const tag = { bold: 'strong', italic: 'em', underline: 'u' }[action];
  const activeElement = closestElement(range.startContainer, [tag]);
  if (activeElement && activeElement.contains(range.endContainer)) {
    const contents = Array.from(activeElement.childNodes);
    unwrap(activeElement);
    return contents.length ? selectContents(contents.at(-1)!) : null;
  }
  if (range.collapsed) return range.cloneRange();
  const wrapper = document.createElement(tag);
  wrapper.append(range.extractContents());
  range.insertNode(wrapper);
  return selectContents(wrapper);
};

export const dispatchTextareaValueEvents = ({
  target,
  value,
  eventName,
}: DispatchTextareaValueEventsParams): void => {
  target.value = value;
  const root = target.getRootNode();
  const dispatchTarget = root instanceof ShadowRoot ? root.host : target;
  dispatchTarget.dispatchEvent(
    new Event(eventName, { bubbles: true, composed: true }),
  );
  dispatchTarget.dispatchEvent(
    new CustomEvent('valuechange', {
      bubbles: true,
      composed: true,
      detail: value,
    }),
  );
};

export const createTextareaValueEventHandlers = ({
  onChange,
  onInput,
  onValueChange,
}: CreateTextareaValueEventHandlersParams): {
  handleChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  handleInput: React.InputEventHandler<HTMLTextAreaElement>;
} => ({
  handleChange: (event) => {
    onChange?.(event);
    onValueChange?.(event.currentTarget.value);
  },
  handleInput: (event) => {
    onInput?.(event);
    onValueChange?.(event.currentTarget.value);
  },
});
