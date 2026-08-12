import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HansTextarea } from './Textarea';

describe('HansTextarea', () => {
  it('Should render and update an uncontrolled native textarea', () => {
    const onChange = vi.fn();
    const onInput = vi.fn();
    const onValueChange = vi.fn();
    render(
      <HansTextarea
        label="Description"
        required
        defaultValue="Initial"
        rows={1}
        placeholder="Write"
        message="Help"
        labelColor="primary"
        messageColor="danger"
        textareaColor="success"
        textareaSize="small"
        customClasses="custom"
        onChange={onChange}
        onInput={onInput}
        onValueChange={onValueChange}
        data-testid="field"
      >
        <span>Prefix</span>
      </HansTextarea>,
    );
    const field = screen.getByTestId('field');
    expect(field).toHaveValue('Initial');
    expect(field).toHaveAttribute('rows', '2');
    expect(screen.getByText('Description').textContent).toContain('*');
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Prefix')).toBeInTheDocument();
    fireEvent.input(field, { target: { value: 'Typed' } });
    fireEvent.change(field, { target: { value: 'Changed' } });
    expect(field).toHaveValue('Changed');
    expect(onInput).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
    expect(onValueChange).toHaveBeenCalled();
  });

  it('Should keep a controlled native textarea synchronized', () => {
    const { rerender } = render(
      <HansTextarea label="Optional" value="First" />,
    );
    expect(screen.getByRole('textbox')).toHaveValue('First');
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Ignored' },
    });
    expect(screen.getByRole('textbox')).toHaveValue('First');
    rerender(<HansTextarea value="Second" disabled />);
    expect(screen.getByRole('textbox')).toHaveValue('Second');
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('Should render persisted markup and expose rich formatting actions', () => {
    const onValueChange = vi.fn();
    render(
      <HansTextarea
        formattingToolbar
        required
        defaultValue={'**Bold**\n*Italic*\n__Under__\n- Item'}
        placeholder="Rich placeholder"
        rows={7}
        formattingToolbarAriaLabel="Editor tools"
        boldButtonAriaLabel="Make bold"
        italicButtonAriaLabel="Make italic"
        underlineButtonAriaLabel="Underline selection"
        listButtonAriaLabel="Create list"
        onValueChange={onValueChange}
      />,
    );
    const editor = screen.getByRole('textbox');
    expect(editor.querySelector('strong')).toHaveTextContent('Bold');
    expect(editor.querySelector('em')).toHaveTextContent('Italic');
    expect(editor.querySelector('u')).toHaveTextContent('Under');
    expect(editor.querySelector('li')).toHaveTextContent('Item');
    expect(
      screen.getByRole('toolbar', { name: 'Editor tools' }),
    ).toBeInTheDocument();
    const selection = window.getSelection()!;
    const range = document.createRange();
    range.selectNodeContents(editor.querySelector('strong')!);
    selection.removeAllRanges();
    selection.addRange(range);
    fireEvent.mouseUp(editor);
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Make bold' }));
    fireEvent.click(screen.getByRole('button', { name: 'Make bold' }));
    expect(editor.querySelector('strong')).toBeNull();
    editor.innerHTML = '<div><strong>Updated</strong></div>';
    fireEvent.input(editor);
    fireEvent.blur(editor);
    expect(onValueChange).toHaveBeenLastCalledWith('**Updated**');
  });

  it('Should ignore selections outside the rich editor', () => {
    render(
      <>
        <HansTextarea formattingToolbar defaultValue="Text" />
        <span>Outside</span>
      </>,
    );
    const range = document.createRange();
    range.selectNodeContents(screen.getByText('Outside'));
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    fireEvent.mouseUp(screen.getByRole('textbox'));
    fireEvent.keyUp(screen.getByRole('textbox'));
    fireEvent.select(screen.getByRole('textbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
  });

  it('Should tolerate browsers without an available selection', () => {
    const getSelection = vi.spyOn(window, 'getSelection').mockReturnValue(null);
    render(<HansTextarea formattingToolbar defaultValue="Text" />);
    fireEvent.mouseUp(screen.getByRole('textbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    getSelection.mockRestore();
  });

  it('Should synchronize controlled rich content and disable editing and actions', () => {
    const { rerender } = render(
      <HansTextarea formattingToolbar value="First" />,
    );
    const editor = screen.getByRole('textbox');
    expect(editor).toHaveTextContent('First');
    rerender(<HansTextarea formattingToolbar value="**Second**" disabled />);
    expect(editor.querySelector('strong')).toHaveTextContent('Second');
    expect(editor).toHaveAttribute('contenteditable', 'false');
    screen
      .getAllByRole('button')
      .forEach((button) => expect(button).toBeDisabled());
  });
});
